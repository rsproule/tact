import { z } from "zod";

import { amountSchema } from "./commands";
import { fail, isGameRuleError } from "./errors";
import {
  boardTileCount,
  hexKey,
  isOnBoard,
  parseHexKey,
} from "./hex";
import type {
  Amount,
  DecisionContext,
  LegacyV2GameState,
  LegacyV2Settings,
} from "./types";

const uuidSchema = z.uuid();

export const legacyV2SettingsSchema = z
  .object({
    playerCount: z.number().int().safe().min(2),
    boardRadius: z.number().int().safe().positive(),
    initialActionPoints: z.number().int().safe().nonnegative(),
    initialHearts: z.number().int().safe().positive(),
    initialRange: z.number().int().safe().positive(),
    epochDurationMs: z.number().int().safe().positive(),
    minimumBuyIn: amountSchema,
    revealWaitBlocks: z.number().int().safe().positive(),
    autoStart: z.boolean(),
    allowedPrincipalIds: z.array(z.uuid()).min(1).optional(),
  })
  .strict()
  .superRefine((settings, context) => {
    if (settings.playerCount > boardTileCount(settings.boardRadius)) {
      context.addIssue({
        code: "custom",
        message: "playerCount cannot exceed the number of board tiles",
        path: ["playerCount"],
      });
    }
    if (
      settings.allowedPrincipalIds &&
      new Set(settings.allowedPrincipalIds).size !== settings.allowedPrincipalIds.length
    ) {
      context.addIssue({
        code: "custom",
        message: "allowedPrincipalIds must not contain duplicates",
        path: ["allowedPrincipalIds"],
      });
    }
  });

export function validateSettings(settings: LegacyV2Settings): LegacyV2Settings {
  const result = legacyV2SettingsSchema.safeParse(settings);
  if (!result.success) {
    fail("invalid_settings", "Invalid legacy-v2 settings", {
      issues: result.error.issues,
    });
  }
  const { allowedPrincipalIds, ...required } = result.data;
  return allowedPrincipalIds === undefined
    ? required
    : { ...required, allowedPrincipalIds };
}

export function validateGameIdentity(gameId: string, ownerPrincipalId: string): void {
  if (!uuidSchema.safeParse(gameId).success) {
    fail("invalid_settings", "gameId must be a UUID");
  }
  if (!uuidSchema.safeParse(ownerPrincipalId).success) {
    fail("invalid_settings", "ownerPrincipalId must be a UUID");
  }
}

export function validateDecisionContext(context: DecisionContext): void {
  if (!uuidSchema.safeParse(context.principalId).success) {
    fail("invalid_context", "principalId must be a UUID");
  }
  if (
    context.actorPlayerId !== undefined &&
    !uuidSchema.safeParse(context.actorPlayerId).success
  ) {
    fail("invalid_context", "actorPlayerId must be a UUID");
  }
  assertNonNegativeSafeInteger(context.nowMs, "nowMs", "invalid_context");
  assertNonNegativeSafeInteger(
    context.blockNumber,
    "blockNumber",
    "invalid_context",
  );
  if (context.randomValue !== undefined) {
    assertNonNegativeSafeInteger(
      context.randomValue,
      "randomValue",
      "invalid_context",
    );
  }
}

export function currentEpoch(
  state: Pick<LegacyV2GameState, "settings">,
  nowMs: number,
): number {
  assertNonNegativeSafeInteger(nowMs, "nowMs", "invalid_context");
  return Math.floor(nowMs / state.settings.epochDurationMs);
}

export function normalizeAmount(value: string, name = "amount"): Amount {
  if (!amountSchema.safeParse(value).success) {
    fail("invalid_command", `${name} must be a canonical non-negative integer`);
  }
  return BigInt(value).toString();
}

export function isZeroAmount(value: Amount): boolean {
  return BigInt(normalizeAmount(value)) === 0n;
}

export function compareAmounts(left: Amount, right: Amount): -1 | 0 | 1 {
  const a = BigInt(normalizeAmount(left));
  const b = BigInt(normalizeAmount(right));
  return a < b ? -1 : a > b ? 1 : 0;
}

export function addAmounts(...values: readonly Amount[]): Amount {
  return values
    .reduce((total, value) => total + BigInt(normalizeAmount(value)), 0n)
    .toString();
}

export function subtractAmounts(left: Amount, right: Amount): Amount {
  const difference = BigInt(normalizeAmount(left)) - BigInt(normalizeAmount(right));
  if (difference < 0n) {
    fail("invalid_state", "Amount subtraction would become negative", {
      left,
      right,
    });
  }
  return difference.toString();
}

export function percentageOfAmount(value: Amount, percentage: number): Amount {
  if (!Number.isSafeInteger(percentage) || percentage < 0 || percentage > 100) {
    fail("invalid_command", "percentage must be an integer between 0 and 100");
  }
  return ((BigInt(normalizeAmount(value)) * BigInt(percentage)) / 100n).toString();
}

export function assertValidState(state: LegacyV2GameState): void {
  try {
    validateSettings(state.settings);
    assertNonNegativeSafeInteger(state.version, "version", "invalid_state");
    assertNonNegativeSafeInteger(state.createdAtMs, "createdAtMs", "invalid_state");
    assertNonNegativeSafeInteger(
      state.createdAtBlock,
      "createdAtBlock",
      "invalid_state",
    );
    assertNonNegativeSafeInteger(
      state.nextHeartSpawnBlock,
      "nextHeartSpawnBlock",
      "invalid_state",
    );
    normalizeAmount(state.prizePool, "prizePool");

    if (state.rulesetId !== "legacy-v2") {
      fail("invalid_state", "rulesetId must be legacy-v2");
    }
    if (
      !uuidSchema.safeParse(state.gameId).success ||
      !uuidSchema.safeParse(state.ownerPrincipalId).success
    ) {
      fail("invalid_state", "game and owner identifiers must be UUIDs");
    }
    if (!(["lobby", "active", "ended"] as const).includes(state.status)) {
      fail("invalid_state", "state has an unsupported status", {
        status: state.status,
      });
    }
    if (state.seatOrder.length !== Object.keys(state.players).length) {
      fail("invalid_state", "seatOrder and players must have the same size");
    }
    if (state.seatOrder.length > state.settings.playerCount) {
      fail("invalid_state", "game contains more players than configured");
    }

    const playerIds = new Set(Object.keys(state.players));
    const principals = new Set<string>();
    const positions = new Set<string>();
    const seats = new Set<number>();
    const deadPlayers = new Set<string>();

    state.seatOrder.forEach((playerId, index) => {
      const player = state.players[playerId];
      if (!player || player.playerId !== playerId) {
        fail("invalid_state", "seatOrder references an invalid player", { playerId });
      }
      if (!uuidSchema.safeParse(playerId).success) {
        fail("invalid_state", "playerId must be a UUID", { playerId });
      }
      if (player.seat !== index + 1 || seats.has(player.seat)) {
        fail("invalid_state", "player seats must be sequential and unique", {
          playerId,
          seat: player.seat,
        });
      }
      seats.add(player.seat);
      if (!uuidSchema.safeParse(player.principalId).success) {
        fail("invalid_state", "player principalId must be a UUID", { playerId });
      }
      if (principals.has(player.principalId)) {
        fail("invalid_state", "a principal may own only one tank per game", {
          principalId: player.principalId,
        });
      }
      principals.add(player.principalId);
      if (
        state.settings.allowedPrincipalIds &&
        !state.settings.allowedPrincipalIds.includes(player.principalId)
      ) {
        fail("invalid_state", "player principal is not on the configured allowlist", {
          playerId,
        });
      }
      if (
        player.handle.length === 0 ||
        player.handle.length > 64 ||
        player.handle.trim() !== player.handle
      ) {
        fail("invalid_state", "player handle must be trimmed and 1-64 characters", {
          playerId,
        });
      }
      if (!isOnBoard(player.position, state.settings.boardRadius)) {
        fail("invalid_state", "player is outside the board", { playerId });
      }
      const position = hexKey(player.position);
      if (positions.has(position)) {
        fail("invalid_state", "two tanks occupy the same position", { position });
      }
      positions.add(position);
      assertNonNegativeSafeInteger(player.hearts, "hearts", "invalid_state");
      assertNonNegativeSafeInteger(
        player.actionPoints,
        "actionPoints",
        "invalid_state",
      );
      assertPositiveSafeInteger(player.range, "range", "invalid_state");
      if (player.lastDripEpoch !== null) {
        assertNonNegativeSafeInteger(
          player.lastDripEpoch,
          "lastDripEpoch",
          "invalid_state",
        );
      }
      if (new Set(player.delegates).size !== player.delegates.length) {
        fail("invalid_state", "delegates must be unique", { playerId });
      }
      if (
        player.delegates.includes(player.principalId) ||
        player.delegates.some((delegate) => !uuidSchema.safeParse(delegate).success)
      ) {
        fail("invalid_state", "delegates must be UUIDs distinct from the owner", {
          playerId,
        });
      }
      if (player.hearts === 0) deadPlayers.add(playerId);
    });

    const deadOrderSet = new Set(state.deadOrder);
    if (
      deadOrderSet.size !== state.deadOrder.length ||
      deadOrderSet.size !== deadPlayers.size ||
      [...deadPlayers].some((playerId) => !deadOrderSet.has(playerId))
    ) {
      fail("invalid_state", "deadOrder must contain each currently dead tank once");
    }

    for (const [key, hearts] of Object.entries(state.boardHearts)) {
      const position = parseHexKey(key);
      if (hexKey(position) !== key) {
        fail("invalid_state", "board heart key must be canonical", { key });
      }
      if (!isOnBoard(position, state.settings.boardRadius)) {
        fail("invalid_state", "board heart is outside the board", { key });
      }
      assertPositiveSafeInteger(hearts, "board hearts", "invalid_state");
      if (positions.has(key)) {
        fail("invalid_state", "heart and tank cannot occupy the same tile", { key });
      }
    }

    if (state.status === "lobby") {
      if (
        state.startedAtMs !== null ||
        state.endedAtMs !== null ||
        state.epochStart !== null ||
        state.podium ||
        Object.keys(state.podiumClaims).length > 0 ||
        state.seatOrder.some((playerId) => state.players[playerId]?.lastDripEpoch !== null)
      ) {
        fail("invalid_state", "lobby has active or ended fields");
      }
    } else if (state.status === "active") {
      if (
        state.startedAtMs === null ||
        state.epochStart === null ||
        state.endedAtMs !== null ||
        state.podium
      ) {
        fail("invalid_state", "active game lifecycle fields are inconsistent");
      }
      if (state.seatOrder.length !== state.settings.playerCount) {
        fail("invalid_state", "active game must have the configured player count");
      }
      assertStartedLifecycle(state);
    } else if (state.status === "ended") {
      const alive = state.seatOrder.filter(
        (playerId) => (state.players[playerId]?.hearts ?? 0) > 0,
      );
      if (
        state.startedAtMs === null ||
        state.epochStart === null ||
        state.endedAtMs === null ||
        !state.podium ||
        !Array.isArray(state.podium) ||
        state.podium.length !== 3 ||
        alive.length !== 1 ||
        state.seatOrder.length !== state.settings.playerCount
      ) {
        fail("invalid_state", "ended game must have one survivor and a podium");
      }
      assertStartedLifecycle(state);
      if (state.podium[0] !== alive[0]) {
        fail("invalid_state", "podium winner must be the surviving tank");
      }
      const expectedPodium = [
        alive[0],
        state.deadOrder.at(-1) ?? null,
        state.deadOrder.at(-2) ?? null,
      ];
      if (state.podium.some((playerId, index) => playerId !== expectedPodium[index])) {
        fail("invalid_state", "podium must follow survivor and latest-death order");
      }
    }

    validateJuryState(state, playerIds);
    validateTreatyState(state, playerIds);

    for (const [bountyId, bounty] of Object.entries(state.bounties)) {
      normalizeAmount(bounty.amount, "bounty amount");
      if (
        bounty.bountyId !== bountyId ||
        !uuidSchema.safeParse(bountyId).success ||
        bounty.ownerPlayerId === bounty.targetPlayerId ||
        isZeroAmount(bounty.amount) ||
        !(["open", "awarded", "cancelled"] as const).includes(bounty.status)
      ) {
        fail("invalid_state", "bounty identity or amount is invalid", { bountyId });
      }
      if (!playerIds.has(bounty.ownerPlayerId) || !playerIds.has(bounty.targetPlayerId)) {
        fail("invalid_state", "bounty references an unknown player", {
          bountyId: bounty.bountyId,
        });
      }
      if (new Set(bounty.acceptedPlayerIds).size !== bounty.acceptedPlayerIds.length) {
        fail("invalid_state", "bounty acceptances must be unique", {
          bountyId: bounty.bountyId,
        });
      }
      if (
        !bounty.acceptedPlayerIds.includes(bounty.ownerPlayerId) ||
        bounty.acceptedPlayerIds.some((playerId) => !playerIds.has(playerId))
      ) {
        fail("invalid_state", "bounty acceptances reference invalid players", {
          bountyId,
        });
      }
      if (
        (bounty.status === "awarded" &&
          (!bounty.winnerPlayerId ||
            !playerIds.has(bounty.winnerPlayerId) ||
            !bounty.acceptedPlayerIds.includes(bounty.winnerPlayerId))) ||
        (bounty.status !== "awarded" && bounty.winnerPlayerId !== null)
      ) {
        fail("invalid_state", "bounty winner and status are inconsistent", {
          bountyId,
        });
      }
    }
    Object.entries(state.bountyCredits).forEach(([playerId, amount]) => {
      if (!playerIds.has(playerId)) {
        fail("invalid_state", "bounty credit references an unknown player", {
          playerId,
        });
      }
      normalizeAmount(amount, "bounty credit");
    });
    validatePodiumClaims(state, playerIds);
  } catch (error) {
    if (isGameRuleError(error) && error.code === "invalid_state") throw error;
    fail("invalid_state", "State validation failed", {
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

function assertStartedLifecycle(state: LegacyV2GameState): void {
  const startedAtMs = state.startedAtMs;
  const epochStart = state.epochStart;
  if (startedAtMs === null || epochStart === null) {
    fail("invalid_state", "started lifecycle fields are required");
  }
  assertNonNegativeSafeInteger(startedAtMs, "startedAtMs", "invalid_state");
  assertNonNegativeSafeInteger(epochStart, "epochStart", "invalid_state");
  if (
    startedAtMs < state.createdAtMs ||
    epochStart !== Math.floor(startedAtMs / state.settings.epochDurationMs)
  ) {
    fail("invalid_state", "started lifecycle chronology is inconsistent");
  }
  if (
    state.endedAtMs !== null &&
    (!Number.isSafeInteger(state.endedAtMs) || state.endedAtMs < startedAtMs)
  ) {
    fail("invalid_state", "endedAtMs must not precede startedAtMs");
  }
  if (
    state.seatOrder.some(
      (playerId) => state.players[playerId]?.lastDripEpoch === null,
    )
  ) {
    fail("invalid_state", "started tanks must have a lastDripEpoch");
  }
}

function validateJuryState(
  state: LegacyV2GameState,
  playerIds: ReadonlySet<string>,
): void {
  for (const [epochKey, jury] of Object.entries(state.juryByEpoch)) {
    const epoch = Number(epochKey);
    if (
      !Number.isSafeInteger(epoch) ||
      epoch < 0 ||
      String(epoch) !== epochKey ||
      !Array.isArray(jury.voters) ||
      new Set(jury.voters).size !== jury.voters.length ||
      jury.voters.some((playerId) => !playerIds.has(playerId))
    ) {
      fail("invalid_state", "jury epoch or voters are invalid", { epochKey });
    }
    let voteCount = 0;
    for (const [targetPlayerId, votes] of Object.entries(jury.votesByTarget)) {
      if (
        !playerIds.has(targetPlayerId) ||
        !Number.isSafeInteger(votes) ||
        votes <= 0
      ) {
        fail("invalid_state", "jury tally is invalid", {
          epochKey,
          targetPlayerId,
        });
      }
      voteCount += votes;
    }
    if (voteCount !== jury.voters.length) {
      fail("invalid_state", "jury tallies must match the voter count", {
        epochKey,
      });
    }
    if (
      typeof jury.closed !== "boolean" ||
      (jury.closed &&
        (jury.cursedPlayerId === null || !playerIds.has(jury.cursedPlayerId))) ||
      (!jury.closed && jury.cursedPlayerId !== null)
    ) {
      fail("invalid_state", "jury closure state is inconsistent", { epochKey });
    }
  }
}

function validateTreatyState(
  state: LegacyV2GameState,
  playerIds: ReadonlySet<string>,
): void {
  for (const [key, proposal] of Object.entries(state.nonAggressionProposals)) {
    if (
      key !== `${proposal.proposerPlayerId}->${proposal.targetPlayerId}` ||
      proposal.proposerPlayerId === proposal.targetPlayerId ||
      !playerIds.has(proposal.proposerPlayerId) ||
      !playerIds.has(proposal.targetPlayerId) ||
      !Number.isSafeInteger(proposal.expiresEpoch) ||
      proposal.expiresEpoch < 0
    ) {
      fail("invalid_state", "non-aggression proposal is invalid", { key });
    }
  }
  for (const [key, treaty] of Object.entries(state.nonAggressionTreaties)) {
    const [first, second] = treaty.playerIds;
    if (
      !Array.isArray(treaty.playerIds) ||
      treaty.playerIds.length !== 2 ||
      !first ||
      !second ||
      first === second ||
      first.localeCompare(second) > 0 ||
      key !== `${first}<->${second}` ||
      !playerIds.has(first) ||
      !playerIds.has(second) ||
      !Number.isSafeInteger(treaty.expiresEpoch) ||
      treaty.expiresEpoch < 0
    ) {
      fail("invalid_state", "non-aggression treaty is invalid", { key });
    }
  }
}

function validatePodiumClaims(
  state: LegacyV2GameState,
  playerIds: ReadonlySet<string>,
): void {
  if (state.status !== "ended" && Object.keys(state.podiumClaims).length > 0) {
    fail("invalid_state", "podium rewards cannot be claimed before game end");
  }
  for (const [playerId, claim] of Object.entries(state.podiumClaims)) {
    const placeIndex = state.podium?.findIndex(
      (podiumPlayerId) => podiumPlayerId === playerId,
    );
    const expectedPercent =
      placeIndex === undefined || placeIndex < 0
        ? undefined
        : ([60, 30, 10] as const)[placeIndex];
    normalizeAmount(claim.amount, "podium claim amount");
    if (
      !playerIds.has(playerId) ||
      claim.playerId !== playerId ||
      placeIndex === undefined ||
      placeIndex < 0 ||
      claim.place !== placeIndex + 1 ||
      claim.sharePercent !== expectedPercent ||
      claim.recipient.trim().length === 0 ||
      claim.recipient.length > 256 ||
      compareAmounts(
        claim.amount,
        percentageOfAmount(state.prizePool, claim.sharePercent),
      ) > 0
    ) {
      fail("invalid_state", "podium claim is inconsistent", { playerId });
    }
  }
}

function assertNonNegativeSafeInteger(
  value: number,
  name: string,
  code: "invalid_context" | "invalid_state",
): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    fail(code, `${name} must be a non-negative safe integer`, { value });
  }
}

function assertPositiveSafeInteger(
  value: number,
  name: string,
  code: "invalid_state",
): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    fail(code, `${name} must be a positive safe integer`, { value });
  }
}
