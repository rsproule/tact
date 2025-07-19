CREATE TABLE "bounties" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"creator" text NOT NULL,
	"target" text NOT NULL,
	"reward" text NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"claimed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_events" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"type" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"block_number" integer,
	"transaction_hash" text,
	"player" text,
	"data" json
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"owner" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"epoch_start" timestamp,
	"player_count" integer NOT NULL,
	"board_size" integer NOT NULL,
	"epoch_seconds" integer NOT NULL,
	"reveal_wait_blocks" integer NOT NULL,
	"init_hearts" integer NOT NULL,
	"init_aps" integer NOT NULL,
	"init_range" integer NOT NULL,
	"entry_cost" text DEFAULT '0' NOT NULL,
	"min_players" integer NOT NULL,
	"max_players" integer NOT NULL,
	"epoch_max_action_points" integer NOT NULL,
	"players_count" integer DEFAULT 0 NOT NULL,
	"prize_pool" text DEFAULT '0' NOT NULL,
	"last_heart_spawn" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hearts" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"position_q" integer NOT NULL,
	"position_r" integer NOT NULL,
	"position_s" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"spawned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hooks" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"type" text NOT NULL,
	"creator" text NOT NULL,
	"target" text,
	"parameters" json,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"address" text NOT NULL,
	"name" text NOT NULL,
	"tank_id" text NOT NULL,
	"is_alive" boolean DEFAULT true NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tanks" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"tank_id" text NOT NULL,
	"owner" text NOT NULL,
	"hearts" integer NOT NULL,
	"aps" integer NOT NULL,
	"range" integer NOT NULL,
	"position_q" integer NOT NULL,
	"position_r" integer NOT NULL,
	"position_s" integer NOT NULL,
	"player_name" text,
	"last_drip_epoch" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treaties" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"type" text NOT NULL,
	"parties" json NOT NULL,
	"duration" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_events" ADD CONSTRAINT "game_events_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hearts" ADD CONSTRAINT "hearts_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hooks" ADD CONSTRAINT "hooks_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tanks" ADD CONSTRAINT "tanks_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treaties" ADD CONSTRAINT "treaties_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;