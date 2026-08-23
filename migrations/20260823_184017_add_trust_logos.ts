import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the trust-logos collection (hero "Trusted by" strip). Hand-trimmed from
// the generated migration: earlier hand-authored migrations (bookings, de
// locale) never updated the drizzle snapshot, so migrate:create re-emitted
// their statements too — those are already applied in prod and are dropped
// here. The generated .json snapshot is kept as-is so future diffs are clean.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "trust_logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "trust_logos_id" integer;
  ALTER TABLE "trust_logos" ADD CONSTRAINT "trust_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "trust_logos_logo_idx" ON "trust_logos" USING btree ("logo_id");
  CREATE INDEX "trust_logos_updated_at_idx" ON "trust_logos" USING btree ("updated_at");
  CREATE INDEX "trust_logos_created_at_idx" ON "trust_logos" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trust_logos_fk" FOREIGN KEY ("trust_logos_id") REFERENCES "public"."trust_logos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_trust_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("trust_logos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_trust_logos_fk";
  DROP INDEX "payload_locked_documents_rels_trust_logos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "trust_logos_id";
  ALTER TABLE "trust_logos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "trust_logos" CASCADE;`)
}
