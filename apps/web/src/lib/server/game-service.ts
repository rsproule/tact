import {
  chooseLegacyV2BotCommand,
  commandEnvelopeSchema,
  createLegacyV2Game,
  executeLegacyV2Command,
  projectLegacyV2Game,
  type CommandEnvelope,
  type GameCommand,
  type LegacyV2BotStrategy,
  type LegacyV2Settings,
} from "@tact/game-engine";
import {
  createGameRecord,
  getGameRecord,
  hashJson,
  listGameBots,
  listGameEvents,
  listGameRecords,
  processGameCommand,
  recordMatchEntryEntitlement,
  replayGameCommandIfPresent,
  type BotStrategy,
  type CommandReceipt,
  type GameView,
  type PrincipalView,
} from "@tact/db";

import type { VerifiedPayment } from "@/lib/payments";
import { getMppCurrency, getMppMaxEntryPrice } from "@/lib/payment-config";

import { ApiError } from "./api-error";
import { requireInteger, requireString, requireUuid } from "./request";

const RULESET = "legacy-v2";
const UNSETTLED_ECONOMIC_COMMANDS = new Set<GameCommand["type"]>([
  "donate",
  "post_bounty",
  "withdraw_bounty",
  "claim_podium_reward",
]);

export async function createGame(
  principal: PrincipalView,
  body: Record<string, unknown>,
): Promise<{ game: Record<string, unknown>; replayed: boolean }> {
  const idempotencyKey = requireString(body.idempotencyKey, "idempotencyKey", {
    min: 8,
    max: 128,
  });
  const configInput = asObject(body.config, "config");
  const parsed = parseCreateConfig(configInput);
  const gameId = crypto.randomUUID();
  const nowMs = Date.now();
  const initialState = createLegacyV2Game({
    gameId,
    ownerPrincipalId: principal.id,
    settings: parsed.settings,
    nowMs,
    blockNumber: logicalBlockNumber(nowMs),
  });
  const requestHash = await hashJson({ principalId: principal.id, config: parsed.publicConfig });
  const created = await createGameRecord({
    gameId,
    ownerPrincipalId: principal.id,
    rulesetVersion: RULESET,
    idempotencyKey,
    requestHash,
    config: parsed.publicConfig,
    initialState,
  });
  return {
    game: projectGame(created.game, principal),
    replayed: created.replayed,
  };
}

export async function listGames(input: {
  principal: PrincipalView | null;
  limit: number;
  before?: Date;
  status?: "lobby" | "active" | "ended" | "cancelled";
}): Promise<{ games: readonly Record<string, unknown>[]; nextCursor: string | null }> {
  const records = await listGameRecords(input);
  return {
    games: records.map((game) => projectGame(game, input.principal)),
    nextCursor:
      records.length === input.limit ? records[records.length - 1]?.createdAt ?? null : null,
  };
}

export async function getGame(
  gameId: string,
  principal: PrincipalView | null,
): Promise<Record<string, unknown>> {
  const game = await requireGame(gameId);
  return projectGame(game, principal);
}

export async function getLegalActions(
  gameId: string,
  principal: PrincipalView | null,
): Promise<Record<string, unknown>> {
  const game = await requireGame(gameId);
  const projection = clientProjection(game, principal);
  return {
    gameId,
    version: game.version,
    principal: principal ? { id: principal.id, kind: principal.kind } : null,
    actions: projection.legalActions,
  };
}

export async function getEvents(input: {
  gameId: string;
  after: number;
  limit: number;
}): Promise<{ events: readonly Record<string, unknown>[]; nextCursor: number }> {
  await requireGame(input.gameId);
  const events = await listGameEvents(input);
  const last = events[events.length - 1]?.sequence;
  return {
    events,
    nextCursor: typeof last === "number" ? last : input.after,
  };
}

export async function joinGame(input: {
  gameId: string;
  principal: PrincipalView;
  body: Record<string, unknown>;
  payment?: VerifiedPayment;
}): Promise<{ command: CommandReceipt; game: Record<string, unknown> }> {
  const game = await requireGame(input.gameId);
  const commandId = requireUuid(input.body.commandId, "commandId");
  const idempotencyKey = requireString(input.body.idempotencyKey, "idempotencyKey", {
    min: 8,
    max: 128,
  });
  const expectedVersion = requireInteger(input.body.expectedVersion, "expectedVersion", {
    min: 0,
  });
  const handle = requireString(input.body.handle, "handle", { min: 1, max: 64 });
  const minimumBuyIn = game.snapshot.settings.minimumBuyIn;
  const entryPriceUsd = String(game.config.entryPriceUsd ?? "0");
  let entitlementId: string | undefined;

  if (minimumBuyIn !== "0") {
    if (!input.payment) {
      throw new ApiError(402, "payment_required", "Payment required", "This game requires payment.");
    }
    if (
      input.payment.amount !== entryPriceUsd ||
      input.payment.atomicAmount !== minimumBuyIn ||
      input.payment.currency.toLowerCase() !== String(game.config.currency).toLowerCase()
    ) {
      throw new ApiError(400, "payment_mismatch", "Payment mismatch", "Verified payment does not match the game entry price.");
    }
    entitlementId = await recordMatchEntryEntitlement({
      principalId: input.principal.id,
      gameId: input.gameId,
      providerReference: input.payment.reference,
      amount: input.payment.atomicAmount,
      currency: input.payment.currency,
      ...(input.payment.payer ? { payer: input.payment.payer } : {}),
      rawReceipt: {
        challengeId: input.payment.challengeId,
        method: input.payment.method,
        status: input.payment.status,
        timestamp: input.payment.timestamp,
        ...(input.payment.externalId ? { externalId: input.payment.externalId } : {}),
      },
    });
  }

  const playerId = crypto.randomUUID();
  const command: GameCommand = {
    type: "join",
    playerId,
    handle,
    buyInAmount: minimumBuyIn,
  };
  const envelope = { commandId, idempotencyKey, expectedVersion, command };
  const requestHash = await hashJson({
    gameId: input.gameId,
    principalId: input.principal.id,
    commandId,
    idempotencyKey,
    expectedVersion,
    handle,
    buyInAmount: minimumBuyIn,
  });
  const receipt = await executeCommand({
    game,
    principal: input.principal,
    envelope,
    requestHash,
    entitlementId,
  });
  return { command: receipt, game: await getGame(input.gameId, input.principal) };
}

export async function submitGameCommand(input: {
  gameId: string;
  principal: PrincipalView;
  body: Record<string, unknown>;
  actorPlayerId?: string;
}): Promise<{ command: CommandReceipt; game: Record<string, unknown> }> {
  const parsed = commandEnvelopeSchema.safeParse(input.body);
  if (!parsed.success) {
    throw new ApiError(400, "invalid_command", "Invalid command", "Command envelope failed validation.", {
      issues: parsed.error.issues,
    });
  }
  if (parsed.data.command.type === "join") {
    throw new ApiError(400, "use_join_endpoint", "Invalid endpoint", "Join through the dedicated join endpoint.");
  }
  if (
    ["donate", "post_bounty", "withdraw_bounty", "claim_podium_reward"].includes(
      parsed.data.command.type,
    )
  ) {
    throw new ApiError(501, "paid_command_not_available", "Command unavailable", "This command is not currently available.");
  }
  const game = await requireGame(input.gameId);
  if (parsed.data.command.type === "start" && game.ownerPrincipalId !== input.principal.id) {
    throw new ApiError(403, "owner_authorization_required", "Forbidden", "Only the game owner may start it.");
  }
  const requestHash = await hashJson({
    gameId: input.gameId,
    principalId: input.principal.id,
    actorPlayerId: input.actorPlayerId ?? null,
    envelope: parsed.data,
  });
  const receipt = await executeCommand({
    game,
    principal: input.principal,
    envelope: parsed.data,
    requestHash,
    actorPlayerId: input.actorPlayerId,
  });
  return { command: receipt, game: await getGame(input.gameId, input.principal) };
}

export async function addBots(input: {
  gameId: string;
  principal: PrincipalView;
  body: Record<string, unknown>;
}): Promise<{ commands: readonly CommandReceipt[]; game: Record<string, unknown> }> {
  const baseCommandId = requireUuid(input.body.commandId, "commandId");
  const baseIdempotencyKey = requireString(input.body.idempotencyKey, "idempotencyKey", {
    min: 8,
    max: 112,
  });
  let expectedVersion = requireInteger(input.body.expectedVersion, "expectedVersion", { min: 0 });
  const strategy = requireBotStrategy(input.body.strategy);
  const count = requireInteger(input.body.count ?? 1, "count", { min: 1, max: 8 });
  let game = await requireGame(input.gameId);
  if (game.ownerPrincipalId !== input.principal.id) {
    throw new ApiError(403, "owner_authorization_required", "Forbidden", "Only the game owner may add bots.");
  }
  if (game.snapshot.settings.minimumBuyIn !== "0") {
    throw new ApiError(409, "paid_bots_not_supported", "Bots unavailable", "Owner bots are currently limited to free games.");
  }

  const firstCommandId = await deriveUuid(baseCommandId, 0);
  const firstIdempotencyKey = `${baseIdempotencyKey}:bot:0`;
  const firstRequestHash = await hashJson({
    baseCommandId,
    baseIdempotencyKey,
    expectedVersion,
    strategy,
    count,
    index: 0,
  });
  const replaying = Boolean(
    await replayGameCommandIfPresent({
      gameId: input.gameId,
      principalId: input.principal.id,
      idempotencyKey: firstIdempotencyKey,
      requestHash: firstRequestHash,
    }),
  );
  if (!replaying) {
    if (game.snapshot.status !== "lobby") {
      throw new ApiError(409, "game_not_in_lobby", "Invalid game state", "Bots can only join a lobby.");
    }
    if (game.snapshot.seatOrder.length + count > game.snapshot.settings.playerCount) {
      throw new ApiError(409, "game_full", "Game is full", "Requested bots exceed open seats.");
    }
  }

  const receipts: CommandReceipt[] = [];
  for (let index = 0; index < count; index += 1) {
    const commandId = index === 0 ? firstCommandId : await deriveUuid(baseCommandId, index);
    const idempotencyKey = `${baseIdempotencyKey}:bot:${index}`;
    const botPrincipalId = crypto.randomUUID();
    const playerId = crypto.randomUUID();
    const displayName = `${capitalize(strategy)} Bot ${game.snapshot.seatOrder.length + 1}`;
    const command: GameCommand = {
      type: "join",
      playerId,
      handle: displayName,
      buyInAmount: "0",
    };
    const envelope = { commandId, idempotencyKey, expectedVersion, command };
    const requestHash = await hashJson({
      baseCommandId,
      baseIdempotencyKey,
      expectedVersion,
      strategy,
      count,
      index,
    });
    const receipt = await processGameCommand({
      gameId: input.gameId,
      principalId: input.principal.id,
      commandId,
      idempotencyKey,
      expectedVersion,
      requestHash,
      type: "add_bot",
      envelope: envelope as unknown as Record<string, unknown>,
      newBot: { playerId, principalId: botPrincipalId, displayName, strategy },
      decide: (state) => {
        const decision = executeLegacyV2Command(state, envelope, {
          principalId: botPrincipalId,
          nowMs: Date.now(),
          blockNumber: logicalBlockNumber(),
          randomValue: deterministicNumber(`${input.gameId}:${commandId}:join`),
        });
        return { snapshot: decision.state, events: decision.events };
      },
    });
    receipts.push(receipt);
    if (receipt.status === "rejected") break;
    expectedVersion = receipt.version;
    game = await requireGame(input.gameId);
  }
  return { commands: receipts, game: await getGame(input.gameId, input.principal) };
}

export async function tickBots(input: {
  gameId: string;
  principal: PrincipalView;
  body: Record<string, unknown>;
}): Promise<{ command: CommandReceipt; game: Record<string, unknown>; bot: Record<string, unknown> }> {
  const commandId = requireUuid(input.body.commandId, "commandId");
  const idempotencyKey = requireString(input.body.idempotencyKey, "idempotencyKey", {
    min: 8,
    max: 128,
  });
  const expectedVersion = requireInteger(input.body.expectedVersion, "expectedVersion", { min: 0 });
  const game = await requireGame(input.gameId);
  if (game.ownerPrincipalId !== input.principal.id) {
    throw new ApiError(403, "owner_authorization_required", "Forbidden", "Only the owner may tick bots.");
  }
  const requestHash = await hashJson({
    gameId: input.gameId,
    ownerPrincipalId: input.principal.id,
    commandId,
    idempotencyKey,
    expectedVersion,
    type: "bot_tick",
  });
  const replayed = await replayGameCommandIfPresent({
    gameId: input.gameId,
    principalId: input.principal.id,
    idempotencyKey,
    requestHash,
  });
  if (replayed) {
    return {
      command: replayed,
      game: await getGame(input.gameId, input.principal),
      bot: { replayed: true },
    };
  }
  const bots = await listGameBots(input.gameId);
  const tieBreaker = deterministicNumber(`${input.gameId}:${expectedVersion}:${commandId}:tick`);
  let selected:
    | { playerId: string; principalId: string; strategy: BotStrategy; decision: NonNullable<ReturnType<typeof chooseLegacyV2BotCommand>> }
    | undefined;
  for (const bot of bots) {
    const projection = projectLegacyV2Game(game.snapshot, {
      nowMs: Date.now(),
      blockNumber: logicalBlockNumber(),
      principalId: bot.principalId,
    });
    const decision = chooseLegacyV2BotCommand(projection, {
      botPlayerId: bot.playerId,
      strategy: bot.strategy as LegacyV2BotStrategy,
      tieBreaker,
    });
    if (decision) {
      selected = { ...bot, decision };
      break;
    }
  }
  if (!selected) {
    throw new ApiError(409, "bot_no_action", "No bot action", "No configured bot has a legal action now.");
  }
  const envelope: CommandEnvelope = {
    commandId,
    idempotencyKey,
    expectedVersion,
    command: selected.decision.command,
  };
  const receipt = await processGameCommand({
    gameId: input.gameId,
    principalId: input.principal.id,
    commandId,
    idempotencyKey,
    expectedVersion,
    requestHash,
    type: "bot_tick",
    envelope: envelope as unknown as Record<string, unknown>,
    decide: (state) => {
      const decision = executeLegacyV2Command(state, envelope, {
        principalId: selected.principalId,
        actorPlayerId: selected.playerId,
        nowMs: Date.now(),
        blockNumber: logicalBlockNumber(),
        randomValue: selected.decision.randomValue,
      });
      return { snapshot: decision.state, events: decision.events };
    },
  });
  return {
    command: receipt,
    game: await getGame(input.gameId, input.principal),
    bot: {
      playerId: selected.playerId,
      strategy: selected.strategy,
      rationale: selected.decision.rationale,
    },
  };
}

function executeCommand(input: {
  game: GameView;
  principal: PrincipalView;
  envelope: CommandEnvelope;
  requestHash: string;
  actorPlayerId?: string;
  entitlementId?: string;
}): Promise<CommandReceipt> {
  return processGameCommand({
    gameId: input.game.id,
    principalId: input.principal.id,
    commandId: input.envelope.commandId,
    idempotencyKey: input.envelope.idempotencyKey,
    expectedVersion: input.envelope.expectedVersion,
    requestHash: input.requestHash,
    type: input.envelope.command.type,
    envelope: input.envelope as unknown as Record<string, unknown>,
    ...(input.entitlementId ? { entitlementId: input.entitlementId } : {}),
    decide: (state) => {
      const decision = executeLegacyV2Command(state, input.envelope, {
        principalId: input.principal.id,
        ...(input.actorPlayerId ? { actorPlayerId: input.actorPlayerId } : {}),
        nowMs: Date.now(),
        blockNumber: logicalBlockNumber(),
        randomValue: deterministicNumber(
          `${input.game.id}:${input.envelope.expectedVersion}:${input.envelope.commandId}`,
        ),
      });
      return { snapshot: decision.state, events: decision.events };
    },
  });
}

function projectGame(game: GameView, principal: PrincipalView | null): Record<string, unknown> {
  return {
    id: game.id,
    ownerPrincipalId: game.ownerPrincipalId,
    isOwner: principal?.id === game.ownerPrincipalId,
    status: game.status,
    rulesetVersion: game.rulesetVersion,
    version: game.version,
    config: game.config,
    stateHash: game.stateHash,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
    projection: clientProjection(game, principal),
  };
}

function clientProjection(game: GameView, principal: PrincipalView | null) {
  const projection = projectLegacyV2Game(
    game.snapshot,
    projectionContext(principal),
  );
  return {
    ...projection,
    legalActions: projection.legalActions.map((action) =>
      UNSETTLED_ECONOMIC_COMMANDS.has(action.type)
        ? {
            ...action,
            enabled: false,
            reason: "settlement_not_enabled",
            details: {
              ...action.details,
              message:
                "This economic action remains disabled until payout settlement is available.",
            },
          }
        : action,
    ),
  };
}

async function requireGame(gameId: string): Promise<GameView> {
  requireUuid(gameId, "gameId");
  const game = await getGameRecord(gameId);
  if (!game) throw new ApiError(404, "game_not_found", "Game not found", "No game exists with that id.");
  return game;
}

function projectionContext(principal: PrincipalView | null): {
  nowMs: number;
  blockNumber: number;
  principalId?: string;
} {
  return {
    nowMs: Date.now(),
    blockNumber: logicalBlockNumber(),
    ...(principal ? { principalId: principal.id } : {}),
  };
}

function parseCreateConfig(input: Record<string, unknown>): {
  settings: LegacyV2Settings;
  publicConfig: Record<string, unknown>;
} {
  const name = typeof input.name === "string" ? requireString(input.name, "config.name", { max: 80 }) : "Tact Game";
  const playerCount = optionalInteger(input.playerCount, "config.playerCount", 4, 2, 32);
  const boardRadius = optionalInteger(input.boardRadius, "config.boardRadius", 5, 1, 20);
  const initialActionPoints = optionalInteger(input.initialActionPoints, "config.initialActionPoints", 12, 0, 10_000);
  const initialHearts = optionalInteger(input.initialHearts, "config.initialHearts", 3, 1, 1_000);
  const initialRange = optionalInteger(input.initialRange, "config.initialRange", 3, 1, 100);
  const epochSeconds = optionalInteger(input.epochSeconds, "config.epochSeconds", 1_800, 10, 86_400);
  const revealWaitBlocks = optionalInteger(input.revealWaitBlocks, "config.revealWaitBlocks", 300, 1, 1_000_000);
  const autoStart = input.autoStart === undefined ? false : Boolean(input.autoStart);
  const entryPriceUsd = parseUsd(input.entryPriceUsd ?? "0");
  const minimumBuyIn = usdToAtomic(entryPriceUsd);
  const currency = getMppCurrency();
  const settings: LegacyV2Settings = {
    playerCount,
    boardRadius,
    initialActionPoints,
    initialHearts,
    initialRange,
    epochDurationMs: epochSeconds * 1_000,
    minimumBuyIn,
    revealWaitBlocks,
    autoStart,
  };
  return {
    settings,
    publicConfig: {
      name,
      playerCount,
      boardRadius,
      initialActionPoints,
      initialHearts,
      initialRange,
      epochSeconds,
      revealWaitBlocks,
      autoStart,
      entryPriceUsd,
      entryPriceAtomic: minimumBuyIn,
      currency,
    },
  };
}

function optionalInteger(
  value: unknown,
  name: string,
  fallback: number,
  min: number,
  max: number,
): number {
  return value === undefined ? fallback : requireInteger(value, name, { min, max });
}

function parseUsd(value: unknown): string {
  const text = requireString(value, "config.entryPriceUsd", { min: 1, max: 32 });
  if (!/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(text)) {
    throw new ApiError(400, "invalid_price", "Invalid entry price", "entryPriceUsd must be a canonical decimal string with at most six decimal places.");
  }
  const maximum = getMppMaxEntryPrice();
  if (BigInt(usdToAtomic(text)) > BigInt(usdToAtomic(maximum))) {
    throw new ApiError(
      400,
      "entry_price_too_high",
      "Entry price exceeds the production limit",
      `entryPriceUsd must be no greater than ${maximum} USD.`,
    );
  }
  return text;
}

function usdToAtomic(value: string): string {
  const [whole = "0", fraction = ""] = value.split(".");
  return (BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, "0") || "0")).toString();
}

function asObject(value: unknown, name: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(400, "invalid_request", "Invalid request", `${name} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function requireBotStrategy(value: unknown): BotStrategy {
  const strategy = requireString(value, "strategy", { min: 4, max: 16 });
  if (!["attack", "medic", "hoard", "sentinel", "idle"].includes(strategy)) {
    throw new ApiError(400, "invalid_bot_strategy", "Invalid bot strategy", "Unsupported bot strategy.");
  }
  return strategy as BotStrategy;
}

function logicalBlockNumber(nowMs = Date.now()): number {
  return Math.floor(nowMs / 12_000);
}

function deterministicNumber(seed: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

async function deriveUuid(base: string, index: number): Promise<string> {
  const digest = await hashJson(`${base}:${index}`);
  return `${digest.slice(0, 8)}-${digest.slice(8, 12)}-4${digest.slice(13, 16)}-a${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
}

function capitalize(value: string): string {
  return `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;
}
