import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";

/**
 * Seeds the "free AI consultations for startups" announcement (en/pl/de) with
 * its own page at /announcements/free-ai-consultations-for-startups. Being the
 * most recently updated active announcement, it takes over the top banner.
 * Skipped when the slug already exists, so re-runs never duplicate or clobber
 * editor content.
 */

const SLUG = "free-ai-consultations-for-startups";

// Minimal Lexical builders, same node shapes as scripts/seed-insights.ts.
const text = (t: string) => ({
  type: "text",
  text: t,
  format: 0,
  detail: 0,
  mode: "normal",
  style: "",
  version: 1,
});

const base = { direction: "ltr" as const, format: "" as const, indent: 0, version: 1 };

type RichBlock = { p?: string; h2?: string; ul?: string[] };

function lexical(blocks: RichBlock[]) {
  const children = blocks.map((b) => {
    if (b.h2) return { type: "heading", tag: "h2", children: [text(b.h2)], ...base };
    if (b.ul)
      return {
        type: "list",
        listType: "bullet",
        tag: "ul",
        start: 1,
        children: b.ul.map((item, i) => ({
          type: "listitem",
          value: i + 1,
          children: [text(item)],
          ...base,
        })),
        ...base,
      };
    return { type: "paragraph", textFormat: 0, children: [text(b.p ?? "")], ...base };
  });
  return { root: { type: "root", children, ...base } };
}

const LOCALES = {
  en: {
    text: "New: we now offer free AI consultations for startups.",
    linkText: "Learn more",
    pageTitle: "Free AI consultations for startups",
    body: lexical([
      {
        p: "We are opening a limited number of free AI consultations for startups. In one video call you talk through your product and data with a Pluscode engineer, and you leave with a concrete, honest read on where AI can help you now and where it cannot yet.",
      },
      { h2: "What we cover" },
      {
        ul: [
          "Where AI fits in your product today, and what is realistically buildable in weeks rather than quarters",
          "Whether your data is ready, and the shortest path to make it ready if it is not",
          "Build or buy: when an API call is enough and when you need your own models",
          "A rough cost and effort estimate for the first working version",
        ],
      },
      { h2: "Who it is for" },
      {
        p: "Founders and product teams from pre-seed to Series A who are considering an AI feature or an internal automation, or who want a sanity check on an existing idea. No pitch, no obligation, and your idea stays yours.",
      },
      { h2: "How to book" },
      {
        p: "Pick a slot through our booking page and tell us in two sentences what you are building. We will come prepared.",
      },
    ]),
  },
  pl: {
    text: "Nowość: oferujemy teraz darmowe konsultacje AI dla startupów.",
    linkText: "Dowiedz się więcej",
    pageTitle: "Darmowe konsultacje AI dla startupów",
    body: lexical([
      {
        p: "Otwieramy ograniczoną liczbę darmowych konsultacji AI dla startupów. Podczas jednej rozmowy wideo omawiasz swój produkt i dane z inżynierem Pluscode, a wychodzisz z konkretną, szczerą oceną tego, gdzie AI może pomóc już teraz, a gdzie jeszcze nie.",
      },
      { h2: "Co omawiamy" },
      {
        ul: [
          "Gdzie AI pasuje do twojego produktu dziś i co realnie da się zbudować w tygodnie, a nie kwartały",
          "Czy twoje dane są gotowe, a jeśli nie, jaka jest najkrótsza droga, żeby były",
          "Budować czy kupić: kiedy wystarczy wywołanie API, a kiedy potrzebujesz własnych modeli",
          "Wstępny szacunek kosztów i nakładu pracy pierwszej działającej wersji",
        ],
      },
      { h2: "Dla kogo" },
      {
        p: "Founderzy i zespoły produktowe od pre-seed do rundy A, które rozważają funkcję AI lub wewnętrzną automatyzację albo chcą sprawdzić istniejący pomysł. Bez sprzedaży, bez zobowiązań, a pomysł zostaje twój.",
      },
      { h2: "Jak umówić rozmowę" },
      {
        p: "Wybierz termin przez naszą stronę rezerwacji i napisz w dwóch zdaniach, co budujesz. Przyjdziemy przygotowani.",
      },
    ]),
  },
  de: {
    text: "Neu: Wir bieten jetzt kostenlose KI-Beratungen für Startups an.",
    linkText: "Mehr erfahren",
    pageTitle: "Kostenlose KI-Beratungen für Startups",
    body: lexical([
      {
        p: "Wir öffnen eine begrenzte Zahl kostenloser KI-Beratungen für Startups. In einem Videocall besprechen Sie Ihr Produkt und Ihre Daten mit einem Pluscode-Engineer und gehen mit einer konkreten, ehrlichen Einschätzung, wo KI Ihnen heute helfen kann und wo noch nicht.",
      },
      { h2: "Was wir besprechen" },
      {
        ul: [
          "Wo KI heute in Ihr Produkt passt und was sich realistisch in Wochen statt Quartalen bauen lässt",
          "Ob Ihre Daten bereit sind, und der kürzeste Weg dorthin, falls nicht",
          "Selbst bauen oder einkaufen: wann ein API-Aufruf genügt und wann eigene Modelle nötig sind",
          "Eine grobe Kosten- und Aufwandsschätzung für die erste funktionierende Version",
        ],
      },
      { h2: "Für wen" },
      {
        p: "Gründer und Produktteams von Pre-Seed bis Series A, die ein KI-Feature oder eine interne Automatisierung erwägen oder eine ehrliche Einschätzung einer bestehenden Idee wollen. Kein Pitch, keine Verpflichtung, und die Idee bleibt Ihre.",
      },
      { h2: "Termin buchen" },
      {
        p: "Wählen Sie einen Slot über unsere Buchungsseite und beschreiben Sie in zwei Sätzen, was Sie bauen. Wir kommen vorbereitet.",
      },
    ]),
  },
} as const;

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const existing = await payload.find({
    collection: "announcements",
    where: { slug: { equals: SLUG } },
    limit: 1,
    req,
  });
  if (existing.docs.length > 0) return;

  const en = LOCALES.en;
  const doc = await payload.create({
    collection: "announcements",
    locale: "en",
    data: {
      title: "Free AI consultations for startups",
      slug: SLUG,
      text: en.text,
      linkText: en.linkText,
      linkUrl: `/announcements/${SLUG}`,
      pageTitle: en.pageTitle,
      body: en.body,
      publishedAt: "2026-08-24T09:00:00.000Z",
      isActive: true,
    },
    req,
  });

  for (const locale of ["pl", "de"] as const) {
    const l = LOCALES[locale];
    await payload.update({
      collection: "announcements",
      id: doc.id,
      locale,
      data: {
        text: l.text,
        linkText: l.linkText,
        pageTitle: l.pageTitle,
        body: l.body,
      },
      req,
    });
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.delete({
    collection: "announcements",
    where: { slug: { equals: SLUG } },
    req,
  });
}
