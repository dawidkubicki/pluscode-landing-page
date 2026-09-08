/**
 * Two fields for the "What we do" band: a path per row, and the label the
 * row shows on hover.
 *
 * Run it with:
 *
 *     node --import tsx scripts/content/services-links.ts
 *
 * RUN IT AFTER home-consulting.ts, never before. That script owns the whole
 * of `home.services` and rewrites the key from its own literals, which do
 * not carry `href` or `readMore`, so `pnpm content:home` after this one
 * would silently drop both and the band would stop compiling. The order is
 * home-netcompany, home-consulting, then this.
 *
 * WHY THE PATHS ARE CONTENT. Until 2026-09-08 the five rows were text and
 * the band had one action, the button in its header. Every row now has a
 * real page behind it, so the row itself is the way in. The path lives in
 * the dictionary rather than in a table inside the component because it
 * travels with the copy: a locale that gains a row gains its destination in
 * the same edit, and nothing in the band has to be recompiled to move one.
 *
 * The paths are NOT localized. They are the same five strings in all three
 * files and they come from one map below, because the router prefixes the
 * active locale itself (see LocaleLink) and a per-locale slug would give
 * three chances to typo the same route.
 *
 * Everything else here is the copy already in the dictionaries, carried
 * through word for word. Nothing in this file retranslates anything, and
 * the check before the write refuses to run if a string on disk has moved
 * away from the one declared here, so a copy edit made somewhere else can
 * never be quietly reverted by adding a link.
 *
 * House style: no em dashes, in any locale.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");

/* ------------------------------------------------------------------ *
 *  The destinations. One row, one page. The four /solutions pages are the
 *  buyer-facing writeups of the two AI engagements plus reporting; the two
 *  /services pages already existed and are the delivery engagements.
 * ------------------------------------------------------------------ */
const HREFS: Record<string, string> = {
  paperwork: "/solutions/paperwork-automation",
  answers: "/solutions/answers-from-documents",
  software: "/services/software-development",
  mvp: "/services/mvp-development",
  forecasting: "/solutions/forecasting-and-reporting",
};

/** What a translator writes: the band copy, with no paths in it. */
export type ServicesCopy = {
  title: string;
  intro: string;
  cta: string;
  /** The label that fades up on the hovered row. Localized. */
  readMore: string;
  items: { key: string; num: string; title: string; body: string }[];
};

/** What lands in the dictionary: the same, plus the path off the map. */
export type ServicesContent = Omit<ServicesCopy, "items"> & {
  items: (ServicesCopy["items"][number] & { href: string })[];
};

const en: ServicesCopy = {
  title: "What we do",
  intro: "Engineers, not slide decks. Each one takes hours off somebody's week.",
  cta: "All services",
  readMore: "Learn more",
  items: [
    {
      key: "paperwork",
      num: "01",
      title: "Paperwork automation",
      body: "Invoices, orders and forms are read and filed without anyone retyping them.",
    },
    {
      key: "answers",
      num: "02",
      title: "Answers from your documents",
      body: "Your team asks a question and gets the answer, with the source page attached.",
    },
    {
      key: "software",
      num: "03",
      title: "Software development",
      body: "Custom systems built end to end by the people who will run them.",
    },
    {
      key: "mvp",
      num: "04",
      title: "MVP development",
      body: "A first version live in weeks, then grown on what real users do with it.",
    },
    {
      key: "forecasting",
      num: "05",
      title: "Forecasting and reporting",
      body: "Numbers from every system in one place, and a view of the months ahead.",
    },
  ],
};

const pl: ServicesCopy = {
  title: "Co robimy",
  intro: "Inżynierowie, nie prezentacje. Każda z tych rzeczy zdejmuje godziny z czyjegoś tygodnia.",
  cta: "Wszystkie usługi",
  readMore: "Dowiedz się więcej",
  items: [
    {
      key: "paperwork",
      num: "01",
      title: "Automatyzacja papierologii",
      body: "Faktury, zamówienia i formularze zostają odczytane i opisane bez przepisywania ręcznie.",
    },
    {
      key: "answers",
      num: "02",
      title: "Odpowiedzi z Twoich dokumentów",
      body: "Zespół zadaje pytanie i dostaje odpowiedź razem ze stroną źródłową.",
    },
    {
      key: "software",
      num: "03",
      title: "Tworzenie oprogramowania",
      body: "Systemy budowane od początku do końca przez ludzi, którzy potem je utrzymują.",
    },
    {
      key: "mvp",
      num: "04",
      title: "Rozwój MVP",
      body: "Pierwsza wersja na żywo w kilka tygodni, potem rozwijana na podstawie tego, co robią użytkownicy.",
    },
    {
      key: "forecasting",
      num: "05",
      title: "Prognozy i raporty",
      body: "Liczby ze wszystkich systemów w jednym miejscu i widok najbliższych miesięcy.",
    },
  ],
};

const de: ServicesCopy = {
  title: "Was wir tun",
  intro: "Ingenieure, keine Foliensätze. Jedes davon nimmt Stunden aus jemandes Woche.",
  cta: "Alle Leistungen",
  readMore: "Mehr erfahren",
  items: [
    {
      key: "paperwork",
      num: "01",
      title: "Automatisierte Sachbearbeitung",
      body: "Rechnungen, Bestellungen und Formulare werden gelesen und abgelegt, ohne dass jemand sie abtippt.",
    },
    {
      key: "answers",
      num: "02",
      title: "Antworten aus Ihren Dokumenten",
      body: "Ihr Team stellt eine Frage und bekommt die Antwort, mit der Quellseite dazu.",
    },
    {
      key: "software",
      num: "03",
      title: "Softwareentwicklung",
      body: "Systeme, von Anfang bis Ende gebaut von den Leuten, die sie danach betreiben.",
    },
    {
      key: "mvp",
      num: "04",
      title: "MVP-Entwicklung",
      body: "Eine erste Version in Wochen live, danach gewachsen an dem, was echte Nutzer tun.",
    },
    {
      key: "forecasting",
      num: "05",
      title: "Prognose und Reporting",
      body: "Zahlen aus allen Systemen an einem Ort, und ein Blick auf die kommenden Monate.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 *  Build, check, write.
 * ------------------------------------------------------------------ */

/** Attaches the path for each row. Throws rather than shipping a row that
 *  renders as a link to nowhere. */
function withHrefs(locale: string, copy: ServicesCopy): ServicesContent {
  return {
    ...copy,
    items: copy.items.map((item) => {
      const href = HREFS[item.key];
      if (!href) {
        throw new Error(
          `services-links: \`${item.key}\` (${locale}) has no path in HREFS.`,
        );
      }
      return { ...item, href };
    }),
  };
}

const byLocale: Record<string, ServicesContent> = {
  en: withHrefs("en", en),
  pl: withHrefs("pl", pl),
  de: withHrefs("de", de),
};

/** Structural equality, so a locale can never ship a half-translated band. */
function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Dict)
        .sort()
        .map((k) => [k, shapeOf((value as Dict)[k])]),
    );
  }
  return typeof value;
}

const reference = JSON.stringify(shapeOf(byLocale.en));
const order = Object.keys(HREFS).join(",");
for (const [locale, content] of Object.entries(byLocale)) {
  if (JSON.stringify(shapeOf(content)) !== reference) {
    throw new Error(
      `dictionaries/${locale}.json would drift: the \`home.services\` shape does not match en.`,
    );
  }
  /* Shape equality compares types, not keys, so the row order is checked
     separately: three files whose rows ran in different orders would each
     be internally valid and would still hand row 3 the wrong page. */
  if (content.items.map((item) => item.key).join(",") !== order) {
    throw new Error(
      `dictionaries/${locale}.json: home.services rows are ${content.items
        .map((item) => item.key)
        .join(", ")}, expected ${Object.keys(HREFS).join(", ")}.`,
    );
  }
}

/** Everything that already exists must survive this script untouched. The
 *  fields are compared one by one rather than as a blob so the message
 *  names the string that moved. */
function assertPreserved(
  locale: string,
  current: ServicesContent,
  next: ServicesContent,
) {
  const moved: string[] = [];
  for (const field of ["title", "intro", "cta"] as const) {
    if (current[field] !== next[field]) moved.push(`home.services.${field}`);
  }
  if (current.items.length !== next.items.length) {
    moved.push(
      `home.services.items has ${current.items.length} rows on disk and ${next.items.length} in this script`,
    );
  } else {
    current.items.forEach((item, i) => {
      for (const field of ["key", "num", "title", "body"] as const) {
        if (item[field] !== next.items[i][field]) {
          moved.push(`home.services.items[${i}].${field}`);
        }
      }
    });
  }
  if (moved.length > 0) {
    throw new Error(
      `dictionaries/${locale}.json has copy this script does not know about, so it would be overwritten: ${moved.join(
        ", ",
      )}. Copy the current strings into services-links.ts and run it again.`,
    );
  }
}

for (const [locale, content] of Object.entries(byLocale)) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = JSON.parse(readFileSync(path, "utf8")) as Dict;
  const home = (dict.home ?? {}) as Dict;
  const current = home.services as ServicesContent | undefined;
  if (!current) {
    throw new Error(
      `dictionaries/${locale}.json has no \`home.services\`. Run home-netcompany.ts and home-consulting.ts first.`,
    );
  }
  assertPreserved(locale, current, content);
  dict.home = { ...home, services: content };
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(`patched home.services with href + readMore -> dictionaries/${locale}.json`);
}
