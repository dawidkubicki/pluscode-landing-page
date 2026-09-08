import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Shorten the startup-consultations banner so it fits a phone on one line.
 *
 * WHY THE COPY AND NOT THE LAYOUT. Dawid asked for the banner to stop taking
 * a second line on mobile. The bar is one row beside a 44px dismiss button,
 * so at 360px the sentence has 282px, and 308px once the arrow is dropped on
 * the compact rung. Measured in the browser at 16px Inter:
 *
 *   486px  "Nowosc: oferujemy teraz darmowe konsultacje AI dla startupow."
 *   294px  "Darmowe konsultacje AI dla startupow."
 *   256px  "Free AI consultations for startups."
 *   278px  "Kostenlose KI-Beratung fur Startups."
 *
 * The old Polish line is 72% over the budget. No type size a person can read
 * closes that gap: it would need 10px. So the sentence is the thing that had
 * to give, and these three are the same offer said in the space a phone
 * actually has.
 *
 * GUARDED ON THE OLD TEXT, so it is a no-op the moment anybody edits the
 * banner in the admin, which is where this copy belongs and where Dawid can
 * change it. Safe to run twice. `down` restores the long version.
 *
 * The link label is untouched: it is dropped on the compact rung anyway and
 * folded into the row's accessible name.
 */

const LOCALES = ["en", "pl", "de"] as const;

const TEXT: Record<(typeof LOCALES)[number], { from: string; to: string }> = {
  en: {
    from: "New: We're now offering free AI consultations for startups.",
    to: "Free AI consultations for startups.",
  },
  pl: {
    from: "Nowość: oferujemy teraz darmowe konsultacje AI dla startupów.",
    to: "Darmowe konsultacje AI dla startupów.",
  },
  de: {
    from: "Neu: Wir bieten jetzt kostenlose KI-Beratungen für Startups an.",
    to: "Kostenlose KI-Beratung für Startups.",
  },
};

/* The English row exists in two wordings across the two announcement
   documents, and both are live. Each is matched on its own. */
const EN_VARIANT = {
  from: "New: we now offer free AI consultations for startups.",
  to: TEXT.en.to,
};

async function swap(
  db: MigrateUpArgs["db"],
  locale: string,
  from: string,
  to: string,
) {
  await db.execute(sql`
    UPDATE "announcements_locales"
       SET "text" = ${to}
     WHERE "_locale" = ${locale}::"_locales"
       AND "text" = ${from};`);
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const locale of LOCALES) {
    const { from, to } = TEXT[locale];
    await swap(db, locale, from, to);
  }
  await swap(db, "en", EN_VARIANT.from, EN_VARIANT.to);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const locale of LOCALES) {
    const { from, to } = TEXT[locale];
    await swap(db, locale, to, from);
  }
}
