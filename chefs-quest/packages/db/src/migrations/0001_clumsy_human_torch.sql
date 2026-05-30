CREATE TABLE "phase_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"phase_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "phase_progress" ADD CONSTRAINT "phase_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;