/**
 * The /quanty platform page content, September 2026.
 *
 * ONE script writes `quantyPage` into en.json, pl.json and de.json so the
 * three files stay structurally identical. Run it with:
 *
 *     node --import tsx scripts/content/quanty-page.ts
 *
 * It touches the top level key `quantyPage` and nothing else. In
 * particular it does NOT touch `quanty`, which is a different, older key
 * that the services pages read, and it does not touch `home.platform`,
 * which belongs to scripts/content/home-netcompany.ts.
 *
 * WHERE THE COPY COMES FROM. Almost none of it is written here. Quanty is
 * our own product with its own live site, and the two sites should
 * describe it in the same words, so the feature names, the one line
 * claims and the six everyday jobs are taken from quanty.ai as it stands
 * on 8 September 2026, translated rather than reinvented. Nothing below
 * describes a capability the product does not have. If quanty.ai changes,
 * this file follows it; it never diverges from it and it never gets ahead
 * of it.
 *
 * THE THINGS THAT ARE NOT NEGOTIABLE:
 *
 *   - Quanty is OURS. `pluscode.ownership` and the body copy above it say
 *     Pluscode built it and still builds it. It is not a partnership, not
 *     a certification and not a reseller arrangement, and no translation
 *     may soften it into one.
 *   - The four figures in `about.facts` are checkable claims about a real
 *     product. "1 price" and "$0" are quanty.ai's own pricing shape, "EU"
 *     is its own hosting statement and "2" is the two people who build it.
 *     Do not add a figure that cannot be checked, and re-check these
 *     whenever quanty.ai's pricing or trust page changes.
 *
 * House style: one clause per line, no headline explains the next
 * section, and no em dashes anywhere, in any locale.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");

/* ------------------------------------------------------------------ *
 *  The shape. Each band of app/(frontend)/[lang]/quanty/page.tsx reads
 *  exactly one key of this object, so a band can be rewritten without
 *  touching a neighbour's copy.
 * ------------------------------------------------------------------ */
export type QuantyPageContent = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** The alt of the wordmark, which stands in for the page's h1 text. */
    logoAlt: string;
    intro: string;
    cta: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    intro: string;
    /** The marked external link out to the product itself. */
    tryIt: string;
    /** Exactly two, in the order the animation shows them. `key` maps to
     *  a real capture file in components/quanty-showcase.tsx; `alt`
     *  describes that capture, so it must stay true to the screenshot. */
    frames: { key: string; label: string; caption: string; alt: string }[];
  };
  about: {
    eyebrow: string;
    title: string;
    /** Two paragraphs, laid out as two five column cells. */
    body: string[];
    /** Four checkable figures. See the note at the top of the file. */
    facts: { key: string; figure: string; label: string }[];
  };
  work: {
    eyebrow: string;
    title: string;
    intro: string;
    /** The six everyday jobs, named by quanty.ai itself. */
    items: { key: string; name: string; body: string }[];
  };
  audience: {
    eyebrow: string;
    title: string;
    intro: string;
    /** The six trades. Deliberately the same six, and the same one line
     *  descriptions, as the home page's Platform band: this page owns its
     *  own copy of them so neither band can drift without the other. */
    items: { key: string; name: string; body: string }[];
  };
  box: {
    eyebrow: string;
    title: string;
    intro: string;
    /** The seven real parts of the product. `line` is the product's own
     *  one line claim, `body` the sentence under it. */
    items: { key: string; name: string; line: string; body: string }[];
  };
  pluscode: {
    eyebrow: string;
    title: string;
    body: string[];
    /** The disclosure. Never drop it, never soften it. */
    ownership: string;
    servicesCta: string;
    externalCta: string;
  };
  cta: { title: string; text: string; button: string };
};

/* ------------------------------------------------------------------ *
 *  EN
 * ------------------------------------------------------------------ */
const en: QuantyPageContent = {
  meta: {
    title: "Quanty, our own AI spreadsheet",
    description:
      "Quanty reads your invoices, contracts and orders into a table and shows the page every value came from. Built by Pluscode in Poznań.",
  },
  hero: {
    eyebrow: "Platform",
    logoAlt: "Quanty",
    intro:
      "Our own AI spreadsheet. Drop in documents and the sheet fills itself, with the source page beside every value.",
    cta: "Book a call",
  },
  showcase: {
    eyebrow: "The product",
    title: "What it looks like at work.",
    intro:
      "Nothing here is a mock-up. Both screens are captures of Quanty as it runs today: a sheet reading a folder of invoices, and the agent adding a column and counting what it found.",
    tryIt: "Try it at quanty.ai",
    frames: [
      {
        key: "sheet",
        label: "Invoices",
        caption:
          "Invoices read into rows. Click a value and Quanty shows the page it came from.",
        alt: "The Quanty sheet with invoices read into rows and the source page open beside a value",
      },
      {
        key: "agent",
        label: "The agent",
        caption:
          "Ask in plain words. The agent adds the column, runs it and says what it found.",
        alt: "The Quanty agent adding a delivery status column to an orders sheet and counting the overdue ones",
      },
    ],
  },
  about: {
    eyebrow: "What Quanty is",
    title:
      "A spreadsheet that reads your paperwork, so nobody has to type it in again.",
    body: [
      "Drop in a folder of invoices, contracts or orders. Quanty reads them, builds the columns, does the counting and keeps a link to the page every value came from. You check the row, not the file.",
      "It is one tool instead of several. Not a replacement for your accountant or your invoicing program, but for the spreadsheets, PDF folders and chat threads you run beside them.",
    ],
    facts: [
      {
        key: "price",
        figure: "1 price",
        label: "for the whole company, not per person",
      },
      { key: "free", figure: "$0", label: "the Free plan" },
      {
        key: "eu",
        figure: "EU",
        label: "servers in Poland, files stay in the EU",
      },
      {
        key: "team",
        figure: "2",
        label: "engineers build it and answer your e-mail",
      },
    ],
  },
  work: {
    eyebrow: "Everyday work",
    title: "The things you already do every week.",
    intro:
      "Invoices, contracts, orders, customers, complaints, hiring. Each one in a table, or on a board, that reads its own paperwork.",
    items: [
      {
        key: "invoices",
        name: "Invoices",
        body: "Amounts, due dates and the contract check fill in from your invoices.",
      },
      {
        key: "contracts",
        name: "Contracts",
        body: "End dates, notice periods and penalties from every contract. A quote next to each value.",
      },
      {
        key: "orders",
        name: "Orders",
        body: "Orders from e-mail land in a table that checks delivery against invoice.",
      },
      {
        key: "customers",
        name: "Customers",
        body: "Who ordered what and when. What they paid, what is still due.",
      },
      {
        key: "complaints",
        name: "Complaints",
        body: "A request from your form lands on a board: new, in repair, closed.",
      },
      {
        key: "hiring",
        name: "Hiring",
        body: "CVs from e-mail and your form in one table, scored against the job description.",
      },
    ],
  },
  audience: {
    eyebrow: "Built for",
    title: "Small and medium companies with more paperwork than people.",
    intro:
      "Six trades where the same folder arrives every week and somebody types it into a spreadsheet.",
    items: [
      {
        key: "transport",
        name: "Transport",
        body: "Orders and carrier invoices",
      },
      {
        key: "accounting",
        name: "Accounting",
        body: "Invoices from e-mail, ready to book",
      },
      { key: "finance", name: "Finance", body: "Who paid, fixed costs, cash" },
      {
        key: "contracts",
        name: "Contracts",
        body: "All contracts in one table",
      },
      { key: "hiring", name: "Hiring", body: "CVs in a table, scores beside" },
      { key: "property", name: "Property", body: "Tenants, rents, dates" },
    ],
  },
  box: {
    eyebrow: "What is in the box",
    title: "Seven parts, one product.",
    intro:
      "You do not buy modules and you do not roll them out. Everything below is in every plan, and the sheet is where all of it starts.",
    items: [
      {
        key: "sheets",
        name: "Sheets",
        line: "Your small ERP, described in one sentence.",
        body: "The AI reads your files, builds the columns and does the counting. You never have to ask anyone for it.",
      },
      {
        key: "chat",
        name: "Chat",
        line: "Say what to change.",
        body: "The chat sits beside every sheet. It adds columns, flags rows and does the sums.",
      },
      {
        key: "boards",
        name: "Kanban boards",
        line: "This can be your CRM.",
        body: "Or your ERP, or your ATS. A matter of settings, not a rollout: you change the stages yourself, in minutes.",
      },
      {
        key: "forms",
        name: "Forms",
        line: "Send a link. Answers fill your table.",
        body: "Put the link on your website. Every submission is a new row in the table.",
      },
      {
        key: "slides",
        name: "Presentations",
        line: "From the table straight to slides.",
        body: "Slides and charts take their numbers straight from the table. Change the table, the slides follow.",
      },
      {
        key: "agents",
        name: "Agents",
        line: "Every job gets its own agent.",
        body: "An agent is an AI helper you brief once and hand your files. Then you write to it in the chat beside a table.",
      },
      {
        key: "connect",
        name: "Quanty Connect",
        line: "Check a company without leaving the table.",
        body: "Quanty adds what the web and paid registers know about the companies in your table. Every number shows where it came from.",
      },
    ],
  },
  pluscode: {
    eyebrow: "Quanty and Pluscode",
    title: "We built it, and the same parts go into client systems.",
    body: [
      "Quanty is not a partner platform and not a certification. It is our own product, designed and built by the two engineers you would work with on a consulting project.",
      "Reading documents, answers that carry their source, approval before anything is written back: those are the parts of Quanty, and they are the parts we put into the systems we build for clients. The product is where we prove them on our own time.",
    ],
    ownership: "Quanty is a product of Pluscode Sp. z o.o., Poznań, Poland.",
    servicesCta: "What we build for clients",
    externalCta: "Try it at quanty.ai",
  },
  cta: {
    title: "Start with one folder of invoices.",
    text: "Bring a real folder to a 30 minute call. We will read it with you and say plainly whether Quanty fits or whether you need something built.",
    button: "Book a call",
  },
};

/* ------------------------------------------------------------------ *
 *  PL
 * ------------------------------------------------------------------ */
const pl: QuantyPageContent = {
  meta: {
    title: "Quanty, nasz własny arkusz z AI",
    description:
      "Quanty wczytuje faktury, umowy i zamówienia do tabeli i pokazuje stronę, z której pochodzi każda wartość. Zbudowane przez Pluscode w Poznaniu.",
  },
  hero: {
    eyebrow: "Platforma",
    logoAlt: "Quanty",
    intro:
      "Nasz własny arkusz z AI. Wrzucasz dokumenty, a tabela wypełnia się sama, ze stroną źródłową przy każdej wartości.",
    cta: "Umów rozmowę",
  },
  showcase: {
    eyebrow: "Produkt",
    title: "Tak to wygląda w pracy.",
    intro:
      "Nic tu nie jest makietą. Oba ekrany to zrzuty z Quanty, które działa dzisiaj: arkusz czytający folder faktur i agent, który dodaje kolumnę i liczy to, co znalazł.",
    tryIt: "Wypróbuj na quanty.ai",
    frames: [
      {
        key: "sheet",
        label: "Faktury",
        caption:
          "Faktury wczytane do wierszy. Klikasz wartość, a Quanty pokazuje stronę, z której pochodzi.",
        alt: "Arkusz Quanty z fakturami wczytanymi do wierszy i stroną źródłową otwartą przy wartości",
      },
      {
        key: "agent",
        label: "Agent",
        caption:
          "Piszesz zwykłym zdaniem. Agent dodaje kolumnę, uruchamia ją i mówi, co znalazł.",
        alt: "Agent Quanty dodający kolumnę statusu dostawy do arkusza zamówień i liczący opóźnione",
      },
    ],
  },
  about: {
    eyebrow: "Czym jest Quanty",
    title: "Arkusz, który czyta wasze papiery, żeby nikt nie musiał ich przepisywać.",
    body: [
      "Wrzucacie folder z fakturami, umowami albo zamówieniami. Quanty je czyta, buduje kolumny, liczy i trzyma odnośnik do strony, z której pochodzi każda wartość. Sprawdzacie wiersz, nie plik.",
      "To jedno narzędzie zamiast kilku. Nie zastąpi księgowej ani programu do faktur, ale zastąpi arkusze, foldery PDF i wątki na czacie, które prowadzicie obok nich.",
    ],
    facts: [
      {
        key: "price",
        figure: "1 cena",
        label: "za całą firmę, nie za osobę",
      },
      { key: "free", figure: "$0", label: "plan Free" },
      {
        key: "eu",
        figure: "UE",
        label: "serwery w Polsce, pliki zostają w UE",
      },
      {
        key: "team",
        figure: "2",
        label: "inżynierów buduje produkt i odpisuje na maile",
      },
    ],
  },
  work: {
    eyebrow: "Codzienna praca",
    title: "To, co i tak robicie co tydzień.",
    intro:
      "Faktury, umowy, zamówienia, klienci, reklamacje, rekrutacja. Każde w tabeli albo na tablicy, która sama czyta swoje papiery.",
    items: [
      {
        key: "invoices",
        name: "Faktury",
        body: "Kwoty, terminy i sprawdzenie z umową wypełniają się z waszych faktur.",
      },
      {
        key: "contracts",
        name: "Umowy",
        body: "Daty końca, okresy wypowiedzenia i kary z każdej umowy. Cytat przy każdej wartości.",
      },
      {
        key: "orders",
        name: "Zamówienia",
        body: "Zamówienia z maila trafiają do tabeli, która porównuje dostawę z fakturą.",
      },
      {
        key: "customers",
        name: "Klienci",
        body: "Kto co zamówił i kiedy. Co zapłacił, co zostało do zapłaty.",
      },
      {
        key: "complaints",
        name: "Reklamacje",
        body: "Zgłoszenie z formularza trafia na tablicę: nowe, w naprawie, zamknięte.",
      },
      {
        key: "hiring",
        name: "Rekrutacja",
        body: "CV z maila i z formularza w jednej tabeli, ocenione względem opisu stanowiska.",
      },
    ],
  },
  audience: {
    eyebrow: "Dla kogo",
    title: "Małe i średnie firmy, w których papierów jest więcej niż ludzi.",
    intro:
      "Sześć branż, w których co tydzień przychodzi ten sam folder, a ktoś przepisuje go do arkusza.",
    items: [
      {
        key: "transport",
        name: "Transport",
        body: "Zlecenia i faktury przewoźników",
      },
      {
        key: "accounting",
        name: "Księgowość",
        body: "Faktury z maila, gotowe do księgowania",
      },
      {
        key: "finance",
        name: "Finanse",
        body: "Kto zapłacił, koszty stałe, gotówka",
      },
      {
        key: "contracts",
        name: "Umowy",
        body: "Wszystkie umowy w jednej tabeli",
      },
      { key: "hiring", name: "Rekrutacja", body: "CV w tabeli, ocena obok" },
      {
        key: "property",
        name: "Nieruchomości",
        body: "Najemcy, czynsze, terminy",
      },
    ],
  },
  box: {
    eyebrow: "Co jest w środku",
    title: "Siedem części, jeden produkt.",
    intro:
      "Nie kupujecie modułów i nie wdrażacie ich osobno. Wszystko poniżej jest w każdym planie, a arkusz jest miejscem, od którego się zaczyna.",
    items: [
      {
        key: "sheets",
        name: "Arkusze",
        line: "Wasz mały ERP, opisany jednym zdaniem.",
        body: "AI czyta wasze pliki, buduje kolumny i liczy. Nigdy nie musicie nikogo o to prosić.",
      },
      {
        key: "chat",
        name: "Czat",
        line: "Powiedzcie, co zmienić.",
        body: "Czat stoi obok każdego arkusza. Dodaje kolumny, oznacza wiersze i liczy sumy.",
      },
      {
        key: "boards",
        name: "Tablice Kanban",
        line: "To może być wasz CRM.",
        body: "Albo ERP, albo ATS. Kwestia ustawień, nie wdrożenia: etapy zmieniacie sami, w kilka minut.",
      },
      {
        key: "forms",
        name: "Formularze",
        line: "Wyślijcie link. Odpowiedzi wypełniają tabelę.",
        body: "Link wstawiacie na swoją stronę. Każde zgłoszenie to nowy wiersz w tabeli.",
      },
      {
        key: "slides",
        name: "Prezentacje",
        line: "Z tabeli prosto na slajdy.",
        body: "Slajdy i wykresy biorą liczby wprost z tabeli. Zmieniacie tabelę, slajdy idą za nią.",
      },
      {
        key: "agents",
        name: "Agenci",
        line: "Każde zadanie dostaje swojego agenta.",
        body: "Agent to pomocnik AI, którego raz instruujecie i któremu dajecie pliki. Potem piszecie do niego na czacie obok tabeli.",
      },
      {
        key: "connect",
        name: "Quanty Connect",
        line: "Sprawdźcie firmę bez wychodzenia z tabeli.",
        body: "Quanty dodaje to, co o firmach z waszej tabeli wiedzą internet i płatne rejestry. Przy każdej liczbie widać, skąd pochodzi.",
      },
    ],
  },
  pluscode: {
    eyebrow: "Quanty i Pluscode",
    title: "Zbudowaliśmy go sami, a te same części trafiają do systemów klientów.",
    body: [
      "Quanty nie jest platformą partnera ani certyfikatem. To nasz własny produkt, zaprojektowany i zbudowany przez tych samych dwóch inżynierów, z którymi pracowalibyście przy projekcie.",
      "Czytanie dokumentów, odpowiedzi z podanym źródłem, akceptacja zanim cokolwiek zostanie zapisane: to są części Quanty i dokładnie to wkładamy w systemy, które budujemy dla klientów. Produkt jest miejscem, w którym sprawdzamy je na własnym czasie.",
    ],
    ownership: "Quanty jest produktem Pluscode Sp. z o.o., Poznań, Polska.",
    servicesCta: "Co budujemy dla klientów",
    externalCta: "Wypróbuj na quanty.ai",
  },
  cta: {
    title: "Zacznijcie od jednego folderu faktur.",
    text: "Przynieście prawdziwy folder na 30 minut rozmowy. Przeczytamy go razem z wami i powiemy wprost, czy Quanty pasuje, czy trzeba zbudować coś innego.",
    button: "Umów rozmowę",
  },
};

/* ------------------------------------------------------------------ *
 *  DE
 * ------------------------------------------------------------------ */
const de: QuantyPageContent = {
  meta: {
    title: "Quanty, unser eigenes KI-Tabellenblatt",
    description:
      "Quanty liest Rechnungen, Verträge und Bestellungen in eine Tabelle und zeigt die Seite, aus der jeder Wert stammt. Gebaut von Pluscode in Poznań.",
  },
  hero: {
    eyebrow: "Plattform",
    logoAlt: "Quanty",
    intro:
      "Unser eigenes KI-Tabellenblatt. Dokumente hineinlegen, und die Tabelle füllt sich selbst, mit der Quellseite neben jedem Wert.",
    cta: "Gespräch buchen",
  },
  showcase: {
    eyebrow: "Das Produkt",
    title: "So sieht es bei der Arbeit aus.",
    intro:
      "Nichts davon ist ein Mock-up. Beide Ansichten sind Aufnahmen von Quanty, wie es heute läuft: ein Blatt, das einen Ordner voller Rechnungen liest, und der Agent, der eine Spalte ergänzt und zählt, was er gefunden hat.",
    tryIt: "Auf quanty.ai ausprobieren",
    frames: [
      {
        key: "sheet",
        label: "Rechnungen",
        caption:
          "Rechnungen als Zeilen eingelesen. Ein Klick auf einen Wert zeigt die Seite, aus der er stammt.",
        alt: "Die Quanty-Tabelle mit eingelesenen Rechnungen und der geöffneten Quellseite neben einem Wert",
      },
      {
        key: "agent",
        label: "Der Agent",
        caption:
          "In normalen Worten sagen, was fehlt. Der Agent legt die Spalte an, führt sie aus und sagt, was er gefunden hat.",
        alt: "Der Quanty-Agent ergänzt eine Spalte für den Lieferstatus in einem Bestellblatt und zählt die überfälligen Posten",
      },
    ],
  },
  about: {
    eyebrow: "Was Quanty ist",
    title:
      "Ein Tabellenblatt, das Ihre Unterlagen liest, damit sie niemand mehr abtippt.",
    body: [
      "Legen Sie einen Ordner mit Rechnungen, Verträgen oder Bestellungen hinein. Quanty liest sie, baut die Spalten, rechnet und behält den Verweis auf die Seite, aus der jeder Wert stammt. Sie prüfen die Zeile, nicht die Datei.",
      "Ein Werkzeug statt mehrerer. Es ersetzt weder Ihre Buchhaltung noch Ihr Rechnungsprogramm, aber die Tabellen, PDF-Ordner und Chat-Verläufe, die Sie daneben führen.",
    ],
    facts: [
      {
        key: "price",
        figure: "1 Preis",
        label: "für das ganze Unternehmen, nicht pro Person",
      },
      { key: "free", figure: "$0", label: "der Free-Tarif" },
      {
        key: "eu",
        figure: "EU",
        label: "Server in Polen, Dateien bleiben in der EU",
      },
      {
        key: "team",
        figure: "2",
        label: "Ingenieure bauen es und beantworten Ihre E-Mails",
      },
    ],
  },
  work: {
    eyebrow: "Alltagsarbeit",
    title: "Die Dinge, die Sie ohnehin jede Woche tun.",
    intro:
      "Rechnungen, Verträge, Bestellungen, Kunden, Reklamationen, Recruiting. Jedes in einer Tabelle oder auf einem Board, das seine eigenen Unterlagen liest.",
    items: [
      {
        key: "invoices",
        name: "Rechnungen",
        body: "Beträge, Fälligkeiten und der Abgleich mit dem Vertrag füllen sich aus Ihren Rechnungen.",
      },
      {
        key: "contracts",
        name: "Verträge",
        body: "Enddaten, Kündigungsfristen und Vertragsstrafen aus jedem Vertrag. Ein Zitat neben jedem Wert.",
      },
      {
        key: "orders",
        name: "Bestellungen",
        body: "Bestellungen aus der E-Mail landen in einer Tabelle, die Lieferung und Rechnung abgleicht.",
      },
      {
        key: "customers",
        name: "Kunden",
        body: "Wer wann was bestellt hat. Was bezahlt ist und was offen bleibt.",
      },
      {
        key: "complaints",
        name: "Reklamationen",
        body: "Eine Meldung aus Ihrem Formular landet auf einem Board: neu, in Reparatur, geschlossen.",
      },
      {
        key: "hiring",
        name: "Recruiting",
        body: "Lebensläufe aus der E-Mail und aus Ihrem Formular in einer Tabelle, bewertet an der Stellenbeschreibung.",
      },
    ],
  },
  audience: {
    eyebrow: "Gebaut für",
    title: "Kleine und mittlere Unternehmen mit mehr Papier als Personal.",
    intro:
      "Sechs Branchen, in denen jede Woche derselbe Ordner ankommt und ihn jemand in eine Tabelle abtippt.",
    items: [
      {
        key: "transport",
        name: "Transport",
        body: "Aufträge und Speditionsrechnungen",
      },
      {
        key: "accounting",
        name: "Buchhaltung",
        body: "Rechnungen aus der Mail, buchungsfertig",
      },
      {
        key: "finance",
        name: "Finanzen",
        body: "Wer gezahlt hat, Fixkosten, Liquidität",
      },
      {
        key: "contracts",
        name: "Verträge",
        body: "Alle Verträge in einer Tabelle",
      },
      {
        key: "hiring",
        name: "Recruiting",
        body: "Lebensläufe als Tabelle, Bewertung daneben",
      },
      { key: "property", name: "Immobilien", body: "Mieter, Mieten, Fristen" },
    ],
  },
  box: {
    eyebrow: "Was drin ist",
    title: "Sieben Teile, ein Produkt.",
    intro:
      "Sie kaufen keine Module und Sie rollen keine aus. Alles unten steckt in jedem Tarif, und das Blatt ist der Anfang von allem.",
    items: [
      {
        key: "sheets",
        name: "Blätter",
        line: "Ihr kleines ERP, in einem Satz beschrieben.",
        body: "Die KI liest Ihre Dateien, baut die Spalten und rechnet. Sie müssen nie jemanden darum bitten.",
      },
      {
        key: "chat",
        name: "Chat",
        line: "Sagen Sie, was sich ändern soll.",
        body: "Der Chat steht neben jedem Blatt. Er ergänzt Spalten, markiert Zeilen und bildet die Summen.",
      },
      {
        key: "boards",
        name: "Kanban-Boards",
        line: "Das kann Ihr CRM sein.",
        body: "Oder Ihr ERP, oder Ihr ATS. Eine Frage der Einstellungen, kein Rollout: die Stufen ändern Sie selbst, in Minuten.",
      },
      {
        key: "forms",
        name: "Formulare",
        line: "Einen Link senden. Antworten füllen die Tabelle.",
        body: "Den Link stellen Sie auf Ihre Website. Jede Einsendung ist eine neue Zeile in der Tabelle.",
      },
      {
        key: "slides",
        name: "Präsentationen",
        line: "Aus der Tabelle direkt auf die Folien.",
        body: "Folien und Diagramme nehmen ihre Zahlen direkt aus der Tabelle. Ändern Sie die Tabelle, folgen die Folien.",
      },
      {
        key: "agents",
        name: "Agenten",
        line: "Jede Aufgabe bekommt ihren Agenten.",
        body: "Ein Agent ist ein KI-Helfer, den Sie einmal einweisen und dem Sie Ihre Dateien geben. Danach schreiben Sie ihm im Chat neben der Tabelle.",
      },
      {
        key: "connect",
        name: "Quanty Connect",
        line: "Eine Firma prüfen, ohne die Tabelle zu verlassen.",
        body: "Quanty ergänzt, was das Web und kostenpflichtige Register über die Firmen in Ihrer Tabelle wissen. Bei jeder Zahl steht, woher sie kommt.",
      },
    ],
  },
  pluscode: {
    eyebrow: "Quanty und Pluscode",
    title: "Wir haben es gebaut, und dieselben Teile gehen in Kundensysteme.",
    body: [
      "Quanty ist keine Partnerplattform und keine Zertifizierung. Es ist unser eigenes Produkt, entworfen und gebaut von denselben zwei Ingenieuren, mit denen Sie in einem Projekt arbeiten würden.",
      "Dokumente lesen, Antworten mit erhaltener Quelle, Freigabe bevor etwas zurückgeschrieben wird: das sind die Teile von Quanty, und genau die setzen wir in den Systemen ein, die wir für Kunden bauen. Das Produkt ist der Ort, an dem wir sie auf eigene Rechnung beweisen.",
    ],
    ownership: "Quanty ist ein Produkt der Pluscode Sp. z o.o., Poznań, Polen.",
    servicesCta: "Was wir für Kunden bauen",
    externalCta: "Auf quanty.ai ausprobieren",
  },
  cta: {
    title: "Beginnen Sie mit einem Ordner voller Rechnungen.",
    text: "Bringen Sie einen echten Ordner in ein 30 Minuten langes Gespräch mit. Wir lesen ihn gemeinsam und sagen Ihnen offen, ob Quanty passt oder ob Sie etwas Gebautes brauchen.",
    button: "Gespräch buchen",
  },
};

/* ------------------------------------------------------------------ *
 *  Write. `quantyPage` replaces whatever was there; every other top
 *  level key is left exactly as it is, so the home page, the service
 *  pages and the older `quanty` key keep their copy.
 * ------------------------------------------------------------------ */
const byLocale: Record<string, QuantyPageContent> = { en, pl, de };

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
      `dictionaries/${locale}.json would drift: the \`quantyPage\` shape does not match en.`,
    );
  }
}

/** The house rule, enforced rather than remembered: no em dashes, in any
 *  language, anywhere in shipped copy. En dashes go too, for the same
 *  reason: they read as the same typographic tic in running prose. */
for (const [locale, content] of Object.entries(byLocale)) {
  const dashes = JSON.stringify(content).match(/[–—]/g);
  if (dashes) {
    throw new Error(
      `dictionaries/${locale}.json would ship ${dashes.length} dash(es) that are not hyphens in \`quantyPage\`.`,
    );
  }
}

for (const [locale, content] of Object.entries(byLocale)) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = JSON.parse(readFileSync(path, "utf8")) as Dict;
  dict.quantyPage = content;
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(`wrote quantyPage -> dictionaries/${locale}.json`);
}
