import { COMPANY, SITE_URL } from "@/lib/company";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNews } from "@/lib/news";
import { getAboutPage, getContactPage, getHomePage, getNewsPage } from "@/lib/pages";
import { getPeople } from "@/lib/people";
import { getProducts } from "@/lib/products";
import { pageUrl } from "@/lib/seo";

/**
 * The text of /llms.txt and /llms-full.txt, in the shape llmstxt.org
 * describes: a title, a one-paragraph summary in a blockquote, then short
 * sections of links.
 *
 * Nothing about the company is written here. Every sentence comes from the
 * helpers the pages render from, or from lib/company.ts, so the file follows
 * the CMS and cannot say something the site does not. Only the headings and
 * the few lines about the file itself belong to this module.
 *
 * Lives beside the route because both routes need it and a route file may
 * export nothing but its handlers.
 */

/** The file is in English whatever the reader's language. */
const LANG: Locale = defaultLocale;

/** How many articles the long file lists. */
const NEWS_LIMIT = 10;

/** The house rule on dashes holds here too, even if an editor typed one. */
const tidy = (text: string | null | undefined) =>
  (text ?? "")
    .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, "$1-$2")
    .replace(/\s*[\u2013\u2014\u2015]\s*/g, ", ")
    .trim();

const oneLine = (text: string | null | undefined) => tidy(text).replace(/\s+/g, " ");

/** Copy keeps paragraphs apart with a blank line. */
const paragraphs = (text: string | null | undefined) =>
  tidy(text)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

/** `portfolioStatement` marks its chips with square brackets. */
const unchip = (text: string) => text.replace(/\[([^\]]+)\]/g, "$1");

const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

/** One entry of a link list: `- [title](url): note`. */
function link(title: string, url: string | null, note = ""): string {
  const head = url ? `[${oneLine(title)}](${url})` : oneLine(title);
  return note ? `- ${head}: ${oneLine(note)}` : `- ${head}`;
}

/** The helpers already fall back to the dictionary. This is for anything else. */
async function safely<T>(read: Promise<T>, fallback: T): Promise<T> {
  try {
    return await read;
  } catch {
    return fallback;
  }
}

export async function llmsText(variant: "short" | "full"): Promise<string> {
  const full = variant === "full";
  const dict = getDictionary(LANG);

  const [home, about, newsPage, contact, people, products, news] = await Promise.all([
    safely(getHomePage(LANG), dict.homePage),
    safely(getAboutPage(LANG), dict.aboutPage),
    safely(getNewsPage(LANG), dict.newsPage),
    safely(getContactPage(LANG), dict.contactPage),
    safely(getPeople(LANG), []),
    safely(getProducts(LANG), []),
    full ? safely(getNews(LANG, { limit: NEWS_LIMIT }), []) : Promise.resolve([]),
  ]);

  const out: string[] = [];
  const add = (...lines: string[]) => out.push(...lines);
  const section = (title: string) => add("", `## ${title}`, "");

  add(`# ${COMPANY.name}`, "", `> ${oneLine(home.seoDescription)}`, "");
  add(oneLine(home.heroTagline), "");
  add(
    full
      ? `This file is generated from the same content as ${SITE_URL}, for language models and agents. It is the long version of ${SITE_URL}/llms.txt. The site is published in English and Polish.`
      : `This file is generated from the same content as ${SITE_URL}, for language models and agents. The site is published in English and Polish.`,
  );

  section(dict.ui.company);
  add(oneLine(home.missionHeading), "");
  for (const p of paragraphs(home.missionBody)) add(p, "");
  add(link(about.heading, pageUrl(LANG, "/about"), about.seoDescription));

  if (full) {
    section(about.heading);
    for (const p of paragraphs(about.intro)) add(p, "");
    if (paragraphs(about.storyBody).length > 0) {
      add(`### ${oneLine(about.storyLabel)}`, "");
      for (const p of paragraphs(about.storyBody)) add(p, "");
    }
    const principles: { title: string; text: string }[] = about.principles;
    if (principles.length > 0) {
      add(`### ${oneLine(about.principlesLabel)}`, "");
      for (const principle of principles) {
        add(`- ${[oneLine(principle.title), oneLine(principle.text)].filter(Boolean).join(": ")}`);
      }
      add("");
    }
  }

  section(home.portfolioLabel);
  add(oneLine(unchip(home.portfolioStatement)), "");
  for (const product of products) {
    // Everything in the portfolio is the company's own product.
    const maker = sentence(oneLine(product.badge) || `Built by ${COMPANY.name}`);
    if (full) {
      add(`### ${oneLine(product.name)}`, "");
      add(sentence(oneLine(product.tagline)), "");
      for (const p of paragraphs(product.description)) add(p, "");
      if (product.url) add(link(product.name, product.url, maker));
      if (product.tags.length > 0) add(`- ${product.tags.map(oneLine).join(", ")}`);
      add("");
    } else {
      add(link(product.name, product.url || null, `${sentence(oneLine(product.tagline))} ${maker}`));
    }
  }

  section(home.peopleHeading);
  for (const person of people) {
    if (full) {
      add(`### ${oneLine(person.name)}`, "", oneLine(person.role), "");
      for (const p of paragraphs(person.bio)) add(p, "");
      if (person.linkedin) add(link(dict.company.linkedin, person.linkedin), "");
    } else {
      add(link(person.name, person.linkedin, person.role));
    }
  }

  if (full && news.length > 0) {
    section(home.newsHeading);
    for (const item of news) {
      const date = item.publishedAt?.slice(0, 10);
      add(
        link(
          item.title,
          pageUrl(LANG, `/news/${item.slug}`),
          [date, oneLine(item.excerpt)].filter(Boolean).join(". "),
        ),
      );
    }
  }

  /* Each language gets its own list, under the names the pages carry in that
     language, so a reader can match a link to what it will find there. */
  const pages = (locale: Locale) => {
    const nav = getDictionary(locale).nav;
    const own = locale === LANG;
    return [
      link(nav.home, pageUrl(locale), own ? dict.meta.ogDescription : dict.nav.home),
      link(nav.about, pageUrl(locale, "/about"), own ? about.seoDescription : dict.nav.about),
      link(nav.news, pageUrl(locale, "/news"), own ? newsPage.seoDescription : dict.nav.news),
      link(nav.contact, pageUrl(locale, "/contact"), own ? contact.seoDescription : dict.nav.contact),
    ];
  };
  for (const locale of locales) {
    section(locale === LANG ? "Pages" : `Pages in ${languageName(locale)}`);
    add(...pages(locale));
  }

  section("Company details");
  const labels = dict.company;
  add(
    `- ${labels.legalName}: ${COMPANY.legalName}`,
    `- ${labels.office}: ${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, ${labels.country}`,
    `- ${labels.krs}: ${COMPANY.krs}`,
    `- ${labels.nip}: ${COMPANY.nip}`,
    `- ${labels.regon}: ${COMPANY.regon}`,
    `- ${labels.email}: ${oneLine(contact.email) || COMPANY.email}`,
  );
  if (oneLine(contact.phone)) add(`- ${labels.phone}: ${oneLine(contact.phone)}`);
  add(`- ${labels.linkedin}: ${COMPANY.linkedin}`);

  // llmstxt.org: links under "Optional" can be skipped when context is short.
  section("Optional");
  if (!full) {
    add(
      link(
        "llms-full.txt",
        `${SITE_URL}/llms-full.txt`,
        "The About text, the biographies, the product description and the latest news, in full",
      ),
    );
  }
  for (const locale of locales) {
    const footer = getDictionary(locale).footer;
    add(link(footer.privacy, pageUrl(locale, "/privacy-policy")));
    add(link(footer.terms, pageUrl(locale, "/terms-of-use")));
  }
  add(link("Sitemap", `${SITE_URL}/sitemap.xml`, "Every page, in both languages"));

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function languageName(locale: Locale): string {
  return new Intl.DisplayNames([LANG], { type: "language" }).of(locale) ?? locale;
}

/** Shared by both routes: plain text, fresh for an hour, then revalidated. */
export const LLMS_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600",
} as const;
