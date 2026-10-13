import { findGlobal } from "./cms";
import type { Locale } from "./i18n/config";
import { getDictionary, type Dictionary } from "./i18n/dictionaries";

/**
 * Copy of the four pages: Payload first, dictionary second.
 *
 * Each page is a Payload global (`home-page`, `about-page`, `news-page`,
 * `contact-page`) that mirrors an object in dictionaries/{en,pl}.json field
 * for field. A getter returns that dictionary shape with every field resolved
 * on its own, in this order:
 *
 *   1. the CMS value in the language asked for
 *   2. the dictionary value in that language
 *   3. the CMS value in English, for text an editor has not translated yet
 *
 * An empty CMS field counts as no value, so clearing a field in the admin
 * brings the dictionary text back. With no database, as in `next build`, the
 * result is the dictionary, untouched. Nothing here throws or returns null.
 */

export type HomePageContent = Dictionary["homePage"];
export type AboutPageContent = Dictionary["aboutPage"];
export type NewsPageContent = Dictionary["newsPage"];
export type ContactPageContent = Dictionary["contactPage"];

/**
 * Asks Payload for every language of a document at once: each localized field
 * comes back as `{ en, pl, de }` instead of one string. That is what lets a
 * missing Polish value fall to the Polish dictionary before the English CMS
 * text; a read in one locale has already merged the two.
 *
 * The cast is because lib/cms.ts types `locale` as a site locale, and "all" is
 * a Payload one.
 */
export const ALL_LOCALES = "all" as unknown as Locale;

const filled = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

/**
 * Resolves one field read with ALL_LOCALES, in the order given at the top of
 * this file. A field that is not localized arrives as a plain string and skips
 * the language steps. Shared with lib/people.ts and lib/products.ts.
 */
export function resolveText(value: unknown, locale: Locale, fallback = ""): string {
  if (filled(value)) return value;
  const byLocale =
    value !== null && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  if (filled(byLocale[locale])) return byLocale[locale];
  if (filled(fallback)) return fallback;
  return filled(byLocale.en) ? byLocale.en : fallback;
}

type PageKey = "homePage" | "aboutPage" | "newsPage" | "contactPage";

/**
 * The dictionary object for `key`, with every text field resolved against the
 * global `slug`. Walking the dictionary's own keys keeps the result in the
 * dictionary's shape whatever the CMS holds. Fields that are not text, which
 * is only `aboutPage.principles`, are left to the caller.
 */
async function resolvePage<K extends PageKey>(
  slug: string,
  key: K,
  locale: Locale,
): Promise<{ content: Dictionary[K]; doc: Record<string, unknown> | null }> {
  const fallback: Dictionary[K] = getDictionary(locale)[key];
  const doc = await findGlobal<Record<string, unknown>>(slug, {
    locale: ALL_LOCALES,
    depth: 0,
  });
  if (!doc) return { content: fallback, doc: null };

  const content: Record<string, unknown> = { ...fallback };
  for (const [field, text] of Object.entries(fallback)) {
    if (typeof text === "string") content[field] = resolveText(doc[field], locale, text);
  }
  return { content: content as Dictionary[K], doc };
}

export async function getHomePage(locale: Locale): Promise<HomePageContent> {
  return (await resolvePage("home-page", "homePage", locale)).content;
}

export async function getAboutPage(locale: Locale): Promise<AboutPageContent> {
  const { content, doc } = await resolvePage("about-page", "aboutPage", locale);

  // A list has no field by field fallback: a CMS list with at least one usable
  // row replaces the dictionary list whole, and an empty one leaves it alone.
  const rows = Array.isArray(doc?.principles) ? doc.principles : [];
  const principles = rows
    .map((row: Record<string, unknown> | null) => ({
      title: resolveText(row?.title, locale),
      text: resolveText(row?.text, locale),
    }))
    .filter((row) => row.title !== "" || row.text !== "");
  if (principles.length === 0) return content;

  return {
    ...content,
    principles,
  };
}

export async function getNewsPage(locale: Locale): Promise<NewsPageContent> {
  return (await resolvePage("news-page", "newsPage", locale)).content;
}

export async function getContactPage(locale: Locale): Promise<ContactPageContent> {
  return (await resolvePage("contact-page", "contactPage", locale)).content;
}
