import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Reshapes "bookings" for the shared lead form: a single `name` becomes
// first/last, `hear_about` and the two consent flags are new, and the old
// per-offering columns (company / format / team_size / use_case / timeline)
// are gone. Existing rows are backfilled before the NOT NULL constraints land:
// `name` is split on the first space, `use_case` falls back into `message`, and
// consent_terms is set true because those rows were submitted under the older
// form, which carried the agreement in its copy rather than a checkbox.
//
// Hand-authored to match collections/Bookings.ts, following the pattern of the
// add_bookings migration. In dev (push mode) Payload applies the config
// directly; this file is for production `pnpm migrate`. If Payload ever reports
// drift, regenerate with `pnpm migrate:create`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_bookings_hear_about" AS ENUM('search', 'recommendation', 'social', 'event', 'content', 'other');

  ALTER TABLE "bookings" ADD COLUMN "first_name" varchar;
  ALTER TABLE "bookings" ADD COLUMN "last_name" varchar;
  ALTER TABLE "bookings" ADD COLUMN "phone" varchar;
  ALTER TABLE "bookings" ADD COLUMN "hear_about" "enum_bookings_hear_about";
  ALTER TABLE "bookings" ADD COLUMN "consent_terms" boolean DEFAULT false;
  ALTER TABLE "bookings" ADD COLUMN "consent_marketing" boolean DEFAULT false;

  UPDATE "bookings" SET
  	"first_name" = COALESCE(NULLIF(split_part(COALESCE("name", ''), ' ', 1), ''), '-'),
  	"last_name" = CASE
  		WHEN position(' ' in COALESCE("name", '')) > 0
  		THEN substring("name" from position(' ' in "name") + 1)
  		ELSE '-'
  	END,
  	"hear_about" = 'other',
  	"message" = COALESCE(NULLIF("message", ''), NULLIF("use_case", ''), '-'),
  	"consent_terms" = true;

  ALTER TABLE "bookings" ALTER COLUMN "first_name" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "last_name" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "hear_about" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "message" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "consent_terms" SET NOT NULL;

  ALTER TABLE "bookings" DROP COLUMN "name";
  ALTER TABLE "bookings" DROP COLUMN "company";
  ALTER TABLE "bookings" DROP COLUMN "format";
  ALTER TABLE "bookings" DROP COLUMN "team_size";
  ALTER TABLE "bookings" DROP COLUMN "use_case";
  ALTER TABLE "bookings" DROP COLUMN "timeline";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bookings" ADD COLUMN "name" varchar;
  ALTER TABLE "bookings" ADD COLUMN "company" varchar;
  ALTER TABLE "bookings" ADD COLUMN "format" varchar;
  ALTER TABLE "bookings" ADD COLUMN "team_size" varchar;
  ALTER TABLE "bookings" ADD COLUMN "use_case" varchar;
  ALTER TABLE "bookings" ADD COLUMN "timeline" varchar;

  UPDATE "bookings" SET "name" = trim(both ' ' from "first_name" || ' ' || "last_name");

  ALTER TABLE "bookings" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "bookings" ALTER COLUMN "message" DROP NOT NULL;

  ALTER TABLE "bookings" DROP COLUMN "first_name";
  ALTER TABLE "bookings" DROP COLUMN "last_name";
  ALTER TABLE "bookings" DROP COLUMN "phone";
  ALTER TABLE "bookings" DROP COLUMN "hear_about";
  ALTER TABLE "bookings" DROP COLUMN "consent_terms";
  ALTER TABLE "bookings" DROP COLUMN "consent_marketing";
  DROP TYPE "public"."enum_bookings_hear_about";`)
}
