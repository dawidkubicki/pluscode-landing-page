import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Content seed for the home "Ambition in action" mosaic: fills the
 * `useCasesSection` global heading and creates the five `use-cases` cards
 * (en/pl/de), mirroring the approved dictionary copy so the live page looks
 * identical while control moves into the CMS.
 *
 * Runs through the Payload local API instead of SQL so localized rows and
 * hooks behave exactly as if an editor had typed the content. Both seeds are
 * skipped when data already exists, so re-running (or a partially seeded
 * environment) never clobbers editor content.
 *
 * REPLAY NOTE, added 2026-10-14. The Local API speaks the schema of today's
 * config, not the schema this point of the chain has built, so replaying the
 * chain into an empty database failed right here, twice over:
 *   1. `payload.create` writes every column of `use-cases`, and the collection
 *      gained `art` one day after this seed, in 20260825_090000_use_case_art.
 *      `up` now creates that enum and column first, guarded, and
 *      20260825_090000 is guarded to match.
 *   2. `payload.update` clears document locks before it writes, with a query
 *      over one `payload_locked_documents_rels` column per collection in the
 *      config. `clients_id`, `hero_slides_id` and `products_id` all arrive
 *      later. The Polish and German rows are therefore inserted with SQL,
 *      which writes the same two columns the update did.
 * A fresh database ends where production is. Production itself is not
 * affected: this migration is recorded there and never runs again.
 */

const SECTION = {
  en: { label: "Applied AI, in production", title: "Ambition in action" },
  pl: { label: "Zastosowane AI, na produkcji", title: "Ambicja w działaniu" },
  de: { label: "Angewandte KI, in Produktion", title: "Ambition in der Praxis" },
} as const;

const CARDS = [
  {
    order: 1,
    featured: true,
    href: "/ai-data/machine-learning/nlp-llm",
    category: { en: "Document AI", pl: "Document AI", de: "Document AI" },
    title: {
      en: "Invoice data flowing straight into the ERP, no manual entry",
      pl: "Dane z faktur trafiają prosto do ERP, bez ręcznego wpisywania",
      de: "Rechnungsdaten fließen direkt ins ERP, ohne manuelle Erfassung",
    },
  },
  {
    order: 2,
    featured: false,
    href: "/ai-data/consulting/genai-implementation",
    category: { en: "Conversational AI", pl: "Conversational AI", de: "Conversational AI" },
    title: {
      en: "A support assistant that resolves half of all tickets",
      pl: "Asystent wsparcia, który rozwiązuje połowę zgłoszeń",
      de: "Ein Support-Assistent, der die Hälfte aller Tickets löst",
    },
  },
  {
    order: 3,
    featured: false,
    href: "/ai-data/machine-learning/forecasting",
    category: { en: "Forecasting", pl: "Prognozowanie", de: "Forecasting" },
    title: {
      en: "Demand forecasts that keep shelves stocked and waste low",
      pl: "Prognozy popytu, które utrzymują pełne półki i niskie straty",
      de: "Bedarfsprognosen, die Regale gefüllt halten und Verschwendung reduzieren",
    },
  },
  {
    order: 4,
    featured: false,
    href: "/ai-data/machine-learning/computer-vision",
    category: { en: "Computer Vision", pl: "Computer Vision", de: "Computer Vision" },
    title: {
      en: "Quality inspection that spots defects before customers do",
      pl: "Kontrola jakości, która wykrywa wady zanim zrobią to klienci",
      de: "Qualitätsprüfung, die Fehler erkennt, bevor Kunden sie sehen",
    },
  },
  {
    order: 5,
    featured: false,
    href: "/ai-data/machine-learning/nlp-llm",
    category: { en: "Knowledge AI", pl: "Knowledge AI", de: "Knowledge AI" },
    title: {
      en: "Company knowledge, searchable in plain language",
      pl: "Wiedza firmowa przeszukiwalna prostym językiem",
      de: "Unternehmenswissen, durchsuchbar in natürlicher Sprache",
    },
  },
] as const;

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // See the replay note above. Same DDL as 20260825_090000_use_case_art.
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_use_cases_art" AS ENUM('document', 'assistant', 'forecast', 'vision', 'knowledge');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
   ALTER TABLE "use_cases" ADD COLUMN IF NOT EXISTS "art" "enum_use_cases_art";`);

  const existingSection = await payload.findGlobal({
    slug: "useCasesSection",
    locale: "en",
    req,
  });
  if (!existingSection?.label && !existingSection?.title) {
    for (const locale of ["en", "pl", "de"] as const) {
      await payload.updateGlobal({
        slug: "useCasesSection",
        locale,
        data: SECTION[locale],
        req,
      });
    }
  }

  const existingCards = await payload.count({ collection: "use-cases", req });
  if (existingCards.totalDocs > 0) return;

  for (const card of CARDS) {
    const doc = await payload.create({
      collection: "use-cases",
      locale: "en",
      data: {
        title: card.title.en,
        category: card.category.en,
        href: card.href,
        featured: card.featured,
        order: card.order,
      },
      req,
    });
    // SQL since 2026-10-14, where this was `payload.update`. See the replay
    // note above: an update first clears document locks, and that query names
    // one column per collection in today's config.
    for (const locale of ["pl", "de"] as const) {
      await db.execute(sql`
        INSERT INTO "use_cases_locales" ("_locale", "_parent_id", "title", "category")
        VALUES (${locale}::"_locales", ${doc.id}::integer, ${card.title[locale]}::varchar, ${card.category[locale]}::varchar)
        ON CONFLICT ("_locale", "_parent_id")
        DO UPDATE SET "title" = EXCLUDED."title", "category" = EXCLUDED."category"
      `);
    }
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.delete({ collection: "use-cases", where: {}, req });
  for (const locale of ["en", "pl", "de"] as const) {
    await payload.updateGlobal({
      slug: "useCasesSection",
      locale,
      data: { label: null, title: null },
      req,
    });
  }
}
