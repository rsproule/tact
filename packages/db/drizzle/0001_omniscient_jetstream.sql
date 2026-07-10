ALTER TYPE "public"."identity_kind" ADD VALUE 'anonymous_session';--> statement-breakpoint
CREATE TABLE "game_bots" (
	"player_id" uuid PRIMARY KEY NOT NULL,
	"game_id" uuid NOT NULL,
	"principal_id" uuid NOT NULL,
	"strategy" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mpp_store" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb,
	"expires_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"scope" text NOT NULL,
	"subject" text NOT NULL,
	"window_started_at" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rate_limits_count_positive" CHECK ("rate_limits"."count" > 0)
);
--> statement-breakpoint
DROP INDEX "game_events_game_version_uq";--> statement-breakpoint
ALTER TABLE "game_events" ADD COLUMN "event_index" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "creation_idempotency_key" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "creation_request_hash" text;--> statement-breakpoint
ALTER TABLE "game_bots" ADD CONSTRAINT "game_bots_player_id_game_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."game_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_bots" ADD CONSTRAINT "game_bots_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_bots" ADD CONSTRAINT "game_bots_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "game_bots_game_principal_uq" ON "game_bots" USING btree ("game_id","principal_id");--> statement-breakpoint
CREATE INDEX "game_bots_game_idx" ON "game_bots" USING btree ("game_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rate_limits_scope_subject_window_uq" ON "rate_limits" USING btree ("scope","subject","window_started_at");--> statement-breakpoint
CREATE INDEX "rate_limits_updated_idx" ON "rate_limits" USING btree ("updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "game_events_game_version_index_uq" ON "game_events" USING btree ("game_id","game_version","event_index");--> statement-breakpoint
CREATE UNIQUE INDEX "games_owner_creation_idempotency_uq" ON "games" USING btree ("owner_principal_id","creation_idempotency_key") WHERE "games"."creation_idempotency_key" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "game_events" ADD CONSTRAINT "game_events_event_index_nonnegative" CHECK ("game_events"."event_index" >= 0);