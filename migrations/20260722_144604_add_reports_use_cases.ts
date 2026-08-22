import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"featured" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reports_locales" (
  	"title" varchar NOT NULL,
  	"eyebrow" varchar DEFAULT 'AI Report',
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "use_cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "use_cases_locales" (
  	"title" varchar NOT NULL,
  	"category" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "use_cases_id" integer;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_locales" ADD CONSTRAINT "reports_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases" ADD CONSTRAINT "use_cases_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_cases_locales" ADD CONSTRAINT "use_cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "reports_image_idx" ON "reports" USING btree ("image_id");
  CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE UNIQUE INDEX "reports_locales_locale_parent_id_unique" ON "reports_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "use_cases_image_idx" ON "use_cases" USING btree ("image_id");
  CREATE INDEX "use_cases_updated_at_idx" ON "use_cases" USING btree ("updated_at");
  CREATE INDEX "use_cases_created_at_idx" ON "use_cases" USING btree ("created_at");
  CREATE UNIQUE INDEX "use_cases_locales_locale_parent_id_unique" ON "use_cases_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_use_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("use_cases_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "use_cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "use_cases_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_locales" CASCADE;
  DROP TABLE "use_cases" CASCADE;
  DROP TABLE "use_cases_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reports_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_use_cases_fk";
  
  DROP INDEX "payload_locked_documents_rels_reports_id_idx";
  DROP INDEX "payload_locked_documents_rels_use_cases_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reports_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "use_cases_id";`)
}
