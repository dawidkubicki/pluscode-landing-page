import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Puts the two real people in the `team` collection, and removes everyone else.
 *
 * WHY. scripts/seed.ts only creates records that do not exist yet, so every
 * database seeded before the team was corrected still carries the original
 * placeholders. Production is one of them: /about has been listing "Engineering
 * Lead, Head of Engineering" and "Design Lead, Head of Design" beside Dawid,
 * and Krzysztof Suliński, who does exist, was missing entirely. Two of those
 * three people are not real. scripts/seed-team.ts fixes it, but it has to be
 * run by hand; a migration runs on container boot, so the fix ships with the
 * deploy instead of waiting for someone to remember.
 *
 * PLAIN SQL, NOT THE LOCAL API. This touches two tables and no hooks, and it
 * has to work on a database whose `team` rows were written by three different
 * seeds. One statement per `db.execute` because node-postgres only accepts a
 * multi statement string in simple query mode, and these carry parameters.
 *
 * IDEMPOTENT, AND SAFE ON A DATABASE ALREADY FIXED BY HAND. Insert is guarded
 * by NOT EXISTS, the field update is a plain UPDATE by name, the localized rows
 * go through ON CONFLICT on the (_locale, _parent_id) unique index, and the
 * prune is a DELETE with a NOT IN. Running it twice changes nothing the second
 * time. The local development database already holds exactly these two people
 * and this migration is a no-op against it.
 *
 * WHAT IT DOES NOT TOUCH.
 *   photo_id          A portrait is a file in the media library, and SQL cannot
 *                     upload one. app/(frontend)/[lang]/about/page.tsx falls
 *                     back to public/assets/team/ for exactly this reason, so
 *                     the right faces show whatever the media library holds.
 *                     scripts/seed-team.ts is still the way to push portraits.
 *   featured_on_home  Left alone when somebody is already flagged, because that
 *                     choice belongs to whoever made it in the admin. Only when
 *                     nobody at all is flagged (or the flagged row was one of
 *                     the placeholders this migration deletes) does Krzysztof
 *                     get it, matching scripts/content/team.ts.
 *
 * The role and bio strings below are the same ones in scripts/content/about.ts
 * under `pages.about.team.members`, which is what scripts/seed-team.ts reads.
 * Edit one and edit the other, or the CMS and the dictionary fallback will say
 * two different things about the same person.
 */

type PersonLocale = { role: string; bio: string };

type Person = {
  name: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  /** Lower first. Dawid left, Krzysztof right, matching the founders photo. */
  order: number;
  /** Who takes the homepage booking card when nobody is flagged yet. */
  featuredWhenNobodyIs: boolean;
  locales: Record<"en" | "pl" | "de", PersonLocale>;
};

const PEOPLE: Person[] = [
  {
    name: "Dawid Kubicki",
    email: "contact@pluscode.io",
    phone: "+48 667 688 927",
    linkedin: "https://www.linkedin.com/company/pluscode",
    order: 0,
    featuredWhenNobodyIs: false,
    locales: {
      en: {
        role: "CEO & AI Consultant",
        bio: "Scopes the work with you and then writes it. Most of what he builds is retrieval over a company's own records, graph and vector systems that have to survive real and inconsistent data, together with the infrastructure that keeps them running once they are live.",
      },
      pl: {
        role: "CEO i konsultant AI",
        bio: "Ustala z Wami zakres pracy, a potem sam ją pisze. Buduje głównie wyszukiwanie we własnych danych firmy, systemy grafowe i wektorowe, które muszą wytrzymać zderzenie z prawdziwymi, niespójnymi danymi, wraz z infrastrukturą, która utrzymuje je po wdrożeniu.",
      },
      de: {
        role: "CEO & KI-Berater",
        bio: "Schneidet die Arbeit mit Ihnen zu und schreibt sie dann selbst. Das meiste, was er baut, ist Suche in den eigenen Daten eines Unternehmens: Graph- und Vektorsysteme, die echten, uneinheitlichen Daten standhalten müssen, samt der Infrastruktur, die sie im Betrieb hält.",
      },
    },
  },
  {
    name: "Krzysztof Suliński",
    email: "contact@pluscode.io",
    phone: null,
    linkedin: null,
    order: 1,
    featuredWhenNobodyIs: true,
    locales: {
      en: {
        role: "AI Consultant",
        bio: "The first person you talk to, and one of the two who build it. He starts by counting what the work costs in hours today, so the decision to automate is a number and not an opinion, and he stays on the project after that number changes.",
      },
      pl: {
        role: "Konsultant AI",
        bio: "Pierwsza osoba, z którą rozmawiasz, i jedna z dwóch, które to budują. Zaczyna od policzenia, ile ta praca kosztuje dziś w godzinach, żeby decyzja o automatyzacji była liczbą, a nie opinią, i zostaje przy projekcie, gdy ta liczba się zmieni.",
      },
      de: {
        role: "KI-Berater",
        bio: "Die erste Person, mit der Sie sprechen, und einer der beiden, die bauen. Er zählt zuerst, was die Arbeit heute an Stunden kostet, damit die Entscheidung für eine Automatisierung eine Zahl ist und keine Meinung, und er bleibt am Projekt, wenn sich diese Zahl ändert.",
      },
    },
  },
];

const LOCALES = ["en", "pl", "de"] as const;

const DAWID = PEOPLE[0].name;
const KRZYSZTOF = PEOPLE[1].name;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Create anyone who is missing. Every literal is cast, because a bare
  //    parameter in the select list of an INSERT ... SELECT has no context
  //    Postgres can infer a type from, and `phone` and `linkedin` are null
  //    for one of the two.
  for (const p of PEOPLE) {
    await db.execute(sql`
      INSERT INTO "team" ("name", "email", "phone", "linkedin", "order", "updated_at", "created_at")
      SELECT ${p.name}::varchar,
             ${p.email}::varchar,
             ${p.phone}::varchar,
             ${p.linkedin}::varchar,
             ${p.order}::numeric,
             now(),
             now()
      WHERE NOT EXISTS (SELECT 1 FROM "team" WHERE "name" = ${p.name}::varchar)
    `);
  }

  // 2. Prune. Everything that is not one of the two goes, and so does any
  //    duplicate of a real person beyond the lowest id, which is what makes
  //    the single row subqueries below safe. team_locales rows and the
  //    payload_locked_documents_rels rows cascade with the parent.
  await db.execute(sql`
    DELETE FROM "team" AS t
    WHERE t."name" NOT IN (${DAWID}::varchar, ${KRZYSZTOF}::varchar)
       OR t."id" > (SELECT MIN(t2."id") FROM "team" AS t2 WHERE t2."name" = t."name")
  `);

  // 3. Bring the surviving rows up to date. photo_id and featured_on_home are
  //    deliberately absent from the SET list, see the header. `phone` and
  //    `linkedin` go through COALESCE because the repo has neither for
  //    Krzysztof: overwriting with NULL would delete a number or a profile URL
  //    an editor had added, and this migration has nothing better to put there.
  for (const p of PEOPLE) {
    await db.execute(sql`
      UPDATE "team"
         SET "email" = ${p.email}::varchar,
             "phone" = COALESCE(${p.phone}::varchar, "phone"),
             "linkedin" = COALESCE(${p.linkedin}::varchar, "linkedin"),
             "order" = ${p.order}::numeric,
             "updated_at" = now()
       WHERE "name" = ${p.name}::varchar
    `);
  }

  // 4. The localized role and bio, one row per person per locale. The unique
  //    index team_locales_locale_parent_id_unique is what ON CONFLICT targets,
  //    so a second run updates in place instead of duplicating.
  for (const p of PEOPLE) {
    for (const locale of LOCALES) {
      const { role, bio } = p.locales[locale];
      await db.execute(sql`
        INSERT INTO "team_locales" ("_locale", "_parent_id", "role", "bio")
        SELECT ${locale}::"_locales", t."id", ${role}::varchar, ${bio}::varchar
          FROM "team" AS t
         WHERE t."name" = ${p.name}::varchar
        ON CONFLICT ("_locale", "_parent_id")
        DO UPDATE SET "role" = EXCLUDED."role", "bio" = EXCLUDED."bio"
      `);
    }
  }

  // 5. The homepage booking card needs somebody. Only fills the gap: an
  //    existing choice, including Dawid if that is what an editor picked,
  //    survives untouched.
  const featured = PEOPLE.find((p) => p.featuredWhenNobodyIs);
  if (featured) {
    await db.execute(sql`
      UPDATE "team"
         SET "featured_on_home" = true,
             "updated_at" = now()
       WHERE "name" = ${featured.name}::varchar
         AND NOT EXISTS (SELECT 1 FROM "team" WHERE "featured_on_home" = true)
    `);
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The placeholders this migration deleted were fictional and are not coming
  // back, so the honest reverse is to remove what it put there: the two people
  // and their localized rows, which cascade. That leaves `team` empty, and an
  // empty collection is a supported state. /about detects it and renders the
  // two of them from the dictionary and from public/assets/team/ instead, so
  // the page is correct either way.
  await db.execute(sql`
    DELETE FROM "team" WHERE "name" IN (${DAWID}::varchar, ${KRZYSZTOF}::varchar)
  `);
}
