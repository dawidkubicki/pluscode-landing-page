import type { CSSProperties } from "react";
import { Reveal } from "./motion";
import { localeDateTag, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  THE SERIES
 *
 *  Three named processes, three hues: the accent for the first, then the
 *  two signal colours the tokens reserve for second and third chart
 *  series, then a neutral chip for the tail. On the dark ground three
 *  tints of one blue were not separable at a glance; three hues are, and
 *  the cyan and violet exist for exactly this use and no other on the
 *  page. Nothing here renames or revalues `@theme`.
 *
 *  Colour still identifies nothing on its own. Every value in the strip
 *  is repeated as text in the table underneath, in the same order, next
 *  to the same swatch, so a reader who cannot separate blue from violet
 *  loses nothing at all. That is also why the strip itself is
 *  `aria-hidden`.
 * ------------------------------------------------------------------ */
const SERIES: readonly { seg: string; swatch: string }[] = [
  { seg: "tm-lime", swatch: "bg-lime" },
  { seg: "tm-cyan", swatch: "bg-signal-cyan" },
  { seg: "tm-violet", swatch: "bg-signal-violet" },
  {
    seg: "tm-tail",
    swatch: "border border-cream-line-strong bg-cream-surface",
  },
];

/* ------------------------------------------------------------------ *
 *  One lit strip. 32px tall, hairline gaps of page ground between the
 *  segments, each segment glowing in its own hue so the four read as one
 *  object rather than four chips. The strip is not `overflow-hidden`,
 *  which would clip the glow; the end radii sit on the first and last
 *  segment instead.
 *
 *  The one piece of motion: a scroll timeline wipes the strip in from the
 *  left while it is still in the bottom third of the viewport. `clip-path`
 *  rather than a width, so nothing relays out per frame, and the inset is
 *  negative on three sides so the glow is never cut. The floor is the
 *  finished state: with no `view()` support, reduced motion or no JS the
 *  strip is simply drawn whole. Same `(max-height: 2400px)` guard as the
 *  reveals in `globals.css`, for the same full-page capture reason.
 * ------------------------------------------------------------------ */
const STRIP_CSS = `
.tm-strip { display: flex; height: 32px; gap: 1px }
.tm-seg { height: 100%; min-width: 2px }
.tm-seg:first-child { border-radius: 4px 0 0 4px }
.tm-seg:last-child { border-radius: 0 4px 4px 0 }
.tm-lime {
  background-color: var(--color-lime);
  box-shadow:
    0 0 20px -2px color-mix(in oklab, var(--color-lime) 60%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.2);
}
.tm-cyan {
  background-color: var(--color-signal-cyan);
  box-shadow:
    0 0 20px -2px color-mix(in oklab, var(--color-signal-cyan) 50%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.3);
}
.tm-violet {
  background-color: var(--color-signal-violet);
  box-shadow:
    0 0 20px -2px color-mix(in oklab, var(--color-signal-violet) 60%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.2);
}
.tm-tail {
  background-color: var(--color-cream-surface);
  box-shadow: inset 0 0 0 1px var(--color-cream-line-strong);
}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (max-height: 2400px) {
    .tm-strip {
      animation: tm-wipe 1s linear both;
      animation-timeline: view();
      animation-range: cover 6% cover 30%;
    }
  }
}
@keyframes tm-wipe {
  from { clip-path: inset(-32px 100% -32px -32px) }
  to   { clip-path: inset(-32px -32px -32px -32px) }
}`;

/**
 * Band 5b, measured in tokens.
 *
 * The paired second half of `time-saved`, on the same ground and
 * separated from it by one hairline. The two bands answer the two halves
 * of the same question and they are deliberately different objects: the
 * band above compares before and after on a time axis, four jobs on one
 * shared scale of hours. This one takes a single month of machine work
 * and splits it by the process it belongs to, so the picture is where the
 * load sits rather than how much shorter a week gets. A grid of hours
 * against one divided strip, an axis against a table.
 *
 * THE ONE PIECE OF JARGON ON THE PAGE. Everything else here is written
 * for a reader who has never thought about AI, and it stays that way.
 * This band is the single sanctioned exception, because a buyer who is
 * quoted in tokens deserves to know what the meter measures before the
 * first invoice, and `tokenLine` is the whole explanation: one sentence,
 * under twenty words, no second clause and no follow-up.
 *
 * PROCESSES, NEVER PEOPLE. The rows are business processes and they are
 * never anything else. A per-person version of this chart was considered
 * and rejected outright, for three reasons that all still hold: on a
 * public page it reads to a prospective buyer as staff surveillance; in
 * the EU it invites GDPR and works-council questions two scroll lengths
 * above a band whose entire argument is that we build to European rules;
 * and a token count is a measure of cost and volume, not of productivity,
 * so a bigger number is not a better month and it is certainly not a
 * better employee. If anyone is ever tempted to put a name on one of
 * these rows, that is the reason not to.
 *
 * `honesty` is not a caption and not filler. It carries the same weight
 * as the footnote in the band above, at the same size and the same token,
 * and the band does not ship without it.
 *
 * Shares are COMPUTED here and stored nowhere. The dictionary carries
 * four token counts and nothing derived, so no locale can drift into
 * quoting a percentage that its own numbers do not add up to, and the
 * figures are formatted through `Intl` so Polish and German get their own
 * decimal separator and percent spacing rather than English typography.
 *
 * HEIGHT. A split, not another header over another field, which is what
 * keeps it short: the argument sits on columns 2 to 12 and the chart on
 * 13 to 25, so the band is only as tall as the taller of the two rather
 * than as tall as both stacked. A short split here is a step down from
 * the field above it, not a fourth slab.
 */
export default function TokenMeasure({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).tokenMeasure;
  const tag = localeDateTag[locale];

  // Every derived number in the band comes off these three lines.
  const total = t.items.reduce((sum, item) => sum + item.tokens, 0);
  const rows = t.items.map((item, i) => ({
    ...item,
    share: total > 0 ? item.tokens / total : 0,
    ...SERIES[Math.min(i, SERIES.length - 1)],
  }));
  // The foot row. Summed from the four shares rather than written as 100%,
  // so if this band is ever cut to three rows the total says three quarters
  // instead of lying about it.
  const shareShown = rows.reduce((sum, row) => sum + row.share, 0);

  const volume = new Intl.NumberFormat(tag, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const share = new Intl.NumberFormat(tag, {
    style: "percent",
    maximumFractionDigits: 0,
  });

  // The two-tone h2 supplies the full stop, so a locale cannot ship one twice.
  const title = t.title.replace(/\s*\.\s*$/, "");

  return (
    <section
      id="token-measure"
      className="scroll-mt-24 border-t border-cream-line bg-cream"
    >
      <style dangerouslySetInnerHTML={{ __html: STRIP_CSS }} />

      <div className="pc-shell">
        <div className="pc-rules">
          {/* One block, not a header over a field. The hairline above is
              the only seam between this band and the grid it belongs to. */}
          <div className="pc-grid py-12 lg:py-14">
            {/* --- the argument, columns 2 to 12 ---------------------- */}
            <Reveal className="col-[2/-2] flex flex-col items-start gap-5 lg:col-[2/12]">
              <span className="pc-pill">{t.label}</span>
              <h2 className="display max-w-[17em] text-heading-sm text-balance">
                <span className="text-ink">{title}. </span>
                <span className="text-ink-soft">{t.greyClause}</span>
              </h2>
              {/* The definition. One line, plain words, said once. */}
              <p className="max-w-[34em] text-[15px] leading-[1.55] text-ink-soft">
                {t.tokenLine}
              </p>
              {/* Non-negotiable, and it keeps the chart honest rather than
                  apologising for it. The rule belongs to the wrapper so it
                  runs the full column while the text keeps a reading
                  measure, the same way the footnote above it is set. */}
              <div className="mt-1 self-stretch border-t border-cream-line pt-4">
                <p className="max-w-[62ch] text-[13px] leading-[1.6] text-ink-mute">
                  {t.honesty}
                </p>
              </div>
            </Reveal>

            {/* --- the chart, columns 13 to 25 ------------------------ */}
            <figure
              className="col-[2/-2] mt-10 lg:col-[13/-2] lg:mt-0"
              data-reveal
              style={{ "--reveal-delay": "0.1" } as CSSProperties}
            >
              <figcaption className="pb-3.5 text-[13px] leading-none text-ink-mute">
                {t.fieldLabel}
              </figcaption>

              {/* One month, divided. `flex-grow` on a zero basis rather
                  than a percentage width, so the four segments share the
                  track exactly and the three hairline gaps come out of the
                  track instead of pushing the last segment over the edge. */}
              <div aria-hidden className="tm-strip">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className={`tm-seg ${row.seg}`}
                    style={{ flexGrow: row.tokens, flexBasis: 0 }}
                  />
                ))}
              </div>

              {/* The same four values as text, in the same order, so the
                  chart is readable with no colour vision at all and the
                  figures land in the reading order a screen reader takes:
                  process, share, volume. */}
              <table className="mt-6 w-full border-collapse text-left">
                <thead>
                  <tr className="text-[12px] leading-none text-ink-mute">
                    <th scope="col" className="pb-2.5 font-medium">
                      {t.processLabel}
                    </th>
                    <th scope="col" className="pb-2.5 text-right font-medium">
                      {t.shareLabel}
                    </th>
                    <th
                      scope="col"
                      className="pb-2.5 pl-4 text-right font-medium"
                    >
                      {t.volumeLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-cream-line">
                      <th
                        scope="row"
                        className="py-2.5 pr-4 text-[15px] leading-[1.3] font-medium text-ink"
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            aria-hidden
                            className={`size-2.5 shrink-0 rounded-[2px] ${row.swatch}`}
                          />
                          {row.name}
                        </span>
                      </th>
                      <td className="py-2.5 text-right text-[14px] text-ink-mute tabular-nums">
                        {share.format(row.share)}
                      </td>
                      <td className="py-2.5 pl-4 text-right text-[15px] font-medium text-lime-soft tabular-nums">
                        {volume.format(row.tokens)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-cream-line">
                    <th
                      scope="row"
                      className="pt-2.5 text-[13px] font-medium text-ink-mute"
                    >
                      {t.totalLabel}
                    </th>
                    <td className="pt-2.5 text-right text-[13px] text-ink-mute tabular-nums">
                      {share.format(shareShown)}
                    </td>
                    <td className="pt-2.5 pl-4 text-right text-[15px] font-medium text-ink tabular-nums">
                      {volume.format(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
