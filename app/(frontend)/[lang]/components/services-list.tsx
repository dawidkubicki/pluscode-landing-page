"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import LocaleLink from "./locale-link";
import { Arrow } from "./ui";
import CapabilityScene, { useMediaQuery } from "./capability-scene";

export type ServiceItem = {
  num: string;
  title: string;
  desc: string;
  tags: string;
  /** One plain sentence describing the scene on the stage. */
  caption?: string;
};

/** How long each capability holds the stage before the row advances. */
const AUTO_MS = 7000;

/* The progress rule under the active cell. A transform on a 2px line, so it
   costs nothing to run and restarts by remount whenever the cell changes. */
const TAB_CSS = `
@keyframes pc-tab-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.pc-tab-progress {
  transform-origin: left;
  animation: pc-tab-progress ${AUTO_MS}ms linear forwards;
}`;

/**
 * The capability tab row and the one stage under it.
 *
 * Five flush cells divided by a hairline, then one well that holds the active
 * capability: a short block of copy in the first eight columns and ONE
 * three.js object behind it, framed into the right two thirds and bleeding
 * to the well's edges. The object does not swap between tabs, it morphs: the
 * same two thousand sheets take up a new arrangement for each capability
 * (see `capability-scene.tsx`).
 *
 * The active index is the entire state machine. `aria-selected` drives the
 * ground change, the 2px accent bar and which panel the stage announces, and
 * the active tab is the only one in the tab sequence, so a keyboard reaches
 * the row in one Tab and moves inside it with the arrow keys.
 *
 * AUTO-ADVANCE. While the stage is on screen and nobody has touched it, the
 * row moves on every seven seconds with a thin rule wiping across the active
 * cell, so a reader who scrolls past sees all five shapes without doing
 * anything. It stops for good on the first click, tab focus or hover over the
 * stage: a thing the visitor is reading must not change under them. Reduced
 * motion never auto-advances.
 */
export function CapabilityTabs({
  items,
  hrefs,
  label,
  linkLabel,
}: {
  items: readonly ServiceItem[];
  /** Index-aligned with `items`. Owned by `services.tsx`. */
  hrefs: readonly string[];
  /** Names the tab row for assistive tech. From `services.label`. */
  label: string;
  /** From `shared.learnMore`, so the link is not English in Polish. */
  linkLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const row = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  // Which end of the scroller still has cells past it. A scrim that is always
  // on erases the first letter of the active cell while the row is at rest,
  // which is worse than no scrim: it has to mean "there is more this way".
  const [more, setMore] = useState({ start: false, end: true });

  /** The visitor has taken over. Never re-armed. */
  const stop = useCallback(() => setAuto(false), []);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const sync = () => {
      const max = el.scrollWidth - el.clientWidth;
      setMore({ start: el.scrollLeft > 4, end: el.scrollLeft < max - 4 });
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, []);

  // The stage has to be mostly on screen for the row to advance, so the reader
  // meets state 01 first instead of whichever one the clock landed on.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rotating = auto && inView && !reduced;
  useEffect(() => {
    if (!rotating) return;
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % items.length),
      AUTO_MS,
    );
    return () => window.clearTimeout(id);
  }, [rotating, active, items.length]);

  // Below lg the row is a scroller: keep the active cell in it, whether the
  // clock or the visitor picked it. The 40px matches `scroll-pl-10` on the
  // row, so the cell lands on its own snap point, clear of the left scrim,
  // with the tail of the previous cell fading out under it.
  useEffect(() => {
    const el = row.current;
    const cell = tabs.current[active];
    if (!el || !cell || el.scrollWidth <= el.clientWidth + 4) return;
    el.scrollTo({
      left: Math.max(0, cell.offsetLeft - 40),
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active, reduced]);

  const item = items[active];
  if (!item) return null;

  /** Automatic activation, per the tabs pattern: moving selects. */
  const move = (next: number) => {
    const i = (next + items.length) % items.length;
    setActive(i);
    tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: items.length - 1,
    };
    const next = keys[e.key];
    if (next === undefined) return;
    e.preventDefault();
    move(next);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TAB_CSS }} />

      {/* THE TAB ROW. Flush cells, `gap-px` over a hairline ground, no
          radius and no shadow. Below lg it becomes one snapping scroller
          with a scrim at each edge, because five readable cells do not fit
          across a phone and stacking them would cost 360px of band.

          The cells are a fixed 208px there rather than sized by their own
          text: a content-width cell made tab 02 271px wide and pushed its
          single line of title straight through the viewport edge. At 208 the
          title wraps inside its own cell, exactly as it does in the lg grid,
          and the edge only ever crosses a wrapped line under the scrim. */}
      <div className="relative border-b border-cream-line">
        <div
          ref={row}
          role="tablist"
          aria-label={label}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          onPointerDown={stop}
          onFocus={stop}
          className="flex snap-x snap-mandatory gap-px overflow-x-auto scroll-pl-10 bg-cream-line [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:overflow-x-visible lg:scroll-pl-0 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((t, i) => {
            const on = i === active;
            return (
              <button
                key={t.num}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`capability-tab-${i}`}
                aria-selected={on}
                aria-controls={on ? `capability-stage-${i}` : undefined}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`group relative flex h-[72px] w-[208px] shrink-0 snap-start flex-col justify-center gap-1 overflow-hidden px-5 text-left transition-colors duration-200 ease-io-attio focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime lg:h-[88px] lg:w-auto lg:px-6 ${
                  on ? "bg-cream" : "bg-cream-dim hover:bg-cream-surface hover:duration-50"
                }`}
              >
                {/* The marker: a ground change plus a 2px rule wiping in
                    from the left edge of the cell. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left bg-lime transition-transform duration-[240ms] ease-out-cubic ${
                    on ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                {/* The clock: a rule wiping across the bottom of the active
                    cell for as long as the row is advancing on its own. */}
                {on && rotating ? (
                  <span
                    aria-hidden="true"
                    className="pc-tab-progress pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-lime/70"
                  />
                ) : null}
                <span className="text-[12px] font-semibold uppercase leading-none tracking-[0.06em] tabular-nums text-ink-mute">
                  {t.num}
                </span>
                <span className="line-clamp-2 text-[16px] font-medium leading-[1.3] text-ink">
                  {t.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* The scroller's two edges. Below lg only, and starting under the
            accent bar so they never cover the marker on the first cell. Each
            one is tied to its own end of the scroll range, so at rest only
            the right edge is veiled and the first cell keeps its first
            letter. The ground holds solid for the first third so a word
            fades out instead of being cut. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 left-0 top-0.5 w-16 bg-gradient-to-r from-cream-dim from-35% to-transparent transition-opacity duration-200 ease-io-attio lg:hidden ${
            more.start ? "opacity-100" : "opacity-0"
          }`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 right-0 top-0.5 w-16 bg-gradient-to-l from-cream-dim from-35% to-transparent transition-opacity duration-200 ease-io-attio lg:hidden ${
            more.end ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* THE STAGE. Its bottom edge is the band's bottom rule, so the band
          ends on the object rather than on a padding value. The scene fills
          the whole well and frames itself: into the right two thirds above
          lg, into the lower half below it, where the copy sits on top. */}
      <div
        ref={stage}
        id={`capability-stage-${active}`}
        role="tabpanel"
        aria-labelledby={`capability-tab-${active}`}
        onPointerEnter={stop}
        className="relative h-[560px] overflow-hidden bg-cream-surface"
      >
        <CapabilityScene index={active} className="absolute inset-0" />

        {/* The seam between the copy and the object, on the column field. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[calc(100%*9/24)] hidden w-px bg-cream-line lg:block"
        />

        <div className="pc-grid relative z-10 lg:h-full">
          <div className="col-[2/-2] flex flex-col items-start gap-3 pt-8 lg:col-[2/10] lg:h-full lg:justify-center lg:gap-4 lg:pt-0">
            <h3 className="display text-heading-xs text-ink">{item.title}</h3>
            <p className="max-w-[26em] text-[16px] leading-[1.55] text-ink-soft">
              {item.desc}
            </p>
            {/* The caption of the picture, marked with a short accent rule so
                it reads as belonging to the object and not to the copy. */}
            {item.caption ? (
              <p className="flex max-w-[26em] items-start gap-2.5 text-[13px] leading-[1.6] text-ink-mute">
                <span
                  aria-hidden="true"
                  className="mt-[9px] h-px w-4 shrink-0 bg-lime"
                />
                <span>{item.caption}</span>
              </p>
            ) : null}
            <p className="max-w-[26em] text-[13px] leading-[1.6] text-ink-mute">
              {item.tags}
            </p>
            <LocaleLink
              href={hrefs[active] ?? "/services"}
              aria-label={`${linkLabel}: ${item.title}`}
              className="group/link -mt-1 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-lime-ink transition-colors hover:text-lime-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
            >
              {linkLabel}
              <Arrow className="size-3.5 transition-transform duration-200 ease-io-attio group-hover/link:translate-x-0.5" />
            </LocaleLink>
          </div>
        </div>
      </div>
    </>
  );
}
