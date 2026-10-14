import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Takes three lines off the home page that made the company sound small.
 *
 * The owner read the live site and rejected the People block: the heading
 * "People" / "Ludzie" over "Small by design." / "Mała firma. Z wyboru." The
 * closing line of the mission, "We build few things." / "Budujemy niewiele.",
 * says the same thing in other words and goes with it. The heading becomes
 * "Team" / "Zespół", the line under it is removed, and the mission closes on
 * care and permanence instead of on size.
 *
 * WHY A MIGRATION. The page copy was seeded into the `home-page` global by
 * 20261014_091000, and from that moment the CMS wins over the dictionaries.
 * Changing dictionaries/{en,pl}.json alone changes a fresh database and
 * nothing that is already live.
 *
 * GUARDED BY THE OLD TEXT. Every statement matches the exact sentence the seed
 * wrote. A field an editor has since rewritten no longer matches and is left
 * alone, and on a database seeded from the current dictionaries nothing
 * matches at all, so this is a no-op there and on every later run.
 */

const TABLE = "home_page_locales";

const OLD_MISSION = {
  en: "AI is rewriting what software can do. Most of that software has yet to be built.\n\nPluscode is a software company. We design and build AI-native products, from the first idea to the people who rely on them every day.\n\nWe build few things. We build them well.",
  pl: "AI zmienia to, co potrafi oprogramowanie. Większość tego oprogramowania jeszcze nie powstała.\n\nPluscode to firma, która tworzy oprogramowanie. Projektujemy i budujemy produkty oparte na AI, od pierwszego pomysłu po ludzi, którzy polegają na nich każdego dnia.\n\nBudujemy niewiele. Budujemy dobrze.",
};

const NEW_MISSION = {
  en: "AI is rewriting what software can do. Most of that software has yet to be built.\n\nPluscode is a software company. We design and build AI-native products, from the first idea to the people who rely on them every day.\n\nWe build with care, and we build to last.",
  pl: "AI zmienia to, co potrafi oprogramowanie. Większość tego oprogramowania jeszcze nie powstała.\n\nPluscode to firma, która tworzy oprogramowanie. Projektujemy i budujemy produkty oparte na AI, od pierwszego pomysłu po ludzi, którzy polegają na nich każdego dnia.\n\nBudujemy starannie i na lata.",
};

type Change = {
  locale: "en" | "pl";
  column: "people_heading" | "people_intro" | "mission_body";
  from: string;
  /** NULL empties the field; the page then shows nothing in its place. */
  to: string | null;
};

const CHANGES: Change[] = [
  { locale: "en", column: "people_intro", from: "Small by design.", to: null },
  { locale: "pl", column: "people_intro", from: "Mała firma. Z wyboru.", to: null },
  { locale: "en", column: "people_heading", from: "People", to: "Team" },
  { locale: "pl", column: "people_heading", from: "Ludzie", to: "Zespół" },
  { locale: "en", column: "mission_body", from: OLD_MISSION.en, to: NEW_MISSION.en },
  { locale: "pl", column: "mission_body", from: OLD_MISSION.pl, to: NEW_MISSION.pl },
];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const change of CHANGES) {
    await db.execute(sql`
      UPDATE ${sql.identifier(TABLE)}
         SET ${sql.identifier(change.column)} = ${change.to}::varchar
       WHERE "_locale" = ${change.locale}::"_locales"
         AND ${sql.identifier(change.column)} = ${change.from}::varchar
    `);
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Puts the old sentences back where the new ones still stand. The removed
  // line under the heading is restored only beside the heading this
  // migration wrote, so an intro an editor emptied on purpose stays empty.
  for (const change of CHANGES) {
    if (change.to === null) {
      const heading = change.locale === "en" ? "Team" : "Zespół";
      await db.execute(sql`
        UPDATE ${sql.identifier(TABLE)}
           SET ${sql.identifier(change.column)} = ${change.from}::varchar
         WHERE "_locale" = ${change.locale}::"_locales"
           AND ${sql.identifier(change.column)} IS NULL
           AND "people_heading" = ${heading}::varchar
      `);
    }
  }
  for (const change of CHANGES) {
    if (change.to !== null) {
      await db.execute(sql`
        UPDATE ${sql.identifier(TABLE)}
           SET ${sql.identifier(change.column)} = ${change.from}::varchar
         WHERE "_locale" = ${change.locale}::"_locales"
           AND ${sql.identifier(change.column)} = ${change.to}::varchar
      `);
    }
  }
}
