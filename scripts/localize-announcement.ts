/**
 * Syncs the top banner row in the CMS to the dictionary copy, in all three
 * locales.
 *
 * WHY THIS EXISTS. lib/announcement.ts serves the most recently updated ACTIVE
 * `announcements` document and only falls back to dictionaries/<locale>.json
 * when there is none. So an old row wins over a rewritten dictionary and the
 * live bar keeps serving copy nobody can find in the source. This script
 * pushes dictionaries/{en,pl,de}.json into that row so the two agree, whichever
 * one the page ends up reading.
 *
 * It updates the existing row in place (including one seeded under the old
 * "AI consultations for startups" label) and creates it only if no banner row
 * exists at all. Idempotent, safe to re-run.
 *
 * Local:          pnpm seed:announcement
 * In production:  docker compose exec landing-pluscode pnpm seed:announcement:prod
 */
import { getPayload } from "payload";
import config from "../payload.config.ts";
import {
  ANNOUNCEMENT_LOCALES,
  BANNER_TITLE,
  LEGACY_BANNER_TITLES,
  bannerCopy,
  bannerDoc,
  bannerLinkUrl,
} from "./content/announcement.ts";

const payload = await getPayload({ config });

// The banner row under its current label or any it has carried before.
const found = await payload.find({
  collection: "announcements",
  where: { title: { in: [BANNER_TITLE, ...LEGACY_BANNER_TITLES] } },
  sort: "-updatedAt",
  limit: 1,
  depth: 0,
});

let id: number | string;
if (found.docs[0]) {
  const existing = found.docs[0];
  id = existing.id;
  console.log(`• found banner row #${id} ("${existing.title}")`);
  console.log(`  was: ${JSON.stringify(existing.text)} / ${JSON.stringify(existing.linkText)} -> ${existing.linkUrl ?? "no link"}`);
} else {
  const created = await payload.create({
    collection: "announcements",
    data: bannerDoc() as never,
  });
  id = created.id;
  console.log(`✓ created banner row #${id}`);
}

// linkUrl is not localized, so it is written once with the default locale.
for (const locale of ANNOUNCEMENT_LOCALES) {
  const copy = bannerCopy(locale);
  await payload.update({
    collection: "announcements",
    id,
    locale,
    data: {
      title: BANNER_TITLE,
      isActive: true,
      linkUrl: bannerLinkUrl(),
      ...copy,
    } as never,
  });
  console.log(`✓ ${locale}: ${copy.text}${copy.linkText ? ` / ${copy.linkText}` : ""}`);
}

// Any other active row would outrank this one the moment an editor touched it,
// which is exactly the failure this script exists to undo. Report, do not
// delete: a second banner may be deliberate and is the editor's call.
const others = await payload.find({
  collection: "announcements",
  where: { and: [{ isActive: { equals: true } }, { id: { not_equals: id } }] },
  limit: 50,
  depth: 0,
});
if (others.docs.length > 0) {
  console.warn(
    `\n! ${others.docs.length} other active announcement(s) can still override the banner:`,
  );
  for (const doc of others.docs) {
    console.warn(`  #${doc.id} "${doc.title}": ${JSON.stringify(doc.text)}`);
  }
  console.warn("  Deactivate them in the CMS if the banner above is the one you want.");
}

console.log(`\nBanner synced to the dictionary. Link: ${bannerLinkUrl() ?? "none"}`);
process.exit(0);
