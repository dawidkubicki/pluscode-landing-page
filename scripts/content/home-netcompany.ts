/**
 * The home page content, September 2026 rebuild.
 *
 * ONE script writes `home` into en.json, pl.json and de.json so the three
 * files stay structurally identical. Run it with:
 *
 *     node --import tsx scripts/content/home-netcompany.ts
 *
 * House style, and the reason the copy is this short: the reference design
 * carries meaning with size and space, not with sentences. Every headline is
 * a noun phrase or one short clause, every body line is one sentence, and
 * nothing here explains what the next section is about. If a line needs a
 * comma splice to survive, it is too long for this page.
 *
 * No em dashes anywhere, in any locale.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");

/* ------------------------------------------------------------------ *
 *  The shape. Every band on the home page reads exactly one key of this
 *  object and nothing else, so a band can be rewritten without touching
 *  a neighbour's copy.
 * ------------------------------------------------------------------ */
export type HomeContent = {
  hero: {
    headline: string;
    subline: string;
    cta: string;
    scroll: string;
  };
  latest: {
    title: string;
    intro: string;
    cta: string;
    readMore: string;
    items: {
      key: string;
      tag: string;
      title: string;
      body: string;
      href: string;
      /** A real picture beside the open item: a product screenshot, an
       *  insight cover or a case field. Never a stock photograph. */
      image: string;
      alt: string;
    }[];
  };
  clients: {
    title: string;
    items: { key: string; name: string; what: string }[];
  };
  platform: {
    eyebrow: string;
    title: string;
    intro: string;
    cta: string;
    note: string;
    items: { key: string; name: string; body: string }[];
  };
  cases: {
    title: string;
    intro: string;
    cta: string;
    items: {
      key: string;
      caption: string;
      title: string;
      image: string;
      alt: string;
      href: string;
    }[];
  };
  stories: {
    title: string;
    intro: string;
    cta: string;
    items: {
      key: string;
      caption: string;
      title: string;
      image: string;
      alt: string;
      href: string;
    }[];
  };
  founders: {
    title: string;
    intro: string;
    cta: string;
    items: {
      key: string;
      name: string;
      role: string;
      caption: string;
      quote: string;
      image: string;
      alt: string;
    }[];
  };
  locations: {
    title: string;
    intro: string;
    /** The one action in the band, next to the country detail. */
    cta: string;
    entity: string;
    roleLabel: string;
    countries: {
      code: string;
      name: string;
      city: string;
      role: string;
      body: string;
    }[];
  };
  menu: {
    label: string;
    /** The hamburger's accessible name below lg, where the one button opens
     *  the nav links, the offering columns AND the language switcher. `label`
     *  is wrong there: it says "Offerings", which is a third of what the
     *  button actually opens. */
    open: string;
    close: string;
    columns: {
      key: string;
      title: string;
      href: string;
      items: { title: string; description: string; href: string }[];
    }[];
  };
};

/* ------------------------------------------------------------------ *
 *  EN
 * ------------------------------------------------------------------ */
const en: HomeContent = {
  hero: {
    headline: "Putting AI to work",
    subline: "Pluscode, from Poznań, across Europe.",
    cta: "Start exploring",
    scroll: "Scroll",
  },
  latest: {
    title: "Insights",
    intro: "More from Pluscode",
    cta: "All insights",
    readMore: "Learn more",
    items: [
      {
        key: "quanty",
        tag: "Quanty",
        title: "Our own AI spreadsheet reaches public beta",
        body: "Quanty reads invoices, contracts and statements into rows you can check, with the source page beside every value. Built by the same engineers you would work with.",
        href: "https://quanty.ai",
        image: "/assets/quanty/chat-2x.webp",
        alt: "The Quanty AI agent adding a delivery status column to an orders sheet",
      },
      {
        key: "fde",
        tag: "Forward deployed engineers",
        title: "An engineer inside your team, accountable for the result",
        body: "Not a body on a timesheet. One of ours sits with your people, learns the job, and owns what ships.",
        href: "/services/forward-deployed-engineers",
        image: "/assets/insights/what-is-a-forward-deployed-engineer.png",
        alt: "Cover of the insight on forward deployed engineers",
      },
      {
        key: "ai-act",
        tag: "EU AI Act",
        title: "What actually changed in August 2026",
        body: "The general purpose obligations are live. We work out your risk tier before anything is designed, not after it is built.",
        href: "/insights/eu-ai-act-august-2026-what-actually-changed",
        image: "/assets/insights/eu-ai-act-august-2026-what-actually-changed.png",
        alt: "Cover of the insight on the EU AI Act changes of August 2026",
      },
      {
        key: "agents",
        tag: "Agents",
        title: "Enterprise agents in 2026, hype against numbers",
        body: "Where autonomous workflows have paid for themselves, where they have not, and how to tell the two apart before you buy.",
        href: "/insights/ai-agents-enterprise-2026-hype-vs-numbers",
        image: "/assets/insights/ai-agents-enterprise-2026-hype-vs-numbers.png",
        alt: "Cover of the insight on enterprise agents in 2026",
      },
      {
        key: "zabka",
        tag: "Retail",
        title: "The architecture behind unstaffed stores",
        body: "We planned, designed and ran the system architecture for autonomous stores at Poland's largest convenience chain.",
        href: "/case-studies",
        image: "/assets/cases/zabka.jpg",
        alt: "Contour field for the unstaffed stores case",
      },
    ],
  },
  clients: {
    title: "Selected clients",
    items: [
      { key: "ubs", name: "UBS", what: "Mobile banking, redesigned" },
      { key: "ebm", name: "EBM Dental", what: "A platform for a clinic" },
    ],
  },
  platform: {
    eyebrow: "Platform",
    title: "Quanty",
    intro:
      "The AI spreadsheet that reads your documents into rows you can check. Ours, built here, and the same parts go into client systems.",
    cta: "Learn about Quanty",
    note: "Quanty is a product of Pluscode Sp. z o.o.",
    items: [
      {
        key: "read",
        name: "READ",
        body: "Invoices, contracts, statements and email become rows, with the source page beside every value.",
      },
      {
        key: "check",
        name: "CHECK",
        body: "Every number keeps a link back to where it came from, so a wrong figure is a click from its page.",
      },
      {
        key: "forecast",
        name: "FORECAST",
        body: "Your numbers in one place and a view of the months ahead, updated as documents arrive.",
      },
      {
        key: "report",
        name: "REPORT",
        body: "The workbook builds the deck, so the monthly pack stops being somebody's Thursday.",
      },
    ],
  },
  cases: {
    title: "Cases",
    intro: "Explore more of our work",
    cta: "Go to Cases",
    items: [
      {
        key: "zabka",
        caption: "How a convenience chain opened stores with nobody behind the counter",
        title: "Shops that run themselves",
        image: "/assets/cases/zabka.jpg",
        alt: "Żabka autonomous store architecture",
        href: "/case-studies",
      },
      {
        key: "ubs",
        caption: "How a bank unified payment flows across its mobile app",
        title: "One way to pay, on every screen",
        image: "/assets/cases/ubs.jpg",
        alt: "UBS mobile banking redesign",
        href: "/case-studies",
      },
      {
        key: "ebm",
        caption: "How a Poznań dental practice replaced a phone line with a platform",
        title: "A clinic that books itself",
        image: "/assets/cases/ebm.jpg",
        alt: "EBM Dental platform",
        href: "/case-studies",
      },
    ],
  },
  stories: {
    title: "Stories",
    intro: "Explore more stories",
    cta: "Go to Stories",
    items: [
      {
        key: "fde",
        caption: "What a forward deployed engineer actually does all day",
        title: "The engineer who sits with you",
        image: "/assets/stories/what-is-a-forward-deployed-engineer.png",
        alt: "What is a forward deployed engineer",
        href: "/insights/what-is-a-forward-deployed-engineer",
      },
      {
        key: "coding",
        caption: "Developers got faster and delivery did not move",
        title: "»The AI coding paradox«",
        image: "/assets/stories/ai-coding-paradox-faster-developers-flat-delivery.png",
        alt: "The AI coding paradox",
        href: "/insights/ai-coding-paradox-faster-developers-flat-delivery",
      },
      {
        key: "models",
        caption: "The frontier models of the second half of 2026, compared",
        title: "What we actually run, and why",
        image: "/assets/stories/frontier-models-h2-2026-claude-fable-5-gpt-5-6.png",
        alt: "Frontier models in the second half of 2026",
        href: "/insights/frontier-models-h2-2026-claude-fable-5-gpt-5-6",
      },
    ],
  },
  founders: {
    title: "People",
    intro: "The people who scope the work are the people who build it.",
    cta: "Book a call",
    items: [
      {
        key: "dawid",
        name: "Dawid Kubicki",
        role: "CEO and AI Consultant, Poznań",
        caption: "Dawid Kubicki on building systems that survive contact with real data",
        quote:
          "»Vector search kept confusing two haulage firms with almost the same name. We rebuilt it as a graph, and the ambiguity went away.«",
        image: "/assets/team/dawid-kubicki.jpg",
        alt: "Dawid Kubicki",
      },
      {
        key: "krzysztof",
        name: "Krzysztof Suliński",
        role: "AI Consultant, Poznań",
        caption: "Krzysztof Suliński on what makes an automation worth building",
        quote:
          "»First we count the hours the work costs today. If the number is small, we say so and you keep your money.«",
        image: "/assets/team/krzysztof-sulinski.jpg",
        alt: "Krzysztof Suliński",
      },
      {
        key: "together",
        name: "Dawid and Krzysztof",
        role: "Founders, Poznań",
        caption: "Dawid and Krzysztof on why the same people scope the work and build it",
        quote: "»You talk to the engineer who writes the code. No account managers, no handover.«",
        image: "/assets/team/founders.jpg",
        alt: "Dawid Kubicki and Krzysztof Suliński",
      },
    ],
  },
  locations: {
    title: "Pluscode works across Europe.",
    intro: "See locations",
    cta: "Book a call",
    entity: "Pluscode Sp. z o.o., Poznań, Poland",
    roleLabel: "Role",
    countries: [
      {
        code: "PL",
        name: "Poland",
        city: "Poznań",
        role: "Head office",
        body: "Where the company is registered and where the engineering happens.",
      },
      {
        code: "DE",
        name: "Germany",
        city: "Remote",
        role: "Consulting",
        body: "We work with German teams as consultants, in German where it helps.",
      },
      {
        code: "IT",
        name: "Italy",
        city: "Remote",
        role: "Consulting",
        body: "We work with Italian teams as consultants, on the same terms.",
      },
      { code: "NL", name: "Netherlands", city: "Remote", role: "Consulting", body: "We work with Dutch teams as consultants, in English." },
      { code: "NO", name: "Norway", city: "Remote", role: "Consulting", body: "We work with Norwegian teams as consultants, in English." },
      { code: "SE", name: "Sweden", city: "Remote", role: "Consulting", body: "We work with Swedish teams as consultants, in English." },
      { code: "FI", name: "Finland", city: "Remote", role: "Consulting", body: "We work with Finnish teams as consultants, in English." },
    ],
  },
  menu: {
    label: "Offerings",
    open: "Menu",
    close: "Close",
    columns: [
      {
        key: "solutions",
        title: "Solutions",
        href: "/solutions",
        items: [
          {
            title: "Paperwork automation",
            description: "Documents arrive, get read, and land in the right place",
            href: "/solutions/paperwork-automation",
          },
          {
            title: "Answers from your documents",
            description: "A question goes in, an answer comes back with its source",
            href: "/solutions/answers-from-documents",
          },
          {
            title: "Assistants and automation",
            description:
              "The repeated steps get done, a person approves the result",
            href: "/solutions/assistants-and-automation",
          },
          {
            title: "Forecasting and reporting",
            description: "Your numbers in one place, and a view of what comes next",
            href: "/solutions/forecasting-and-reporting",
          },
          {
            title: "Process mapping",
            description: "We find the work worth automating before anyone writes code",
            href: "/solutions/process-mapping",
          },
          {
            title: "Data governance",
            description: "GDPR, the EU AI Act, and who may see what",
            href: "/solutions/data-governance",
          },
        ],
      },
      {
        key: "platform",
        title: "Platform",
        href: "/quanty",
        items: [
          {
            title: "Quanty",
            description: "The AI spreadsheet that reads your documents into rows",
            href: "/quanty",
          },
          {
            title: "Document reading",
            description: "Invoices, contracts and statements, with the source kept",
            href: "/quanty#showcase",
          },
          {
            title: "Chat and agents",
            description: "Say what to change, and the sheet changes",
            href: "/quanty#in-the-box",
          },
          {
            title: "Reporting",
            description: "The workbook builds the deck",
            href: "/quanty#in-the-box",
          },
        ],
      },
      {
        key: "engineering",
        title: "Engineering",
        href: "/services",
        items: [
          {
            title: "Forward deployed engineers",
            description: "Our engineer inside your team, accountable for the result",
            href: "/services/forward-deployed-engineers",
          },
          {
            title: "Software development",
            description: "Custom systems built end to end",
            href: "/services/software-development",
          },
          {
            title: "MVP development",
            description: "From idea to launched product in weeks",
            href: "/services/mvp-development",
          },
          {
            title: "Cloud and MLOps",
            description: "Infrastructure that runs AI in production",
            href: "/services/cloud",
          },
          {
            title: "Team extension",
            description: "Senior engineers embedded in your team",
            href: "/services/team-extension",
          },
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ *
 *  PL
 * ------------------------------------------------------------------ */
const pl: HomeContent = {
  hero: {
    headline: "AI, które pracuje",
    subline: "Pluscode, z Poznania, w całej Europie.",
    cta: "Zobacz, co robimy",
    scroll: "Przewiń",
  },
  latest: {
    title: "Insights",
    intro: "Więcej od Pluscode",
    cta: "Wszystkie artykuły",
    readMore: "Czytaj dalej",
    items: [
      {
        key: "quanty",
        tag: "Quanty",
        title: "Nasz arkusz AI wchodzi w publiczną betę",
        body: "Quanty czyta faktury, umowy i wyciągi do wierszy, które można sprawdzić, a przy każdej wartości zostaje strona źródłowa. Zbudowany przez tych samych inżynierów, z którymi będziesz pracować.",
        href: "https://quanty.ai",
        image: "/assets/quanty/chat-2x.webp",
        alt: "Agent AI Quanty dodaje kolumnę statusu dostawy do arkusza zamówień",
      },
      {
        key: "fde",
        tag: "Forward deployed engineers",
        title: "Inżynier w Twoim zespole, odpowiedzialny za efekt",
        body: "Nie osoba na liście godzin. Nasz inżynier siada z Twoimi ludźmi, uczy się pracy i odpowiada za to, co powstaje.",
        href: "/services/forward-deployed-engineers",
        image: "/assets/insights/what-is-a-forward-deployed-engineer.png",
        alt: "Okładka artykułu o forward deployed engineers",
      },
      {
        key: "ai-act",
        tag: "AI Act",
        title: "Co naprawdę zmieniło się w sierpniu 2026",
        body: "Obowiązki dla modeli ogólnego przeznaczenia już obowiązują. Poziom ryzyka ustalamy przed projektowaniem, nie po wdrożeniu.",
        href: "/insights/eu-ai-act-august-2026-what-actually-changed",
        image: "/assets/insights/eu-ai-act-august-2026-what-actually-changed.png",
        alt: "Okładka artykułu o zmianach w AI Act z sierpnia 2026",
      },
      {
        key: "agents",
        tag: "Agenci",
        title: "Agenci w firmach w 2026, szum kontra liczby",
        body: "Gdzie autonomiczne procesy się zwróciły, gdzie nie, i jak to rozpoznać przed zakupem.",
        href: "/insights/ai-agents-enterprise-2026-hype-vs-numbers",
        image: "/assets/insights/ai-agents-enterprise-2026-hype-vs-numbers.png",
        alt: "Okładka artykułu o agentach w firmach w 2026",
      },
      {
        key: "zabka",
        tag: "Handel",
        title: "Architektura sklepów bez obsługi",
        body: "Zaplanowaliśmy, zaprojektowaliśmy i poprowadziliśmy architekturę systemu autonomicznych sklepów największej sieci convenience w Polsce.",
        href: "/case-studies",
        image: "/assets/cases/zabka.jpg",
        alt: "Pole konturowe dla wdrożenia sklepów bez obsługi",
      },
    ],
  },
  clients: {
    title: "Wybrani klienci",
    items: [
      { key: "ubs", name: "UBS", what: "Bankowość mobilna od nowa" },
      { key: "ebm", name: "EBM Dental", what: "Platforma dla kliniki" },
    ],
  },
  platform: {
    eyebrow: "Platforma",
    title: "Quanty",
    intro:
      "Arkusz AI, który czyta Twoje dokumenty do wierszy, które można sprawdzić. Nasz, zbudowany tutaj, z tych samych części co systemy klientów.",
    cta: "Poznaj Quanty",
    note: "Quanty jest produktem Pluscode Sp. z o.o.",
    items: [
      {
        key: "read",
        name: "CZYTA",
        body: "Faktury, umowy, wyciągi i maile stają się wierszami, a przy każdej wartości zostaje strona źródłowa.",
      },
      {
        key: "check",
        name: "SPRAWDZA",
        body: "Każda liczba ma odnośnik do miejsca, z którego pochodzi, więc błędna wartość jest o jedno kliknięcie od swojej strony.",
      },
      {
        key: "forecast",
        name: "PROGNOZUJE",
        body: "Twoje liczby w jednym miejscu i widok najbliższych miesięcy, aktualizowany wraz z dokumentami.",
      },
      {
        key: "report",
        name: "RAPORTUJE",
        body: "Arkusz sam składa prezentację, więc miesięczny raport przestaje być czyimś czwartkiem.",
      },
    ],
  },
  cases: {
    title: "Realizacje",
    intro: "Zobacz więcej naszych prac",
    cta: "Przejdź do realizacji",
    items: [
      {
        key: "zabka",
        caption: "Jak sieć convenience otworzyła sklepy bez nikogo za ladą",
        title: "Sklepy, które działają same",
        image: "/assets/cases/zabka.jpg",
        alt: "Architektura autonomicznych sklepów Żabka",
        href: "/case-studies",
      },
      {
        key: "ubs",
        caption: "Jak bank ujednolicił płatności w całej aplikacji mobilnej",
        title: "Jedna płatność na każdym ekranie",
        image: "/assets/cases/ubs.jpg",
        alt: "Przeprojektowanie bankowości mobilnej UBS",
        href: "/case-studies",
      },
      {
        key: "ebm",
        caption: "Jak poznańska klinika zastąpiła telefon platformą",
        title: "Klinika, która sama się umawia",
        image: "/assets/cases/ebm.jpg",
        alt: "Platforma EBM Dental",
        href: "/case-studies",
      },
    ],
  },
  stories: {
    title: "Historie",
    intro: "Zobacz więcej historii",
    cta: "Przejdź do historii",
    items: [
      {
        key: "fde",
        caption: "Czym naprawdę zajmuje się forward deployed engineer",
        title: "Inżynier, który siada obok",
        image: "/assets/stories/what-is-a-forward-deployed-engineer.png",
        alt: "Kim jest forward deployed engineer",
        href: "/insights/what-is-a-forward-deployed-engineer",
      },
      {
        key: "coding",
        caption: "Programiści przyspieszyli, a dostarczanie stoi w miejscu",
        title: "»Paradoks kodowania z AI«",
        image: "/assets/stories/ai-coding-paradox-faster-developers-flat-delivery.png",
        alt: "Paradoks kodowania z AI",
        href: "/insights/ai-coding-paradox-faster-developers-flat-delivery",
      },
      {
        key: "models",
        caption: "Modele drugiej połowy 2026 roku, porównane",
        title: "Czego naprawdę używamy i dlaczego",
        image: "/assets/stories/frontier-models-h2-2026-claude-fable-5-gpt-5-6.png",
        alt: "Modele drugiej połowy 2026 roku",
        href: "/insights/frontier-models-h2-2026-claude-fable-5-gpt-5-6",
      },
    ],
  },
  founders: {
    title: "Ludzie",
    intro: "Ci, którzy ustalają zakres pracy, to ci sami, którzy ją budują.",
    cta: "Umów rozmowę",
    items: [
      {
        key: "dawid",
        name: "Dawid Kubicki",
        role: "CEO i konsultant AI, Poznań",
        caption: "Dawid Kubicki o systemach, które wytrzymują zderzenie z prawdziwymi danymi",
        quote:
          "»Wyszukiwanie wektorowe myliło dwie firmy transportowe o niemal identycznej nazwie. Przebudowaliśmy to na graf i problem zniknął.«",
        image: "/assets/team/dawid-kubicki.jpg",
        alt: "Dawid Kubicki",
      },
      {
        key: "krzysztof",
        name: "Krzysztof Suliński",
        role: "Konsultant AI, Poznań",
        caption: "Krzysztof Suliński o tym, kiedy automatyzacja ma sens",
        quote:
          "»Najpierw liczymy godziny, które ta praca kosztuje dzisiaj. Jeśli liczba jest mała, mówimy to wprost i zostają Wam pieniądze.«",
        image: "/assets/team/krzysztof-sulinski.jpg",
        alt: "Krzysztof Suliński",
      },
      {
        key: "together",
        name: "Dawid i Krzysztof",
        role: "Założyciele, Poznań",
        caption: "Dawid i Krzysztof o tym, dlaczego zakres ustalają ci sami ludzie, którzy potem budują",
        quote: "»Rozmawiasz z inżynierem, który pisze kod. Bez opiekunów klienta, bez przekazywania projektu.«",
        image: "/assets/team/founders.jpg",
        alt: "Dawid Kubicki i Krzysztof Suliński",
      },
    ],
  },
  locations: {
    title: "Pluscode pracuje w całej Europie.",
    intro: "Zobacz lokalizacje",
    cta: "Umów rozmowę",
    entity: "Pluscode Sp. z o.o., Poznań, Polska",
    roleLabel: "Rola",
    countries: [
      {
        code: "PL",
        name: "Polska",
        city: "Poznań",
        role: "Siedziba",
        body: "Tu jest zarejestrowana spółka i tu powstaje inżynieria.",
      },
      {
        code: "DE",
        name: "Niemcy",
        city: "Zdalnie",
        role: "Konsulting",
        body: "Pracujemy z niemieckimi zespołami jako konsultanci, po niemiecku, jeśli to pomaga.",
      },
      {
        code: "IT",
        name: "Włochy",
        city: "Zdalnie",
        role: "Konsulting",
        body: "Pracujemy z włoskimi zespołami jako konsultanci, na tych samych zasadach.",
      },
      { code: "NL", name: "Holandia", city: "Zdalnie", role: "Konsulting", body: "Pracujemy z holenderskimi zespołami jako konsultanci, po angielsku." },
      { code: "NO", name: "Norwegia", city: "Zdalnie", role: "Konsulting", body: "Pracujemy z norweskimi zespołami jako konsultanci, po angielsku." },
      { code: "SE", name: "Szwecja", city: "Zdalnie", role: "Konsulting", body: "Pracujemy ze szwedzkimi zespołami jako konsultanci, po angielsku." },
      { code: "FI", name: "Finlandia", city: "Zdalnie", role: "Konsulting", body: "Pracujemy z fińskimi zespołami jako konsultanci, po angielsku." },
    ],
  },
  menu: {
    label: "Oferta",
    open: "Menu",
    close: "Zamknij",
    columns: [
      {
        key: "solutions",
        title: "Rozwiązania",
        href: "/solutions",
        items: [
          {
            title: "Automatyzacja papierologii",
            description: "Dokumenty przychodzą, zostają odczytane i trafiają na miejsce",
            href: "/solutions/paperwork-automation",
          },
          {
            title: "Odpowiedzi z Twoich dokumentów",
            description: "Wchodzi pytanie, wraca odpowiedź razem ze źródłem",
            href: "/solutions/answers-from-documents",
          },
          {
            title: "Asystenci i automatyzacja",
            description:
              "Powtarzalne kroki dzieją się same, człowiek zatwierdza wynik",
            href: "/solutions/assistants-and-automation",
          },
          {
            title: "Prognozy i raporty",
            description: "Twoje liczby w jednym miejscu i widok tego, co dalej",
            href: "/solutions/forecasting-and-reporting",
          },
          {
            title: "Mapowanie procesów",
            description: "Szukamy pracy wartej automatyzacji, zanim ktokolwiek pisze kod",
            href: "/solutions/process-mapping",
          },
          {
            title: "Ład danych",
            description: "RODO, AI Act i to, kto co może zobaczyć",
            href: "/solutions/data-governance",
          },
        ],
      },
      {
        key: "platform",
        title: "Platforma",
        href: "/quanty",
        items: [
          {
            title: "Quanty",
            description: "Arkusz AI, który czyta Twoje dokumenty do wierszy",
            href: "/quanty",
          },
          {
            title: "Odczyt dokumentów",
            description: "Faktury, umowy i wyciągi, ze źródłem przy każdej wartości",
            href: "/quanty#showcase",
          },
          {
            title: "Czat i agenci",
            description: "Mówisz, co zmienić, a arkusz się zmienia",
            href: "/quanty#in-the-box",
          },
          {
            title: "Raportowanie",
            description: "Arkusz sam składa prezentację",
            href: "/quanty#in-the-box",
          },
        ],
      },
      {
        key: "engineering",
        title: "Inżynieria",
        href: "/services",
        items: [
          {
            title: "Forward deployed engineers",
            description: "Nasz inżynier w Twoim zespole, odpowiedzialny za efekt",
            href: "/services/forward-deployed-engineers",
          },
          {
            title: "Tworzenie oprogramowania",
            description: "Systemy budowane od początku do końca",
            href: "/services/software-development",
          },
          {
            title: "Rozwój MVP",
            description: "Od pomysłu do wdrożenia w kilka tygodni",
            href: "/services/mvp-development",
          },
          {
            title: "Chmura i MLOps",
            description: "Infrastruktura, na której AI działa produkcyjnie",
            href: "/services/cloud",
          },
          {
            title: "Wsparcie zespołu",
            description: "Doświadczeni inżynierowie w Twoim zespole",
            href: "/services/team-extension",
          },
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ *
 *  DE
 * ------------------------------------------------------------------ */
const de: HomeContent = {
  hero: {
    headline: "KI, die arbeitet",
    subline: "Pluscode, aus Poznań, in ganz Europa.",
    cta: "Jetzt entdecken",
    scroll: "Scrollen",
  },
  latest: {
    title: "Insights",
    intro: "Mehr von Pluscode",
    cta: "Alle Insights",
    readMore: "Mehr erfahren",
    items: [
      {
        key: "quanty",
        tag: "Quanty",
        title: "Unsere KI-Tabelle geht in die öffentliche Beta",
        body: "Quanty liest Rechnungen, Verträge und Kontoauszüge in prüfbare Zeilen, mit der Quellseite neben jedem Wert. Gebaut von denselben Ingenieuren, mit denen Sie arbeiten würden.",
        href: "https://quanty.ai",
        image: "/assets/quanty/chat-2x.webp",
        alt: "Der Quanty-KI-Agent fügt einer Bestelltabelle eine Lieferstatus-Spalte hinzu",
      },
      {
        key: "fde",
        tag: "Forward Deployed Engineers",
        title: "Ein Ingenieur in Ihrem Team, verantwortlich für das Ergebnis",
        body: "Keine Position auf einem Stundenzettel. Einer von uns sitzt bei Ihren Leuten, lernt die Arbeit und verantwortet, was entsteht.",
        href: "/services/forward-deployed-engineers",
        image: "/assets/insights/what-is-a-forward-deployed-engineer.png",
        alt: "Cover des Beitrags über Forward Deployed Engineers",
      },
      {
        key: "ai-act",
        tag: "KI-Verordnung",
        title: "Was sich im August 2026 wirklich geändert hat",
        body: "Die Pflichten für Allzweckmodelle gelten. Wir klären Ihre Risikostufe, bevor etwas entworfen wird, nicht danach.",
        href: "/insights/eu-ai-act-august-2026-what-actually-changed",
        image: "/assets/insights/eu-ai-act-august-2026-what-actually-changed.png",
        alt: "Cover des Beitrags über die Änderungen der KI-Verordnung im August 2026",
      },
      {
        key: "agents",
        tag: "Agenten",
        title: "Agenten im Unternehmen 2026, Hype gegen Zahlen",
        body: "Wo sich autonome Abläufe gerechnet haben, wo nicht, und woran Sie das vor dem Kauf erkennen.",
        href: "/insights/ai-agents-enterprise-2026-hype-vs-numbers",
        image: "/assets/insights/ai-agents-enterprise-2026-hype-vs-numbers.png",
        alt: "Cover des Beitrags über Agenten im Unternehmen 2026",
      },
      {
        key: "zabka",
        tag: "Handel",
        title: "Die Architektur hinter unbesetzten Filialen",
        body: "Wir haben die Systemarchitektur für autonome Filialen der größten Convenience-Kette Polens geplant, entworfen und geführt.",
        href: "/case-studies",
        image: "/assets/cases/zabka.jpg",
        alt: "Konturfeld für den Fall der unbesetzten Filialen",
      },
    ],
  },
  clients: {
    title: "Ausgewählte Kunden",
    items: [
      { key: "ubs", name: "UBS", what: "Mobile Banking, neu gedacht" },
      { key: "ebm", name: "EBM Dental", what: "Eine Plattform für eine Klinik" },
    ],
  },
  platform: {
    eyebrow: "Plattform",
    title: "Quanty",
    intro:
      "Die KI-Tabelle, die Ihre Dokumente in prüfbare Zeilen liest. Unsere, hier gebaut, aus denselben Teilen wie unsere Kundensysteme.",
    cta: "Quanty kennenlernen",
    note: "Quanty ist ein Produkt der Pluscode Sp. z o.o.",
    items: [
      {
        key: "read",
        name: "LESEN",
        body: "Rechnungen, Verträge, Auszüge und E-Mails werden zu Zeilen, mit der Quellseite neben jedem Wert.",
      },
      {
        key: "check",
        name: "PRÜFEN",
        body: "Jede Zahl behält den Verweis auf ihre Herkunft, ein falscher Wert ist einen Klick von seiner Seite entfernt.",
      },
      {
        key: "forecast",
        name: "PROGNOSE",
        body: "Ihre Zahlen an einem Ort und ein Blick auf die kommenden Monate, aktualisiert mit jedem Dokument.",
      },
      {
        key: "report",
        name: "BERICHT",
        body: "Die Arbeitsmappe baut die Präsentation, das Monatspaket ist nicht mehr jemandes Donnerstag.",
      },
    ],
  },
  cases: {
    title: "Projekte",
    intro: "Mehr aus unserer Arbeit",
    cta: "Zu den Projekten",
    items: [
      {
        key: "zabka",
        caption: "Wie eine Handelskette Filialen ohne Personal eröffnete",
        title: "Läden, die sich selbst führen",
        image: "/assets/cases/zabka.jpg",
        alt: "Architektur autonomer Żabka-Filialen",
        href: "/case-studies",
      },
      {
        key: "ubs",
        caption: "Wie eine Bank Zahlungswege in ihrer App vereinheitlichte",
        title: "Ein Weg zu zahlen, auf jedem Bildschirm",
        image: "/assets/cases/ubs.jpg",
        alt: "UBS Mobile Banking Redesign",
        href: "/case-studies",
      },
      {
        key: "ebm",
        caption: "Wie eine Praxis in Poznań ihre Telefonleitung ersetzte",
        title: "Eine Klinik, die sich selbst plant",
        image: "/assets/cases/ebm.jpg",
        alt: "EBM Dental Plattform",
        href: "/case-studies",
      },
    ],
  },
  stories: {
    title: "Geschichten",
    intro: "Mehr Geschichten entdecken",
    cta: "Zu den Geschichten",
    items: [
      {
        key: "fde",
        caption: "Was ein Forward Deployed Engineer tatsächlich den ganzen Tag tut",
        title: "Der Ingenieur, der neben Ihnen sitzt",
        image: "/assets/stories/what-is-a-forward-deployed-engineer.png",
        alt: "Was ist ein Forward Deployed Engineer",
        href: "/insights/what-is-a-forward-deployed-engineer",
      },
      {
        key: "coding",
        caption: "Entwickler wurden schneller, die Auslieferung nicht",
        title: "»Das KI-Coding-Paradox«",
        image: "/assets/stories/ai-coding-paradox-faster-developers-flat-delivery.png",
        alt: "Das KI-Coding-Paradox",
        href: "/insights/ai-coding-paradox-faster-developers-flat-delivery",
      },
      {
        key: "models",
        caption: "Die Spitzenmodelle der zweiten Jahreshälfte 2026 im Vergleich",
        title: "Was wir wirklich einsetzen, und warum",
        image: "/assets/stories/frontier-models-h2-2026-claude-fable-5-gpt-5-6.png",
        alt: "Spitzenmodelle der zweiten Jahreshälfte 2026",
        href: "/insights/frontier-models-h2-2026-claude-fable-5-gpt-5-6",
      },
    ],
  },
  founders: {
    title: "Menschen",
    intro: "Wer die Arbeit abstimmt, baut sie auch.",
    cta: "Gespräch buchen",
    items: [
      {
        key: "dawid",
        name: "Dawid Kubicki",
        role: "CEO und KI-Berater, Poznań",
        caption: "Dawid Kubicki über Systeme, die echten Daten standhalten",
        quote:
          "»Die Vektorsuche verwechselte zwei Speditionen mit fast gleichem Namen. Wir haben es als Graph neu gebaut, und die Verwechslung war weg.«",
        image: "/assets/team/dawid-kubicki.jpg",
        alt: "Dawid Kubicki",
      },
      {
        key: "krzysztof",
        name: "Krzysztof Suliński",
        role: "KI-Berater, Poznań",
        caption: "Krzysztof Suliński darüber, wann sich eine Automatisierung lohnt",
        quote:
          "»Zuerst zählen wir die Stunden, die diese Arbeit heute kostet. Ist die Zahl klein, sagen wir das, und Sie behalten Ihr Geld.«",
        image: "/assets/team/krzysztof-sulinski.jpg",
        alt: "Krzysztof Suliński",
      },
      {
        key: "together",
        name: "Dawid und Krzysztof",
        role: "Gründer, Poznań",
        caption: "Dawid und Krzysztof darüber, warum dieselben Leute abstimmen und bauen",
        quote: "»Sie sprechen mit dem Ingenieur, der den Code schreibt. Keine Kundenbetreuer, keine Übergabe.«",
        image: "/assets/team/founders.jpg",
        alt: "Dawid Kubicki und Krzysztof Suliński",
      },
    ],
  },
  locations: {
    title: "Pluscode arbeitet in ganz Europa.",
    intro: "Standorte ansehen",
    cta: "Gespräch buchen",
    entity: "Pluscode Sp. z o.o., Poznań, Polen",
    roleLabel: "Rolle",
    countries: [
      {
        code: "PL",
        name: "Polen",
        city: "Poznań",
        role: "Hauptsitz",
        body: "Hier ist das Unternehmen eingetragen, und hier entsteht die Technik.",
      },
      {
        code: "DE",
        name: "Deutschland",
        city: "Remote",
        role: "Beratung",
        body: "Wir arbeiten mit deutschen Teams als Berater, auf Deutsch, wo es hilft.",
      },
      {
        code: "IT",
        name: "Italien",
        city: "Remote",
        role: "Beratung",
        body: "Wir arbeiten mit italienischen Teams als Berater, zu denselben Bedingungen.",
      },
      { code: "NL", name: "Niederlande", city: "Remote", role: "Beratung", body: "Wir arbeiten mit niederländischen Teams als Berater, auf Englisch." },
      { code: "NO", name: "Norwegen", city: "Remote", role: "Beratung", body: "Wir arbeiten mit norwegischen Teams als Berater, auf Englisch." },
      { code: "SE", name: "Schweden", city: "Remote", role: "Beratung", body: "Wir arbeiten mit schwedischen Teams als Berater, auf Englisch." },
      { code: "FI", name: "Finnland", city: "Remote", role: "Beratung", body: "Wir arbeiten mit finnischen Teams als Berater, auf Englisch." },
    ],
  },
  menu: {
    label: "Leistungen",
    open: "Menü",
    close: "Schließen",
    columns: [
      {
        key: "solutions",
        title: "Lösungen",
        href: "/solutions",
        items: [
          {
            title: "Automatisierte Sachbearbeitung",
            description: "Dokumente kommen an, werden gelesen und landen am richtigen Ort",
            href: "/solutions/paperwork-automation",
          },
          {
            title: "Antworten aus Ihren Dokumenten",
            description: "Eine Frage geht rein, eine Antwort kommt mit ihrer Quelle zurück",
            href: "/solutions/answers-from-documents",
          },
          {
            title: "Assistenten und Automatisierung",
            description:
              "Die wiederkehrenden Schritte laufen, ein Mensch gibt das Ergebnis frei",
            href: "/solutions/assistants-and-automation",
          },
          {
            title: "Prognose und Reporting",
            description: "Ihre Zahlen an einem Ort, und ein Blick nach vorn",
            href: "/solutions/forecasting-and-reporting",
          },
          {
            title: "Prozessaufnahme",
            description: "Wir finden die Arbeit, die sich lohnt, bevor jemand Code schreibt",
            href: "/solutions/process-mapping",
          },
          {
            title: "Daten-Governance",
            description: "DSGVO, KI-Verordnung, und wer was sehen darf",
            href: "/solutions/data-governance",
          },
        ],
      },
      {
        key: "platform",
        title: "Plattform",
        href: "/quanty",
        items: [
          {
            title: "Quanty",
            description: "Die KI-Tabelle, die Ihre Dokumente in Zeilen liest",
            href: "/quanty",
          },
          {
            title: "Dokumente lesen",
            description: "Rechnungen, Verträge und Auszüge, mit erhaltener Quelle",
            href: "/quanty#showcase",
          },
          {
            title: "Chat und Agenten",
            description: "Sie sagen, was sich ändern soll, und die Tabelle folgt",
            href: "/quanty#in-the-box",
          },
          {
            title: "Reporting",
            description: "Die Arbeitsmappe baut die Präsentation",
            href: "/quanty#in-the-box",
          },
        ],
      },
      {
        key: "engineering",
        title: "Technik",
        href: "/services",
        items: [
          {
            title: "Forward Deployed Engineers",
            description: "Unser Ingenieur in Ihrem Team, verantwortlich für das Ergebnis",
            href: "/services/forward-deployed-engineers",
          },
          {
            title: "Softwareentwicklung",
            description: "Systeme, von Anfang bis Ende gebaut",
            href: "/services/software-development",
          },
          {
            title: "MVP-Entwicklung",
            description: "Von der Idee zum Launch in Wochen",
            href: "/services/mvp-development",
          },
          {
            title: "Cloud und MLOps",
            description: "Infrastruktur, auf der KI produktiv läuft",
            href: "/services/cloud",
          },
          {
            title: "Team-Erweiterung",
            description: "Erfahrene Ingenieure in Ihrem Team",
            href: "/services/team-extension",
          },
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ *
 *  Write. `home` replaces whatever was there; every other top level key
 *  is left exactly as it is, so the service pages, the legal pages and
 *  the forms keep their copy.
 * ------------------------------------------------------------------ */
const byLocale: Record<string, HomeContent> = { en, pl, de };

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
      `dictionaries/${locale}.json would drift: the \`home\` shape does not match en.`,
    );
  }
}

for (const [locale, content] of Object.entries(byLocale)) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = JSON.parse(readFileSync(path, "utf8")) as Dict;
  dict.home = content;
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(`wrote home -> dictionaries/${locale}.json`);
}
