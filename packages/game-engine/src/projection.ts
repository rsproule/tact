import type { GameCommand } from "./commands";
import { fail } from "./errors";
import {
  activeTreatyBetween,
  canControlTank,
  controlledTanks,
  isTankAlive,
} from "./engine";
import { enumerateBoard, hexDistance, hexKey, type Hex } from "./hex";
import { rangeUpgradeCost } from "./legacy-v2";
import type {
  Amount,
  BountyState,
  LegacyV2GameState,
  LegacyV2GameStatus,
  NonAggressionTreaty,
  PlayerId,
  PrincipalId,
  TankState,
} from "./types";
import {
  assertValidState,
  currentEpoch,
  isZeroAmount,
  validateDecisionContext,
} from "./validation";

export interface ProjectionContext {
  readonly nowMs: number;
  readonly blockNumber: number;
  readonly principalId?: PrincipalId;
}

export interface ProjectedTank {
  readonly playerId: PlayerId;
  readonly seat: number;
  readonly handle: string;
  readonly position: Hex;
  readonly hearts: number;
  readonly actionPoints: number;
  readonly range: number;
  readonly alive: boolean;
  readonly lastDripEpoch: number | null;
  readonly ownedByViewer: boolean;
  readonly controllableByViewer: boolean;
}

export interface ProjectedBoardHeart {
  readonly position: Hex;
  readonly quantity: number;
}

export type ProjectedLegacyV2Settings = Omit<
  LegacyV2GameState["settings"],
  "allowedPrincipalIds"
> & {
  readonly restricted: boolean;
};

export type LegalActionType = GameCommand["type"];

export interface LegalAction {
  readonly type: LegalActionType;
  readonly actorPlayerId: PlayerId | null;
  readonly enabled: boolean;
  readonly reason: string | null;
  readonly details: Readonly<Record<string, unknown>>;
}

export interface LegacyV2GameProjection {
  readonly rulesetId: "legacy-v2";
  readonly gameId: string;
  readonly status: LegacyV2GameStatus;
  readonly version: number;
  /** Public settings; the principal allowlist itself is intentionally omitted. */
  readonly settings: ProjectedLegacyV2Settings;
  readonly currentEpoch: number;
  readonly nextHeartSpawnBlock: number;
  readonly prizePool: Amount;
  readonly players: readonly ProjectedTank[];
  readonly boardHearts: readonly ProjectedBoardHeart[];
  readonly deadOrder: readonly PlayerId[];
  readonly activeTreaties: readonly NonAggressionTreaty[];
  readonly bounties: readonly BountyState[];
  readonly podium: LegacyV2GameState["podium"];
  readonly legalActions: readonly LegalAction[];
}

export function projectLegacyV2Game(
  state: LegacyV2GameState,
  context: ProjectionContext,
): LegacyV2GameProjection {
  assertValidState(state);
  validateProjectionContext(state, context);
  const epoch = currentEpoch(state, context.nowMs);
  const principalId = context.principalId;
  const { allowedPrincipalIds: _privateAllowlist, ...publicSettings } = state.settings;
  return {
    rulesetId: state.rulesetId,
    gameId: state.gameId,
    status: state.status,
    version: state.version,
    settings: {
      ...publicSettings,
      restricted: Boolean(state.settings.allowedPrincipalIds),
    },
    currentEpoch: epoch,
    nextHeartSpawnBlock: state.nextHeartSpawnBlock,
    prizePool: state.prizePool,
    players: state.seatOrder.map((playerId) => {
      const player = state.players[playerId] as TankState;
      return {
        playerId,
        seat: player.seat,
        handle: player.handle,
        position: player.position,
        hearts: player.hearts,
        actionPoints: player.actionPoints,
        range: player.range,
        alive: isTankAlive(player),
        lastDripEpoch: player.lastDripEpoch,
        ownedByViewer: principalId === player.principalId,
        controllableByViewer:
          principalId !== undefined && canControlTank(player, principalId),
      };
    }),
    boardHearts: Object.entries(state.boardHearts)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, quantity]) => ({
        position: parseProjectionHexKey(key),
        quantity,
      })),
    deadOrder: [...state.deadOrder],
    activeTreaties: Object.values(state.nonAggressionTreaties)
      .filter((treaty) => epoch <= treaty.expiresEpoch)
      .sort((left, right) =>
        left.playerIds.join(":").localeCompare(right.playerIds.join(":")),
      ),
    bounties: Object.values(state.bounties).sort((left, right) =>
      left.bountyId.localeCompare(right.bountyId),
    ),
    podium: state.podium,
    legalActions: legalActions(state, context),
  };
}

export function legalActions(
  state: LegacyV2GameState,
  context: ProjectionContext,
): readonly LegalAction[] {
  assertValidState(state);
  validateProjectionContext(state, context);
  const actions: LegalAction[] = [];
  const principalId = context.principalId;
  const epoch = currentEpoch(state, context.nowMs);

  if (state.status === "lobby") {
    const alreadyJoined =
      principalId !== undefined &&
      state.seatOrder.some(
        (playerId) => state.players[playerId]?.principalId === principalId,
      );
    const allowed =
      principalId !== undefined &&
      (!state.settings.allowedPrincipalIds ||
        state.settings.allowedPrincipalIds.includes(principalId));
    actions.push({
      type: "join",
      actorPlayerId: null,
      enabled:
        Boolean(principalId) &&
        !alreadyJoined &&
        allowed &&
        state.seatOrder.length < state.settings.playerCount,
      reason: !principalId
        ? "authentication_required"
        : alreadyJoined
          ? "already_joined"
          : !allowed
            ? "principal_not_allowed"
            : state.seatOrder.length >= state.settings.playerCount
              ? "game_full"
              : null,
      details: {
        minimumBuyIn: state.settings.minimumBuyIn,
        requiresRandomValue: true,
      },
    });
    actions.push({
      type: "start",
      actorPlayerId: null,
      enabled:
        principalId === state.ownerPrincipalId &&
        state.seatOrder.length === state.settings.playerCount,
      reason: !principalId
        ? "authentication_required"
        : principalId !== state.ownerPrincipalId
          ? "not_authorized"
          : state.seatOrder.length !== state.settings.playerCount
            ? "not_enough_players"
            : null,
      details: {
        requiredPlayers: state.settings.playerCount,
        joinedPlayers: state.seatOrder.length,
        ownerOnly: true,
      },
    });
  }

  actions.push({
    type: "donate",
    actorPlayerId: null,
    enabled: Boolean(principalId),
    reason: principalId ? null : "authentication_required",
    details: {},
  });

  if (state.status === "active") {
    actions.push({
      type: "poke_heart_spawn",
      actorPlayerId: null,
      enabled:
        Boolean(principalId) && context.blockNumber >= state.nextHeartSpawnBlock,
      reason: !principalId
        ? "authentication_required"
        : context.blockNumber < state.nextHeartSpawnBlock
          ? "heart_spawn_not_ready"
          : null,
      details: {
        scheduledBlock: state.nextHeartSpawnBlock,
        requiresRandomValue:
          context.blockNumber >= state.nextHeartSpawnBlock &&
          context.blockNumber - state.nextHeartSpawnBlock <= 256,
      },
    });

    for (const playerId of state.seatOrder) {
      const target = state.players[playerId] as TankState;
      if (!isTankAlive(target)) continue;
      const claimable = claimableActionPointsForPlayer(state, playerId, context.nowMs);
      actions.push({
        type: "claim_action_points",
        actorPlayerId: null,
        enabled: Boolean(principalId) && claimable > 0,
        reason: !principalId
          ? "authentication_required"
          : claimable > 0
            ? null
            : "already_dripped",
        details: { targetPlayerId: playerId, claimable },
      });
    }
  }

  if (principalId) {
    for (const actor of controlledTanks(state, principalId)) {
      actions.push(delegateLegalAction(actor, principalId));
      const credit = state.bountyCredits[actor.playerId] ?? "0";
      actions.push({
        type: "withdraw_bounty",
        actorPlayerId: actor.playerId,
        enabled: !isZeroAmount(credit),
        reason: isZeroAmount(credit) ? "no_bounty_credit" : null,
        details: { amount: credit },
      });

      if (state.status === "active") {
        if (isTankAlive(actor)) {
          actions.push(...livingTankActions(state, actor, epoch));
        } else {
          actions.push(deadTankVoteAction(state, actor, epoch));
          actions.push(...programmableTrustActions(state, actor, epoch));
        }
      }

      if (state.status === "ended") {
        const placeIndex = state.podium?.findIndex(
          (playerId) => playerId === actor.playerId,
        );
        actions.push({
          type: "claim_podium_reward",
          actorPlayerId: actor.playerId,
          enabled:
            placeIndex !== undefined &&
            placeIndex >= 0 &&
            !state.podiumClaims[actor.playerId],
          reason:
            placeIndex === undefined || placeIndex < 0
              ? "not_on_podium"
              : state.podiumClaims[actor.playerId]
                ? "reward_already_claimed"
                : null,
          details: {
            place: placeIndex !== undefined && placeIndex >= 0 ? placeIndex + 1 : null,
          },
        });
        for (const bounty of Object.values(state.bounties)) {
          if (bounty.ownerPlayerId !== actor.playerId) continue;
          actions.push({
            type: "cancel_bounty",
            actorPlayerId: actor.playerId,
            enabled: bounty.status === "open",
            reason: bounty.status === "open" ? null : "bounty_closed",
            details: { bountyId: bounty.bountyId, amount: bounty.amount },
          });
        }
      }
    }
  }

  return actions;
}

export function claimableActionPointsForPlayer(
  state: LegacyV2GameState,
  playerId: PlayerId,
  nowMs: number,
): number {
  if (state.status !== "active") return 0;
  const player = state.players[playerId];
  if (!player || !isTankAlive(player) || state.epochStart === null) return 0;
  const epoch = currentEpoch(state, nowMs);
  const last = player.lastDripEpoch ?? state.epochStart;
  return Math.max(0, epoch - last);
}

function livingTankActions(
  state: LegacyV2GameState,
  actor: TankState,
  epoch: number,
): readonly LegalAction[] {
  const occupied = new Set(
    state.seatOrder.map(
      (playerId) => hexKey((state.players[playerId] as TankState).position),
    ),
  );
  const destinations = enumerateBoard(state.settings.boardRadius).filter(
    (position) =>
      !occupied.has(hexKey(position)) &&
      hexDistance(actor.position, position) <= actor.actionPoints,
  );
  const otherPlayers = state.seatOrder
    .map((playerId) => state.players[playerId] as TankState)
    .filter((player) => player.playerId !== actor.playerId);
  const shootTargets = state.seatOrder
    .map((playerId) => state.players[playerId] as TankState)
    .filter(
      (target) =>
        isTankAlive(target) &&
        hexDistance(actor.position, target.position) <= actor.range &&
        !activeTreatyBetween(state, actor.playerId, target.playerId, epoch),
    )
    .map((target) => ({
      playerId: target.playerId,
      maxShots: Math.min(actor.actionPoints, target.hearts),
      distance: hexDistance(actor.position, target.position),
    }))
    .filter((target) => target.maxShots > 0);
  const giveTargets = otherPlayers
    .filter((target) => hexDistance(actor.position, target.position) <= actor.range)
    .map((target) => ({
      playerId: target.playerId,
      alive: isTankAlive(target),
      distance: hexDistance(actor.position, target.position),
      maxHearts: actor.hearts,
      maxActionPoints: actor.actionPoints,
    }));
  const upgradeCost = rangeUpgradeCost(actor.range);

  return [
    {
      type: "move",
      actorPlayerId: actor.playerId,
      enabled: destinations.length > 0,
      reason: destinations.length > 0 ? null : "no_reachable_destination",
      details: { destinations },
    },
    {
      type: "shoot",
      actorPlayerId: actor.playerId,
      enabled: shootTargets.length > 0,
      reason: shootTargets.length > 0 ? null : "no_shootable_target",
      details: { targets: shootTargets },
    },
    {
      type: "give",
      actorPlayerId: actor.playerId,
      enabled:
        giveTargets.length > 0 && (actor.hearts > 0 || actor.actionPoints > 0),
      reason: giveTargets.length > 0 ? null : "no_target_in_range",
      details: { targets: giveTargets },
    },
    {
      type: "upgrade",
      actorPlayerId: actor.playerId,
      enabled: actor.actionPoints >= upgradeCost,
      reason:
        actor.actionPoints >= upgradeCost ? null : "insufficient_action_points",
      details: { actionPointCost: upgradeCost, newRange: actor.range + 1 },
    },
    ...programmableTrustActions(state, actor, epoch),
  ];
}

function programmableTrustActions(
  state: LegacyV2GameState,
  actor: TankState,
  epoch: number,
): readonly LegalAction[] {
  const otherPlayers = state.seatOrder
    .map((playerId) => state.players[playerId] as TankState)
    .filter((player) => player.playerId !== actor.playerId);
  const treatyTargets = otherPlayers.map((target) => target.playerId);
  const acceptableProposals = Object.values(state.nonAggressionProposals).filter(
    (proposal) =>
      proposal.targetPlayerId === actor.playerId &&
      epoch < proposal.expiresEpoch &&
      !activeTreatyBetween(
        state,
        actor.playerId,
        proposal.proposerPlayerId,
        epoch,
      ),
  );
  const bountyTargets = otherPlayers
    .filter(isTankAlive)
    .map((target) => target.playerId);
  const openBounties = Object.values(state.bounties)
    .filter(
      (bounty) =>
        bounty.status === "open" &&
        !bounty.acceptedPlayerIds.includes(actor.playerId),
    )
    .map((bounty) => bounty.bountyId);

  return [
    {
      type: "propose_non_aggression",
      actorPlayerId: actor.playerId,
      enabled: treatyTargets.length > 0,
      reason: treatyTargets.length > 0 ? null : "no_other_tanks",
      details: { targetPlayerIds: treatyTargets, minimumExpiresEpoch: epoch + 1 },
    },
    {
      type: "accept_non_aggression",
      actorPlayerId: actor.playerId,
      enabled: acceptableProposals.length > 0,
      reason: acceptableProposals.length > 0 ? null : "no_pending_proposal",
      details: {
        proposerPlayerIds: acceptableProposals.map(
          (proposal) => proposal.proposerPlayerId,
        ),
      },
    },
    {
      type: "post_bounty",
      actorPlayerId: actor.playerId,
      enabled: bountyTargets.length > 0,
      reason: bountyTargets.length > 0 ? null : "no_living_target",
      details: { targetPlayerIds: bountyTargets },
    },
    {
      type: "accept_bounty",
      actorPlayerId: actor.playerId,
      enabled: openBounties.length > 0,
      reason: openBounties.length > 0 ? null : "no_open_bounty",
      details: { bountyIds: openBounties },
    },
  ];
}

function deadTankVoteAction(
  state: LegacyV2GameState,
  actor: TankState,
  epoch: number,
): LegalAction {
  const jury = state.juryByEpoch[String(epoch)];
  const targets = state.seatOrder
    .map((playerId) => state.players[playerId] as TankState)
    .filter(isTankAlive)
    .map((player) => player.playerId);
  const voted = jury?.voters.includes(actor.playerId) ?? false;
  const closed = jury?.closed ?? false;
  return {
    type: "curse_vote",
    actorPlayerId: actor.playerId,
    enabled: !voted && !closed && targets.length > 0,
    reason: voted ? "already_voted" : closed ? "voting_closed" : null,
    details: {
      targetPlayerIds: targets,
      majorityRequired: Math.floor(state.deadOrder.length / 2) + 1,
    },
  };
}

function delegateLegalAction(
  actor: TankState,
  principalId: PrincipalId,
): LegalAction {
  const isOwner = actor.principalId === principalId;
  return {
    type: "delegate",
    actorPlayerId: actor.playerId,
    enabled: isOwner,
    reason: isOwner ? null : "delegate_cannot_delegate",
    details: { permanent: true },
  };
}

function parseProjectionHexKey(key: string): Hex {
  const [q, r, s] = key.split(",").map(Number);
  return { q: q as number, r: r as number, s: s as number };
}

function validateProjectionContext(
  state: LegacyV2GameState,
  context: ProjectionContext,
): void {
  validateDecisionContext({
    principalId: context.principalId ?? "00000000-0000-4000-8000-000000000000",
    nowMs: context.nowMs,
    blockNumber: context.blockNumber,
  });
  if (context.nowMs < state.createdAtMs || context.blockNumber < state.createdAtBlock) {
    fail("invalid_context", "Projection context cannot precede game creation");
  }
}
