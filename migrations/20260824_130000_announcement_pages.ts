import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Columns for announcement pages: `slug` + `publishedAt` on the doc,
 * localized `pageTitle` + `body` (richtext). Hand-authored, mirroring the
 * existing announcements DDL in 20260608_195300_initial.ts — see the snapshot
 * note in 20260823_184017_add_trust_logos.ts.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "announcements" ADD COLUMN "slug" varchar;
   ALTER TABLE "announcements" ADD COLUMN "published_at" timestamp(3) with time zone;
   ALTER TABLE "announcements_locales" ADD COLUMN "page_title" varchar;
   ALTER TABLE "announcements_locales" ADD COLUMN "body" jsonb;
   CREATE UNIQUE INDEX "announcements_slug_idx" ON "announcements" USING btree ("slug");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "announcements_slug_idx";
   ALTER TABLE "announcements" DROP COLUMN "slug";
   ALTER TABLE "announcements" DROP COLUMN "published_at";
   ALTER TABLE "announcements_locales" DROP COLUMN "page_title";
   ALTER TABLE "announcements_locales" DROP COLUMN "body";`);
}
