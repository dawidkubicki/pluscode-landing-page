"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "./motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ *
 *  The one accent in this band: a 2px rule across the top of every
 *  figure that draws in from the left as the cell enters the viewport.
 *
 *  It is a scroll timeline, not an observer, for the same reason
 *  `[data-reveal]` is: the floor is the finished state, so with no JS,
 *  no `view()` support or a starved frame loop every rule is simply
 *  drawn at full length. The timeline is the cell's, not the rule's: a
 *  2px subject would give the entry range 2px of scroll and the draw
 *  would snap. Each cell publishes `--fg-i` and its rule starts 12% of
 *  the range later than the one before it, so the four rules arrive left
 *  to right rather than as one bar.
 *
 *  The `max-height` guard mirrors globals.css: a viewport as tall as the
 *  document never resolves the range and `both` would hold the rule at
 *  `from`, which is invisible. Past 2400px the floor stands.
 * ------------------------------------------------------------------ */
const RULE_CSS = `
.fg-cell { view-timeline-name: --fg-cell; view-timeline-axis: block }
.fg-rule { transform: scaleX(1); transform-origin: left center }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (max-height: 2400px) {
    .fg-rule {
      animation: fg-draw 1s linear both;
      animation-timeline: --fg-cell;
      animation-range: entry calc(var(--fg-i, 0) * 12%) entry calc(58% + var(--fg-i, 0) * 12%);
    }
  }
}
@keyframes fg-draw {
  from { transform: scaleX(0) }
  to   { transform: scaleX(1) }
}`;

type Parsed = { to: number; suffix: string; unit: boolean };

/** "40+" is 40 and "+", "7 yrs" is 7 and " yrs". Anything that does not
 *  open with digits ("EU", "UE") is not a count and renders as it is.
 *  `unit` marks an alphabetic suffix, which is set smaller beside the
 *  numeral; a bare symbol like "+" stays at full size as part of it. */
function parse(value: string): Parsed | null {
  const m = value.match(/^(\d+)(.*)$/);
  if (!m) return null;
  const suffix = m[2];
  return { to: Number(m[1]), suffix, unit: /\p{L}/u.test(suffix) };
}

/* ------------------------------------------------------------------ *
 *  Count: the numeral, counted up once it scrolls into view.
 *
 *  It differs from `CountUp` in `./motion` in one thing that matters:
 *  its first paint is the real number, not 0. `CountUp` renders 0 from
 *  the server and relies on JavaScript to reach the value, which for
 *  "40+ projects" is a wrong claim to anyone reading without it. Here
 *  the server renders 40, the count runs only after the cell is in view
 *  and only with motion allowed, and the worst case is "it did not
 *  count". The final value also stays in the DOM for assistive tech,
 *  which never hears the intermediate numbers.
 * ------------------------------------------------------------------ */
function Count({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} aria-hidden>
      {Math.round(value)}
    </span>
  );
}

type CellStyle = CSSProperties & { "--fg-i": number };

function Figure({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const parsed = parse(value);
  const style: CellStyle = { "--fg-i": index };

  return (
    <li
      className="fg-cell flex flex-col bg-cream px-5 pb-10 md:px-6 md:pb-12 lg:px-7 lg:pb-16"
      style={style}
    >
      <span aria-hidden className="fg-rule block h-0.5 w-full bg-lime" />

      <p className="display mt-7 text-[44px] leading-[0.95] tracking-[-0.03em] text-ink tabular-nums md:mt-8 md:text-[60px] lg:mt-9 lg:text-[72px]">
        {parsed ? (
          <>
            <span className="sr-only">{value}</span>
            <Count to={parsed.to} />
            {parsed.suffix && (
              <span
                aria-hidden
                className={
                  parsed.unit
                    ? "ml-[0.14em] text-[0.42em] font-medium tracking-[-0.01em] text-ink-soft"
                    : undefined
                }
              >
                {parsed.suffix.trim()}
              </span>
            )}
          </>
        ) : (
          value
        )}
      </p>

      <p className="mt-4 max-w-[15em] text-[14px] leading-[1.45] text-ink-mute md:mt-5 md:text-[15px]">
        {label}
      </p>
    </li>
  );
}

/* ------------------------------------------------------------------ *
 *  BAND 7: IN NUMBERS
 *
 *  The other half of the old proof rail: four checkable figures about
 *  this company, on their own ground, after the savings charts, where a
 *  reader asks "and can I believe you". They used to be 28px numbers in
 *  a strip beside three client names. They are 72px now, in the display
 *  face, with the accent drawn as a rule above each one and nothing
 *  else spending it: the figures are ink, the labels are the caption
 *  grey, and the four cells share hairline dividers and no other frame.
 *
 *  The values come from `hero.stats`, unchanged, so the hero's own data
 *  and this band can never disagree. Numeric ones count up on reveal.
 *
 *  Two up below lg so a phone gets a 2x2 with the hairline cross through
 *  the middle, and no figure shares a track with a label that is not its
 *  own.
 * ------------------------------------------------------------------ */
export default function Figures({
  dict,
  stats,
}: {
  dict: Dictionary["figures"];
  stats: Dictionary["hero"]["stats"];
}) {
  // The two-tone h2 supplies the full stop, so a locale cannot ship one twice.
  const title = dict.title.replace(/\s*\.\s*$/, "");
  const figures = stats.slice(0, 4);

  return (
    <section
      id="figures"
      className="scroll-mt-24 border-t border-cream-line bg-cream"
    >
      <style dangerouslySetInnerHTML={{ __html: RULE_CSS }} />

      <div className="pc-shell">
        <div className="pc-rules">
          {/* The header. No rule under it: the four accent rules are the
              top edge of the grid and a grey hairline 1px above them would
              only blur it. */}
          <div className="pc-grid pt-16 pb-10 lg:pt-20 lg:pb-12 xl:pt-24">
            <Reveal className="col-[3/-3] flex flex-col items-start gap-6 lg:col-[2/-2]">
              <span className="pc-pill">{dict.label}</span>
              <h2 className="display max-w-[22em] text-balance text-heading-md">
                <span className="text-ink">{title}. </span>
                <span className="text-ink-soft">{dict.greyClause}</span>
              </h2>
            </Reveal>
          </div>

          {/* The four-up. `gap-px` over the hairline colour is the divider;
              each cell paints the page ground back over it. Flush to the
              next band's top rule. */}
          <div className="pc-grid">
            <ul className="col-[2/-2] grid grid-cols-2 gap-px bg-cream-line lg:grid-cols-4">
              {figures.map((s, i) => (
                <Figure key={s.value} value={s.value} label={s.label} index={i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
