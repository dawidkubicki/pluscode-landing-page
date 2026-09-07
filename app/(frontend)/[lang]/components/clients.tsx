import { Reveal, Stagger, StaggerItem } from "./motion";
import { Arrow } from "./ui";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { TrustLogo } from "@/lib/trust";

type ClientItem = Dictionary["clients"]["items"][number];

/** Case study pages that resolve today: the seeded documents and, before
 *  seeding, the dictionary fallbacks in `lib/case-studies.ts`. A key outside
 *  this set sends the reader to the index rather than to a 404. */
const CASE_STUDY_SLUGS = new Set(["zabka", "ubs", "ebm"]);

const hrefFor = (key: string) =>
  CASE_STUDY_SLUGS.has(key) ? `/case-studies/${key}` : "/case-studies";

/** "Żabka" and "zabka" are the same client. Strip diacritics and case before
 *  matching a CMS logo to a dictionary item, so a mark uploaded under either
 *  spelling lands in the right cell. */
const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

function logoFor(logos: TrustLogo[], item: ClientItem): TrustLogo | undefined {
  const name = fold(item.name);
  const key = fold(item.key);
  return logos.find((l) => {
    const n = fold(l.name);
    return n === name || n === key || n.includes(key);
  });
}

/* ------------------------------------------------------------------ *
 *  BAND 2: WHO WE HAVE BUILT FOR
 *
 *  The half of the old proof rail that named clients. That rail was a
 *  130px strip of three names beside three numbers, which is what the
 *  owner called awful: two different claims squeezed into one line, so
 *  neither had room to be read. The names now have a band of their own,
 *  directly under the promise, where a reader first asks "who else".
 *
 *  Shape: the standard header, then three flush cells across the
 *  measure. A cell is one client top to bottom: the mark alone at the
 *  top with room around it, then at the foot the sector, one display
 *  line of what we did there, one sentence of how, and the link. The
 *  whole cell is the link. The three cells share hairline dividers and
 *  nothing else: no card, no radius, no shadow, and the band's own rules
 *  close the ends. On hover the shared divider lights up from the bottom
 *  in the accent, the same device `offerings.tsx` uses, so the two bands
 *  answer the pointer the same way.
 *
 *  Three rules the band depends on:
 *
 *  1. Real names only. Three clients is the honest length and three is
 *     what renders. Nothing is ever padded in beside them.
 *  2. One ink weight for every mark. Client logos arrive in their own
 *     brand colours, and a row of those on this ground is the loudest
 *     thing on the site. A CMS mark is painted as a CSS mask over `ink`.
 *     Without a CMS mark the name is set in the display face at the same
 *     height, so the three cells open with the same shape whichever
 *     source they came from. The two SVGs under `public/assets/portfolio`
 *     are text stubs (Żabka's reads "|abka"), so they are deliberately not
 *     used here.
 *  3. The accent budget is the hover divider and the link colour. The
 *     marks, the headlines and the copy are all ink.
 *
 *  Below md the three cells stack, full width, with the hairline gaps
 *  turning into the row dividers. The mark keeps its size.
 * ------------------------------------------------------------------ */
export default function Clients({
  dict,
  logos = [],
}: {
  dict: Dictionary["clients"];
  /** CMS marks from the `trust-logos` collection; often empty locally. */
  logos?: TrustLogo[];
}) {
  // The two-tone h2 supplies the full stop, so a locale cannot ship one twice.
  const title = dict.title.replace(/\s*\.\s*$/, "");
  const items = dict.items.slice(0, 3);

  return (
    <section id="clients" className="scroll-mt-24 bg-cream-dim">
      <div className="pc-shell">
        <div className="pc-rules">
          {/* The header. It closes on its own rule and the three cells
              open against it. The hero above ends on `border-b`, so this
              band draws no top rule of its own. */}
          <div className="pc-grid border-b border-cream-line pt-16 pb-12 lg:pt-20 xl:pt-24">
            <Reveal className="col-[3/-3] flex flex-col items-start gap-6 lg:col-[2/-2]">
              <span className="pc-pill">{dict.label}</span>
              <h2 className="display max-w-[22em] text-balance text-heading-md">
                <span className="text-ink">{title}. </span>
                <span className="text-ink-soft">{dict.greyClause}</span>
              </h2>
            </Reveal>
          </div>

          {/* The proof wall. `gap-px` over the hairline colour is the
              divider; each cell paints the band ground back over it. The
              wall is flush to the next band's top rule, so it closes on
              that and carries no padding of its own underneath. */}
          <div className="pc-grid">
            <Stagger
              className="col-[2/-2] grid grid-cols-1 gap-px bg-cream-line md:grid-cols-3"
              gap={0.06}
            >
              {items.map((item) => {
                const logo = logoFor(logos, item);
                return (
                  <StaggerItem key={item.key} className="flex bg-cream-dim">
                    <LocaleLink
                      href={hrefFor(item.key)}
                      className="group relative flex w-full flex-col px-6 pt-7 pb-7 transition-colors duration-300 ease-io-attio hover:bg-cream-surface hover:duration-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime/40 md:min-h-[320px] lg:min-h-[360px] lg:px-8 lg:pt-8 lg:pb-8"
                    >
                      {/* The hover marker: the shared divider itself lighting
                          up from the bottom. Grows in 240ms, retracts in 200ms. */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 -left-px w-px origin-bottom scale-y-0 bg-lime transition-transform duration-[240ms] ease-out-cubic group-hover:scale-y-100 group-hover:duration-[200ms]"
                      />

                      {/* The mark. 32px tall, ink, left aligned, alone in
                          the top of the cell. */}
                      <span className="flex h-8 items-center">
                        {logo ? (
                          <span
                            role="img"
                            aria-label={logo.logo.alt || item.name}
                            className="block h-8 w-full max-w-[176px] bg-ink"
                            style={{
                              WebkitMaskImage: `url("${logo.logo.url}")`,
                              maskImage: `url("${logo.logo.url}")`,
                              WebkitMaskRepeat: "no-repeat",
                              maskRepeat: "no-repeat",
                              WebkitMaskPosition: "left center",
                              maskPosition: "left center",
                              WebkitMaskSize: "contain",
                              maskSize: "contain",
                            }}
                          />
                        ) : (
                          <span className="display whitespace-nowrap text-[30px] font-semibold leading-none tracking-[-0.03em] text-ink">
                            {item.name}
                          </span>
                        )}
                      </span>

                      {/* The foot: sector, what, how, link. `mt-auto` pins
                          it to the bottom from md up, which is what gives
                          the mark its air; on a phone the cell is as tall
                          as its content and a fixed gap does the job. */}
                      <span className="mt-10 flex flex-col gap-3 md:mt-auto md:pt-16">
                        <span className="text-[13px] font-medium leading-none text-ink-mute">
                          {item.tag}
                        </span>
                        <h3 className="display text-[22px] leading-[1.2] text-balance text-ink">
                          {item.what}
                        </h3>
                        <p className="text-[15px] leading-[1.5] text-ink-soft">
                          {item.detail}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-lime-ink transition-colors duration-300 ease-io-attio group-hover:text-lime-soft group-hover:duration-50">
                          {dict.cta}
                          <Arrow className="size-3.5 shrink-0 transition-transform duration-300 ease-io-attio group-hover:translate-x-0.5 group-hover:duration-50" />
                        </span>
                      </span>
                    </LocaleLink>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
