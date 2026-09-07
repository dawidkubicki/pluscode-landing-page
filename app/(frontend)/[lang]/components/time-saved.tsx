import type { CSSProperties } from "react";

export type TimeSavedItem = {
  id: string;
  name: string;
  before: number;
  after: number;
  /** Kept in the dictionary for the subpages. Not rendered on the homepage. */
  today: string;
  /** One line under each row on desktop: what the freed hours go into. */
  instead: string;
  check: string;
};

export type TimeSavedDict = {
  label: string;
  title: string;
  /** The 35 word original. Replaced on the homepage by `greyClause`, still
   *  read by the subpages. */
  subtitle: string;
  /** The grey half of the two-tone h2. Optional only so this band cannot
   *  break the build ahead of the dictionary task; it renders when present. */
  greyClause?: string;
  scaleMax: number;
  unit: string;
  beforeLabel: string;
  afterLabel: string;
  /** Was a CountUp line under every row. Not rendered any more. */
  percentLine: string;
  footnote: string;
  /** The word after the saving: "8 h back". Optional until the dictionary
   *  task adds it; the English fallback below stands in meanwhile. */
  backLabel?: string;
  items: readonly TimeSavedItem[];
};

/** Hard-coded English fallback for `dict.backLabel`. PL "z powrotem",
 *  DE "zurück" are requested from the dictionary task. */
const BACK_FALLBACK = "back";

/* ------------------------------------------------------------------ *
 *  THE HOURS GRID
 *
 *  Every job is one row of `scaleMax` square cells, one cell per hour of
 *  one person's week. Three states, all set as ordinary CSS so the server
 *  renders the finished picture with no JavaScript at all:
 *
 *    .ts-on   an hour still spent on the job with AI. Electric blue, lit,
 *             with a soft glow so a run of them reads as one strip.
 *    .ts-off  an hour that comes back. A hollow cell: hairline outline,
 *             nothing inside. It is still drawn, so the reader can count
 *             the twelve today against the four with AI.
 *    .ts-nil  a position on the scale the job never used. A 3px dot, so
 *             every row visibly runs to the same 16 and the axis means
 *             something.
 *
 *  THE ONE PIECE OF MOTION. A scroll timeline, not an observer, for the
 *  same reason `[data-reveal]` is: the floor is the finished state, so
 *  with no JS, no `view()` support, reduced motion or a starved frame
 *  loop the grid is simply drawn finished. While the row is still in the
 *  bottom third of the viewport it plays "today": every one of the
 *  `before` cells starts dim and filled, then the saved ones switch off
 *  one by one from the left while the kept ones brighten to blue. Each
 *  cell reads its column from `--i` (set once by position below) and the
 *  row's `after` from `--a`, so its own switch-off moment is
 *  `(--i - --a)` steps after the first, and the whole row is finished by
 *  `cover 32%`, before the reader's eye reaches it. Nothing here animates
 *  opacity: the keyframes move colour and shadow only, so the served HTML
 *  never contains a hidden state.
 *
 *  The `(max-height: 2400px)` guard is the one `globals.css` uses for the
 *  reveals: a viewport as tall as the document (full-page captures, OG
 *  bots) never resolves a `view()` range and would hold every cell at its
 *  dim `from` state.
 * ------------------------------------------------------------------ */
const CELL_INDEX_CSS = Array.from(
  { length: 16 },
  (_, i) => `.ts-c:nth-child(${i + 1}){--i:${i}}`,
).join("\n");

const GRID_CSS = `
.ts-field { --cell-gap: 3px; --cell-r: 3px; --glow: 8px; --dot: 2px }
@media (min-width: 640px) {
  .ts-field { --cell-gap: 5px; --cell-r: 4px; --glow: 12px; --dot: 3px }
}
@media (min-width: 1024px) {
  .ts-field { --cell-gap: 6px; --glow: 16px }
}

/* Phone: the job name and the saving share one line, the cells sit under
   them full width, the note is not shown. */
.ts-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 16px;
  border-top: 1px solid var(--color-cream-line);
  padding: 12px 0 14px;
}
.ts-name { grid-column: 1; grid-row: 1; display: flex; align-items: center }
.ts-save {
  grid-column: 2; grid-row: 1;
  display: flex; flex-direction: column; justify-content: center; align-items: flex-end;
}
.ts-cells { grid-column: 1 / -1; grid-row: 2; margin-top: 10px }
.ts-note { display: none }

/* Desktop: one grid for the whole field, so the sixteen columns of every
   row and the axis line up to the pixel, and the saving column is sized
   once for the widest string any row produces. Each row is two grid rows,
   cells then note, addressed through --r set on the row. */
@media (min-width: 1024px) {
  .ts-field {
    display: grid;
    /* The cells column is capped so a cell never grows past 46px: 16 cells
       and 15 gaps at 826px. The fourth column takes what is left at wide
       widths and shrinks to nothing under 1300, and a filler per row
       carries the rule across it so every rule still reaches the rail. */
    grid-template-columns: 196px minmax(0, 826px) auto minmax(0, 1fr);
  }
  .ts-legend { grid-column: 1; grid-row: 1 }
  .ts-axis { grid-column: 2; grid-row: 1 }
  .ts-row { display: contents }
  .ts-name, .ts-cells, .ts-save, .ts-fill {
    grid-row: var(--r);
    border-top: 1px solid var(--color-cream-line);
    padding-top: 12px;
  }
  .ts-name { grid-column: 1; padding-right: 32px }
  .ts-cells { grid-column: 2; margin-top: 0 }
  .ts-save { grid-column: 3; padding-left: 32px }
  .ts-fill { grid-column: 4 }
  .ts-note {
    display: block;
    grid-column: 2;
    grid-row: var(--rn);
    padding: 8px 0 12px;
  }
}

.ts-cells {
  display: grid;
  grid-template-columns: repeat(16, minmax(0, 1fr));
  gap: var(--cell-gap);
}
.ts-c {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--cell-r);
  border: 1px solid var(--color-cream-line-strong);
  background-color: transparent;
}
.ts-on {
  background-color: var(--color-lime);
  border-color: var(--color-lime-bright);
  box-shadow:
    0 0 var(--glow) color-mix(in oklab, var(--color-lime) 55%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.22);
}
.ts-nil { border-color: transparent }
.ts-nil::before {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: var(--dot);
  height: var(--dot);
  border-radius: 999px;
  background: var(--color-cream-line-strong);
}
${CELL_INDEX_CSS}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (max-height: 2400px) {
    .ts-off {
      animation: ts-off 1s linear both;
      animation-timeline: view();
      animation-range:
        cover calc(8% + (var(--i) - var(--a)) * 3%)
        cover calc(10.5% + (var(--i) - var(--a)) * 3%);
    }
    .ts-on {
      animation: ts-on 1s linear both;
      animation-timeline: view();
      animation-range: cover 8% cover 32%;
    }
  }
}
@keyframes ts-off {
  from { background-color: var(--color-cream-line) }
  to   { background-color: transparent }
}
@keyframes ts-on {
  from {
    background-color: var(--color-cream-line);
    border-color: var(--color-cream-line-strong);
    box-shadow:
      0 0 var(--glow) transparent,
      inset 0 1px 0 transparent;
  }
  to {
    background-color: var(--color-lime);
    border-color: var(--color-lime-bright);
    box-shadow:
      0 0 var(--glow) color-mix(in oklab, var(--color-lime) 55%, transparent),
      inset 0 1px 0 rgb(255 255 255 / 0.22);
  }
}`;

/** `--r` the row's first grid row, `--rn` the note's row under it (set
 *  here rather than as `calc(var(--r) + 1)` so no engine has to accept a
 *  calc() where it expects an integer), `--a` the row's `after`. */
type RowStyle = CSSProperties & { "--r": number; "--rn": number; "--a": number };

/**
 * Band 5, time back. Four ordinary office jobs, before and after, on one
 * shared scale of 0 to `scaleMax` hours per person per week, drawn as a
 * grid of hours rather than two bars.
 *
 * ONE FIELD, NOT FOUR ARTICLES. The whole argument is that four jobs sit
 * on the same axis. Four rows share one axis drawn once, one set of
 * hairline rules and one grid, so a lit cell in row three is exactly under
 * a lit cell in row one.
 *
 * EVERY NUMBER IS TEXT. The cells are decorative and hidden from assistive
 * technology. The saving ("8 h back") and the pair it comes from
 * ("Today 12 h, With AI 4 h") are ordinary text on the right of every row,
 * in reading order after the job name, so nothing in this band depends on
 * seeing colour or counting squares. Rows are never summed: four
 * different people's weeks do not add up to a number that means anything.
 *
 * The footnote is not decoration. It is the one piece of risk copy on the
 * page and it ships with the band or the band does not ship.
 */
export default function TimeSaved({ dict }: { dict: TimeSavedDict }) {
  // Defensive clamp: a row longer than the declared scale would overflow.
  const scale = Math.max(dict.scaleMax, ...dict.items.map((i) => i.before));
  const columns = Array.from({ length: scale }, (_, i) => i);
  const back = dict.backLabel ?? BACK_FALLBACK;
  // The two-tone h2 supplies the full stop, so a locale cannot ship one twice.
  const title = dict.title.replace(/\s*\.\s*$/, "");

  // `scroll-mt-24`: the hero's secondary button anchors to `#time-saved` and
  // the header sits fixed over the top of the page.
  return (
    <section
      id="time-saved"
      className="scroll-mt-24 border-t border-cream-line bg-cream"
    >
      <style dangerouslySetInnerHTML={{ __html: GRID_CSS }} />

      <div className="pc-shell">
        <div className="pc-rules">
          {/* S1, the shared band header. Closes with its own rule; the field
              below opens with its own padding. */}
          <div className="pc-grid border-b border-cream-line pt-14 pb-6 lg:pt-16 lg:pb-7 xl:pt-20">
            <div
              className="col-[3/-3] flex flex-col items-start gap-5 lg:col-[2/-2]"
              data-reveal
            >
              <span className="pc-pill">{dict.label}</span>
              <h2 className="display max-w-[22em] text-heading-md text-balance">
                <span className="text-ink">{title}. </span>
                {dict.greyClause ? (
                  <span className="text-ink-soft">{dict.greyClause}</span>
                ) : null}
              </h2>
            </div>
          </div>

          <div className="pc-grid py-5 lg:py-6">
            <div className="col-[3/-3] lg:col-[2/-2]">
              <div className="ts-field">
                {/* The legend, once, in the label column beside the axis. */}
                <ul className="ts-legend flex flex-wrap items-center gap-x-5 gap-y-1.5 pb-3 lg:pb-0">
                  {[dict.beforeLabel, dict.afterLabel].map((legend, i) => (
                    <li
                      key={legend}
                      className="flex items-center gap-2 text-[12px] leading-none text-ink-mute"
                    >
                      <span
                        aria-hidden
                        className={`ts-c size-3 shrink-0 ${i === 0 ? "" : "ts-on"}`}
                        style={{ "--glow": "6px" } as CSSProperties}
                      />
                      {legend}
                    </li>
                  ))}
                </ul>

                {/* The axis, drawn once for all four rows, exactly as wide as
                    the cells under it. */}
                <div className="ts-axis relative flex h-[18px] items-end justify-between border-b border-cream-line pb-1 text-[12px] leading-none text-ink-mute tabular-nums">
                  <span>0</span>
                  <span
                    aria-hidden
                    className="absolute bottom-1 left-1/2 -translate-x-1/2"
                  >
                    {scale / 2}
                  </span>
                  <span>
                    {scale} {dict.unit}
                  </span>
                </div>

                {dict.items.map((item, index) => {
                  const saved = Math.max(item.before - item.after, 0);
                  const style: RowStyle = {
                    "--r": 2 + index * 2,
                    "--rn": 3 + index * 2,
                    "--a": item.after,
                  };

                  return (
                    <div key={item.id} className="ts-row" style={style}>
                      <div className="ts-name text-[16px] leading-[1.3] font-medium text-ink">
                        {item.name}
                      </div>

                      {/* Sixteen hours. Decorative: every value it draws is
                          repeated as text in `.ts-save`. */}
                      <div className="ts-cells" aria-hidden>
                        {columns.map((i) => {
                          const state =
                            i < item.after
                              ? "ts-on"
                              : i < item.before
                                ? "ts-off"
                                : "ts-nil";
                          return <span key={i} className={`ts-c ${state}`} />;
                        })}
                      </div>

                      <div className="ts-save">
                        <span className="text-[15px] leading-none font-medium whitespace-nowrap text-lime-soft tabular-nums">
                          {saved} {dict.unit} {back}
                        </span>
                        <span className="mt-2 text-[12px] leading-none whitespace-nowrap text-ink-mute tabular-nums">
                          <span className="sr-only">{dict.beforeLabel} </span>
                          {item.before} {dict.unit}{" "}
                          <span aria-hidden>&rarr;</span>{" "}
                          <span className="sr-only">{dict.afterLabel} </span>
                          {item.after} {dict.unit}
                        </span>
                      </div>

                      {/* Carries the row rule across the fourth column at
                          wide widths. Empty on purpose. */}
                      <div className="ts-fill max-lg:hidden" aria-hidden />

                      {/* What the freed hours go into. The human half of the
                          argument, one line, desktop only. */}
                      <p className="ts-note max-w-[70ch] text-[13px] leading-[1.5] text-ink-mute">
                        {item.instead}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Non-negotiable: the band does not ship without this line.
                  The rule belongs to the wrapper, not to the paragraph, so it
                  closes the field at the same width as the four row rules
                  while the text keeps a 70ch reading measure. */}
              <div
                className="mt-2 border-t border-cream-line pt-4 lg:mt-0"
                data-reveal
                style={{ "--reveal-delay": "0.1" } as CSSProperties}
              >
                <p className="max-w-[70ch] text-[13px] leading-[1.6] text-ink-mute">
                  {dict.footnote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
