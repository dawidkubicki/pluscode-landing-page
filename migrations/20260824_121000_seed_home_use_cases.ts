import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";

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

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
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
    for (const locale of ["pl", "de"] as const) {
      await payload.update({
        collection: "use-cases",
        id: doc.id,
        locale,
        data: { title: card.title[locale], category: card.category[locale] },
        req,
      });
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
