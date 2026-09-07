/**
 * The copy for the top banner, in every locale.
 *
 * dictionaries/{en,pl,de}.json is the source of truth. lib/announcement.ts
 * reads the CMS first and only falls back to the dictionary, so an active
 * `announcements` row silently overrides whatever the dictionary says. That is
 * how the bar kept serving a startup-consultations line long after the
 * dictionary had been rewritten.
 *
 * Both seeders read the banner through here, so the row and the fallback can
 * never say two different things. Change the copy in the dictionaries, then run
 * `pnpm seed:announcement` to push it into the row.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

export const ANNOUNCEMENT_LOCALES = ["en", "pl", "de"] as const;
export type AnnouncementLocale = (typeof ANNOUNCEMENT_LOCALES)[number];

/**
 * Internal admin label for the banner row, not shown on the site. It names the
 * slot rather than the message, so rewriting the copy never orphans the row.
 */
export const BANNER_TITLE = "Homepage banner";

/**
 * Labels this row has carried before. The seeders look these up too, so an
 * existing database is updated in place instead of gaining a second banner
 * that then competes with the first.
 */
export const LEGACY_BANNER_TITLES = ["AI consultations for startups"];

export type BannerCopy = {
  text: string;
  /** Optional call to action label. */
  linkText: string | null;
};

type DictionaryAnnouncement = {
  text?: string;
  linkText?: string;
  linkUrl?: string;
};

/** The `announcement` block of one dictionary. */
function block(locale: AnnouncementLocale): DictionaryAnnouncement {
  const dict = JSON.parse(
    fs.readFileSync(path.join(root, `dictionaries/${locale}.json`), "utf8"),
  );
  const announcement = dict?.announcement;
  if (!announcement || typeof announcement.text !== "string" || !announcement.text) {
    throw new Error(`dictionaries/${locale}.json has no announcement.text`);
  }
  return announcement;
}

/** The localized banner message and call to action label. */
export function bannerCopy(locale: AnnouncementLocale): BannerCopy {
  const { text, linkText } = block(locale);
  return { text: text as string, linkText: linkText || null };
}

/**
 * The banner link. `linkUrl` is not a localized field in the collection, and
 * the three dictionaries point at the same route, so the English one wins.
 */
export function bannerLinkUrl(): string | null {
  return block("en").linkUrl || null;
}

/** The full default-locale record, ready for payload.create or .update. */
export function bannerDoc() {
  const { text, linkText } = bannerCopy("en");
  return {
    title: BANNER_TITLE,
    text,
    linkText,
    linkUrl: bannerLinkUrl(),
    isActive: true,
  };
}
