import { Reveal, Stagger, StaggerItem } from "./motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Where we are from, and the rules the work already follows. Not a compliance
 * notice: the flag is a fact, used once and small, and the copy only says where
 * the company is and which rules its work obeys. Never claim endorsement,
 * accreditation or funding.
 *
 * **This band is centred on purpose and the centring is load bearing.** It is
 * the last page band before the close, it follows two asymmetric bands and a
 * hairline spacer, and the object it is built around is a symmetrical one. Do
 * not "fix" it into a left aligned band later.
 *
 * It ran at 816px because it stacked an eyebrow, a headline, a four line
 * paragraph, then 112px of air around an internal rule, then a chip row, then
 * an orphan entity line. It is 398px now because the paragraph became the grey
 * half of the headline, the internal rule became the band's own structure (a
 * block closes with `border-b`, the next opens with its own padding) and the
 * entity line was promoted into a fourth cell. A registered legal entity
 * sitting in a row of compliance facts is a compliance fact.
 *
 * HEIGHT. 398px at 1440 against a 400 budget: 278 for the statement (pt-16,
 * the flag, the pill, a three line h2, pb-6, rule) plus 119 for the cell row
 * (px-6 py-6, with `min-h-[118px]` still governing a one line cell). The
 * closing padding is the small one on purpose, because the `border-b` is what
 * separates the statement from the cells and a rule plus 24px reads as one
 * seam where a rule plus 40px reads as two. German runs 20px taller because a
 * chip wraps to a third line there, which is a dictionary length.
 *
 * Zero accent anywhere in here. The flag is the only saturated colour, and a
 * second one would kill it.
 */
export default function Europe({ locale }: { locale: Locale }) {
  // `greyClause` is added by the dictionary task. Typed optional so this band
  // renders a headline rather than the word "undefined" if it is ever missing
  // from a locale, and so the intersection still resolves once it lands.
  const t: Dictionary["europe"] & { greyClause?: string } =
    getDictionary(locale).europe;

  // Every headline on this page ends in a full stop, and no dictionary string
  // carries its own trailing punctuation, so the band supplies it. Guarded in
  // case a translator adds one anyway.
  const title = /[.!?]$/.test(t.title.trim()) ? t.title.trim() : `${t.title.trim()}.`;

  // The registered entity, promoted out of an orphan caption into cell four.
  // "Pluscode Sp. z o.o., Poznań, Poland" splits into the entity and the seat,
  // which is the same shape in all three locales.
  const comma = t.entity.indexOf(",");
  const entityName = comma > 0 ? t.entity.slice(0, comma).trim() : t.entity.trim();
  const entitySeat = comma > 0 ? t.entity.slice(comma + 1).trim() : "";

  return (
    <section
      id="europe"
      className="scroll-mt-24 border-t border-cream-line bg-cream"
    >
      <div className="pc-shell">
        <div className="pc-rules">
          {/* The statement. Closes with its own rule; the cell row below opens
              against it, so there is no padded gutter between the two. */}
          <div className="pc-grid border-b border-cream-line pt-12 pb-6 lg:pt-14 xl:pt-16">
            <div className="col-[3/-3] lg:col-[2/-2]">
              <Reveal className="flex flex-col items-center text-center">
                {/*
                  An <img>, never inlined SVG: an <img> cannot inherit
                  `currentColor` and cannot be reached by a stray `fill-*`
                  utility, so the emblem survives a future recolour of the page.
                  Exact 3:2 at 36x24, keylined with a box-shadow ring rather
                  than a border (a border eats into the blue field), and the
                  ring is light because the flag sits on a dark ground. 2px radius
                  because a flag is not a pill. Once on the page, unfiltered,
                  full opacity, static.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/eu-flag.svg"
                  alt={t.flagAlt}
                  width={36}
                  height={24}
                  className="block h-6 w-9 rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.14)]"
                />

                {/* House pill geometry without its indigo ground. Written out
                    rather than composed from `.pc-pill`, because that utility
                    is declared after Tailwind's own and a `bg-*` class cannot
                    override its ground. */}
                <span className="mt-5 inline-flex h-6 items-center rounded-lg bg-cream-surface px-1.5 text-[14px] font-medium leading-5 tracking-[-0.14px] text-ink-soft">
                  {t.eyebrow}
                </span>

                {/*
                  One headline, two tones, no paragraph underneath.

                  The measure is 26em rather than the narrower one the left
                  aligned bands read at, and the number is measured rather than
                  chosen: at 22em the same copy runs to four lines, at 20em five.

                  It holds three lines at 32px today, identically in English,
                  Polish and German, and the band's 398px is built on three.
                  The two lines this was originally sized for needed a grey
                  clause of ten words or fewer and the dictionary now ships
                  fourteen, which costs one line. That is a dictionary budget,
                  not a layout one. Do NOT widen the measure to buy the line
                  back: the clause would need roughly 31em to fit in two, and a
                  centred headline that wide stops reading as a statement and
                  starts reading as a paragraph. Trim the clause instead, in all
                  three locales, and the band drops to 364 on its own.
                */}
                <h2 className="display mt-5 max-w-[26em] text-balance text-heading-sm">
                  <span className="text-ink">{title} </span>
                  {t.greyClause ? (
                    <span className="text-ink-soft">{t.greyClause}</span>
                  ) : null}
                </h2>
              </Reveal>
            </div>
          </div>

          {/* Four flush cells. The 1px gaps on a hairline-coloured parent are
              the dividers, so they can never go ragged, and no cell carries a
              border, a radius or a shadow of its own. Type only: no
              checkmarks, no shields, no padlock next to "GDPR". */}
          <Stagger
            className="grid grid-cols-4 gap-px bg-cream-line max-lg:grid-cols-2 max-sm:grid-cols-1"
            gap={0.05}
          >
            {t.chips.map((chip) => (
              <StaggerItem
                key={chip.title}
                className="min-h-[118px] bg-cream px-6 py-6"
              >
                <p className="text-[16px] font-semibold leading-[1.4] text-ink">
                  {chip.title}
                </p>
                <p className="mt-2 text-[14px] leading-[1.45] text-ink-soft">
                  {chip.text}
                </p>
              </StaggerItem>
            ))}

            <StaggerItem className="min-h-[118px] bg-cream px-6 py-6">
              <p className="text-[16px] font-semibold leading-[1.4] text-ink">
                {entityName}
              </p>
              {entitySeat ? (
                <p className="mt-2 text-[14px] leading-[1.45] text-ink-soft">
                  {entitySeat}
                </p>
              ) : null}
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
