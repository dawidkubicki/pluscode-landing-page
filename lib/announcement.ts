import { findDocs, findOne } from "./cms";
import type { Locale } from "./i18n/config";

export type Announcement = {
  text: string;
  linkText: string | null;
  linkUrl: string | null;
} | null;

type AnnouncementDoc = {
  text?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  isActive?: boolean | null;
};

/**
 * The most recent active announcement, or null. Pages fall back to the
 * dictionary copy when nothing is set in the CMS.
 */
export async function getActiveAnnouncement(
  locale: Locale,
): Promise<Announcement> {
  const docs = await findDocs<AnnouncementDoc>("announcements", {
    where: { isActive: { equals: true } },
    sort: "-updatedAt",
    limit: 1,
    depth: 0,
    locale,
  });
  const doc = docs && docs.length > 0 ? docs[0] : null;
  if (!doc || !doc.text) return null;
  return {
    text: doc.text,
    linkText: doc.linkText ?? null,
    linkUrl: doc.linkUrl ?? null,
  };
}

export type AnnouncementPage = {
  /** Page heading: the dedicated title, or the banner message. */
  title: string;
  /** The banner message, used as the meta description. */
  bannerText: string;
  body: unknown | null;
  publishedAt: string | null;
};

type AnnouncementPageDoc = AnnouncementDoc & {
  pageTitle?: string | null;
  body?: unknown;
  publishedAt?: string | null;
};

/**
 * One announcement's own page ("/announcements/<slug>"), or null when no
 * announcement carries that slug. Kept independent of `isActive` so the
 * permalink outlives the banner.
 */
export async function getAnnouncementPage(
  slug: string,
  locale: Locale,
): Promise<AnnouncementPage | null> {
  const doc = await findOne<AnnouncementPageDoc>("announcements", "slug", slug, locale);
  if (!doc || !doc.text) return null;
  return {
    title: doc.pageTitle || doc.text,
    bannerText: doc.text,
    body: doc.body ?? null,
    publishedAt: doc.publishedAt ?? null,
  };
}
