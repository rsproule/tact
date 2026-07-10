import type { LegacyV2Event, LegacyV2GameState } from "@tact/game-engine";
import { parseHexKey } from "@tact/game-engine";
import { and, asc, desc, eq, gt, lt, sql } from "drizzle-orm";

import { getDatabase } from "./client";
import { hashJson } from "./integrity";
import {
  boardResources,
  entitlements,
  gameBots,
  gameCommands,
  gameEvents,
  gamePlayers,
  games,
  outbox,
  paymentReceipts,
  principalIdentities,
  principals,
  tanks,
} from "./schema";
import type {
  BotStrategy,
  CommandReceipt,
  GameMutationPlan,
  GameView,
  StoredGameSnapshot,
} from "./types";

export type RepositoryErrorCode =
  | "game_not_found"
  | "idempotency_key_reused"
  | "command_id_reused"
  | "stale_game_version"
  | "command_in_progress"
  | "invalid_state_version"
  | "empty_event_batch"
  | "entitlement_unavailable";

export class RepositoryError extends Error {
  constructor(
    readonly code: RepositoryErrorCode,
    message: string,
    readonly details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}

export async function createGameRecord(input: {
  gameId: string;
  ownerPrincipalId: string;
  rulesetVersion: string;
  idempotencyKey: string;
  requestHash: string;
  config: Record<string, unknown>;
  initialState: StoredGameSnapshot;
}): Promise<{ game: GameView; replayed: boolean }> {
  return getDatabase().transaction(async (tx) => {
    const previous = await tx
      .select()
      .from(games)
      .where(
        and(
          eq(games.ownerPrincipalId, input.ownerPrincipalId),
          eq(games.creationIdempotencyKey, input.idempotencyKey),
        ),
      )
      .limit(1);
    if (previous[0]) {
      assertCreationHash(previous[0].creationRequestHash, input.requestHash);
      return { game: mapGame(previous[0]), replayed: true };
    }

    const initialEvent = {
      type: "game_created",
      payload: {
        gameId: input.gameId,
        ownerPrincipalId: input.ownerPrincipalId,
        rulesetVersion: input.rulesetVersion,
        config: input.config,
      },
    };
    const eventHash = await hashEvent({
      gameId: input.gameId,
      gameVersion: 0,
      eventIndex: 0,
      type: initialEvent.type,
      payload: initialEvent.payload,
      previousHash: null,
    });

    const inserted = await tx
      .insert(games)
      .values({
        id: input.gameId,
        ownerPrincipalId: input.ownerPrincipalId,
        status: input.initialState.status,
        rulesetVersion: input.rulesetVersion,
        version: 0,
        config: input.config,
        stateSnapshot: asJson(input.initialState),
        stateHash: eventHash,
        creationIdempotencyKey: input.idempotencyKey,
        creationRequestHash: input.requestHash,
      })
      .onConflictDoNothing({
        target: [games.ownerPrincipalId, games.creationIdempotencyKey],
        where: sql`${games.creationIdempotencyKey} IS NOT NULL`,
      })
      .returning();

    const game = inserted[0];
    if (!game) {
      const raced = await tx
        .select()
        .from(games)
        .where(
          and(
            eq(games.ownerPrincipalId, input.ownerPrincipalId),
            eq(games.creationIdempotencyKey, input.idempotencyKey),
          ),
        )
        .limit(1);
      const winner = raced[0];
      if (!winner) throw new RepositoryError("game_not_found", "Creation race lost");
      assertCreationHash(winner.creationRequestHash, input.requestHash);
      return { game: mapGame(winner), replayed: true };
    }

    const [event] = await tx
      .insert(gameEvents)
      .values({
        gameId: game.id,
        gameVersion: 0,
        eventIndex: 0,
        principalId: input.ownerPrincipalId,
        type: initialEvent.type,
        payload: initialEvent.payload,
        previousHash: null,
        eventHash,
      })
      .returning({ sequence: gameEvents.sequence });
    if (event) {
      await tx.insert(outbox).values({
        eventSequence: event.sequence,
        topic: "game.events",
        payload: { gameId: game.id, gameVersion: 0, eventIndex: 0 },
      });
    }
    return { game: mapGame(game), replayed: false };
  });
}

export async function listGameRecords(input: {
  limit: number;
  before?: Date;
  status?: "lobby" | "active" | "ended" | "cancelled";
}): Promise<readonly GameView[]> {
  const filters = [
    input.before ? lt(games.createdAt, input.before) : undefined,
    input.status ? eq(games.status, input.status) : undefined,
  ].filter((value): value is Exclude<typeof value, undefined> => value !== undefined);
  const rows = await getDatabase()
    .select()
    .from(games)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(games.createdAt), desc(games.id))
    .limit(input.limit);
  return rows.map(mapGame);
}

export async function getGameRecord(gameId: string): Promise<GameView | null> {
  const rows = await getDatabase().select().from(games).where(eq(games.id, gameId)).limit(1);
  return rows[0] ? mapGame(rows[0]) : null;
}

export async function listGameEvents(input: {
  gameId: string;
  after: number;
  limit: number;
}): Promise<readonly Record<string, unknown>[]> {
  const rows = await getDatabase()
    .select()
    .from(gameEvents)
    .where(and(eq(gameEvents.gameId, input.gameId), gt(gameEvents.sequence, input.after)))
    .orderBy(asc(gameEvents.sequence))
    .limit(input.limit);
  return rows.map((row) => ({
    sequence: row.sequence,
    id: row.id,
    gameId: row.gameId,
    gameVersion: row.gameVersion,
    eventIndex: row.eventIndex,
    commandId: row.commandId,
    principalId: row.principalId,
    type: row.type,
    payload: row.payload,
    previousHash: row.previousHash,
    eventHash: row.eventHash,
    occurredAt: row.occurredAt.toISOString(),
  }));
}

/**
 * Resolve a completed command before application code derives any mutable
 * state-dependent work (for example choosing a bot action). The transactional
 * command path performs the same check again under the game row lock.
 */
export async function replayGameCommandIfPresent(input: {
  gameId: string;
  principalId: string;
  idempotencyKey: string;
  requestHash: string;
}): Promise<CommandReceipt | null> {
  const rows = await getDatabase()
    .select()
    .from(gameCommands)
    .where(
      and(
        eq(gameCommands.gameId, input.gameId),
        eq(gameCommands.principalId, input.principalId),
        eq(gameCommands.idempotencyKey, input.idempotencyKey),
      ),
    )
    .limit(1);
  return rows[0] ? replayCommand(rows[0], input.requestHash) : null;
}

export async function processGameCommand(input: {
  gameId: string;
  principalId: string;
  commandId: string;
  idempotencyKey: string;
  expectedVersion: number;
  requestHash: string;
  type: string;
  envelope: Record<string, unknown>;
  decide: (state: StoredGameSnapshot) => Promise<GameMutationPlan> | GameMutationPlan;
  entitlementId?: string;
  newBot?: {
    playerId: string;
    principalId: string;
    displayName: string;
    strategy: BotStrategy;
  };
}): Promise<CommandReceipt> {
  return getDatabase().transaction(async (tx) => {
    await tx.execute(sql`select ${games.id} from ${games} where ${games.id} = ${input.gameId} for update`);
    const gameRows = await tx.select().from(games).where(eq(games.id, input.gameId)).limit(1);
    const game = gameRows[0];
    if (!game) throw new RepositoryError("game_not_found", "Game does not exist");

    const prior = await tx
      .select()
      .from(gameCommands)
      .where(
        and(
          eq(gameCommands.gameId, input.gameId),
          eq(gameCommands.principalId, input.principalId),
          eq(gameCommands.idempotencyKey, input.idempotencyKey),
        ),
      )
      .limit(1);
    if (prior[0]) return replayCommand(prior[0], input.requestHash);

    const reusedId = await tx
      .select({ id: gameCommands.id, requestHash: gameCommands.requestHash })
      .from(gameCommands)
      .where(eq(gameCommands.id, input.commandId))
      .limit(1);
    if (reusedId[0]) {
      throw new RepositoryError("command_id_reused", "commandId was already used", {
        commandId: input.commandId,
      });
    }

    await tx.insert(gameCommands).values({
      id: input.commandId,
      gameId: input.gameId,
      principalId: input.principalId,
      idempotencyKey: input.idempotencyKey,
      expectedVersion: input.expectedVersion,
      requestHash: input.requestHash,
      type: input.type,
      envelope: input.envelope,
      entitlementId: input.entitlementId,
    });

    if (game.version !== input.expectedVersion) {
      return rejectCommand(tx, input, "stale_game_version", "Game version is stale", {
        expectedVersion: input.expectedVersion,
        currentVersion: game.version,
      });
    }

    let plan: GameMutationPlan;
    try {
      plan = await input.decide(game.stateSnapshot as unknown as StoredGameSnapshot);
    } catch (error) {
      const rejection = normalizeDecisionError(error);
      return rejectCommand(tx, input, rejection.code, rejection.message, rejection.details);
    }

    if (plan.events.length === 0) {
      return rejectCommand(tx, input, "empty_event_batch", "Command emitted no events", {});
    }
    const nextVersion = game.version + 1;
    if (plan.snapshot.version !== nextVersion) {
      return rejectCommand(
        tx,
        input,
        "invalid_state_version",
        "Engine state version did not advance exactly once",
        { expected: nextVersion, received: plan.snapshot.version },
      );
    }

    if (input.entitlementId) {
      const consumed = await tx
        .update(entitlements)
        .set({
          status: "consumed",
          consumedByCommandId: input.commandId,
          consumedAt: new Date(),
        })
        .where(
          and(
            eq(entitlements.id, input.entitlementId),
            eq(entitlements.principalId, input.principalId),
            eq(entitlements.gameId, input.gameId),
            eq(entitlements.status, "available"),
          ),
        )
        .returning({ id: entitlements.id });
      if (consumed.length === 0) {
        return rejectCommand(
          tx,
          input,
          "entitlement_unavailable",
          "Required paid entitlement is unavailable",
          {},
        );
      }
    }

    if (input.newBot) {
      await tx.insert(principals).values({
        id: input.newBot.principalId,
        kind: "agent",
        displayName: input.newBot.displayName,
      });
      await tx.insert(principalIdentities).values({
        principalId: input.newBot.principalId,
        kind: "agent_token",
        issuer: "tact:internal-bot",
        subject: `${input.gameId}:${input.newBot.playerId}`,
      });
    }

    let previousHash = game.stateHash;
    const persistedEvents: { sequence: number; index: number }[] = [];
    for (const [eventIndex, domainEvent] of plan.events.entries()) {
      const payload = asJson(domainEvent);
      const eventHash = await hashEvent({
        gameId: input.gameId,
        gameVersion: nextVersion,
        eventIndex,
        type: domainEvent.type,
        payload,
        previousHash,
      });
      const [event] = await tx
        .insert(gameEvents)
        .values({
          gameId: input.gameId,
          gameVersion: nextVersion,
          eventIndex,
          commandId: input.commandId,
          principalId: input.principalId,
          type: domainEvent.type,
          payload,
          previousHash,
          eventHash,
        })
        .returning({ sequence: gameEvents.sequence });
      if (event) persistedEvents.push({ sequence: event.sequence, index: eventIndex });
      previousHash = eventHash;
    }

    const updated = await tx
      .update(games)
      .set({
        status: plan.snapshot.status,
        version: nextVersion,
        stateSnapshot: asJson(plan.snapshot),
        stateHash: previousHash,
        epochStartedAt:
          plan.snapshot.startedAtMs === null ? null : new Date(plan.snapshot.startedAtMs),
        winnerPlayerId: plan.snapshot.podium?.[0] ?? null,
        startedAt:
          plan.snapshot.startedAtMs === null ? null : new Date(plan.snapshot.startedAtMs),
        endedAt: plan.snapshot.endedAtMs === null ? null : new Date(plan.snapshot.endedAtMs),
        updatedAt: new Date(),
      })
      .where(and(eq(games.id, input.gameId), eq(games.version, game.version)))
      .returning({ id: games.id });
    if (updated.length === 0) {
      throw new RepositoryError("stale_game_version", "The game changed; refetch it and retry.");
    }

    await synchronizeProjection(tx, plan.snapshot);
    if (input.newBot) {
      await tx.insert(gameBots).values({
        playerId: input.newBot.playerId,
        gameId: input.gameId,
        principalId: input.newBot.principalId,
        strategy: input.newBot.strategy,
      });
    }
    for (const event of persistedEvents) {
      await tx.insert(outbox).values({
        eventSequence: event.sequence,
        topic: "game.events",
        payload: {
          gameId: input.gameId,
          gameVersion: nextVersion,
          eventIndex: event.index,
        },
      });
    }

    const result = {
      version: nextVersion,
      eventCount: plan.events.length,
      stateHash: previousHash,
    };
    await tx
      .update(gameCommands)
      .set({ status: "applied", result, completedAt: new Date() })
      .where(eq(gameCommands.id, input.commandId));
    return {
      commandId: input.commandId,
      gameId: input.gameId,
      status: "applied",
      version: nextVersion,
      result,
      replayed: false,
    };
  });
}

export async function listGameBots(gameId: string): Promise<
  readonly { playerId: string; principalId: string; strategy: BotStrategy }[]
> {
  const rows = await getDatabase()
    .select({
      playerId: gameBots.playerId,
      principalId: gameBots.principalId,
      strategy: gameBots.strategy,
    })
    .from(gameBots)
    .where(eq(gameBots.gameId, gameId))
    .orderBy(asc(gameBots.createdAt));
  return rows.map((row) => ({ ...row, strategy: row.strategy as BotStrategy }));
}

export async function recordMatchEntryEntitlement(input: {
  principalId: string;
  gameId: string;
  providerReference: string;
  amount: string;
  currency: string;
  payer?: string;
  rawReceipt: Record<string, unknown>;
}): Promise<string> {
  return getDatabase().transaction(async (tx) => {
    let receipt = await tx
      .select({
        id: paymentReceipts.id,
        principalId: paymentReceipts.principalId,
        payer: paymentReceipts.payer,
        amount: paymentReceipts.amount,
        currency: paymentReceipts.currency,
      })
      .from(paymentReceipts)
      .where(
        and(
          eq(paymentReceipts.protocol, "mpp"),
          eq(paymentReceipts.providerReference, input.providerReference),
        ),
      )
      .limit(1);
    if (!receipt[0]) {
      receipt = await tx
        .insert(paymentReceipts)
        .values({
          protocol: "mpp",
          method: "tempo",
          providerReference: input.providerReference,
          principalId: input.principalId,
          payer: input.payer,
          amount: input.amount,
          currency: input.currency,
          status: "settled",
          rawReceipt: input.rawReceipt,
          settledAt: new Date(),
        })
        .onConflictDoNothing({
          target: [paymentReceipts.protocol, paymentReceipts.providerReference],
        })
        .returning({
          id: paymentReceipts.id,
          principalId: paymentReceipts.principalId,
          payer: paymentReceipts.payer,
          amount: paymentReceipts.amount,
          currency: paymentReceipts.currency,
        });
      if (!receipt[0]) {
        receipt = await tx
          .select({
            id: paymentReceipts.id,
            principalId: paymentReceipts.principalId,
            payer: paymentReceipts.payer,
            amount: paymentReceipts.amount,
            currency: paymentReceipts.currency,
          })
          .from(paymentReceipts)
          .where(
            and(
              eq(paymentReceipts.protocol, "mpp"),
              eq(paymentReceipts.providerReference, input.providerReference),
            ),
          )
          .limit(1);
      }
    }
    const resolvedReceipt = receipt[0];
    if (!resolvedReceipt) throw new Error("Payment receipt resolution failed");
    if (
      resolvedReceipt.principalId !== input.principalId ||
      resolvedReceipt.amount !== input.amount ||
      resolvedReceipt.currency.toLowerCase() !== input.currency.toLowerCase() ||
      (resolvedReceipt.payer ?? null) !== (input.payer ?? null)
    ) {
      throw new Error("Payment receipt was already bound to different entry details");
    }
    const receiptId = resolvedReceipt.id;

    let entitlement = await tx
      .select({
        id: entitlements.id,
        principalId: entitlements.principalId,
        gameId: entitlements.gameId,
      })
      .from(entitlements)
      .where(
        and(
          eq(entitlements.paymentReceiptId, receiptId),
          eq(entitlements.kind, "match_entry"),
        ),
      )
      .limit(1);
    if (!entitlement[0]) {
      entitlement = await tx
        .insert(entitlements)
        .values({
          principalId: input.principalId,
          gameId: input.gameId,
          kind: "match_entry",
          paymentReceiptId: receiptId,
        })
        .onConflictDoNothing({
          target: [entitlements.paymentReceiptId, entitlements.kind],
        })
        .returning({
          id: entitlements.id,
          principalId: entitlements.principalId,
          gameId: entitlements.gameId,
        });
      if (!entitlement[0]) {
        entitlement = await tx
          .select({
            id: entitlements.id,
            principalId: entitlements.principalId,
            gameId: entitlements.gameId,
          })
          .from(entitlements)
          .where(
            and(
              eq(entitlements.paymentReceiptId, receiptId),
              eq(entitlements.kind, "match_entry"),
            ),
          )
          .limit(1);
      }
    }
    const resolvedEntitlement = entitlement[0];
    if (!resolvedEntitlement) throw new Error("Entitlement resolution failed");
    if (
      resolvedEntitlement.principalId !== input.principalId ||
      resolvedEntitlement.gameId !== input.gameId
    ) {
      throw new Error("Payment entitlement was already bound to a different match entry");
    }
    return resolvedEntitlement.id;
  });
}

type Transaction = Parameters<Parameters<ReturnType<typeof getDatabase>["transaction"]>[0]>[0];

async function synchronizeProjection(tx: Transaction, state: LegacyV2GameState): Promise<void> {
  for (const playerId of state.seatOrder) {
    const player = state.players[playerId];
    if (!player) continue;
    const place = state.podium?.findIndex((candidate) => candidate === playerId) ?? -1;
    await tx
      .insert(gamePlayers)
      .values({
        id: player.playerId,
        gameId: state.gameId,
        principalId: player.principalId,
        seat: player.seat,
        handle: player.handle,
        state: player.hearts > 0 ? "alive" : "dead",
        finishedPlace: place >= 0 ? place + 1 : null,
      })
      .onConflictDoUpdate({
        target: gamePlayers.id,
        set: {
          handle: player.handle,
          state: player.hearts > 0 ? "alive" : "dead",
          finishedPlace: place >= 0 ? place + 1 : null,
        },
      });
    await tx
      .insert(tanks)
      .values({
        playerId: player.playerId,
        gameId: state.gameId,
        positionQ: player.position.q,
        positionR: player.position.r,
        positionS: player.position.s,
        hearts: player.hearts,
        actionPoints: player.actionPoints,
        range: player.range,
        lastDripEpoch: player.lastDripEpoch ?? 0,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: tanks.playerId,
        set: {
          positionQ: player.position.q,
          positionR: player.position.r,
          positionS: player.position.s,
          hearts: player.hearts,
          actionPoints: player.actionPoints,
          range: player.range,
          lastDripEpoch: player.lastDripEpoch ?? 0,
          updatedAt: new Date(),
        },
      });
  }

  await tx.delete(boardResources).where(eq(boardResources.gameId, state.gameId));
  const resources = Object.entries(state.boardHearts).map(([key, quantity]) => {
    const position = parseHexKey(key);
    return {
      gameId: state.gameId,
      kind: "heart",
      quantity,
      positionQ: position.q,
      positionR: position.r,
      positionS: position.s,
    };
  });
  if (resources.length > 0) await tx.insert(boardResources).values(resources);
}

async function rejectCommand(
  tx: Transaction,
  input: {
    gameId: string;
    commandId: string;
    expectedVersion: number;
  },
  code: string,
  message: string,
  details: Record<string, unknown>,
): Promise<CommandReceipt> {
  const result = { code, message, details, version: input.expectedVersion };
  await tx
    .update(gameCommands)
    .set({ status: "rejected", errorCode: code, result, completedAt: new Date() })
    .where(eq(gameCommands.id, input.commandId));
  return {
    commandId: input.commandId,
    gameId: input.gameId,
    status: "rejected",
    version: input.expectedVersion,
    result,
    errorCode: code,
    replayed: false,
  };
}

function replayCommand(
  command: typeof gameCommands.$inferSelect,
  requestHash: string,
): CommandReceipt {
  if (command.requestHash !== requestHash) {
    throw new RepositoryError(
      "idempotency_key_reused",
      "Idempotency key was reused with a different request",
      { idempotencyKey: command.idempotencyKey },
    );
  }
  if (command.status === "received") {
    throw new RepositoryError("command_in_progress", "Command is still being processed");
  }
  const result = command.result ?? {};
  const resultVersion = result.version;
  return {
    commandId: command.id,
    gameId: command.gameId,
    status: command.status,
    version: typeof resultVersion === "number" ? resultVersion : command.expectedVersion,
    result,
    ...(command.errorCode ? { errorCode: command.errorCode } : {}),
    replayed: true,
  };
}

function normalizeDecisionError(error: unknown): {
  code: string;
  message: string;
  details: Record<string, unknown>;
} {
  if (error && typeof error === "object" && "code" in error) {
    const candidate = error as { code?: unknown; message?: unknown; details?: unknown };
    if (typeof candidate.code === "string") {
      return {
        code: candidate.code,
        message:
          typeof candidate.message === "string" ? candidate.message : "Command was rejected",
        details:
          candidate.details && typeof candidate.details === "object"
            ? (candidate.details as Record<string, unknown>)
            : {},
      };
    }
  }
  throw error;
}

function assertCreationHash(stored: string | null, received: string): void {
  if (stored !== received) {
    throw new RepositoryError(
      "idempotency_key_reused",
      "Creation idempotency key was reused with a different request",
    );
  }
}

function mapGame(row: typeof games.$inferSelect): GameView {
  return {
    id: row.id,
    ownerPrincipalId: row.ownerPrincipalId,
    status: row.status as LegacyV2GameState["status"],
    rulesetVersion: row.rulesetVersion,
    version: row.version,
    config: row.config,
    snapshot: row.stateSnapshot as unknown as StoredGameSnapshot,
    stateHash: row.stateHash,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function hashEvent(input: {
  gameId: string;
  gameVersion: number;
  eventIndex: number;
  type: string;
  payload: Record<string, unknown>;
  previousHash: string | null;
}): Promise<string> {
  return hashJson(input);
}

function asJson(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}
