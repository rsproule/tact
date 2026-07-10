import { sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const principalKind = pgEnum("principal_kind", ["human", "agent"]);
export const identityKind = pgEnum("identity_kind", [
  "neon_auth",
  "agent_token",
  "wallet",
  "anonymous_session",
]);
export const gameStatus = pgEnum("game_status", [
  "lobby",
  "active",
  "ended",
  "cancelled",
]);
export const playerState = pgEnum("player_state", ["alive", "dead"]);
export const commandStatus = pgEnum("command_status", [
  "received",
  "applied",
  "rejected",
]);
export const paymentProtocol = pgEnum("payment_protocol", ["mpp", "x402"]);
export const paymentStatus = pgEnum("payment_status", [
  "verified",
  "settled",
  "failed",
  "refunded",
]);
export const entitlementStatus = pgEnum("entitlement_status", [
  "available",
  "consumed",
  "revoked",
]);

export const principals = pgTable(
  "principals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: principalKind("kind").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("principals_kind_idx").on(table.kind)],
);

export const principalIdentities = pgTable(
  "principal_identities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    principalId: uuid("principal_id")
      .notNull()
      .references(() => principals.id, { onDelete: "cascade" }),
    kind: identityKind("kind").notNull(),
    issuer: text("issuer").notNull(),
    subject: text("subject").notNull(),
    credentialHash: text("credential_hash"),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("principal_identities_issuer_subject_uq").on(
      table.kind,
      table.issuer,
      table.subject,
    ),
    index("principal_identities_principal_idx").on(table.principalId),
  ],
);

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerPrincipalId: uuid("owner_principal_id")
      .notNull()
      .references(() => principals.id),
    status: gameStatus("status").notNull().default("lobby"),
    rulesetVersion: text("ruleset_version").notNull(),
    version: bigint("version", { mode: "number" }).notNull().default(0),
    config: jsonb("config").$type<Record<string, unknown>>().notNull(),
    stateSnapshot: jsonb("state_snapshot")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    stateHash: text("state_hash"),
    creationIdempotencyKey: text("creation_idempotency_key"),
    creationRequestHash: text("creation_request_hash"),
    epochStartedAt: timestamp("epoch_started_at", { withTimezone: true }),
    winnerPlayerId: uuid("winner_player_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("games_status_created_idx").on(table.status, table.createdAt),
    index("games_owner_idx").on(table.ownerPrincipalId),
    uniqueIndex("games_owner_creation_idempotency_uq")
      .on(table.ownerPrincipalId, table.creationIdempotencyKey)
      .where(sql`${table.creationIdempotencyKey} IS NOT NULL`),
    check("games_version_nonnegative", sql`${table.version} >= 0`),
  ],
);

export const gamePlayers = pgTable(
  "game_players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    principalId: uuid("principal_id")
      .notNull()
      .references(() => principals.id),
    seat: integer("seat").notNull(),
    handle: text("handle").notNull(),
    state: playerState("state").notNull().default("alive"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    finishedPlace: smallint("finished_place"),
  },
  (table) => [
    uniqueIndex("game_players_game_principal_uq").on(table.gameId, table.principalId),
    uniqueIndex("game_players_game_seat_uq").on(table.gameId, table.seat),
    index("game_players_principal_idx").on(table.principalId),
    check("game_players_seat_positive", sql`${table.seat} > 0`),
  ],
);

export const tanks = pgTable(
  "tanks",
  {
    playerId: uuid("player_id")
      .primaryKey()
      .references(() => gamePlayers.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    positionQ: smallint("position_q").notNull(),
    positionR: smallint("position_r").notNull(),
    positionS: smallint("position_s").notNull(),
    hearts: integer("hearts").notNull(),
    actionPoints: integer("action_points").notNull(),
    range: integer("range").notNull(),
    lastDripEpoch: bigint("last_drip_epoch", { mode: "number" }).notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("tanks_game_position_uq").on(
      table.gameId,
      table.positionQ,
      table.positionR,
      table.positionS,
    ),
    index("tanks_game_idx").on(table.gameId),
    check(
      "tanks_cube_coordinate",
      sql`${table.positionQ} + ${table.positionR} + ${table.positionS} = 0`,
    ),
    check(
      "tanks_resources_nonnegative",
      sql`${table.hearts} >= 0 AND ${table.actionPoints} >= 0 AND ${table.range} >= 0`,
    ),
  ],
);

export const gameBots = pgTable(
  "game_bots",
  {
    playerId: uuid("player_id")
      .primaryKey()
      .references(() => gamePlayers.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    principalId: uuid("principal_id")
      .notNull()
      .references(() => principals.id, { onDelete: "cascade" }),
    strategy: text("strategy").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("game_bots_game_principal_uq").on(table.gameId, table.principalId),
    index("game_bots_game_idx").on(table.gameId),
  ],
);

export const boardResources = pgTable(
  "board_resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    quantity: integer("quantity").notNull().default(1),
    positionQ: smallint("position_q").notNull(),
    positionR: smallint("position_r").notNull(),
    positionS: smallint("position_s").notNull(),
    spawnedAt: timestamp("spawned_at", { withTimezone: true }).notNull().defaultNow(),
    collectedAt: timestamp("collected_at", { withTimezone: true }),
    collectedByPlayerId: uuid("collected_by_player_id").references(() => gamePlayers.id),
  },
  (table) => [
    uniqueIndex("board_resources_active_position_uq")
      .on(table.gameId, table.positionQ, table.positionR, table.positionS)
      .where(sql`${table.collectedAt} IS NULL`),
    index("board_resources_game_active_idx").on(table.gameId, table.collectedAt),
    check(
      "board_resources_cube_coordinate",
      sql`${table.positionQ} + ${table.positionR} + ${table.positionS} = 0`,
    ),
    check("board_resources_quantity_positive", sql`${table.quantity} > 0`),
  ],
);

export const paymentReceipts = pgTable(
  "payment_receipts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    protocol: paymentProtocol("protocol").notNull(),
    method: text("method").notNull(),
    providerReference: text("provider_reference").notNull(),
    challengeId: text("challenge_id"),
    principalId: uuid("principal_id").references(() => principals.id),
    payer: text("payer"),
    amount: text("amount").notNull(),
    currency: text("currency").notNull(),
    status: paymentStatus("status").notNull(),
    rawReceipt: jsonb("raw_receipt").$type<Record<string, unknown>>().notNull(),
    settledAt: timestamp("settled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("payment_receipts_protocol_reference_uq").on(
      table.protocol,
      table.providerReference,
    ),
    index("payment_receipts_principal_idx").on(table.principalId),
  ],
);

export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    principalId: uuid("principal_id")
      .notNull()
      .references(() => principals.id),
    gameId: uuid("game_id").references(() => games.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    status: entitlementStatus("status").notNull().default("available"),
    paymentReceiptId: uuid("payment_receipt_id")
      .notNull()
      .references(() => paymentReceipts.id),
    consumedByCommandId: uuid("consumed_by_command_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("entitlements_receipt_kind_uq").on(table.paymentReceiptId, table.kind),
    index("entitlements_available_idx").on(
      table.principalId,
      table.gameId,
      table.kind,
      table.status,
    ),
  ],
);

export const gameCommands = pgTable(
  "game_commands",
  {
    id: uuid("id").primaryKey(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    principalId: uuid("principal_id")
      .notNull()
      .references(() => principals.id),
    idempotencyKey: text("idempotency_key").notNull(),
    expectedVersion: bigint("expected_version", { mode: "number" }).notNull(),
    requestHash: text("request_hash").notNull(),
    type: text("type").notNull(),
    envelope: jsonb("envelope").$type<Record<string, unknown>>().notNull(),
    status: commandStatus("status").notNull().default("received"),
    result: jsonb("result").$type<Record<string, unknown>>(),
    errorCode: text("error_code"),
    entitlementId: uuid("entitlement_id").references(() => entitlements.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("game_commands_idempotency_uq").on(
      table.gameId,
      table.principalId,
      table.idempotencyKey,
    ),
    index("game_commands_game_created_idx").on(table.gameId, table.createdAt),
  ],
);

export const gameEvents = pgTable(
  "game_events",
  {
    sequence: bigserial("sequence", { mode: "number" }).primaryKey(),
    id: uuid("id").notNull().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    gameVersion: bigint("game_version", { mode: "number" }).notNull(),
    eventIndex: smallint("event_index").notNull().default(0),
    commandId: uuid("command_id").references(() => gameCommands.id),
    principalId: uuid("principal_id").references(() => principals.id),
    type: text("type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    previousHash: text("previous_hash"),
    eventHash: text("event_hash").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("game_events_id_uq").on(table.id),
    uniqueIndex("game_events_game_version_index_uq").on(
      table.gameId,
      table.gameVersion,
      table.eventIndex,
    ),
    index("game_events_game_sequence_idx").on(table.gameId, table.sequence),
    check("game_events_event_index_nonnegative", sql`${table.eventIndex} >= 0`),
  ],
);

/** Durable replay/session state for mppx's AtomicStore contract. */
export const mppStore = pgTable("mpp_store", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Fixed-window limits used at public mutation boundaries. */
export const rateLimits = pgTable(
  "rate_limits",
  {
    scope: text("scope").notNull(),
    subject: text("subject").notNull(),
    windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(1),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("rate_limits_scope_subject_window_uq").on(
      table.scope,
      table.subject,
      table.windowStartedAt,
    ),
    index("rate_limits_updated_idx").on(table.updatedAt),
    check("rate_limits_count_positive", sql`${table.count} > 0`),
  ],
);

export const outbox = pgTable(
  "outbox",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventSequence: bigint("event_sequence", { mode: "number" })
      .notNull()
      .references(() => gameEvents.sequence, { onDelete: "cascade" }),
    topic: text("topic").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    attempts: integer("attempts").notNull().default(0),
    availableAt: timestamp("available_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    lastError: text("last_error"),
  },
  (table) => [
    uniqueIndex("outbox_event_topic_uq").on(table.eventSequence, table.topic),
    index("outbox_pending_idx")
      .on(table.availableAt)
      .where(sql`${table.publishedAt} IS NULL`),
    check("outbox_attempts_nonnegative", sql`${table.attempts} >= 0`),
  ],
);

export type Principal = typeof principals.$inferSelect;
export type Game = typeof games.$inferSelect;
export type GamePlayer = typeof gamePlayers.$inferSelect;
export type Tank = typeof tanks.$inferSelect;
export type GameCommandRecord = typeof gameCommands.$inferSelect;
export type GameEventRecord = typeof gameEvents.$inferSelect;
