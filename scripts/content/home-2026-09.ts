/**
 * Dictionary additions for the September 2026 home page rework. Run once:
 *
 *   node --import tsx scripts/content/home-2026-09.ts
 *
 * Edits dictionaries/{en,pl,de}.json together by JSON path so the three files
 * stay structurally identical. Idempotent: running it twice writes the same
 * values twice. House style: no em dashes anywhere.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;
type Locale = "en" | "pl" | "de";

const root = resolve(import.meta.dirname, "../..");
const file = (l: Locale) => resolve(root, `dictionaries/${l}.json`);
const load = (l: Locale): Dict => JSON.parse(readFileSync(file(l), "utf8"));
const save = (l: Locale, d: Dict) =>
  writeFileSync(file(l), JSON.stringify(d, null, 2) + "\n");

function setPath(obj: Dict, path: string, value: unknown) {
  const keys = path.split(".");
  let cur: Dict = obj;
  for (const k of keys.slice(0, -1)) {
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k] as Dict;
  }
  cur[keys[keys.length - 1]] = value;
}

function delPath(obj: Dict, path: string) {
  const keys = path.split(".");
  let cur: Dict = obj;
  for (const k of keys.slice(0, -1)) {
    if (typeof cur[k] !== "object" || cur[k] === null) return;
    cur = cur[k] as Dict;
  }
  delete cur[keys[keys.length - 1]];
}

/* ------------------------------------------------------------------ */

const clients = {
  en: {
    label: "Who we have built for",
    title: "Built for a retail chain, a bank and a clinic",
    greyClause: "Three of the teams we have shipped for, and what we did there.",
    cta: "Read the case studies",
    items: [
      {
        key: "zabka",
        name: "Żabka",
        tag: "Retail",
        what: "Architecture for autonomous stores",
        detail:
          "Planned, designed and ran the system architecture behind unstaffed stores for Poland's largest convenience chain.",
      },
      {
        key: "ubs",
        name: "UBS",
        tag: "Banking",
        what: "A mobile redesign, delivered at speed",
        detail:
          "Our engineers joined the bank's own team to unify payment flows and navigation across its mobile app.",
      },
      {
        key: "ebm",
        name: "EBM Dental",
        tag: "Healthcare",
        what: "A modern web platform for a dental clinic",
        detail:
          "Design and Next.js build for a multi-specialist practice in Poznań, from the first sketch to launch.",
      },
    ],
  },
  pl: {
    label: "Dla kogo budowaliśmy",
    title: "Dla sieci sklepów, banku i kliniki",
    greyClause: "Trzy zespoły, dla których dowieźliśmy, i co tam zrobiliśmy.",
    cta: "Zobacz case studies",
    items: [
      {
        key: "zabka",
        name: "Żabka",
        tag: "Handel",
        what: "Architektura sklepów autonomicznych",
        detail:
          "Zaplanowaliśmy, zaprojektowaliśmy i utrzymywaliśmy architekturę systemu sklepów bezobsługowych największej sieci convenience w Polsce.",
      },
      {
        key: "ubs",
        name: "UBS",
        tag: "Bankowość",
        what: "Nowy design aplikacji mobilnej, w tempie",
        detail:
          "Nasi inżynierowie dołączyli do zespołu banku, by ujednolicić płatności i nawigację w aplikacji mobilnej.",
      },
      {
        key: "ebm",
        name: "EBM Dental",
        tag: "Ochrona zdrowia",
        what: "Nowoczesna platforma www kliniki stomatologicznej",
        detail:
          "Projekt i wdrożenie w Next.js dla wielospecjalistycznej praktyki w Poznaniu, od szkicu do startu.",
      },
    ],
  },
  de: {
    label: "Für wen wir gebaut haben",
    title: "Für eine Handelskette, eine Bank und eine Klinik",
    greyClause: "Drei Teams, für die wir geliefert haben, und was wir dort gemacht haben.",
    cta: "Case Studies lesen",
    items: [
      {
        key: "zabka",
        name: "Żabka",
        tag: "Handel",
        what: "Architektur für autonome Stores",
        detail:
          "Systemarchitektur für unbesetzte Filialen der größten Convenience-Kette Polens geplant, entworfen und betrieben.",
      },
      {
        key: "ubs",
        name: "UBS",
        tag: "Banking",
        what: "Ein Mobile-Redesign, schnell geliefert",
        detail:
          "Unsere Engineers verstärkten das Team der Bank, um Zahlungsflüsse und Navigation in der App zu vereinheitlichen.",
      },
      {
        key: "ebm",
        name: "EBM Dental",
        tag: "Gesundheitswesen",
        what: "Eine moderne Webplattform für eine Zahnklinik",
        detail:
          "Design und Next.js-Umsetzung für eine Praxis mit mehreren Fachrichtungen in Poznań, vom ersten Entwurf bis zum Start.",
      },
    ],
  },
} as const;

const figures = {
  en: {
    label: "In numbers",
    title: "A small team with a long record",
    greyClause: "Four numbers you can check on the first call.",
  },
  pl: {
    label: "W liczbach",
    title: "Mały zespół, długi staż",
    greyClause: "Cztery liczby, które sprawdzisz na pierwszej rozmowie.",
  },
  de: {
    label: "In Zahlen",
    title: "Ein kleines Team mit langer Bilanz",
    greyClause: "Vier Zahlen, die Sie im ersten Gespräch prüfen können.",
  },
} as const;

const quanty = {
  en: {
    label: "Our own product",
    title: "We also build our own. Quanty",
    greyClause:
      "is an AI spreadsheet that reads invoices, contracts and orders into rows, with the source page beside every value.",
    points: [
      "Designed and built by the same two engineers you would work with",
      "In beta now, with a public launch this autumn",
      "Made from the same parts we put into client systems: document reading, answers with a source, approvals",
    ],
    cta: "See quanty.ai",
    note: "Quanty is a product of Pluscode Sp. z o.o.",
    imageAlt: "The Quanty workbook with invoices read into a table",
  },
  pl: {
    label: "Nasz własny produkt",
    title: "Budujemy też własny produkt. Quanty",
    greyClause:
      "to arkusz AI, który czyta faktury, umowy i zamówienia do tabeli i przy każdej wartości pokazuje stronę, z której pochodzi.",
    points: [
      "Zaprojektowany i zbudowany przez tych samych dwóch inżynierów, z którymi będziesz pracować",
      "Dziś w becie, publiczny start tej jesieni",
      "Z tych samych klocków, które wkładamy w systemy klientów: czytanie dokumentów, odpowiedzi ze źródłem, zatwierdzenia",
    ],
    cta: "Zobacz quanty.ai",
    note: "Quanty jest produktem Pluscode Sp. z o.o.",
    imageAlt: "Skoroszyt Quanty z fakturami wczytanymi do tabeli",
  },
  de: {
    label: "Unser eigenes Produkt",
    title: "Wir bauen auch selbst. Quanty",
    greyClause:
      "ist eine KI-Tabelle, die Rechnungen, Verträge und Bestellungen in Zeilen liest und neben jedem Wert die Quellseite zeigt.",
    points: [
      "Entworfen und gebaut von denselben zwei Engineers, mit denen Sie arbeiten würden",
      "Heute in der Beta, öffentlicher Start im Herbst",
      "Aus denselben Bausteinen wie unsere Kundensysteme: Dokumente lesen, Antworten mit Quelle, Freigaben",
    ],
    cta: "quanty.ai ansehen",
    note: "Quanty ist ein Produkt der Pluscode Sp. z o.o.",
    imageAlt: "Die Quanty-Arbeitsmappe mit eingelesenen Rechnungen",
  },
} as const;

/** Index-aligned with `offerings.items`: 01 analysis, 02 MVP, 03 AI native, 04 workshop. */
const offeringExtras = {
  en: {
    exampleLabel: "For example",
    stepsLabel: "How it goes",
    items: [
      {
        example:
          "Your accounting team retypes 300 invoices a month. We count the hours and price what it takes to stop.",
        steps: [
          "We sit with the person doing the job",
          "We count the hours and where they go",
          "You get a costed shortlist of what to fix first",
        ],
      },
      {
        example:
          "A portal where your customers check their order status without calling you.",
        steps: [
          "We agree what version one must do",
          "We build it with your users watching",
          "It goes live, and you own it",
        ],
      },
      {
        example:
          "Incoming emails are read, answered where it is routine, and passed to a person where it is not.",
        steps: [
          "We map the repeat work",
          "We build it on your own data, with approvals",
          "We hand it over and stay for support",
        ],
      },
      {
        example:
          "Half a day with your managers on what AI can do for your company, in plain language.",
        steps: [
          "We learn your business beforehand",
          "Half a day of examples, no slides",
          "You leave with one first move",
        ],
      },
    ],
  },
  pl: {
    exampleLabel: "Na przykład",
    stepsLabel: "Jak to wygląda",
    items: [
      {
        example:
          "Księgowość przepisuje 300 faktur miesięcznie. Liczymy godziny i wyceniamy, ile kosztuje z tym skończyć.",
        steps: [
          "Siadamy z osobą, która robi tę pracę",
          "Liczymy godziny i to, gdzie uciekają",
          "Dostajesz wycenioną listę, co naprawić najpierw",
        ],
      },
      {
        example:
          "Portal, w którym klienci sprawdzają status zamówienia bez dzwonienia do Ciebie.",
        steps: [
          "Ustalamy, co musi robić wersja pierwsza",
          "Budujemy ją na oczach Twoich użytkowników",
          "Startuje, a Ty jesteś jej właścicielem",
        ],
      },
      {
        example:
          "Przychodzące maile są czytane, rutynowe dostają odpowiedź, reszta trafia do człowieka.",
        steps: [
          "Mapujemy powtarzalną pracę",
          "Budujemy system na Twoich danych, z zatwierdzeniami",
          "Przekazujemy go i zostajemy na wsparcie",
        ],
      },
      {
        example:
          "Pół dnia z menedżerami o tym, co AI może zrobić w Twojej firmie, prostym językiem.",
        steps: [
          "Wcześniej poznajemy Twój biznes",
          "Pół dnia przykładów, bez slajdów",
          "Wychodzisz z jednym pierwszym krokiem",
        ],
      },
    ],
  },
  de: {
    exampleLabel: "Zum Beispiel",
    stepsLabel: "So läuft es",
    items: [
      {
        example:
          "Ihre Buchhaltung tippt 300 Rechnungen im Monat ab. Wir zählen die Stunden und beziffern, was es kostet, damit aufzuhören.",
        steps: [
          "Wir setzen uns zu der Person, die die Arbeit macht",
          "Wir zählen die Stunden und wohin sie gehen",
          "Sie erhalten eine bepreiste Liste, was zuerst zu beheben ist",
        ],
      },
      {
        example:
          "Ein Portal, in dem Ihre Kunden den Auftragsstatus prüfen, ohne anzurufen.",
        steps: [
          "Wir legen fest, was Version eins können muss",
          "Wir bauen sie, während Ihre Nutzer zusehen",
          "Sie geht live, und sie gehört Ihnen",
        ],
      },
      {
        example:
          "Eingehende E-Mails werden gelesen, Routinefälle beantwortet, der Rest geht an einen Menschen.",
        steps: [
          "Wir kartieren die wiederkehrende Arbeit",
          "Wir bauen es auf Ihren Daten, mit Freigaben",
          "Wir übergeben es und bleiben für den Support",
        ],
      },
      {
        example:
          "Ein halber Tag mit Ihren Führungskräften darüber, was KI in Ihrem Unternehmen leisten kann, in klarer Sprache.",
        steps: [
          "Wir lernen Ihr Geschäft vorab kennen",
          "Ein halber Tag Beispiele, keine Folien",
          "Sie gehen mit einem ersten Schritt nach Hause",
        ],
      },
    ],
  },
} as const;

/** One caption per capability for the WebGL stage in "Five ways". Plain words. */
const sceneCaptions = {
  en: [
    "Documents arrive, get read, and land in the right place.",
    "A question goes in, an answer comes back with where it came from.",
    "Parts that fit together into one system that runs.",
    "A first version, live in weeks, then grown.",
    "Many numbers become one picture of what comes next.",
  ],
  pl: [
    "Dokumenty przychodzą, są czytane i trafiają na swoje miejsce.",
    "Wchodzi pytanie, wraca odpowiedź razem ze źródłem.",
    "Elementy, które składają się w jeden działający system.",
    "Pierwsza wersja, działająca w tygodnie, potem rozwijana.",
    "Wiele liczb staje się jednym obrazem tego, co dalej.",
  ],
  de: [
    "Dokumente kommen an, werden gelesen und landen am richtigen Ort.",
    "Eine Frage geht hinein, eine Antwort kommt mit ihrer Quelle zurück.",
    "Teile, die zu einem laufenden System zusammenpassen.",
    "Eine erste Version, in Wochen live, dann ausgebaut.",
    "Viele Zahlen werden ein Bild davon, was als Nächstes kommt.",
  ],
} as const;

const hero = {
  en: { sceneNote: "" },
  pl: { sceneNote: "" },
  de: { sceneNote: "" },
} as const;


/** Strings the component tasks asked for after the first pass, plus the
 *  About page figures, which claimed 150 projects and 25 people while the
 *  home says 40+ projects and two engineers. Aligned to the checkable set. */
const followUps = {
  en: {
    "navigation.callNote": "30 minutes with an engineer, not a sales deck.",
    "timeSaved.backLabel": "back",
    "quanty.chip": "Built by Pluscode",
    "pages.about.stats.items.years": { value: "7+", label: "Years building AI and software" },
    "pages.about.stats.items.projects": { value: "40+", label: "Projects delivered" },
    "pages.about.stats.items.clients": { value: "8", label: "Industries worked in" },
    "pages.about.stats.items.team": { value: "2", label: "Engineers who do the work" },
  },
  pl: {
    "navigation.callNote": "30 minut z inżynierem, nie prezentacja sprzedażowa.",
    "timeSaved.backLabel": "z powrotem",
    "quanty.chip": "Zbudowane przez Pluscode",
    "pages.about.stats.items.years": { value: "7+", label: "Lat budowania AI i oprogramowania" },
    "pages.about.stats.items.projects": { value: "40+", label: "Zrealizowanych projektów" },
    "pages.about.stats.items.clients": { value: "8", label: "Branż, w których pracowaliśmy" },
    "pages.about.stats.items.team": { value: "2", label: "Inżynierów, którzy wykonują pracę" },
  },
  de: {
    "navigation.callNote": "30 Minuten mit einem Engineer, kein Verkaufsgespräch.",
    "timeSaved.backLabel": "zurück",
    "quanty.chip": "Gebaut von Pluscode",
    "offerings.fde.bullets.0": "Assistenten, die aus Dokumenten antworten",
    "pages.about.stats.items.years": { value: "7+", label: "Jahre KI und Software" },
    "pages.about.stats.items.projects": { value: "40+", label: "Umgesetzte Projekte" },
    "pages.about.stats.items.clients": { value: "8", label: "Branchen, in denen wir gearbeitet haben" },
    "pages.about.stats.items.team": { value: "2", label: "Engineers, die die Arbeit machen" },
  },
} as const;

/* ------------------------------------------------------------------ */

for (const l of ["en", "pl", "de"] as const) {
  const d = load(l);

  setPath(d, "clients", clients[l]);
  setPath(d, "figures", figures[l]);
  setPath(d, "quanty", quanty[l]);

  setPath(d, "offerings.exampleLabel", offeringExtras[l].exampleLabel);
  setPath(d, "offerings.stepsLabel", offeringExtras[l].stepsLabel);
  const items = (d.offerings as Dict).items as Dict[];
  offeringExtras[l].items.forEach((extra, i) => {
    if (!items[i]) throw new Error(`${l}: offerings.items[${i}] missing`);
    items[i].example = extra.example;
    items[i].steps = [...extra.steps];
  });

  const svc = (d.services as Dict).items as Dict[];
  sceneCaptions[l].forEach((caption, i) => {
    if (!svc[i]) throw new Error(`${l}: services.items[${i}] missing`);
    svc[i].caption = caption;
  });

  // The synthetic app windows are gone from the site; so is their copy.
  delPath(d, "artifacts");
  delPath(d, "hero.panelCaption");
  void hero;

  for (const [path, value] of Object.entries(followUps[l])) setPath(d, path, value);

  save(l, d);
  console.log(`${l}: ok`);
}
