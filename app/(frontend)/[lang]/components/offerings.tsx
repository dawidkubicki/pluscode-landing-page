import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  OFFERINGS. Four ways to start, as four labelled cells.
 *
 *  GROUND, NOT RULES, SEPARATES THIS BAND. Services above it and the
 *  Quanty plate below it both meet this band edge to edge, and a third
 *  hairline between two already ruled bands would read as a fourth list
 *  row rather than as a boundary. Stepping the ground one notch down to
 *  `paper-dim` does the separating instead, which is the move the system
 *  reserves for exactly this: a band that changes subject without
 *  changing voice.
 *
 *  THREE LABELLED PAIRS PER CELL, IN A FIXED ORDER. Each cell answers
 *  who it is for, what it looks like in practice, and what is handed
 *  over. The labels come from the dictionary, so they translate with the
 *  copy, and every cell uses the identical margin ladder (mt-6 above a
 *  label, mt-1 under it) so the three labels sit at or near the same
 *  three heights across the row.
 *
 *  They will not line up perfectly, and that is deliberate. Exact
 *  alignment needs a fixed height per pair, and a fixed height clips the
 *  German and Polish copy, which runs longer than the English at every
 *  one of these strings. A ragged label is legible; a cropped sentence
 *  is not. If the alignment ever has to be exact, the fix is a subgrid
 *  across the four cells, never a height.
 *
 *  Server component: no state, no effects.
 * ------------------------------------------------------------------ */

export default function Offerings({
  dict,
}: {
  dict: Dictionary["home"]["offerings"];
}) {
  return (
    <section className="bg-paper-dim py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>
          <div className="col-span-4 flex flex-col items-start gap-5 md:col-span-6 md:items-end md:justify-end">
            <p className="text-[1.125rem] leading-[1.375] text-moss">
              {dict.intro}
            </p>
            <LocaleLink href="/book-a-call" className="btn btn-primary">
              {dict.cta}
            </LocaleLink>
          </div>

          {dict.items.map((item) => (
            <div
              key={item.key}
              className="col-span-4 mt-16 border-t border-rule pt-8 md:col-span-3 md:mt-24"
            >
              <h3 className="text-heading-sm text-ink">{item.title}</h3>

              <p className="mt-6 text-[0.875rem] text-moss">{dict.forLabel}</p>
              <p className="mt-1 text-[1rem] leading-[1.375] text-ink">
                {item.audience}
              </p>

              <p className="mt-6 text-[0.875rem] text-moss">
                {dict.exampleLabel}
              </p>
              <p className="mt-1 text-[1rem] leading-[1.375] text-moss">
                {item.example}
              </p>

              <p className="mt-6 text-[0.875rem] text-moss">
                {dict.deliverablesLabel}
              </p>
              {/* No disc, no marker glyph. A 4px square in the muted green
                  is the same mark the rest of the page uses for a hairline,
                  and it is set as a flex row rather than a list-style so the
                  wrapped second line of a deliverable hangs under the text
                  and not under the square. The 0.55em top offset centres the
                  square on the first line at this size; `shrink-0` stops the
                  flex row squeezing it into a rectangle. */}
              <ul className="mt-2">
                {item.deliverables.map((deliverable) => (
                  <li
                    key={deliverable}
                    className="mt-2 flex gap-3 text-[1rem] leading-[1.375] text-moss first:mt-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-1 shrink-0 bg-moss"
                    />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
