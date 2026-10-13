import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Tables for the October 2026 rebuild: the `products` collection behind the
 * portfolio, and the four page globals `home-page`, `about-page`, `news-page`
 * and `contact-page`.
 *
 * ADDITIVE ONLY, AND SAFE TO RUN TWICE. This runs on container boot against a
 * database that holds published news, real leads and the team. It creates
 * twelve new tables, adds one nullable column to
 * `payload_locked_documents_rels`, and lifts one NOT NULL. No existing table,
 * column, enum value or row is dropped or rewritten. Every statement is
 * guarded, tables, columns and indexes with IF NOT EXISTS and the constraints
 * with a DO block, because Postgres has no ADD CONSTRAINT IF NOT EXISTS and a
 * half applied run must be able to finish.
 *
 * THE ONE CHANGE TO AN EXISTING COLUMN is `bookings.hear_about`, which stops
 * being NOT NULL. The contact form of the rebuilt site no longer asks how a
 * visitor found us, and a message must not be refused for leaving out an
 * answer nobody asked for. Rows that have a value keep it.
 *
 * THE DEPLOY IS SILENT UNTIL THE NEXT MIGRATION FILLS THE TABLES. With no
 * rows, lib/pages.ts and lib/products.ts return the copy in
 * dictionaries/{en,pl}.json, which is also what
 * 20261014_091000_seed_portfolio_and_pages writes.
 *
 * GLOBAL TABLES HAVE NULLABLE TIMESTAMPS WITH NO DEFAULT. That is what Payload
 * generates for a global, unlike a collection, and what the adapter builds
 * when it pushes this config into an empty database. The DDL below was diffed
 * against exactly that push with pg_dump, table by table. The older
 * `use_cases_section` global was written with NOT NULL DEFAULT now() instead;
 * it is left as it is.
 *
 * NO VERSION TABLES. Neither the collection nor the globals have drafts.
 *
 * Hand authored. See the snapshot note in 20260823_184017_add_trust_logos.ts
 * for why `migrate:create` cannot be used here.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"url" varchar,
  	"logo_id" integer,
  	"image_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "products_locales" (
  	"tagline" varchar,
  	"description" varchar,
  	"badge" varchar,
  	"tags" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "home_page_locales" (
  	"hero_tagline" varchar,
  	"mission_heading" varchar,
  	"mission_body" varchar,
  	"portfolio_label" varchar,
  	"portfolio_statement" varchar,
  	"people_heading" varchar,
  	"people_intro" varchar,
  	"news_heading" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "about_page_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"story_label" varchar,
  	"story_body" varchar,
  	"principles_label" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "about_page_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "about_page_principles_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "news_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "news_page_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "contact_page_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"address" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "products_id" integer;
  ALTER TABLE "bookings" ALTER COLUMN "hear_about" DROP NOT NULL;

  DO $$ BEGIN
   ALTER TABLE "products" ADD CONSTRAINT "products_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "about_page_principles" ADD CONSTRAINT "about_page_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "about_page_principles_locales" ADD CONSTRAINT "about_page_principles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_principles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "news_page_locales" ADD CONSTRAINT "news_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "products_logo_idx" ON "products" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "about_page_principles_order_idx" ON "about_page_principles" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "about_page_principles_parent_id_idx" ON "about_page_principles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "about_page_principles_locales_locale_parent_id_unique" ON "about_page_principles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "news_page_locales_locale_parent_id_unique" ON "news_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drops only what `up` created. `hear_about` gets its NOT NULL back, which
  // needs a value in every row first: 'other' is what 20260823_090000 gave
  // the leads that predate the question, and it means the same thing here.
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_products_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_products_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "products_id";
  DROP TABLE IF EXISTS "contact_page_locales" CASCADE;
  DROP TABLE IF EXISTS "contact_page" CASCADE;
  DROP TABLE IF EXISTS "news_page_locales" CASCADE;
  DROP TABLE IF EXISTS "news_page" CASCADE;
  DROP TABLE IF EXISTS "about_page_principles_locales" CASCADE;
  DROP TABLE IF EXISTS "about_page_principles" CASCADE;
  DROP TABLE IF EXISTS "about_page_locales" CASCADE;
  DROP TABLE IF EXISTS "about_page" CASCADE;
  DROP TABLE IF EXISTS "home_page_locales" CASCADE;
  DROP TABLE IF EXISTS "home_page" CASCADE;
  DROP TABLE IF EXISTS "products_locales" CASCADE;
  DROP TABLE IF EXISTS "products" CASCADE;
  UPDATE "bookings" SET "hear_about" = 'other' WHERE "hear_about" IS NULL;
  ALTER TABLE "bookings" ALTER COLUMN "hear_about" SET NOT NULL;`);
}
