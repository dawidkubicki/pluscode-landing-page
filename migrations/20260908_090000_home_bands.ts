import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * The four editable home page bands.
 *
 * Adds the `clients` collection behind the "Selected clients" band, and the
 * handful of columns that let the existing `case-studies` and `insights`
 * documents place themselves in the Cases, Insights and Stories bands. No
 * parallel collections: the two that already hold real documents keep them.
 *
 * ADDITIVE ONLY. This runs on container boot against a database that already
 * holds published work, so every column is nullable or carries a default, and
 * nothing here rewrites or drops an existing row. The two flag columns default
 * to false, which is what keeps the deploy silent: until an editor ticks one,
 * every reader in lib/home-bands.ts finds nothing and the bands go on rendering
 * the dictionary.
 *
 * BOTH COLLECTIONS HAVE DRAFTS, so each new column is mirrored on the version
 * table with the `version_` prefix Payload gives it, and the localized tag is
 * mirrored on the version locales table too. Leaving those out would build a
 * drizzle schema the version tables cannot answer.
 *
 * Hand-authored, mirroring the DDL Payload generates for the same shapes in
 * 20260608_195300_initial.ts and checked against the live tables with psql.
 * See the snapshot note in 20260823_184017_add_trust_logos.ts.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "clients_locales" (
  	"what" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "case_studies" ADD COLUMN "show_on_home" boolean DEFAULT false;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_show_on_home" boolean DEFAULT false;
  ALTER TABLE "insights" ADD COLUMN "show_in_insights_band" boolean DEFAULT false;
  ALTER TABLE "insights" ADD COLUMN "show_in_stories_band" boolean DEFAULT false;
  ALTER TABLE "insights" ADD COLUMN "home_order" numeric DEFAULT 0;
  ALTER TABLE "insights" ADD COLUMN "home_href" varchar;
  ALTER TABLE "insights_locales" ADD COLUMN "home_tag" varchar;
  ALTER TABLE "_insights_v" ADD COLUMN "version_show_in_insights_band" boolean DEFAULT false;
  ALTER TABLE "_insights_v" ADD COLUMN "version_show_in_stories_band" boolean DEFAULT false;
  ALTER TABLE "_insights_v" ADD COLUMN "version_home_order" numeric DEFAULT 0;
  ALTER TABLE "_insights_v" ADD COLUMN "version_home_href" varchar;
  ALTER TABLE "_insights_v_locales" ADD COLUMN "version_home_tag" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "clients_locales" ADD CONSTRAINT "clients_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE UNIQUE INDEX "clients_locales_locale_parent_id_unique" ON "clients_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clients_fk";
  DROP INDEX "payload_locked_documents_rels_clients_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "clients_id";
  ALTER TABLE "_insights_v_locales" DROP COLUMN "version_home_tag";
  ALTER TABLE "_insights_v" DROP COLUMN "version_home_href";
  ALTER TABLE "_insights_v" DROP COLUMN "version_home_order";
  ALTER TABLE "_insights_v" DROP COLUMN "version_show_in_stories_band";
  ALTER TABLE "_insights_v" DROP COLUMN "version_show_in_insights_band";
  ALTER TABLE "insights_locales" DROP COLUMN "home_tag";
  ALTER TABLE "insights" DROP COLUMN "home_href";
  ALTER TABLE "insights" DROP COLUMN "home_order";
  ALTER TABLE "insights" DROP COLUMN "show_in_stories_band";
  ALTER TABLE "insights" DROP COLUMN "show_in_insights_band";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_show_on_home";
  ALTER TABLE "case_studies" DROP COLUMN "show_on_home";
  ALTER TABLE "clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clients_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "clients_locales" CASCADE;`);
}
