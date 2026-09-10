import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * A mark for each client in the "Selected clients" band.
 *
 * BTC Transport and Verde Cargo took the band in September 2026 and both ship
 * a real wordmark, so the band now sets a logo above each name instead of the
 * name alone. `clients.logo_id` is the upload relation that carries it.
 *
 * ADDITIVE AND NULLABLE. This runs on container boot against a database that
 * already holds the band's rows, and a client without a mark is a valid
 * client: components/clients.tsx drops the whole row of marks rather than
 * render a gap, so a null here costs a picture and never a name. `ON DELETE
 * set null` for the same reason, matching the trust_logos relation added in
 * 20260823_184017 - deleting a media document must not delete the client.
 *
 * The collection has no drafts, so there is no version table to mirror.
 *
 * Hand-authored, mirroring the DDL Payload generates for the identical upload
 * field on `trust_logos`. See the snapshot note in that migration.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clients" ADD COLUMN "logo_id" integer;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clients" DROP CONSTRAINT "clients_logo_id_media_id_fk";
  DROP INDEX "clients_logo_idx";
  ALTER TABLE "clients" DROP COLUMN "logo_id";`);
}
