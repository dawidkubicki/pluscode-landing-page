import Image from "next/image";

import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  APPROACH. How we work: hosting, the AI Act, and the rules of the
 *  trade we are building for.
 *
 *  NO BUTTON IN THE HEADER. Every other band on the page pairs its title
 *  with an intro and a call to action, and this one has no destination
 *  to send anyone to: there is no page that says more about where the
 *  data sits than these three lines do. Rather than invent a link, the
 *  header is the title on the left and the intro on the right, and the
 *  intro is indented to column 8 so the right hand side still starts on
 *  the same line as the intro of Services and Offerings above it. That
 *  is also why the intro is not bottom aligned here: with no button
 *  under it there is nothing to hang off the baseline. The flags below
 *  do not change that: they are evidence for the three claims, not a
 *  fourth thing to click.
 *
 *  A FLAG UNDER EACH CLAIM. Three cells of text that differ only in
 *  their words gave the reader nothing to look at, and the band is the
 *  one place on the page that is entirely about jurisdiction. So each
 *  cell now ends with a small label and the flag it is answering to:
 *  hosting and the AI Act are two arguments about one jurisdiction, so
 *  both carry the European flag, and the third cell carries the seven
 *  countries we actually work in. The label is what stops the flags
 *  reading as clip art. It says which question the flag answers, so the
 *  mark is part of the sentence above it.
 *
 *  THE MARKS SIT ON THE FLOOR OF THE ROW. `flex flex-col` with
 *  `md:mt-auto` on the mark pushes all three down to the bottom of the
 *  row, which on the page is one line whatever length the three bodies
 *  run to. `md:pt-10` is the floor for the case where a body is long
 *  enough that the auto margin collapses to nothing. Below 768px the
 *  cells stack and there is no row to align to, so a plain top margin
 *  carries the same space.
 *
 *  `unoptimized` IS REQUIRED, not a preference, exactly as it is on the
 *  wordmarks in the header, the footer and the Quanty band. Next routes
 *  every next/image src through /_next/image, and that endpoint refuses
 *  SVG unless `images.dangerouslyAllowSVG` is set for the whole site,
 *  which would let any future SVG here be served with its scripts intact.
 *  `unoptimized` serves the file straight out of /public instead, which is
 *  what a 300 byte flag wants anyway. `width` and `height` are the flag's
 *  real intrinsic pixels, so the box has the right shape before the
 *  stylesheet lands; the rendered height comes from CSS.
 *
 *  Three cells, four columns each, so the row fills the grid exactly and
 *  the hairlines land on the same column lines as the Clients row. Below
 *  768px they stack, and the per cell top margin carries the rhythm.
 *
 *  Server component: no state, no effects.
 * ------------------------------------------------------------------ */

/** The European flag, 3:2, already in the repo. */
const EU_FLAG = { src: "/assets/eu-flag.svg", w: 900, h: 600 };

/** The seven countries the Europe map already lights up (lib/europe-map.ts),
 *  each drawn to its official construction and proportion. Poland leads
 *  because that is where the company is, and the rest follow the map's own
 *  order. Written out here rather than imported so the band does not take a
 *  dependency on the map's generated file. The ratios are the flags' real
 *  ones, which is why the row is not a set of equal rectangles. */
const COUNTRY_FLAGS = [
  { code: "pl", w: 160, h: 100 },
  { code: "de", w: 150, h: 90 },
  { code: "fi", w: 180, h: 110 },
  { code: "it", w: 150, h: 100 },
  { code: "nl", w: 150, h: 100 },
  { code: "no", w: 165, h: 120 },
  { code: "se", w: 160, h: 100 },
] as const;

/** Which mark belongs to which claim, by the dictionary's own key. A key
 *  that is not listed gets no flag rather than a wrong one. */
const MARKS: Record<string, "eu" | "countries" | undefined> = {
  hosting: "eu",
  aiact: "eu",
  rules: "countries",
};

/** Square, hairlined, 24px tall. Every flag on the band is drawn the same
 *  way, so the row reads as one mark and not as seven stickers. */
const FLAG_CLASS = "h-6 w-auto border border-rule";

export default function Approach({
  dict,
}: {
  dict: Dictionary["home"]["approach"];
}) {
  return (
    <section className="bg-paper-dim py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>

          <div className="col-span-4 md:col-span-5 md:col-start-8">
            <p className="text-[1.125rem] leading-[1.375] text-moss">
              {dict.intro}
            </p>
          </div>

          {dict.items.map((item) => {
            const mark = MARKS[item.key];
            return (
              <div
                key={item.key}
                className="col-span-4 mt-16 flex flex-col border-t border-rule pt-8 md:col-span-4 md:mt-24"
              >
                <h3 className="text-heading-sm text-ink">{item.title}</h3>
                <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                  {item.body}
                </p>

                {mark && (
                  <div className="mt-10 md:mt-auto md:pt-10">
                    <p className="text-[0.875rem] text-moss">{item.caption}</p>

                    {mark === "eu" ? (
                      /* The cell's own title already says European Union, so
                         the flag adds nothing to a screen reader and is
                         marked decorative. */
                      <Image
                        src={EU_FLAG.src}
                        alt=""
                        width={EU_FLAG.w}
                        height={EU_FLAG.h}
                        unoptimized
                        className={`mt-3 ${FLAG_CLASS}`}
                      />
                    ) : (
                      /* One image to assistive technology, not seven: the
                         group carries the name and every flag inside it is
                         decorative, so the row is announced once, as the
                         list of countries it is. It wraps rather than
                         scrolls: a four column cell is under 310px wide
                         between 768px and roughly 1030px, which is where
                         the seven stop fitting on one line, and two tidy
                         lines are better there than a hidden scroller. */
                      <div
                        role="img"
                        aria-label={dict.countries}
                        className="mt-3 flex flex-wrap items-center gap-2"
                      >
                        {COUNTRY_FLAGS.map((flag) => (
                          <Image
                            key={flag.code}
                            src={`/assets/flags/${flag.code}.svg`}
                            alt=""
                            width={flag.w}
                            height={flag.h}
                            unoptimized
                            className={FLAG_CLASS}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
