import { Reveal } from "./motion";
import { CapabilityTabs } from "./services-list";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Home capabilities band: five things we take off somebody's desk.
 *  INDEX-ALIGNED with `services.items` in the dictionaries: entry n is the
 *  page behind capability n, so reordering one without the other points a
 *  tab at the wrong route. Forward Deployed Engineers is deliberately absent,
 *  because it is a way to buy rather than a capability: it closes the
 *  ways-to-work band instead. Every route below exists on disk. */
const hrefs = [
  "/ai-data/machine-learning", // 01 Paperwork automation
  "/ai-data/machine-learning", // 02 Answers from your own documents
  "/services/software-development", // 03 Software development
  "/services/mvp-development", // 04 MVP Development
  "/ai-data/analytics", // 05 Forecasting and reporting
];

/**
 * The band is a header, a five cell tab row and ONE stage, 256 + 88 + 560.
 *
 * It used to be a 360px sticky rail beside five stacked prose rows: the rail
 * held 297px of content in an 877px column, so more than half of the left
 * side was empty, and each row restated the same three text roles with
 * nothing to look at. Five wells would need five objects each strong enough
 * to carry a whole band. There is one object instead, a three.js field of
 * sheets that takes a different shape for each capability, and the five
 * share a single 560px stage and take turns on it.
 *
 * This file stays a server component: it reads the dictionary and hands the
 * slice down. Only the active index is client state, and that lives in
 * `services-list.tsx`.
 */
export default function Services({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  /**
   * `greyClause` is read defensively. The three dictionaries
   * are cast rather than validated, so a key that has not landed yet must
   * render its predecessor rather than the word `undefined`.
   */
  const t = dict.services as (typeof dict)["services"] & {
    greyClause?: string;
  };
  /* The two-tone h2: the claim in ink, the qualifier in grey, one size, one
     weight. It replaces the heading plus the paragraph that used to sit under
     every band header, and it caps the explanation at about fourteen words
     because it is being set at 40px. */
  const title = t.title.replace(/\s*\.\s*$/, "");
  const grey = t.greyClause ?? t.subtitle;

  return (
    <section
      id="services"
      className="scroll-mt-24 border-t border-cream-line bg-cream-dim"
    >
      <div className="pc-shell">
        <div className="pc-rules">
          {/* S1, the shared band header. It closes on its own rule and the
              tab row opens against it, so there is no seam to pad. Tighter
              than the other band headers on purpose: the object below is
              the point of this band and should be on screen sooner. */}
          <div className="pc-grid border-b border-cream-line pt-14 pb-10 lg:pt-16 lg:pb-12 xl:pt-20">
            <Reveal className="col-[3/-3] flex flex-col items-start gap-6 lg:col-[2/-2]">
              <span className="pc-pill">{t.label}</span>
              <h2 className="display max-w-[26em] text-balance text-heading-md">
                <span className="text-ink">{title}. </span>
                <span className="text-ink-soft">{grey}</span>
              </h2>
            </Reveal>
          </div>

          <CapabilityTabs
            items={t.items}
            hrefs={hrefs}
            label={t.label}
            linkLabel={dict.shared.learnMore}
          />
        </div>
      </div>
    </section>
  );
}
