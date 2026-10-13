import { randomBytes } from "node:crypto";

import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

import en from "../dictionaries/en.json";
import pl from "../dictionaries/pl.json";

/**
 * Content for the October 2026 rebuild: the two people, Quanty in the
 * portfolio, and the copy of the four page globals.
 *
 * WHY A MIGRATION. The rebuilt pages read the CMS first and the dictionaries
 * second. A migration runs on container boot, so the admin opens on the same
 * words the site already shows instead of on empty forms, and nobody has to
 * remember a seed script.
 *
 * THE COPY IS READ FROM dictionaries/{en,pl}.json, NOT TYPED HERE. Whatever is
 * in the image at deploy time is what lands in the database, so the fallback
 * and the seed cannot disagree. Every value is read defensively: a key that is
 * missing, or is not a string, becomes NULL, and an empty string does too. A
 * migration that throws takes the site down, and no sentence is worth that.
 * NULL is also what lib/pages.ts treats as "use the dictionary".
 *
 * PLAIN SQL, NOT THE LOCAL API, so replaying the chain into an empty database
 * depends only on the tables 20261014_090000 created and never on what
 * payload.config.ts looks like by then. One statement per `db.execute`,
 * because node-postgres only takes a multi statement string in simple query
 * mode and these carry parameters.
 *
 * IDEMPOTENT. Inserts are guarded by NOT EXISTS or ON CONFLICT, and updates
 * only touch a row whose value differs, so a second run changes nothing, not
 * even `updated_at`.
 *
 * WHAT IT WRITES, AND WHAT IT LEAVES ALONE.
 *   team      After this there are exactly two people: Dawid Kubicki and Ada
 *             Kubicka, with the English and Polish role and bio from `people`
 *             in the dictionaries. Every other row is deleted. That is the one
 *             delete in this rebuild, and the owner asked for it: nobody else
 *             may appear. `phone` and `featured_on_home` are not touched.
 *             `photo_id` is cleared on Dawid's row ONCE, on the run that
 *             first creates Ada: the two portraits that ship in
 *             public/assets/team/ were made as a matched pair, and an upload
 *             left over from the previous site would sit beside Ada's on a
 *             different backdrop. lib/people.ts then falls back to the
 *             shipped pair. The old file stays in the media library, and a
 *             photo uploaded after this migration is never touched.
 *   products  Each product in `products` of the dictionaries is inserted when
 *             no row has its slug. A row that exists is never updated.
 *   globals   Each of the four is filled only when its table is empty. Once a
 *             row exists the text belongs to whoever edits it in the admin.
 *   German    Nothing is written for `de`, and no German row is removed. The
 *             site stopped serving it; the rows stay as they are.
 */

type Json = Record<string, unknown>;
type Db = MigrateUpArgs["db"];

const LOCALES = ["en", "pl"] as const;
type Locale = (typeof LOCALES)[number];

const DICTIONARIES: Record<Locale, Json> = { en, pl };

/** A non empty string, or NULL. */
const text = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value : null;

const record = (value: unknown): Json =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Json)
    : {};

const records = (value: unknown): Json[] =>
  Array.isArray(value) ? value.map(record) : [];

/** `heroTagline` is the field and the dictionary key, `hero_tagline` the column. */
const column = (field: string) =>
  field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Who the two people are is fixed here, because it is the one thing the owner
 * decided by name. `key` finds their role and bio in the dictionaries.
 */
const PEOPLE = [
  {
    key: "dawid",
    name: "Dawid Kubicki",
    order: 0,
    linkedin: "https://www.linkedin.com/in/dawidkubicki/",
    email: "contact@pluscode.io",
  },
  {
    key: "ada",
    name: "Ada Kubicka",
    order: 1,
    linkedin: "https://www.linkedin.com/in/ada-kubicka-1a922a94/",
    email: null,
  },
] as const;

const DAWID = PEOPLE[0].name;
const ADA = PEOPLE[1].name;

async function seedPeople(db: Db, dictionaries: Record<Locale, Json>) {
  // 0. Is this the first time? Ada exists only once this migration has run,
  //    so her absence is what marks a database still carrying the old site's
  //    people, and the old site's portrait upload.
  const before = await db.execute(
    sql`SELECT 1 FROM "team" WHERE "name" = ${ADA}::varchar LIMIT 1`,
  );
  const firstRun = before.rows.length === 0;

  // 1. Create whoever is missing. Every literal is cast, because a bare
  //    parameter in the select list of an INSERT ... SELECT has no context
  //    Postgres can infer a type from.
  for (const person of PEOPLE) {
    await db.execute(sql`
      INSERT INTO "team" ("name", "email", "linkedin", "order", "updated_at", "created_at")
      SELECT ${person.name}::varchar,
             ${person.email}::varchar,
             ${person.linkedin}::varchar,
             ${person.order}::numeric,
             now(),
             now()
      WHERE NOT EXISTS (SELECT 1 FROM "team" WHERE "name" = ${person.name}::varchar)
    `);
  }

  // 2. Prune. Everybody who is not one of the two goes, and so does a
  //    duplicate of either beyond the lowest id. team_locales rows and
  //    payload_locked_documents_rels rows cascade with the parent.
  await db.execute(sql`
    DELETE FROM "team" AS t
    WHERE t."name" NOT IN (${DAWID}::varchar, ${ADA}::varchar)
       OR t."id" > (SELECT MIN(t2."id") FROM "team" AS t2 WHERE t2."name" = t."name")
  `);

  // 3. Order and profile link. Dawid's row carried the company page as his
  //    LinkedIn; it becomes his own. `email` only fills a gap: there is none
  //    for Ada in the repo, and a NULL must not erase one typed in the admin.
  for (const person of PEOPLE) {
    await db.execute(sql`
      UPDATE "team"
         SET "order" = ${person.order}::numeric,
             "linkedin" = ${person.linkedin}::varchar,
             "email" = COALESCE(${person.email}::varchar, "email"),
             "updated_at" = now()
       WHERE "name" = ${person.name}::varchar
         AND ("order" IS DISTINCT FROM ${person.order}::numeric
           OR "linkedin" IS DISTINCT FROM ${person.linkedin}::varchar
           OR "email" IS DISTINCT FROM COALESCE(${person.email}::varchar, "email"))
    `);
  }

  // 3b. On the first run only, let go of a portrait uploaded for the previous
  //     site, so the shipped pair shows. See the note at the top of the file.
  if (firstRun) {
    await db.execute(sql`
      UPDATE "team"
         SET "photo_id" = NULL, "updated_at" = now()
       WHERE "name" = ${DAWID}::varchar AND "photo_id" IS NOT NULL
    `);
  }

  // 4. Role and bio, one row per person per locale, on the unique index
  //    team_locales_locale_parent_id_unique. A value the dictionary does not
  //    have keeps whatever the row holds.
  for (const person of PEOPLE) {
    for (const locale of LOCALES) {
      const copy = records(dictionaries[locale].people).find(
        (entry) => entry.key === person.key,
      );
      const role = text(copy?.role);
      const bio = text(copy?.bio);
      if (role === null && bio === null) continue;
      await db.execute(sql`
        INSERT INTO "team_locales" ("_locale", "_parent_id", "role", "bio")
        SELECT ${locale}::"_locales", t."id", ${role}::varchar, ${bio}::varchar
          FROM "team" AS t
         WHERE t."name" = ${person.name}::varchar
        ON CONFLICT ("_locale", "_parent_id")
        DO UPDATE SET "role" = COALESCE(EXCLUDED."role", "team_locales"."role"),
                      "bio" = COALESCE(EXCLUDED."bio", "team_locales"."bio")
            WHERE "team_locales"."role" IS DISTINCT FROM COALESCE(EXCLUDED."role", "team_locales"."role")
               OR "team_locales"."bio" IS DISTINCT FROM COALESCE(EXCLUDED."bio", "team_locales"."bio")
      `);
    }
  }
}

async function seedProducts(db: Db, dictionaries: Record<Locale, Json>) {
  // English decides which products exist, and their place in the list.
  const products = records(dictionaries.en.products).filter(
    (product) => text(product.slug) !== null && text(product.name) !== null,
  );

  for (const [index, product] of products.entries()) {
    const slug = text(product.slug);
    const name = text(product.name);

    const inserted = await db.execute(sql`
      INSERT INTO "products" ("name", "slug", "url", "order", "updated_at", "created_at")
      SELECT ${name}::varchar,
             ${slug}::varchar,
             ${text(product.url)}::varchar,
             ${index}::numeric,
             now(),
             now()
      WHERE NOT EXISTS (SELECT 1 FROM "products" WHERE "slug" = ${slug}::varchar)
      RETURNING "id"
    `);
    const id = inserted.rows[0]?.id;
    // No row back means the product was already there, and then its text is
    // an editor's: leave the localized rows alone too.
    if (id === undefined || id === null) continue;

    for (const locale of LOCALES) {
      const copy = records(dictionaries[locale].products).find(
        (entry) => entry.slug === slug,
      );
      if (!copy) continue;
      // The dictionary keeps tags as a list. The field is one comma separated
      // line, which lib/products.ts splits again.
      const tags = Array.isArray(copy.tags)
        ? copy.tags.map(text).filter((tag) => tag !== null).join(", ")
        : null;
      await db.execute(sql`
        INSERT INTO "products_locales" ("_locale", "_parent_id", "tagline", "description", "badge", "tags")
        VALUES (${locale}::"_locales",
                ${id}::integer,
                ${text(copy.tagline)}::varchar,
                ${text(copy.description)}::varchar,
                ${text(copy.badge)}::varchar,
                ${text(tags)}::varchar)
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING
      `);
    }
  }
}

/**
 * The four page globals. `key` is the object in the dictionaries, `shared`
 * the fields kept once on the global's own table, `localized` the ones kept
 * per language. Field names are the dictionary keys and the Payload field
 * names; see globals/*.ts.
 */
const PAGES = [
  {
    table: "home_page",
    key: "homePage",
    shared: [],
    localized: [
      "heroTagline",
      "missionHeading",
      "missionBody",
      "portfolioLabel",
      "portfolioStatement",
      "peopleHeading",
      "peopleIntro",
      "newsHeading",
      "seoTitle",
      "seoDescription",
    ],
  },
  {
    table: "about_page",
    key: "aboutPage",
    shared: [],
    localized: [
      "heading",
      "intro",
      "storyLabel",
      "storyBody",
      "principlesLabel",
      "seoTitle",
      "seoDescription",
    ],
  },
  {
    table: "news_page",
    key: "newsPage",
    shared: [],
    localized: ["heading", "intro", "seoTitle", "seoDescription"],
  },
  {
    table: "contact_page",
    key: "contactPage",
    shared: ["email", "phone"],
    localized: ["heading", "intro", "address", "seoTitle", "seoDescription"],
  },
] as const;

async function seedPages(db: Db, dictionaries: Record<Locale, Json>) {
  for (const page of PAGES) {
    const table = sql.identifier(page.table);
    const localesTable = sql.identifier(`${page.table}_locales`);

    // A global is a table with at most one row. An existing row, even an
    // empty one, means somebody saved the form: never overwrite it.
    const existing = await db.execute(sql`SELECT 1 FROM ${table} LIMIT 1`);
    if (existing.rows.length > 0) continue;

    // Not localized, so the English file is the one that is read.
    const shared = record(dictionaries.en[page.key]);
    const sharedColumns = page.shared.map((field) => sql`, ${sql.identifier(column(field))}`);
    const sharedValues = page.shared.map((field) => sql`, ${text(shared[field])}::varchar`);

    const inserted = await db.execute(sql`
      INSERT INTO ${table} ("updated_at", "created_at"${sql.join(sharedColumns)})
      VALUES (now(), now()${sql.join(sharedValues)})
      RETURNING "id"
    `);
    const id = inserted.rows[0]?.id;
    if (id === undefined || id === null) continue;

    for (const locale of LOCALES) {
      const copy = record(dictionaries[locale][page.key]);
      const columns = page.localized.map((field) => sql`, ${sql.identifier(column(field))}`);
      const values = page.localized.map((field) => sql`, ${text(copy[field])}::varchar`);
      await db.execute(sql`
        INSERT INTO ${localesTable} ("_locale", "_parent_id"${sql.join(columns)})
        VALUES (${locale}::"_locales", ${id}::integer${sql.join(values)})
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING
      `);
    }

    if (page.table === "about_page") await seedPrinciples(db, id, dictionaries);
  }
}

/**
 * The `principles` array of the About page: one row per position, and one
 * localized row per language that has something to say at that position. The
 * dictionaries ship it empty, so on a first deploy this writes nothing.
 */
async function seedPrinciples(db: Db, parentId: unknown, dictionaries: Record<Locale, Json>) {
  const lists = LOCALES.map((locale) => ({
    locale,
    rows: records(record(dictionaries[locale].aboutPage).principles),
  }));
  const length = Math.max(...lists.map((list) => list.rows.length));

  let order = 0;
  for (let index = 0; index < length; index += 1) {
    const copies = lists
      .map(({ locale, rows }) => ({
        locale,
        title: text(rows[index]?.title),
        body: text(rows[index]?.text),
      }))
      .filter((copy) => copy.title !== null || copy.body !== null);
    // A position with nothing to say in any language is not a principle.
    if (copies.length === 0) continue;

    order += 1;
    // Payload gives array rows a 24 character hex id of its own making.
    const rowId = randomBytes(12).toString("hex");
    await db.execute(sql`
      INSERT INTO "about_page_principles" ("_order", "_parent_id", "id")
      VALUES (${order}::integer, ${parentId}::integer, ${rowId}::varchar)
    `);
    for (const copy of copies) {
      await db.execute(sql`
        INSERT INTO "about_page_principles_locales" ("_locale", "_parent_id", "title", "text")
        VALUES (${copy.locale}::"_locales", ${rowId}::varchar, ${copy.title}::varchar, ${copy.body}::varchar)
      `);
    }
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await seedPeople(db, DICTIONARIES);
  await seedProducts(db, DICTIONARIES);
  await seedPages(db, DICTIONARIES);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Removes what `up` put there and nothing older. It cannot give Dawid's row
  // back the old portrait link that `up` cleared: which upload that was is not
  // recorded. The file is still in the media library. Ada's row is the only team
  // row this migration created; Dawid was there before it and stays, with the
  // role and bio written above, because the text they replaced described a
  // company that no longer exists. The people deleted in `up` are not
  // restored: the owner asked for them to be gone.
  //
  // The products and the page globals are emptied, an editor's later changes
  // included, since 20261014_090000 drops those tables in its own `down`. An
  // empty table is a supported state everywhere: the pages render the
  // dictionaries instead.
  await db.execute(sql`DELETE FROM "team" WHERE "name" = ${ADA}::varchar`);
  for (const product of records(DICTIONARIES.en.products)) {
    const slug = text(product.slug);
    if (slug === null) continue;
    await db.execute(sql`DELETE FROM "products" WHERE "slug" = ${slug}::varchar`);
  }
  for (const page of PAGES) {
    await db.execute(sql`DELETE FROM ${sql.identifier(page.table)}`);
  }
}
