import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "de" locale to every locale enum, matching the new entry in
// payload.config.ts `localization.locales`. Hand-authored like the bookings
// migration; in dev (push mode) Payload adjusts the enums from the config
// automatically. Postgres 12+ allows ADD VALUE inside a transaction as long as
// the new value is not used before commit, which holds here.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."_locales" ADD VALUE IF NOT EXISTS 'de';
  ALTER TYPE "public"."enum__case_studies_v_published_locale" ADD VALUE IF NOT EXISTS 'de';
  ALTER TYPE "public"."enum__insights_v_published_locale" ADD VALUE IF NOT EXISTS 'de';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Postgres cannot drop a value from an enum. A stray 'de' label is harmless
  // once the locale is removed from payload.config.ts, so this is a no-op.
}
