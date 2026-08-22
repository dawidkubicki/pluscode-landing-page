import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the non-localized "bookings" collection (workshop / engagement form
// submissions). Hand-authored to match the CollectionConfig in
// collections/Bookings.ts, following the pattern of the reports/use_cases
// migration. In dev (push mode) Payload creates this table from the config
// automatically; this file is for production `pnpm migrate`. If Payload ever
// reports drift, regenerate with `pnpm migrate:create`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_bookings_offering" AS ENUM('ai-opportunity-workshop', 'ai-discovery-sprint', 'genai-proof-of-concept', 'fractional-ai-team', 'general');
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"offering" "enum_bookings_offering" DEFAULT 'general' NOT NULL,
  	"format" varchar,
  	"team_size" varchar,
  	"use_case" varchar,
  	"timeline" varchar,
  	"message" varchar,
  	"locale" varchar,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "bookings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bookings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "bookings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bookings_fk";
  DROP INDEX "payload_locked_documents_rels_bookings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "bookings_id";
  DROP TYPE "public"."enum_bookings_offering";`)
}
