/**
 * The /about page content, September 2026.
 *
 * ONE script writes `pages.about` into en.json, pl.json and de.json so the
 * three files stay structurally identical. Run it with:
 *
 *     node --import tsx scripts/content/about.ts
 *
 * WHY THIS EXISTS. The page shipped with template copy: a founding story
 * about "a vision to make technology accessible", a claim that Pluscode had
 * "grown into a full-service software development company", and four generic
 * values (Excellence, Innovation, Partnership, Transparency). None of it is
 * true of a two person AI consultancy in Poznan and none of it sounds like
 * the rest of the site. Every string below is rewritten in the site's own
 * voice: what we are, who the two of us are, how the work actually runs, and
 * what a client gets.
 *
 * WHAT IS DELIBERATELY UNCHANGED. `stats.items` keeps the four figures the
 * site already claims everywhere else (7+ years, 40+ projects, 8 industries,
 * 2 engineers), because components/stats.tsx reads this exact object for the
 * homepage band as well as for /about. Changing a number here changes it in
 * two places, so nothing is invented and nothing is rounded up.
 *
 * WHO ELSE READS THIS. scripts/content/team.ts pulls the role line and the
 * bio for each person out of `team.members.{dawid,krzysztof}` and writes them
 * into the `team` collection, and migrations/20260908_091000_team_real_people.ts
 * carries the same strings for production. Those two keys and their three
 * fields (name, role, bio) must stay. If you edit a bio here, edit the
 * migration too, or the CMS and the dictionary will disagree.
 *
 * House style: everything is one short sentence or two. No em dashes, in any
 * locale. No invented people, clients, awards or numbers.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");

/* ------------------------------------------------------------------ *
 *  The shape. Every band on /about reads exactly one key of this
 *  object, so a band can be rewritten without disturbing a neighbour.
 * ------------------------------------------------------------------ */
type Item = { title: string; description: string };
type Stat = { value: string; label: string };
type Member = { name: string; role: string; bio: string };

export type AboutContent = {
  label: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
  story: {
    label: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    /** The line under the photograph of the two of them. */
    caption: string;
    /** Alt text for public/assets/team/founders.jpg. */
    imageAlt: string;
  };
  /** Four ways of working, not four adjectives. Rendered in this order. */
  values: {
    label: string;
    title: string;
    items: { eu: Item; risk: Item; domain: Item; access: Item };
  };
  /** Also the source for the homepage stats band. See the note above. */
  stats: {
    items: { years: Stat; projects: Stat; clients: Stat; team: Stat };
  };
  team: {
    label: string;
    title: string;
    intro: string;
    /** Screen reader labels for the two contact icons. "{name}" is filled in. */
    emailLabel: string;
    linkedinLabel: string;
    members: { dawid: Member; krzysztof: Member };
  };
  cta: {
    titleStart: string;
    titleEm: string;
    titleEnd: string;
    text: string;
    cta: string;
  };
};

/* ------------------------------------------------------------------ *
 *  English
 * ------------------------------------------------------------------ */
const en: AboutContent = {
  label: "About us",
  title: "Two engineers who build what they scope",
  subtitle:
    "You talk to the engineer who writes the code. No account managers, no handover, no team you never meet.",
  breadcrumb: "About",
  story: {
    label: "Who we are",
    title: "A two person AI consultancy in Poznań",
    paragraph1:
      "Pluscode is Dawid Kubicki and Krzysztof Suliński. We build AI systems and the software around them: reading documents, searching a company's own records, forecasting the months ahead, and the infrastructure that keeps all of it running after launch.",
    paragraph2:
      "Seven years, forty projects, eight industries. We take on what we can finish, and when a piece of work does not need us we say so on the first call.",
    caption: "Dawid Kubicki and Krzysztof Suliński, Poznań.",
    imageAlt: "Dawid Kubicki and Krzysztof Suliński",
  },
  values: {
    label: "How we work",
    title: "Four things that do not change",
    items: {
      eu: {
        title: "Your data stays in the EU",
        description:
          "EU hosting by default, and a GDPR processing agreement signed before we touch anything of yours. If you need a different arrangement, you ask for it.",
      },
      risk: {
        title: "The AI Act tier comes first",
        description:
          "We work out which EU AI Act risk tier your use case falls into before anything is designed. The obligations then shape the build instead of arriving after it.",
      },
      domain: {
        title: "Your industry before your code",
        description:
          "We learn how the work is done today, from the people who do it, before we write a line. A system that does not understand the process automates the wrong part of it.",
      },
      access: {
        title: "One engineer, start to finish",
        description:
          "The person who scopes the work writes it and answers when it breaks. Nobody is handed the project halfway, because there is nobody to hand it to.",
      },
    },
  },
  stats: {
    items: {
      years: { value: "7+", label: "Years building AI and software" },
      projects: { value: "40+", label: "Projects delivered" },
      clients: { value: "8", label: "Industries worked in" },
      team: { value: "2", label: "Engineers who do the work" },
    },
  },
  team: {
    label: "The team",
    title: "Dawid and Krzysztof",
    intro:
      "Two engineers, both in Poznań. Whichever of us you speak to first stays with the project until it is done.",
    emailLabel: "Email {name}",
    linkedinLabel: "{name} on LinkedIn",
    members: {
      dawid: {
        name: "Dawid Kubicki",
        role: "CEO & AI Consultant",
        bio: "Scopes the work with you and then writes it. Most of what he builds is retrieval over a company's own records, graph and vector systems that have to survive real and inconsistent data, together with the infrastructure that keeps them running once they are live.",
      },
      krzysztof: {
        name: "Krzysztof Suliński",
        role: "AI Consultant",
        bio: "The first person you talk to, and one of the two who build it. He starts by counting what the work costs in hours today, so the decision to automate is a number and not an opinion, and he stays on the project after that number changes.",
      },
    },
  },
  cta: {
    titleStart: "Tell us what the ",
    titleEm: "work looks like",
    titleEnd: " today.",
    text: "One call, no pitch. If the job does not need us, we will tell you that instead.",
    cta: "Book a call",
  },
};

/* ------------------------------------------------------------------ *
 *  Polish
 * ------------------------------------------------------------------ */
const pl: AboutContent = {
  label: "O nas",
  title: "Dwóch inżynierów, którzy sami budują to, co planują",
  subtitle:
    "Rozmawiasz z inżynierem, który pisze kod. Bez opiekunów klienta, bez przekazywania projektu, bez zespołu, którego nigdy nie poznasz.",
  breadcrumb: "O nas",
  story: {
    label: "Kim jesteśmy",
    title: "Dwuosobowa firma konsultingowa AI w Poznaniu",
    paragraph1:
      "Pluscode to Dawid Kubicki i Krzysztof Suliński. Budujemy systemy AI i oprogramowanie wokół nich: czytanie dokumentów, wyszukiwanie we własnych danych firmy, prognozy na kolejne miesiące oraz infrastrukturę, która utrzymuje to wszystko po wdrożeniu.",
    paragraph2:
      "Siedem lat, czterdzieści projektów, osiem branż. Bierzemy tyle, ile jesteśmy w stanie skończyć, a jeśli dana praca nas nie potrzebuje, mówimy to już na pierwszej rozmowie.",
    caption: "Dawid Kubicki i Krzysztof Suliński, Poznań.",
    imageAlt: "Dawid Kubicki i Krzysztof Suliński",
  },
  values: {
    label: "Jak pracujemy",
    title: "Cztery rzeczy, które się nie zmieniają",
    items: {
      eu: {
        title: "Wasze dane zostają w UE",
        description:
          "Hosting w Unii Europejskiej domyślnie i umowa powierzenia przetwarzania danych podpisana, zanim cokolwiek Waszego dotkniemy. Jeśli potrzebujecie innego układu, wystarczy powiedzieć.",
      },
      risk: {
        title: "Najpierw poziom ryzyka z AI Act",
        description:
          "Ustalamy, do której kategorii ryzyka unijnego AI Act trafia Wasz przypadek, zanim cokolwiek zaprojektujemy. Obowiązki kształtują wtedy budowę systemu, zamiast pojawiać się po jej zakończeniu.",
      },
      domain: {
        title: "Najpierw branża, potem kod",
        description:
          "Zanim napiszemy linijkę kodu, uczymy się od ludzi, którzy tę pracę wykonują, jak wygląda ona dzisiaj. System, który nie rozumie procesu, automatyzuje jego niewłaściwą część.",
      },
      access: {
        title: "Jeden inżynier od początku do końca",
        description:
          "Osoba, która ustala zakres, pisze kod i odbiera telefon, gdy coś przestaje działać. Nikt nie przejmuje projektu w połowie, bo nie ma komu go przekazać.",
      },
    },
  },
  stats: {
    items: {
      years: { value: "7+", label: "Lat budowania AI i oprogramowania" },
      projects: { value: "40+", label: "Zrealizowanych projektów" },
      clients: { value: "8", label: "Branż, w których pracowaliśmy" },
      team: { value: "2", label: "Inżynierów, którzy wykonują pracę" },
    },
  },
  team: {
    label: "Zespół",
    title: "Dawid i Krzysztof",
    intro:
      "Dwóch inżynierów, obaj w Poznaniu. Ten z nas, z którym porozmawiasz najpierw, zostaje przy projekcie do końca.",
    emailLabel: "E-mail: {name}",
    linkedinLabel: "{name} na LinkedIn",
    members: {
      dawid: {
        name: "Dawid Kubicki",
        role: "CEO i konsultant AI",
        bio: "Ustala z Wami zakres pracy, a potem sam ją pisze. Buduje głównie wyszukiwanie we własnych danych firmy, systemy grafowe i wektorowe, które muszą wytrzymać zderzenie z prawdziwymi, niespójnymi danymi, wraz z infrastrukturą, która utrzymuje je po wdrożeniu.",
      },
      krzysztof: {
        name: "Krzysztof Suliński",
        role: "Konsultant AI",
        bio: "Pierwsza osoba, z którą rozmawiasz, i jedna z dwóch, które to budują. Zaczyna od policzenia, ile ta praca kosztuje dziś w godzinach, żeby decyzja o automatyzacji była liczbą, a nie opinią, i zostaje przy projekcie, gdy ta liczba się zmieni.",
      },
    },
  },
  cta: {
    titleStart: "Powiedz nam, jak ta ",
    titleEm: "praca wygląda",
    titleEnd: " dzisiaj.",
    text: "Jedna rozmowa, bez sprzedaży. Jeśli to zadanie nas nie potrzebuje, powiemy to wprost.",
    cta: "Umów rozmowę",
  },
};

/* ------------------------------------------------------------------ *
 *  German
 * ------------------------------------------------------------------ */
const de: AboutContent = {
  label: "Über uns",
  title: "Zwei Engineers, die bauen, was sie zuschneiden",
  subtitle:
    "Sie sprechen mit dem Engineer, der den Code schreibt. Keine Account Manager, keine Übergabe, kein Team, das Sie nie zu sehen bekommen.",
  breadcrumb: "Über uns",
  story: {
    label: "Wer wir sind",
    title: "Eine KI-Beratung aus zwei Personen in Poznań",
    paragraph1:
      "Pluscode sind Dawid Kubicki und Krzysztof Suliński. Wir bauen KI-Systeme und die Software darum herum: Dokumente lesen, in den eigenen Daten eines Unternehmens suchen, die kommenden Monate prognostizieren, und die Infrastruktur, die das alles nach dem Start am Laufen hält.",
    paragraph2:
      "Sieben Jahre, vierzig Projekte, acht Branchen. Wir nehmen an, was wir zu Ende bringen können, und wenn eine Aufgabe uns nicht braucht, sagen wir das im ersten Gespräch.",
    caption: "Dawid Kubicki und Krzysztof Suliński, Poznań.",
    imageAlt: "Dawid Kubicki und Krzysztof Suliński",
  },
  values: {
    label: "Wie wir arbeiten",
    title: "Vier Dinge, die sich nicht ändern",
    items: {
      eu: {
        title: "Ihre Daten bleiben in der EU",
        description:
          "Hosting in der EU als Standard, und ein Auftragsverarbeitungsvertrag nach DSGVO, bevor wir etwas von Ihnen anfassen. Brauchen Sie eine andere Lösung, sagen Sie es uns.",
      },
      risk: {
        title: "Zuerst die Risikoklasse des AI Act",
        description:
          "Wir klären, in welche Risikoklasse der EU-KI-Verordnung Ihr Anwendungsfall fällt, bevor irgendetwas entworfen wird. Die Pflichten formen dann den Bau, statt danach aufzutauchen.",
      },
      domain: {
        title: "Erst Ihre Branche, dann Code",
        description:
          "Bevor wir eine Zeile schreiben, lernen wir von den Menschen, die die Arbeit machen, wie sie heute abläuft. Ein System, das den Prozess nicht versteht, automatisiert den falschen Teil davon.",
      },
      access: {
        title: "Ein Engineer, von Anfang bis Ende",
        description:
          "Wer die Arbeit zuschneidet, schreibt sie auch und geht ans Telefon, wenn etwas kaputt ist. Niemand übernimmt das Projekt auf halbem Weg, weil es niemanden gibt, dem man es übergeben könnte.",
      },
    },
  },
  stats: {
    items: {
      years: { value: "7+", label: "Jahre KI und Software" },
      projects: { value: "40+", label: "Umgesetzte Projekte" },
      clients: { value: "8", label: "Branchen, in denen wir gearbeitet haben" },
      team: { value: "2", label: "Engineers, die die Arbeit machen" },
    },
  },
  team: {
    label: "Das Team",
    title: "Dawid und Krzysztof",
    intro:
      "Zwei Engineers, beide in Poznań. Wer von uns zuerst mit Ihnen spricht, bleibt bis zum Ende beim Projekt.",
    emailLabel: "E-Mail an {name}",
    linkedinLabel: "{name} auf LinkedIn",
    members: {
      dawid: {
        name: "Dawid Kubicki",
        role: "CEO & KI-Berater",
        bio: "Schneidet die Arbeit mit Ihnen zu und schreibt sie dann selbst. Das meiste, was er baut, ist Suche in den eigenen Daten eines Unternehmens: Graph- und Vektorsysteme, die echten, uneinheitlichen Daten standhalten müssen, samt der Infrastruktur, die sie im Betrieb hält.",
      },
      krzysztof: {
        name: "Krzysztof Suliński",
        role: "KI-Berater",
        bio: "Die erste Person, mit der Sie sprechen, und einer der beiden, die bauen. Er zählt zuerst, was die Arbeit heute an Stunden kostet, damit die Entscheidung für eine Automatisierung eine Zahl ist und keine Meinung, und er bleibt am Projekt, wenn sich diese Zahl ändert.",
      },
    },
  },
  cta: {
    titleStart: "Sagen Sie uns, wie die ",
    titleEm: "Arbeit heute",
    titleEnd: " aussieht.",
    text: "Ein Gespräch, kein Pitch. Wenn die Aufgabe uns nicht braucht, sagen wir Ihnen das.",
    cta: "Gespräch buchen",
  },
};

/* ------------------------------------------------------------------ *
 *  Write. `pages.about` is replaced; every other key under `pages` and
 *  every other top level key is left exactly as it is, so the service
 *  pages, the legal pages and the forms keep their copy.
 * ------------------------------------------------------------------ */
const byLocale: Record<string, AboutContent> = { en, pl, de };

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
      `dictionaries/${locale}.json would drift: the \`pages.about\` shape does not match en.`,
    );
  }
}

/** No em dashes, in any locale, ever. Catches a paste before it ships. */
for (const [locale, content] of Object.entries(byLocale)) {
  if (JSON.stringify(content).includes("—")) {
    throw new Error(`dictionaries/${locale}.json: pages.about contains an em dash.`);
  }
}

for (const [locale, content] of Object.entries(byLocale)) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = JSON.parse(readFileSync(path, "utf8")) as Dict;
  const pages = dict.pages as Dict | undefined;
  if (!pages) throw new Error(`dictionaries/${locale}.json has no \`pages\` key.`);
  pages.about = content;
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(`wrote pages.about -> dictionaries/${locale}.json`);
}
