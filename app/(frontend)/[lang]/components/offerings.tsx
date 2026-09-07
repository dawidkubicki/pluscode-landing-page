import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  OFFERINGS. Four ways to start, as four ruled cells.
 *
 *  GROUND, NOT RULES, SEPARATES THIS BAND. Services above it and the
 *  Quanty plate below it both meet this band edge to edge, and a third
 *  hairline between two already ruled bands would read as a fourth list
 *  row rather than as a boundary. Stepping the ground one notch down to
 *  `paper-dim` does the separating instead, which is the move the system
 *  reserves for exactly this: a band that changes subject without
 *  changing voice.
 *
 *  ONE HEADLINE AND ONE SENTENCE PER CELL. That is the whole cell. An
 *  earlier draft stacked three labelled pairs under each headline (who
 *  it is for, an example, the deliverables) and review cut all of it:
 *  the band ran longer than Services and said less, and the four cells
 *  ragged out at four different heights. A reader who wants the detail
 *  has the button, which goes to a call, not to a page.
 *
 *  The hairline sits on the cell, not on the row, so the four cells read
 *  as four entries in a list that happens to run sideways, and below
 *  768px they stack into the same ruled list Services uses above.
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
              <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
