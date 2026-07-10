CREATE TYPE "public"."command_status" AS ENUM('received', 'applied', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."entitlement_status" AS ENUM('available', 'consumed', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."game_status" AS ENUM('lobby', 'active', 'ended', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."identity_kind" AS ENUM('neon_auth', 'agent_token', 'wallet');--> statement-breakpoint
CREATE TYPE "public"."payment_protocol" AS ENUM('mpp', 'x402');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('verified', 'settled', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."player_state" AS ENUM('alive', 'dead');--> statement-breakpoint
CREATE TYPE "public"."principal_kind" AS ENUM('human', 'agent');--> statement-breakpoint
CREATE TABLE "board_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"position_q" smallint NOT NULL,
	"position_r" smallint NOT NULL,
	"position_s" smallint NOT NULL,
	"spawned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"collected_at" timestamp with time zone,
	"collected_by_player_id" uuid,
	CONSTRAINT "board_resources_cube_coordinate" CHECK ("board_resources"."position_q" + "board_resources"."position_r" + "board_resources"."position_s" = 0),
	CONSTRAINT "board_resources_quantity_positive" CHECK ("board_resources"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"principal_id" uuid NOT NULL,
	"game_id" uuid,
	"kind" text NOT NULL,
	"status" "entitlement_status" DEFAULT 'available' NOT NULL,
	"payment_receipt_id" uuid NOT NULL,
	"consumed_by_command_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consumed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "game_commands" (
	"id" uuid PRIMARY KEY NOT NULL,
	"game_id" uuid NOT NULL,
	"principal_id" uuid NOT NULL,
	"idempotency_key" text NOT NULL,
	"expected_version" bigint NOT NULL,
	"request_hash" text NOT NULL,
	"type" text NOT NULL,
	"envelope" jsonb NOT NULL,
	"status" "command_status" DEFAULT 'received' NOT NULL,
	"result" jsonb,
	"error_code" text,
	"entitlement_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "game_events" (
	"sequence" bigserial PRIMARY KEY NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"game_version" bigint NOT NULL,
	"command_id" uuid,
	"principal_id" uuid,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"previous_hash" text,
	"event_hash" text NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"principal_id" uuid NOT NULL,
	"seat" integer NOT NULL,
	"handle" text NOT NULL,
	"state" "player_state" DEFAULT 'alive' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_place" smallint,
	CONSTRAINT "game_players_seat_positive" CHECK ("game_players"."seat" > 0)
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_principal_id" uuid NOT NULL,
	"status" "game_status" DEFAULT 'lobby' NOT NULL,
	"ruleset_version" text NOT NULL,
	"version" bigint DEFAULT 0 NOT NULL,
	"config" jsonb NOT NULL,
	"state_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"state_hash" text,
	"epoch_started_at" timestamp with time zone,
	"winner_player_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "games_version_nonnegative" CHECK ("games"."version" >= 0)
);
--> statement-breakpoint
CREATE TABLE "outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_sequence" bigint NOT NULL,
	"topic" text NOT NULL,
	"payload" jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"last_error" text,
	CONSTRAINT "outbox_attempts_nonnegative" CHECK ("outbox"."attempts" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payment_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocol" "payment_protocol" NOT NULL,
	"method" text NOT NULL,
	"provider_reference" text NOT NULL,
	"challenge_id" text,
	"principal_id" uuid,
	"payer" text,
	"amount" text NOT NULL,
	"currency" text NOT NULL,
	"status" "payment_status" NOT NULL,
	"raw_receipt" jsonb NOT NULL,
	"settled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "principal_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"principal_id" uuid NOT NULL,
	"kind" "identity_kind" NOT NULL,
	"issuer" text NOT NULL,
	"subject" text NOT NULL,
	"credential_hash" text,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "principals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "principal_kind" NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tanks" (
	"player_id" uuid PRIMARY KEY NOT NULL,
	"game_id" uuid NOT NULL,
	"position_q" smallint NOT NULL,
	"position_r" smallint NOT NULL,
	"position_s" smallint NOT NULL,
	"hearts" integer NOT NULL,
	"action_points" integer NOT NULL,
	"range" integer NOT NULL,
	"last_drip_epoch" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tanks_cube_coordinate" CHECK ("tanks"."position_q" + "tanks"."position_r" + "tanks"."position_s" = 0),
	CONSTRAINT "tanks_resources_nonnegative" CHECK ("tanks"."hearts" >= 0 AND "tanks"."action_points" >= 0 AND "tanks"."range" >= 0)
);
--> statement-breakpoint
ALTER TABLE "board_resources" ADD CONSTRAINT "board_resources_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_resources" ADD CONSTRAINT "board_resources_collected_by_player_id_game_players_id_fk" FOREIGN KEY ("collected_by_player_id") REFERENCES "public"."game_players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_payment_receipt_id_payment_receipts_id_fk" FOREIGN KEY ("payment_receipt_id") REFERENCES "public"."payment_receipts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_commands" ADD CONSTRAINT "game_commands_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_commands" ADD CONSTRAINT "game_commands_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_commands" ADD CONSTRAINT "game_commands_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "public"."entitlements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_events" ADD CONSTRAINT "game_events_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_events" ADD CONSTRAINT "game_events_command_id_game_commands_id_fk" FOREIGN KEY ("command_id") REFERENCES "public"."game_commands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_events" ADD CONSTRAINT "game_events_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_owner_principal_id_principals_id_fk" FOREIGN KEY ("owner_principal_id") REFERENCES "public"."principals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outbox" ADD CONSTRAINT "outbox_event_sequence_game_events_sequence_fk" FOREIGN KEY ("event_sequence") REFERENCES "public"."game_events"("sequence") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_identities" ADD CONSTRAINT "principal_identities_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tanks" ADD CONSTRAINT "tanks_player_id_game_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."game_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tanks" ADD CONSTRAINT "tanks_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "board_resources_active_position_uq" ON "board_resources" USING btree ("game_id","position_q","position_r","position_s") WHERE "board_resources"."collected_at" IS NULL;--> statement-breakpoint
CREATE INDEX "board_resources_game_active_idx" ON "board_resources" USING btree ("game_id","collected_at");--> statement-breakpoint
CREATE UNIQUE INDEX "entitlements_receipt_kind_uq" ON "entitlements" USING btree ("payment_receipt_id","kind");--> statement-breakpoint
CREATE INDEX "entitlements_available_idx" ON "entitlements" USING btree ("principal_id","game_id","kind","status");--> statement-breakpoint
CREATE UNIQUE INDEX "game_commands_idempotency_uq" ON "game_commands" USING btree ("game_id","principal_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "game_commands_game_created_idx" ON "game_commands" USING btree ("game_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "game_events_id_uq" ON "game_events" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "game_events_game_version_uq" ON "game_events" USING btree ("game_id","game_version");--> statement-breakpoint
CREATE INDEX "game_events_game_sequence_idx" ON "game_events" USING btree ("game_id","sequence");--> statement-breakpoint
CREATE UNIQUE INDEX "game_players_game_principal_uq" ON "game_players" USING btree ("game_id","principal_id");--> statement-breakpoint
CREATE UNIQUE INDEX "game_players_game_seat_uq" ON "game_players" USING btree ("game_id","seat");--> statement-breakpoint
CREATE INDEX "game_players_principal_idx" ON "game_players" USING btree ("principal_id");--> statement-breakpoint
CREATE INDEX "games_status_created_idx" ON "games" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "games_owner_idx" ON "games" USING btree ("owner_principal_id");--> statement-breakpoint
CREATE UNIQUE INDEX "outbox_event_topic_uq" ON "outbox" USING btree ("event_sequence","topic");--> statement-breakpoint
CREATE INDEX "outbox_pending_idx" ON "outbox" USING btree ("available_at") WHERE "outbox"."published_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "payment_receipts_protocol_reference_uq" ON "payment_receipts" USING btree ("protocol","provider_reference");--> statement-breakpoint
CREATE INDEX "payment_receipts_principal_idx" ON "payment_receipts" USING btree ("principal_id");--> statement-breakpoint
CREATE UNIQUE INDEX "principal_identities_issuer_subject_uq" ON "principal_identities" USING btree ("kind","issuer","subject");--> statement-breakpoint
CREATE INDEX "principal_identities_principal_idx" ON "principal_identities" USING btree ("principal_id");--> statement-breakpoint
CREATE INDEX "principals_kind_idx" ON "principals" USING btree ("kind");--> statement-breakpoint
CREATE UNIQUE INDEX "tanks_game_position_uq" ON "tanks" USING btree ("game_id","position_q","position_r","position_s");--> statement-breakpoint
CREATE INDEX "tanks_game_idx" ON "tanks" USING btree ("game_id");