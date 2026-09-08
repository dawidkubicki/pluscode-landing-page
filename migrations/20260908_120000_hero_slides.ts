import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * The home hero playlist.
 *
 * Adds the `hero-slides` collection: one row per full screen slide, holding
 * the paths to a clip that ships with the repo, the two measured overlay
 * opacities for that footage, and the localized headline and subline written
 * for it.
 *
 * ADDITIVE ONLY, AND SAFE TO RUN TWICE. This runs on container boot against a
 * database that already holds published work. Nothing here touches an
 * existing row or an existing column: it creates two new tables and adds one
 * nullable column to `payload_locked_documents_rels`. Every statement is
 * guarded, tables and columns and indexes with IF NOT EXISTS and the four
 * constraints with a DO block, because Postgres has no ADD CONSTRAINT IF NOT
 * EXISTS and a half applied run must be able to finish rather than fail on
 * the first thing it already did.
 *
 * THE DEPLOY IS SILENT UNTIL SOMEBODY SEEDS IT. An empty collection means
 * lib/hero-slides.ts returns null and the hero renders the slides built into
 * dictionaries/{en,pl,de}.json, which is what it does today. Run
 * scripts/seed-hero-slides.ts to fill it, and only then does the CMS take
 * over. That ordering is on purpose: the hero is the one screen that can
 * never come up blank, so the CMS is an override on a working page rather
 * than the thing the page depends on.
 *
 * NO VERSIONS TABLE. The collection has no drafts, exactly like `clients`, so
 * there is no `_hero_slides_v` pair to mirror the columns onto.
 *
 * Hand authored, mirroring the DDL Payload generates for the same shapes:
 * the localized pair and its unique index from `clients` in
 * 20260908_090000_home_bands.ts, and the upload relation and the locked
 * documents wiring from `trust_logos` in 20260823_184017_add_trust_logos.ts.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "hero_slides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"mp4_path" varchar NOT NULL,
  	"webm_path" varchar,
  	"poster_path" varchar NOT NULL,
  	"poster_override_id" integer,
  	"overlay_top" numeric DEFAULT 0.62,
  	"overlay_bottom" numeric DEFAULT 0.74,
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "hero_slides_locales" (
  	"headline" varchar NOT NULL,
  	"subline" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "hero_slides_id" integer;

  DO $$ BEGIN
   ALTER TABLE "hero_slides_locales" ADD CONSTRAINT "hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_poster_override_id_media_id_fk" FOREIGN KEY ("poster_override_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_slides_fk" FOREIGN KEY ("hero_slides_id") REFERENCES "public"."hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE UNIQUE INDEX IF NOT EXISTS "hero_slides_key_idx" ON "hero_slides" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "hero_slides_poster_override_idx" ON "hero_slides" USING btree ("poster_override_id");
  CREATE INDEX IF NOT EXISTS "hero_slides_updated_at_idx" ON "hero_slides" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "hero_slides_created_at_idx" ON "hero_slides" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "hero_slides_locales_locale_parent_id_unique" ON "hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_hero_slides_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_slides_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_hero_slides_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_hero_slides_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "hero_slides_id";
  ALTER TABLE IF EXISTS "hero_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "hero_slides_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "hero_slides_locales" CASCADE;
  DROP TABLE IF EXISTS "hero_slides" CASCADE;`);
}
