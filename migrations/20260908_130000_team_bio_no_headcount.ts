import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Take the headcount out of Krzysztof's bio in the `team` collection.
 *
 * WHY THIS IS A SECOND MIGRATION RATHER THAN AN EDIT TO THE FIRST ONE.
 * 20260908_091000_team_real_people wrote these bios and has already run in
 * production, so its row in `payload_migrations` means it will never run
 * again: editing its literals would change nothing on the live site and would
 * only make the file lie about what is in the database. A migration that has
 * shipped is history, and history gets appended to.
 *
 * WHAT CHANGED AND WHY. The site no longer states how many people work here
 * (Dawid's call, 2026-09-08). The dictionary copy was rewritten for it, but
 * /about prefers the CMS row over the dictionary whenever the collection has
 * a matching person, so the old sentence, "one of the two who build it", kept
 * printing on the live page while every other surface had stopped counting.
 * Only Krzysztof's bio said a number; Dawid's never did, which is why he is
 * not in here.
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It matches on the OLD text rather than on
 * the person, so it is a no-op the moment anybody has edited that bio in the
 * admin. An editor's sentence is theirs and a migration must not overwrite it
 * six months from now on a database nobody remembers seeding. That also makes
 * it safe to run twice: the second run matches nothing.
 *
 * `down` puts the old sentence back, under the same rule: only where the new
 * one is still exactly what this migration wrote.
 */

const LOCALES = ["en", "pl", "de"] as const;

/** Per locale: the sentence written in September, and the one that replaces it. */
const BIOS: Record<(typeof LOCALES)[number], { from: string; to: string }> = {
  en: {
    from: "The first person you talk to, and one of the two who build it. He starts by counting what the work costs in hours today, so the decision to automate is a number and not an opinion, and he stays on the project after that number changes.",
    to: "The first person you talk to, and one of the people who build it. He starts by counting what the work costs in hours today, so the decision to automate is a number and not an opinion, and he stays on the project after that number changes.",
  },
  pl: {
    from: "Pierwsza osoba, z którą rozmawiasz, i jedna z dwóch, które to budują. Zaczyna od policzenia, ile ta praca kosztuje dziś w godzinach, żeby decyzja o automatyzacji była liczbą, a nie opinią, i zostaje przy projekcie, gdy ta liczba się zmieni.",
    to: "Pierwsza osoba, z którą rozmawiasz, i jedna z osób, które to budują. Zaczyna od policzenia, ile ta praca kosztuje dziś w godzinach, żeby decyzja o automatyzacji była liczbą, a nie opinią, i zostaje przy projekcie, gdy ta liczba się zmieni.",
  },
  de: {
    from: "Die erste Person, mit der Sie sprechen, und einer der beiden, die bauen. Er zählt zuerst, was die Arbeit heute an Stunden kostet, damit die Entscheidung für eine Automatisierung eine Zahl ist und keine Meinung, und er bleibt am Projekt, wenn sich diese Zahl ändert.",
    to: "Die erste Person, mit der Sie sprechen, und einer von denen, die es bauen. Er zählt zuerst, was die Arbeit heute an Stunden kostet, damit die Entscheidung für eine Automatisierung eine Zahl ist und keine Meinung, und er bleibt am Projekt, wenn sich diese Zahl ändert.",
  },
};

const NAME = "Krzysztof Suliński";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const locale of LOCALES) {
    const { from, to } = BIOS[locale];
    await db.execute(sql`
      UPDATE "team_locales" AS l
         SET "bio" = ${to}
        FROM "team" AS t
       WHERE l."_parent_id" = t."id"
         AND t."name" = ${NAME}
         AND l."_locale" = ${locale}::"_locales"
         AND l."bio" = ${from};`);
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const locale of LOCALES) {
    const { from, to } = BIOS[locale];
    await db.execute(sql`
      UPDATE "team_locales" AS l
         SET "bio" = ${from}
        FROM "team" AS t
       WHERE l."_parent_id" = t."id"
         AND t."name" = ${NAME}
         AND l."_locale" = ${locale}::"_locales"
         AND l."bio" = ${to};`);
  }
}
