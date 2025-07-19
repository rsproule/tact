ALTER TABLE "games" ADD COLUMN "winner" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "winner_name" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "ended_at" timestamp;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "end_reason" text;