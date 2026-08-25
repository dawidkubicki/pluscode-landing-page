import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Adds `art` to `use-cases`: which drawing a card falls back to when no image
 * has been uploaded. Hand-authored like the migrations around it, so the
 * drizzle snapshot stays untouched (see the note in
 * 20260823_184017_add_trust_logos.ts).
 *
 * Existing cards are backfilled by their position in the seeded mosaic, which
 * is also the order the frontend falls back to when `art` is empty. That keeps
 * the page identical either way, and gives an editor something to change.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_use_cases_art" AS ENUM('document', 'assistant', 'forecast', 'vision', 'knowledge');
   ALTER TABLE "use_cases" ADD COLUMN "art" "enum_use_cases_art";

   UPDATE "use_cases" SET "art" = 'document'  WHERE "order" = 1 AND "art" IS NULL;
   UPDATE "use_cases" SET "art" = 'assistant' WHERE "order" = 2 AND "art" IS NULL;
   UPDATE "use_cases" SET "art" = 'forecast'  WHERE "order" = 3 AND "art" IS NULL;
   UPDATE "use_cases" SET "art" = 'vision'    WHERE "order" = 4 AND "art" IS NULL;
   UPDATE "use_cases" SET "art" = 'knowledge' WHERE "order" = 5 AND "art" IS NULL;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "use_cases" DROP COLUMN "art";
   DROP TYPE "public"."enum_use_cases_art";`);
}
