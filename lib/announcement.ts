import { findDocs } from "./cms";
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
