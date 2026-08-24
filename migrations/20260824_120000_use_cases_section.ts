import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Tables for the `useCasesSection` global (home use-case mosaic heading).
 * Hand-authored (mirrors fhtrade's home_team migration, minus the media FK),
 * so the drizzle snapshot is untouched — see the note in
 * 20260823_184017_add_trust_logos.ts before running `migrate:create` later.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "use_cases_section" (
   	"id" serial PRIMARY KEY NOT NULL,
   	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
   	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   CREATE TABLE "use_cases_section_locales" (
   	"label" varchar,
   	"title" varchar,
   	"id" serial PRIMARY KEY NOT NULL,
   	"_locale" "_locales" NOT NULL,
   	"_parent_id" integer NOT NULL
   );

   ALTER TABLE "use_cases_section_locales" ADD CONSTRAINT "use_cases_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."use_cases_section"("id") ON DELETE cascade ON UPDATE no action;
   CREATE UNIQUE INDEX "use_cases_section_locales_locale_parent_id_unique" ON "use_cases_section_locales" USING btree ("_locale","_parent_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "use_cases_section_locales" CASCADE;
   DROP TABLE "use_cases_section" CASCADE;`);
}
