/**
 * "How we work", with the flags that now sit under each claim.
 *
 * Run it with:
 *
 *     node --import tsx scripts/content/approach-flags.ts
 *
 * WHY A SCRIPT AND NOT AN EDIT. The three dictionaries have to stay
 * structurally identical or a locale ships a band with a missing line, so
 * every copy change goes through one file that writes all three and throws
 * if their shapes have drifted. This one touches `home.approach` and
 * nothing else, so it can run beside the other content scripts without
 * standing on their keys.
 *
 * WHAT IS NEW. `items[].caption` is the small label that sits above each
 * cell's flag and says what the flag is answering: where the data sits,
 * which rules apply, where we work. Without it a row of flags is
 * decoration. `countries` is the accessible name of the seven flag row,
 * because the flags themselves are marked decorative: one label naming the
 * countries reads better than seven separate announcements.
 *
 * The titles, the intro and the bodies are unchanged from the September
 * 2026 home copy. No em dashes, in any locale.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");

export type ApproachContent = {
  title: string;
  intro: string;
  /** The accessible name of the national flag row. Names the countries in
   *  the order they are drawn, which is Poland first and then the order the
   *  Europe map uses. */
  countries: string;
  items: {
    key: string;
    /** The label above the cell's flag. One short noun phrase. */
    caption: string;
    title: string;
    body: string;
  }[];
};

const en: ApproachContent = {
  title: "How we work",
  intro:
    "A Polish company working across Europe. Before we build, we sit with your team and learn the job.",
  countries:
    "Flags of Poland, Germany, Finland, Italy, the Netherlands, Norway and Sweden",
  items: [
    {
      key: "hosting",
      caption: "Where the data sits",
      title: "EU hosting by default",
      body: "EU regions unless you agree otherwise, with a GDPR processing agreement.",
    },
    {
      key: "aiact",
      caption: "Which rules apply",
      title: "Built for the EU AI Act",
      body: "We work out your risk tier before anything is designed, not after it is built.",
    },
    {
      key: "rules",
      caption: "Where we work",
      title: "We learn your industry's rules",
      body: "Retail, banking, healthcare, logistics. We read them before writing code.",
    },
  ],
};

const pl: ApproachContent = {
  title: "Jak pracujemy",
  intro:
    "Polska firma pracująca w całej Europie. Zanim zaczniemy budować, siadamy z Waszym zespołem i uczymy się tej pracy.",
  countries:
    "Flagi Polski, Niemiec, Finlandii, Włoch, Holandii, Norwegii i Szwecji",
  items: [
    {
      key: "hosting",
      caption: "Gdzie leżą dane",
      title: "Hosting w UE domyślnie",
      body: "Regiony UE, chyba że ustalimy inaczej, wraz z umową powierzenia danych.",
    },
    {
      key: "aiact",
      caption: "Jakie przepisy obowiązują",
      title: "Zgodnie z AI Act",
      body: "Poziom ryzyka ustalamy przed projektowaniem, nie po wdrożeniu.",
    },
    {
      key: "rules",
      caption: "Gdzie pracujemy",
      title: "Uczymy się reguł Waszej branży",
      body: "Handel, bankowość, ochrona zdrowia, logistyka. Czytamy je, zanim napiszemy kod.",
    },
  ],
};

const de: ApproachContent = {
  title: "Wie wir arbeiten",
  intro:
    "Ein polnisches Unternehmen, das in ganz Europa arbeitet. Bevor wir bauen, sitzen wir bei Ihrem Team und lernen die Arbeit.",
  countries:
    "Flaggen von Polen, Deutschland, Finnland, Italien, den Niederlanden, Norwegen und Schweden",
  items: [
    {
      key: "hosting",
      caption: "Wo die Daten liegen",
      title: "EU-Hosting als Standard",
      body: "EU-Regionen, sofern nicht anders vereinbart, mit Auftragsverarbeitungsvertrag.",
    },
    {
      key: "aiact",
      caption: "Welche Regeln gelten",
      title: "Auf die KI-Verordnung ausgelegt",
      body: "Wir klären Ihre Risikostufe, bevor etwas entworfen wird, nicht danach.",
    },
    {
      key: "rules",
      caption: "Wo wir arbeiten",
      title: "Wir lernen die Regeln Ihrer Branche",
      body: "Handel, Banken, Gesundheit, Logistik. Wir lesen sie, bevor wir Code schreiben.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 *  Write. Only `home.approach` is replaced; every other key of `home`
 *  and every other top level key is left exactly as it was, so the
 *  scripts running beside this one keep their copy.
 * ------------------------------------------------------------------ */
const byLocale: Record<string, ApproachContent> = { en, pl, de };

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

const reference = JSON.stringify(shapeOf(en));
for (const [locale, content] of Object.entries(byLocale)) {
  const actual = JSON.stringify(shapeOf(content));
  if (actual !== reference) {
    throw new Error(
      `dictionaries/${locale}.json would drift: the \`home.approach\` shape does not match en.`,
    );
  }
}

for (const [locale, content] of Object.entries(byLocale)) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = JSON.parse(readFileSync(path, "utf8")) as Dict;
  const home = dict.home as Dict | undefined;
  if (!home) {
    throw new Error(`dictionaries/${locale}.json has no \`home\` key to patch.`);
  }
  home.approach = content;
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(`wrote home.approach -> dictionaries/${locale}.json`);
}
