/**
 * Adds the PL and DE translations to the "AI consultations for startups"
 * announcement banner (scripts/seed.ts creates it in English only, so the
 * other locales fall back to English until this runs). Idempotent.
 *
 * Local:          pnpm seed:announcement
 * In production:  docker compose exec landing-pluscode pnpm seed:announcement:prod
 */
import { getPayload } from "payload";
import config from "../payload.config.ts";

const TITLE = "AI consultations for startups";

const LOCALIZED = {
  en: {
    text: "New: We're now offering free AI consultations for startups.",
    linkText: "Learn more",
  },
  pl: {
    text: "Nowość: oferujemy teraz darmowe konsultacje AI dla startupów.",
    linkText: "Dowiedz się więcej",
  },
  de: {
    text: "Neu: Wir bieten jetzt kostenlose KI-Beratungen für Startups an.",
    linkText: "Mehr erfahren",
  },
} as const;

const payload = await getPayload({ config });

const found = await payload.find({
  collection: "announcements",
  where: { title: { equals: TITLE } },
  limit: 1,
});

if (!found.docs[0]) {
  console.error(`Announcement "${TITLE}" not found; run pnpm seed first.`);
  process.exit(1);
}

const id = found.docs[0].id;
for (const locale of ["en", "pl", "de"] as const) {
  await payload.update({
    collection: "announcements",
    id,
    locale,
    data: LOCALIZED[locale] as never,
  });
  console.log(`✓ announcement localized (${locale}): ${LOCALIZED[locale].text}`);
}

console.log("\nAnnouncement localized.");
process.exit(0);
