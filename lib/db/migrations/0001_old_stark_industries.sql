CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "jobs_status_created_at_idx" ON "jobs" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "jobs_work_arrangement_idx" ON "jobs" USING btree ("work_arrangement");--> statement-breakpoint
CREATE INDEX "jobs_employment_type_idx" ON "jobs" USING btree ("employment_type");--> statement-breakpoint
CREATE INDEX "jobs_source_url_idx" ON "jobs" USING btree ("source_url");