import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * How fast each hero clip runs, as a column on `hero_slides`.
 *
 * A SECOND MIGRATION RATHER THAN AN EDIT TO 20260908_120000_hero_slides, for
 * the same reason as the team bio: that one has already run in production, so
 * its row in `payload_migrations` means it will never run again and editing
 * its DDL would only make the file disagree with the database it created.
 *
 * WHY A COLUMN AND NOT A RE-ENCODE. Dawid asked for the freight hyperlapse to
 * run a little slower and for the speed to be adjustable per clip. Slowing a
 * clip with `playbackRate` costs nothing: the file on disk stays the footage
 * as shot, the browser plays it at whatever multiplier this column names, and
 * an editor can change it in the admin without anybody opening ffmpeg. It
 * also sets how long a slide holds the screen, because the playlist hands
 * over when the clip ends, so 10 seconds of freight yard at 0.8 lasts 12.5
 * and matches the studio clip beside it.
 *
 * `DEFAULT 1` is "the file as it was encoded", which is the only answer that
 * is never wrong for a row nobody has looked at yet. Additive, nullable by
 * way of a default, and safe to run twice.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "rate" numeric DEFAULT 1;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_slides" DROP COLUMN IF EXISTS "rate";`);
}
