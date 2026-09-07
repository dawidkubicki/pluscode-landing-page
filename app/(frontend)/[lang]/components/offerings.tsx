import { Reveal, Stagger } from "./motion";
import { Arrow } from "./ui";
import LocaleLink from "./locale-link";
import OfferingArt, { OfferingArtStyles, type ArtKind } from "./offering-art";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Where each engagement sends the visitor. INDEX-ALIGNED with
 *  `offerings.items`: three go straight to the booking form with the offer
 *  named in the query string, and only the workshop still has a detail page
 *  that describes it under the right name. */
const HREFS = [
  "/book-a-call?offer=requirement-analysis", // 01 Requirement Analysis
  "/book-a-call?offer=mvp-deployment", // 02 MVP Deployment
  "/book-a-call?offer=ai-native-development", // 03 AI Native Development
  "/workshops/ai-opportunity-workshop", // 04 AI Workshops
];

/** `item.meta` is one string per locale, "duration MIDDLE-DOT commercial
 *  model", and the three dictionaries are owned by another task. Splitting
 *  it here turns the two facts into two rows of the cell's terms ledger
 *  without adding a word to the page or a key to the dictionaries. A locale
 *  that ever drops the separator degrades to a single row. */
const terms = (meta: string) =>
  meta
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

/** Six bullets is 34 words in a band whose whole argument is already made
 *  by the header and `fde.desc`. Four fills the 2x2 hairline grid and reads
 *  as a sample rather than a catalogue. The keys stay in all three
 *  dictionaries; the FDE service page renders the full set. */
const FDE_BULLETS_SHOWN = 4;

/** A small sentence-case caption. The site does not use uppercase or
 *  monospaced labels: a label voice from a terminal is wrong for this
 *  audience. */
const caption = "text-[12px] leading-none text-ink-mute";

/* ------------------------------------------------------------------ *
 *  BAND 4: WAYS TO WORK
 *
 *  Three blocks stacked inside one set of vertical rules: the header, the
 *  four engagements as a flush 4-up, and the Forward Deployed Engineers
 *  row that closes the band.
 *
 *  WHAT THIS PASS CHANGED, and why. The previous 4-up was four columns of
 *  type: a name, one line of description, then the terms ledger. The
 *  owner's reading was "boring, not modern, and people without knowledge
 *  of AI won't understand it", and the cells gave that reader nothing to
 *  hold on to. "We build the system that does the repeat work" is true
 *  and says nothing to an operator who has never bought software.
 *
 *  Each cell is now a small page with the same six parts, in order:
 *
 *    1  a drawing, about 160px, that tells the engagement as a story with
 *       no words (`offering-art.tsx`): hours being counted, a building
 *       going live, mail sorted between a tray and a person, bulbs
 *       switching on;
 *    2  the name, 22px in the display face;
 *    3  the one-line description that was already there;
 *    4  "For example" and one concrete sentence in plain words, set off by
 *       a hairline. This is the line for the reader who does not know AI:
 *       "Your accounting team retypes 300 invoices a month";
 *    5  "How it goes", three numbered steps on a hairline timeline, so the
 *       shape of the engagement is visible before anyone books a call;
 *    6  the terms ledger and the call to action, pinned to the foot.
 *
 *  The grid row still equalises the four cells, `mt-auto` still pins the
 *  ledger, and the ledger rows are still full-bleed (`-mx-6`), so the
 *  four cells share unbroken rules and read as one table. The drawing
 *  plate is full-bleed too and closes on its own rule, so the row opens
 *  on a strip of four pictures instead of four headings.
 *
 *  The whole cell is still the link. Hovering lights the shared divider
 *  in the accent, as before, and the drawing plays its hover state.
 * ------------------------------------------------------------------ */
export default function Offerings({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).offerings;
  const fde = t.fde;

  return (
    <section
      id="offerings"
      className="scroll-mt-24 border-t border-cream-line bg-cream-dim"
    >
      <OfferingArtStyles />

      <div className="pc-shell">
        <div className="pc-rules">
          {/* --- the header. Closes on its own rule; the 4-up opens with
              its own edge, so there is no `mt-14` welding the two. ----- */}
          <div className="pc-grid border-b border-cream-line pt-16 pb-12 lg:pt-20 xl:pt-24">
            <Reveal className="col-[3/-3] flex flex-col items-start gap-6 lg:col-[2/-2]">
              <span className="pc-pill">{t.label}</span>
              <h2 className="display max-w-[22em] text-balance text-heading-md">
                <span className="text-ink">{t.title}. </span>
                <span className="text-ink-soft">{t.greyClause}</span>
              </h2>
            </Reveal>
          </div>

          {/* --- the 4-up. Four cells across the measure, divided by a
              single shared hairline and nothing else. Four columns on
              desktop, two on tablet, one on phones. ------------------- */}
          <div className="pc-grid border-b border-cream-line">
            <Stagger className="col-[2/-2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {t.items.map((item, i) => (
                <LocaleLink
                  key={item.name}
                  href={HREFS[i]}
                  className="oa-cell group relative flex flex-col border-cream-line px-6 pb-6 transition-colors duration-300 ease-io-attio hover:bg-cream-surface hover:duration-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime/40 max-sm:[&:not(:first-child)]:border-t sm:max-lg:[&:nth-child(even)]:border-l sm:max-lg:[&:nth-child(n+3)]:border-t lg:[&:not(:first-child)]:border-l"
                >
                  {/* The hover marker: the shared divider itself lighting up
                      from the bottom. Grows in 240ms, retracts in 200ms. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-px w-px origin-bottom scale-y-0 bg-lime transition-transform duration-[240ms] ease-out-cubic group-hover:scale-y-100 group-hover:duration-[200ms]"
                  />

                  {/* 1. The drawing plate. Full-bleed, on the page ground so
                      the drawing's surface fills stand on it whether or not
                      the cell is hovered, closing on its own rule. A faint
                      accent glow behind the drawing brightens on hover. */}
                  <div
                    aria-hidden
                    className="relative -mx-6 h-44 overflow-hidden border-b border-cream-line bg-cream"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_62%,rgb(51_102_255/0.12),transparent_70%)] opacity-60 transition-opacity duration-300 ease-io-attio group-hover:opacity-100 group-hover:duration-50" />
                    <OfferingArt
                      kind={i as ArtKind}
                      className="relative h-full w-full px-2 py-1.5"
                    />
                  </div>

                  {/* Nothing is marked featured today. When one is, it takes
                      the pill above its name and no other cell changes. */}
                  {item.featured && (
                    <span className="pc-pill mt-5 self-start">
                      {t.featuredLabel}
                    </span>
                  )}

                  {/* 2 and 3. The name and the line under it. */}
                  <div className="mt-5 flex flex-col gap-2">
                    <h3 className="display text-[22px] leading-[1.15] text-ink">
                      {item.name}
                    </h3>
                    <p className="text-[15px] leading-[1.5] text-ink-soft">
                      {item.desc}
                    </p>
                  </div>

                  {/* 4. The example. One concrete sentence for the reader who
                      does not know what any of this is, set off by a
                      hairline of its own. */}
                  <div className="mt-5 flex flex-col gap-1.5 border-t border-cream-line pt-4">
                    <span className={caption}>{t.exampleLabel}</span>
                    <p className="text-[14px] leading-[1.5] text-ink-soft">
                      {item.example}
                    </p>
                  </div>

                  {/* 5. How it goes. Three numbered steps, the numbers in
                      the accent text colour, joined by a hairline that runs
                      from the foot of one number to the head of the next. */}
                  <div className="mt-5 flex flex-col gap-3">
                    <span className={caption}>{t.stepsLabel}</span>
                    <ol className="flex flex-col">
                      {item.steps.map((step, si) => (
                        <li
                          key={si}
                          className="relative flex gap-3 pb-3 last:pb-0"
                        >
                          {si < item.steps.length - 1 && (
                            <span
                              aria-hidden
                              className="absolute top-5 bottom-0 left-[9.5px] w-px bg-cream-line"
                            />
                          )}
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-cream-line-strong text-[11px] leading-none font-medium text-lime-soft tabular-nums">
                            {si + 1}
                          </span>
                          <span className="pt-0.5 text-[13px] leading-[1.45] text-ink-soft">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* 6. The terms ledger. `mt-auto` pins it to the foot of
                      the cell, so the three rules run unbroken across all
                      four cells and the 4-up reads as one hairline table.
                      `-mx-6` with `px-6` back on each row is what lets a
                      rule reach the cell edge and meet the vertical divider.

                      Below sm the cell is full width, so the two terms share
                      a row instead of stacking. */}
                  <div className="-mx-6 mt-auto flex flex-col pt-6">
                    <div className="flex flex-col max-sm:flex-row">
                      {terms(item.meta).map((term, ti) => (
                        <span
                          key={ti}
                          className={`border-t border-cream-line px-6 py-4 text-[13px] leading-[1.45] max-sm:flex-1 ${
                            ti === 0
                              ? "tabular-nums text-ink"
                              : "text-ink-soft"
                          }`}
                        >
                          {term}
                        </span>
                      ))}
                    </div>

                    <span className="flex items-center justify-between gap-2 border-t border-cream-line px-6 pt-4 text-[14px] font-medium text-lime-ink transition-colors duration-300 ease-io-attio group-hover:text-lime-deep group-hover:duration-50">
                      {item.cta}
                      <Arrow className="size-3.5 shrink-0 transition-transform duration-300 ease-io-attio group-hover:translate-x-0.5 group-hover:duration-50" />
                    </span>
                  </div>
                </LocaleLink>
              ))}
            </Stagger>
          </div>

          {/* --- the FDE row. The argument on columns 2 to 12; on 13 to 25
              a small drawing of an engineer joining a team, then the things
              they can build as a hairline grid. No card, no radius, no
              shadow. The band's own rules are the only frame it gets. --- */}
          <div
            id="forward-deployed-engineers"
            className="pc-grid scroll-mt-24 py-10 max-lg:py-8"
          >
            <Reveal className="col-[2/12] flex flex-col items-start gap-3.5 self-center max-lg:col-[2/-2]">
              <span className="pc-pill">{fde.label}</span>
              <h3 className="display max-w-[16em] text-heading-xs text-ink">
                {fde.name}.
              </h3>
              <p className="max-w-[30em] text-[15px] leading-[1.55] text-ink-soft">
                {fde.desc}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <LocaleLink
                  href="/services/forward-deployed-engineers"
                  className="btn btn-outline"
                >
                  {fde.cta}
                  <Arrow className="size-4" />
                </LocaleLink>
                <LocaleLink
                  href="/insights/what-is-a-forward-deployed-engineer"
                  className="group/read inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-lime-ink transition-colors duration-300 ease-io-attio hover:text-lime-deep hover:duration-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                >
                  {fde.readLink}
                  <Arrow className="size-3.5 shrink-0 transition-transform duration-300 ease-io-attio group-hover/read:translate-x-0.5 group-hover/read:duration-50" />
                </LocaleLink>
              </div>
            </Reveal>

            <div
              className="col-[13/-2] flex flex-col gap-5 self-center max-lg:col-[2/-2] max-lg:mt-8"
              data-reveal
            >
              <div aria-hidden className="h-28 w-full max-w-[320px]">
                <OfferingArt kind={4} className="h-full w-full" />
              </div>
              <ul
                aria-label={fde.bulletsLabel}
                className="grid grid-cols-2 gap-px bg-cream-line max-sm:grid-cols-1"
              >
                {fde.bullets.slice(0, FDE_BULLETS_SHOWN).map((bullet) => (
                  <li
                    key={bullet}
                    className="line-clamp-1 bg-cream-dim px-5 py-4 text-[13px] leading-[1.5] text-ink-soft"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
