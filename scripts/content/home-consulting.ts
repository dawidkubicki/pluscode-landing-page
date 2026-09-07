/**
 * The consulting half of the home page, plus the Quanty band.
 *
 * Run it AFTER scripts/content/home-netcompany.ts, which writes the `home`
 * key this one extends:
 *
 *     node --import tsx scripts/content/home-netcompany.ts
 *     node --import tsx scripts/content/home-consulting.ts
 *
 * WHY A SECOND SCRIPT. The first one is the page's skeleton: hero, index,
 * clients, cases, stories, people, map, menu. This one is the substance a
 * visitor is actually shopping for, and it changes on a different clock. The
 * two are kept apart so a copy edit to the services list is a small diff in a
 * readable file rather than a needle in nine hundred lines.
 *
 * It MERGES into `home` rather than replacing it, so running the pair in
 * order is idempotent and running this one alone still works.
 *
 * The `platform` band is rewritten here rather than in the first script
 * because its copy is not ours to invent: it is taken from quanty.ai, our own
 * product, so the two sites say the same thing about it in all three
 * languages. See the note on the band below.
 *
 * House style: one sentence per line of body copy, no em dashes, no jargon
 * the buyer would have to look up.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");

export type ConsultingContent = {
  /** What we do. Five engagements, the substance of the consultancy. */
  services: {
    title: string;
    intro: string;
    cta: string;
    items: {
      key: string;
      num: string;
      title: string;
      body: string;
      tags: string;
    }[];
  };
  /** Four ways to start, each with an audience, an example and deliverables. */
  offerings: {
    title: string;
    intro: string;
    cta: string;
    forLabel: string;
    exampleLabel: string;
    deliverablesLabel: string;
    items: {
      key: string;
      title: string;
      audience: string;
      example: string;
      deliverables: string[];
    }[];
  };
  /** How we work: the rules the work follows, which this buyer asks about. */
  approach: {
    title: string;
    intro: string;
    items: { key: string; title: string; body: string }[];
  };
  /** Quanty. Copy and logo taken from quanty.ai, our own product. */
  platform: {
    eyebrow: string;
    title: string;
    logoAlt: string;
    tagline: string;
    intro: string;
    cta: string;
    note: string;
    forLabel: string;
    items: { key: string; name: string; body: string }[];
    industries: { key: string; name: string; body: string }[];
  };
};

/* ------------------------------------------------------------------ *
 *  EN
 * ------------------------------------------------------------------ */
const en: ConsultingContent = {
  services: {
    title: "What we do",
    intro: "Engineers, not slide decks. Each one takes hours off somebody's week.",
    cta: "All services",
    items: [
      {
        key: "paperwork",
        num: "01",
        title: "Paperwork automation",
        body: "Invoices, orders and forms are read and filed without anyone retyping them.",
        tags: "Invoices, delivery notes, contracts, straight into your system",
      },
      {
        key: "answers",
        num: "02",
        title: "Answers from your documents",
        body: "Your team asks a question and gets the answer, with the source page attached.",
        tags: "Your files, your wording, answers with a source",
      },
      {
        key: "software",
        num: "03",
        title: "Software development",
        body: "Custom systems built end to end by the people who will run them.",
        tags: "Web, mobile, fits the systems you already use",
      },
      {
        key: "mvp",
        num: "04",
        title: "MVP development",
        body: "A first version live in weeks, then grown on what real users do with it.",
        tags: "Scope, build, launch, measure",
      },
      {
        key: "forecasting",
        num: "05",
        title: "Forecasting and reporting",
        body: "Numbers from every system in one place, and a view of the months ahead.",
        tags: "One picture, updated as the data arrives",
      },
    ],
  },
  offerings: {
    title: "Four ways to start",
    intro: "Pick the one that matches where you are.",
    cta: "Book a call",
    forLabel: "For",
    exampleLabel: "For example",
    deliverablesLabel: "You get",
    items: [
      {
        key: "audit",
        title: "Process audit",
        audience: "Companies who know something is slow but not what to fix",
        example:
          "Your accounting team retypes 300 invoices a month. We count the hours and price what it takes to stop.",
        deliverables: [
          "A map of the process as it runs today",
          "The hours and the cost of doing it by hand",
          "A costed shortlist of what to fix first",
        ],
      },
      {
        key: "mvp",
        title: "Build the first version",
        audience: "Teams with an idea that needs to become real",
        example:
          "A portal where your customers check their order status without calling you.",
        deliverables: [
          "A working product your team can use",
          "Live with real users, not a demo",
          "A clear plan for what comes next",
        ],
      },
      {
        key: "ai",
        title: "AI in daily work",
        audience: "Companies putting AI into the work people already do",
        example:
          "Incoming email is read, answered where it is routine, and passed to a person where it is not.",
        deliverables: [
          "A system running on your own data",
          "Checks and approvals wherever a person is needed",
          "Handover, training and support",
        ],
      },
      {
        key: "workshop",
        title: "Workshop",
        audience: "Leadership and the people doing the work",
        example:
          "Half a day with your managers on what AI can do for your company, in plain language.",
        deliverables: [
          "A shared picture of what is worth doing",
          "The ideas ranked by effort and payback",
          "A written summary you can act on",
        ],
      },
    ],
  },
  approach: {
    title: "How we work",
    intro:
      "A Polish company working across Europe. Before we build, we sit with your team and learn the job.",
    items: [
      {
        key: "hosting",
        title: "EU hosting by default",
        body: "EU regions unless you agree otherwise, with a GDPR processing agreement.",
      },
      {
        key: "aiact",
        title: "Built for the EU AI Act",
        body: "We work out your risk tier before anything is designed, not after it is built.",
      },
      {
        key: "rules",
        title: "We learn your industry's rules",
        body: "Retail, banking, healthcare, logistics. We read them before writing code.",
      },
    ],
  },
  platform: {
    eyebrow: "Platform",
    title: "Quanty",
    logoAlt: "Quanty",
    tagline: "Drop in documents. The sheet fills itself.",
    intro:
      "Quanty reads your invoices, contracts and orders, fills the table and shows the page every value came from. We build it, and the same parts go into client systems.",
    cta: "See Quanty",
    note: "Quanty is a product of Pluscode Sp. z o.o.",
    forLabel: "Built for",
    items: [
      {
        key: "reads",
        name: "It reads your files",
        body: "The AI reads your documents, builds the columns and does the counting. You never have to ask anyone for it.",
      },
      {
        key: "chat",
        name: "Say what to change",
        body: "The chat sits beside every sheet. It adds columns, flags rows and does the sums.",
      },
      {
        key: "shape",
        name: "CRM, ERP or ATS",
        body: "A matter of settings, not a rollout. You change the stages yourself, in minutes.",
      },
      {
        key: "slides",
        name: "Straight to slides",
        body: "Slides and charts take their numbers from the table. Change the table and the slides follow.",
      },
    ],
    industries: [
      { key: "transport", name: "Transport", body: "Orders and carrier invoices" },
      { key: "accounting", name: "Accounting", body: "Invoices from email, ready to book" },
      { key: "finance", name: "Finance", body: "Who paid, fixed costs, cash" },
      { key: "contracts", name: "Contracts", body: "All contracts in one table" },
      { key: "hiring", name: "Hiring", body: "CVs in a table, scores beside" },
      { key: "property", name: "Property", body: "Tenants, rents, dates" },
    ],
  },
};

/* ------------------------------------------------------------------ *
 *  PL
 * ------------------------------------------------------------------ */
const pl: ConsultingContent = {
  services: {
    title: "Co robimy",
    intro: "Inżynierowie, nie prezentacje. Każda z tych rzeczy zdejmuje godziny z czyjegoś tygodnia.",
    cta: "Wszystkie usługi",
    items: [
      {
        key: "paperwork",
        num: "01",
        title: "Automatyzacja papierologii",
        body: "Faktury, zamówienia i formularze zostają odczytane i opisane bez przepisywania ręcznie.",
        tags: "Faktury, listy przewozowe, umowy, prosto do Twojego systemu",
      },
      {
        key: "answers",
        num: "02",
        title: "Odpowiedzi z Twoich dokumentów",
        body: "Zespół zadaje pytanie i dostaje odpowiedź razem ze stroną źródłową.",
        tags: "Twoje pliki, Twoje słownictwo, odpowiedzi ze źródłem",
      },
      {
        key: "software",
        num: "03",
        title: "Tworzenie oprogramowania",
        body: "Systemy budowane od początku do końca przez ludzi, którzy potem je utrzymują.",
        tags: "Web, mobile, dopasowane do systemów, które już macie",
      },
      {
        key: "mvp",
        num: "04",
        title: "Rozwój MVP",
        body: "Pierwsza wersja na żywo w kilka tygodni, potem rozwijana na podstawie tego, co robią użytkownicy.",
        tags: "Zakres, budowa, wdrożenie, pomiar",
      },
      {
        key: "forecasting",
        num: "05",
        title: "Prognozy i raporty",
        body: "Liczby ze wszystkich systemów w jednym miejscu i widok najbliższych miesięcy.",
        tags: "Jeden obraz, aktualizowany wraz z danymi",
      },
    ],
  },
  offerings: {
    title: "Cztery sposoby, żeby zacząć",
    intro: "Wybierz ten, który pasuje do miejsca, w którym jesteście.",
    cta: "Umów rozmowę",
    forLabel: "Dla kogo",
    exampleLabel: "Na przykład",
    deliverablesLabel: "Co dostajecie",
    items: [
      {
        key: "audit",
        title: "Audyt procesu",
        audience: "Firm, które wiedzą, że coś idzie wolno, ale nie wiedzą co naprawić",
        example:
          "Księgowość przepisuje 300 faktur miesięcznie. Liczymy godziny i wyceniamy, ile kosztuje to zatrzymać.",
        deliverables: [
          "Mapa procesu takiego, jaki jest dzisiaj",
          "Godziny i koszt robienia tego ręcznie",
          "Wyceniona lista tego, co naprawić najpierw",
        ],
      },
      {
        key: "mvp",
        title: "Pierwsza wersja produktu",
        audience: "Zespołów z pomysłem, który ma stać się czymś realnym",
        example:
          "Portal, w którym klienci sprawdzają status zamówienia bez dzwonienia do Was.",
        deliverables: [
          "Działający produkt, z którego korzysta zespół",
          "Wdrożony u prawdziwych użytkowników, nie demo",
          "Jasny plan tego, co dalej",
        ],
      },
      {
        key: "ai",
        title: "AI w codziennej pracy",
        audience: "Firm, które wprowadzają AI do pracy, którą ludzie już wykonują",
        example:
          "Przychodzące maile są czytane, rutynowe odpowiadane, a reszta trafia do człowieka.",
        deliverables: [
          "System działający na Waszych danych",
          "Kontrole i akceptacje wszędzie tam, gdzie potrzebny jest człowiek",
          "Przekazanie, szkolenie i wsparcie",
        ],
      },
      {
        key: "workshop",
        title: "Warsztat",
        audience: "Zarządu i ludzi, którzy wykonują tę pracę",
        example:
          "Pół dnia z Waszymi menedżerami o tym, co AI może zrobić dla firmy, prostym językiem.",
        deliverables: [
          "Wspólny obraz tego, co warto zrobić",
          "Pomysły uszeregowane według nakładu i zwrotu",
          "Pisemne podsumowanie, na którym można działać",
        ],
      },
    ],
  },
  approach: {
    title: "Jak pracujemy",
    intro:
      "Polska firma pracująca w całej Europie. Zanim zaczniemy budować, siadamy z Waszym zespołem i uczymy się tej pracy.",
    items: [
      {
        key: "hosting",
        title: "Hosting w UE domyślnie",
        body: "Regiony UE, chyba że ustalimy inaczej, wraz z umową powierzenia danych.",
      },
      {
        key: "aiact",
        title: "Zgodnie z AI Act",
        body: "Poziom ryzyka ustalamy przed projektowaniem, nie po wdrożeniu.",
      },
      {
        key: "rules",
        title: "Uczymy się reguł Waszej branży",
        body: "Handel, bankowość, ochrona zdrowia, logistyka. Czytamy je, zanim napiszemy kod.",
      },
    ],
  },
  platform: {
    eyebrow: "Platforma",
    title: "Quanty",
    logoAlt: "Quanty",
    tagline: "Wrzuć dokumenty. Arkusz wypełni się sam.",
    intro:
      "Quanty czyta faktury, umowy i zamówienia, wpisuje wartości do tabeli i przy każdej pokazuje stronę, z której pochodzi. Budujemy go my, a te same części trafiają do systemów klientów.",
    cta: "Zobacz Quanty",
    note: "Quanty jest produktem Pluscode Sp. z o.o.",
    forLabel: "Zbudowane dla",
    items: [
      {
        key: "reads",
        name: "Czyta Wasze pliki",
        body: "AI czyta dokumenty, buduje kolumny i liczy sama. Nie trzeba nikogo o to prosić.",
      },
      {
        key: "chat",
        name: "Powiedz, co zmienić",
        body: "Czat jest obok każdej tabeli. Dodaje kolumny, oznacza wiersze i liczy sumy.",
      },
      {
        key: "shape",
        name: "CRM, ERP albo ATS",
        body: "Kwestia ustawień, nie wdrożenia. Etapy zmieniacie sami, w kilka minut.",
      },
      {
        key: "slides",
        name: "Od razu prezentacja",
        body: "Slajdy i wykresy biorą liczby prosto z tabeli. Zmieniasz tabelę, zmieniają się slajdy.",
      },
    ],
    industries: [
      { key: "transport", name: "Transport", body: "Zlecenia i faktury przewoźników" },
      { key: "accounting", name: "Księgowość", body: "Faktury z maila, gotowe do księgowania" },
      { key: "finance", name: "Finanse", body: "Kto zapłacił, koszty stałe, gotówka" },
      { key: "contracts", name: "Umowy", body: "Wszystkie umowy w jednej tabeli" },
      { key: "hiring", name: "Rekrutacja", body: "CV w tabeli, ocena obok" },
      { key: "property", name: "Nieruchomości", body: "Najemcy, czynsze, terminy" },
    ],
  },
};

/* ------------------------------------------------------------------ *
 *  DE
 * ------------------------------------------------------------------ */
const de: ConsultingContent = {
  services: {
    title: "Was wir tun",
    intro: "Ingenieure, keine Foliensätze. Jedes davon nimmt Stunden aus jemandes Woche.",
    cta: "Alle Leistungen",
    items: [
      {
        key: "paperwork",
        num: "01",
        title: "Automatisierte Sachbearbeitung",
        body: "Rechnungen, Bestellungen und Formulare werden gelesen und abgelegt, ohne dass jemand sie abtippt.",
        tags: "Rechnungen, Lieferscheine, Verträge, direkt in Ihr System",
      },
      {
        key: "answers",
        num: "02",
        title: "Antworten aus Ihren Dokumenten",
        body: "Ihr Team stellt eine Frage und bekommt die Antwort, mit der Quellseite dazu.",
        tags: "Ihre Dateien, Ihre Begriffe, Antworten mit Quelle",
      },
      {
        key: "software",
        num: "03",
        title: "Softwareentwicklung",
        body: "Systeme, von Anfang bis Ende gebaut von den Leuten, die sie danach betreiben.",
        tags: "Web, Mobile, passend zu Ihren bestehenden Systemen",
      },
      {
        key: "mvp",
        num: "04",
        title: "MVP-Entwicklung",
        body: "Eine erste Version in Wochen live, danach gewachsen an dem, was echte Nutzer tun.",
        tags: "Umfang, Bau, Launch, Messung",
      },
      {
        key: "forecasting",
        num: "05",
        title: "Prognose und Reporting",
        body: "Zahlen aus allen Systemen an einem Ort, und ein Blick auf die kommenden Monate.",
        tags: "Ein Bild, aktualisiert mit den Daten",
      },
    ],
  },
  offerings: {
    title: "Vier Wege zu beginnen",
    intro: "Nehmen Sie den, der zu Ihrem Stand passt.",
    cta: "Gespräch buchen",
    forLabel: "Für wen",
    exampleLabel: "Zum Beispiel",
    deliverablesLabel: "Sie bekommen",
    items: [
      {
        key: "audit",
        title: "Prozessaudit",
        audience: "Unternehmen, die wissen, dass etwas langsam ist, aber nicht was",
        example:
          "Ihre Buchhaltung tippt 300 Rechnungen im Monat ab. Wir zählen die Stunden und beziffern, was es kostet, damit aufzuhören.",
        deliverables: [
          "Eine Karte des Prozesses, wie er heute läuft",
          "Die Stunden und die Kosten der Handarbeit",
          "Eine bezifferte Liste dessen, was zuerst drankommt",
        ],
      },
      {
        key: "mvp",
        title: "Die erste Version bauen",
        audience: "Teams mit einer Idee, die real werden muss",
        example:
          "Ein Portal, in dem Ihre Kunden den Auftragsstatus sehen, ohne anzurufen.",
        deliverables: [
          "Ein laufendes Produkt, das Ihr Team nutzt",
          "Live bei echten Nutzern, keine Demo",
          "Ein klarer Plan für das, was folgt",
        ],
      },
      {
        key: "ai",
        title: "KI in der täglichen Arbeit",
        audience: "Unternehmen, die KI in die Arbeit bringen, die ohnehin getan wird",
        example:
          "Eingehende E-Mails werden gelesen, im Routinefall beantwortet und sonst an eine Person übergeben.",
        deliverables: [
          "Ein System, das auf Ihren eigenen Daten läuft",
          "Prüfungen und Freigaben überall dort, wo ein Mensch nötig ist",
          "Übergabe, Schulung und Support",
        ],
      },
      {
        key: "workshop",
        title: "Workshop",
        audience: "Führung und die Leute, die die Arbeit machen",
        example:
          "Ein halber Tag mit Ihren Führungskräften darüber, was KI für Ihr Unternehmen tun kann, in klarer Sprache.",
        deliverables: [
          "Ein gemeinsames Bild davon, was sich lohnt",
          "Die Ideen sortiert nach Aufwand und Ertrag",
          "Eine schriftliche Zusammenfassung zum Handeln",
        ],
      },
    ],
  },
  approach: {
    title: "Wie wir arbeiten",
    intro:
      "Ein polnisches Unternehmen, das in ganz Europa arbeitet. Bevor wir bauen, sitzen wir bei Ihrem Team und lernen die Arbeit.",
    items: [
      {
        key: "hosting",
        title: "EU-Hosting als Standard",
        body: "EU-Regionen, sofern nicht anders vereinbart, mit Auftragsverarbeitungsvertrag.",
      },
      {
        key: "aiact",
        title: "Auf die KI-Verordnung ausgelegt",
        body: "Wir klären Ihre Risikostufe, bevor etwas entworfen wird, nicht danach.",
      },
      {
        key: "rules",
        title: "Wir lernen die Regeln Ihrer Branche",
        body: "Handel, Banken, Gesundheit, Logistik. Wir lesen sie, bevor wir Code schreiben.",
      },
    ],
  },
  platform: {
    eyebrow: "Plattform",
    title: "Quanty",
    logoAlt: "Quanty",
    tagline: "Dokumente rein. Die Tabelle füllt sich selbst.",
    intro:
      "Quanty liest Ihre Rechnungen, Verträge und Bestellungen, füllt die Tabelle und zeigt die Seite, aus der jeder Wert stammt. Wir bauen es, und dieselben Teile stecken in Kundensystemen.",
    cta: "Quanty ansehen",
    note: "Quanty ist ein Produkt der Pluscode Sp. z o.o.",
    forLabel: "Gebaut für",
    items: [
      {
        key: "reads",
        name: "Es liest Ihre Dateien",
        body: "Die KI liest Ihre Dokumente, baut die Spalten und rechnet selbst. Sie müssen niemanden darum bitten.",
      },
      {
        key: "chat",
        name: "Sagen Sie, was sich ändern soll",
        body: "Der Chat sitzt neben jeder Tabelle. Er fügt Spalten hinzu, markiert Zeilen und rechnet Summen.",
      },
      {
        key: "shape",
        name: "CRM, ERP oder ATS",
        body: "Eine Frage der Einstellungen, nicht der Einführung. Die Phasen ändern Sie selbst, in Minuten.",
      },
      {
        key: "slides",
        name: "Direkt zu Folien",
        body: "Folien und Diagramme nehmen ihre Zahlen aus der Tabelle. Ändern Sie die Tabelle, folgen die Folien.",
      },
    ],
    industries: [
      { key: "transport", name: "Transport", body: "Aufträge und Speditionsrechnungen" },
      { key: "accounting", name: "Buchhaltung", body: "Rechnungen aus der Mail, buchungsfertig" },
      { key: "finance", name: "Finanzen", body: "Wer gezahlt hat, Fixkosten, Liquidität" },
      { key: "contracts", name: "Verträge", body: "Alle Verträge in einer Tabelle" },
      { key: "hiring", name: "Recruiting", body: "Lebensläufe als Tabelle, Bewertung daneben" },
      { key: "property", name: "Immobilien", body: "Mieter, Mieten, Fristen" },
    ],
  },
};

/* ------------------------------------------------------------------ *
 *  Write. Merges into `home`; every other key is left alone.
 * ------------------------------------------------------------------ */
const byLocale: Record<string, ConsultingContent> = { en, pl, de };

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
  if (JSON.stringify(shapeOf(content)) !== reference) {
    throw new Error(
      `dictionaries/${locale}.json would drift: the consulting shape does not match en.`,
    );
  }
}

for (const [locale, content] of Object.entries(byLocale)) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = JSON.parse(readFileSync(path, "utf8")) as Dict;
  const home = (dict.home ?? {}) as Dict;
  if (!home.hero) {
    throw new Error(
      `dictionaries/${locale}.json has no \`home.hero\`. Run home-netcompany.ts first.`,
    );
  }
  dict.home = { ...home, ...content };
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(`merged services, offerings, approach, platform -> ${locale}.json`);
}
