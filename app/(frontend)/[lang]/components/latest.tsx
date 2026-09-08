"use client";

/* ------------------------------------------------------------------ *
 *  INSIGHTS. Five items on one tab strip with one of them open beneath:
 *  the tags run across the top as a row of text buttons sitting on a
 *  hairline, the open item is a wide image with its tag, headline,
 *  standfirst and link in the last quarter beside it, and the strip moves
 *  on by itself every seven seconds. It is the reference's "Latest
 *  insights" band, and the clock is what makes it read as one.
 *
 *  "use client" because the open item is local state, the tags are real
 *  buttons, and the auto-advance is a timer that has to know whether the
 *  reader has keyboard focus inside, has scrolled away, or has asked the
 *  OS for less motion. Nothing else on the band needs the client.
 *
 *  THE MOUSE DOES NOT STOP THE CLOCK. Hovering the band, a tag or the
 *  link leaves the timer and the bar running: the reader is reading, not
 *  asking the carousel to freeze, and a band that stalls under the
 *  pointer feels broken to anyone whose cursor happens to rest there.
 *  Only keyboard focus holds it, and only `:focus-visible` focus at
 *  that, so the hold is taken exactly when the browser would also draw
 *  the ring. That keyboard hold is the band's WCAG 2.2.2 pause
 *  mechanism, so it stays: a reader stepping through the tags with the
 *  arrow keys is never moved off the item under their fingers. Scrolling
 *  the band off screen and asking for reduced motion still stop it, and
 *  a click on a tag still restarts the seven seconds from zero.
 *
 *  THE OLD ORDER TRICK IS GONE. The previous cut listed the tags down the
 *  left with the open item beside them, and because the phone's four
 *  column grid collapsed that split, it slotted the panel under the
 *  selected tag with `order` on the phone while md placed every child by
 *  explicit row and column. This cut stacks the same way at every width,
 *  strip then image then text, so there is no second layout to reconcile:
 *  the strip scrolls sideways on the phone instead of wrapping, and the
 *  row under it is an ordinary grid. One DOM still serves both widths, it
 *  just no longer needs `order` or row placement to do it.
 *
 *  THE BAR IS THE CLOCK. The 3px line under the active tag is not a
 *  static marker: it is a CSS keyframe that grows from nothing to the
 *  full width of the tag over the same 7000ms the timer waits, so the
 *  reader can see how long the item stays before the next one opens. The
 *  two are kept in step by sharing one constant and by remounting the bar
 *  (its `key` is the active index plus a cycle counter) whenever the
 *  clock restarts, so a click, focus leaving, or the band scrolling back
 *  into view all put the bar back to zero together with the timer.
 *
 *  IT GROWS BY `transform`, NOT BY `width`. A width keyframe is a layout
 *  animation: every frame of it is laid out and painted on the main
 *  thread, so the seven seconds of bar would visibly stutter under the
 *  work of the item change beside it. `scaleX` from a left origin draws
 *  the identical line on the compositor and cannot be disturbed by
 *  anything the panel is doing.
 *
 *  THE FILL RUNS OVER A TRACK. A bar at zero is no bar at all, and every
 *  cycle starts there: for the first fraction of a second after an item
 *  opens, and for as long as a keyboard reader holds the clock on a tag
 *  they have just arrived at, the fill has no width to see. So the
 *  active tag always gets a full width 3px line in sage and the ink fill
 *  grows over it, which means the tag the reader chose carries a marker
 *  from the first frame. Sage is a palette mark, not an accent, and it is
 *  the only place on the band that is neither ink nor moss nor rule.
 *
 *  ALL FIVE IMAGES ARE IN THE BOX AT ONCE, stacked with `fill`. Swapping
 *  the `src` of one image would show the paper-dim ground for as long as
 *  the next file took to arrive, and on a seven second cadence that flash
 *  would be the most visible thing on the band. Five images in the DOM
 *  cost a few requests up front and nothing after that. None of them is
 *  `priority`: the band is below the fold.
 *
 *  THE CHANGE IS ONE MOVEMENT, NOT TWO. The incoming image is raised
 *  above the outgoing one and fades in over it while settling from 104%
 *  to 100%, so it arrives rather than appears. The outgoing frame is not
 *  dissolved against it: it is held solid underneath for exactly the
 *  length of the fade and then dropped in a single frame, so the two are
 *  never both semi transparent and the pair never reads as a double
 *  exposure over the ground. The text column follows a breath later, its
 *  two groups fading up a few pixels one after the other, which is what
 *  ties the picture and the words into one change instead of a crossfade
 *  with a jump-cut beside it. Everything moves on `opacity` and
 *  `transform` only, so no line of the band is ever re-laid out: no
 *  reflow, no height jump, no scrollbar twitch. Under
 *  `prefers-reduced-motion` the copy animation is not declared at all and
 *  globals.css clamps the image transition to nothing, so the item simply
 *  changes.
 * ------------------------------------------------------------------ */

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** One item of the band. The CMS-backed parent builds these and hands
 *  them down, so the shape lives here rather than in `lib/`. */
export type LatestItem = Dictionary["home"]["latest"]["items"][number];

/** How long each item stays open. The timer and the bar's keyframe both
 *  read this one constant, which is what keeps the line reaching the right
 *  edge at the same moment the next item opens. */
const DWELL_MS = 7000;

/* The item change, in milliseconds. The image leads, the copy follows,
 * and the second group of copy follows the first. Kept together here
 * because the numbers only make sense as a sequence: the words have
 * settled inside three quarters of a second and the picture has finished
 * settling at one, which is a seventh of a dwell. */
const SHOT_MS = 700;
const COPY_MS = 480;
const COPY_DELAY_MS = 150;
const COPY_STEP_MS = 90;

/* THE BAND'S PRIVATE STYLESHEET, for the same reason platform.tsx has
 * one: a keyframe has to be declared somewhere, and declaring it beside
 * the elements that run it keeps globals.css free of a band's private
 * animation. It also lets the durations above be the single source for
 * both the timer and the CSS, which a Tailwind arbitrary value could not
 * do because those are scanned as literal strings at build time.
 *
 * The bar. `forwards` holds the line at full width for the frame between
 * the animation ending and the next item mounting, so it never snaps back
 * to zero before it is replaced. The paused state is a data attribute
 * rather than a class swap because the attribute reads as state in the
 * markup, which is what it is.
 *
 * The image. Every frame is `opacity: 0; scale(1.04)` and out of the way
 * at `z-index: 0`; the open one is raised, opaque and at rest. The closed
 * rule's transition is the one that matters: a 1ms change delayed by a
 * little more than the whole fade means the frame that has just closed
 * keeps its opacity and its scale until the incoming frame has finished
 * covering it, and only then blinks out underneath. The 80ms of slack is
 * there so the drop can never land a frame early and show the ground.
 * That is what makes this a cover rather than a cross-dissolve.
 *
 * The copy. Declared only under `no-preference`, so a reader who has
 * asked for less motion gets the text at rest even in the server's markup,
 * with no flash of a delayed fill mode while the client catches up.
 * Reduced motion for the bar is handled in the component instead: the
 * global rule at the foot of globals.css clamps every animation to
 * 0.001ms, which would leave this one held at full width by `forwards`,
 * and that is exactly the static line the component draws for that
 * preference anyway. */
const BAND_CSS = `
@keyframes pc-insights-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.pc-insights-bar {
  width: 100%;
  transform-origin: left center;
  animation: pc-insights-fill ${DWELL_MS}ms linear forwards;
}
.pc-insights-bar[data-paused="true"] {
  animation-play-state: paused;
}
.pc-insights-shot {
  opacity: 0;
  transform: scale(1.04);
  z-index: 0;
  transition:
    opacity 1ms linear ${SHOT_MS + 80}ms,
    transform 1ms linear ${SHOT_MS + 80}ms;
}
.pc-insights-shot[data-open="true"] {
  opacity: 1;
  transform: scale(1);
  z-index: 1;
  transition:
    opacity ${SHOT_MS}ms var(--ease-out-cubic),
    transform ${SHOT_MS + 300}ms var(--ease-out-cubic);
}
@media (prefers-reduced-motion: no-preference) {
  @keyframes pc-insights-copy {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }
  .pc-insights-copy > * {
    animation: pc-insights-copy ${COPY_MS}ms var(--ease-out-cubic) both;
    animation-delay: ${COPY_DELAY_MS}ms;
  }
  .pc-insights-copy > * + * {
    animation-delay: ${COPY_DELAY_MS + COPY_STEP_MS}ms;
  }
}
`;

/* `prefers-reduced-motion`, read through useSyncExternalStore rather than
 * through an effect that sets state. The media query is an external store
 * with a subscribe and a snapshot, which is exactly the hook's shape, and
 * the value is then right on the first client render instead of one render
 * late. The server snapshot is `false` so the markup matches a client
 * without the preference; a client with it re-renders once on hydration,
 * which turns a 3px line from animated into still and nothing else. */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const readReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const readReducedOnServer = () => false;

export default function Latest({
  dict,
  items: cmsItems,
}: {
  dict: Dictionary["home"]["latest"];
  /** The published items, when the band is driven by the CMS. The parent
   *  fetches them; an empty or missing list falls back to the dictionary,
   *  so the band is never blank while the collection is being filled. */
  items?: LatestItem[] | null;
}) {
  const items = cmsItems && cmsItems.length > 0 ? cmsItems : dict.items;
  const count = items.length;

  const [index, setIndex] = useState(0);
  /* Bumped whenever the clock restarts without the item changing, so the
     bar's key still changes and it remounts at zero. */
  const [cycle, setCycle] = useState(0);
  const [focused, setFocused] = useState(false);
  /* False until the observer says otherwise, so a band below the fold does
     not start counting before the reader has reached it. */
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    readReduced,
    readReducedOnServer,
  );

  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const running = visible && !focused && !reduced;

  /* The dictionary list and a CMS list can be different lengths, and the
     open index survives the swap between them, so it is clamped on read
     rather than trusted. The timer's own modulo fixes the state itself on
     the next tick. */
  const openIndex = index < count ? index : 0;
  const current = items[openIndex];
  const external = current.href.startsWith("http");
  const tabId = (key: string) => `insights-tab-${key}`;

  const restart = () => setCycle((c) => c + 1);

  /** A choice made by the reader. It opens the item and restarts the clock
   *  even when the item is the one already open, because a click on the
   *  active tag reads as "stay here", and a full seven seconds is the least
   *  that should mean. */
  const select = (i: number) => {
    setIndex(i);
    restart();
  };

  /* THE CLOCK. One timeout per open item, and the cleanup clears it, so a
     change of item, a restart, and a hold all tear down the pending advance
     and, if the band is still running, the effect sets a fresh one. `index`
     and `cycle` are in the list precisely so the effect reruns for them:
     nothing in the body reads them, the rerun is the point. */
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % count);
    }, DWELL_MS);
    return () => window.clearTimeout(id);
  }, [running, index, cycle, count]);

  /* Off screen, the clock stops: advancing a band nobody can see would
     mean the reader scrolls back to a different item than the one they
     left, with no way of knowing why. A quarter of the band is enough to
     count as seen. Coming back into view restarts from zero rather than
     from wherever the bar was left, so the timer and the line agree. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setCycle((c) => c + 1);
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* On the phone the strip is wider than the screen, and the clock keeps
     moving whether or not the next tag is in view. This scrolls the strip,
     and only the strip, so the active tag is visible: `scrollIntoView` is
     avoided on purpose because it would also scroll the page whenever the
     band is only partly on screen, and hijacking the reader's scroll every
     seven seconds is far worse than a tag being off to one side. The first
     tab's offset is the strip's own padding, so subtracting it lands the
     active tag where the first one rests. */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const tabs = strip.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const tab = tabs[openIndex];
    const first = tabs[0];
    if (!tab || !first) return;
    const left = tab.offsetLeft;
    const right = left + tab.offsetWidth;
    const inView =
      left >= strip.scrollLeft &&
      right <= strip.scrollLeft + strip.clientWidth;
    if (inView) return;
    strip.scrollTo({
      left: left - first.offsetLeft,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [openIndex, reduced]);

  /* Automatic activation, as the ARIA tabs pattern describes it: an arrow
     key both moves focus and opens the item, and the tabs roll their
     tabindex so Tab itself steps past the strip into the panel. Home and
     End are the pattern's two optional keys and cost one line each. */
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (openIndex + 1) % count;
    else if (event.key === "ArrowLeft") next = (openIndex - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    select(next);
    stripRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  };

  /* THE ONE HOLD. Keyboard focus, and nothing else. Focus events bubble in
     React, so one pair on the section covers every tab and the link, and
     losing focus to somewhere outside the band restarts the clock from zero
     rather than dropping the reader back into a half-run cycle.

     ONLY KEYBOARD FOCUS COUNTS. A mouse click leaves focus on the tab it
     pressed, and that focus stays there after the pointer has moved on, so
     if every focus were a hold the first click would stop the clock for
     good: the reader picks an item, walks away, and the band never moves
     again. `:focus-visible` is exactly the distinction wanted, it is true
     for focus that arrived by keyboard and false for focus that arrived by
     pointer. */
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target.matches(":focus-visible")) setFocused(true);
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    const to = event.relatedTarget;
    if (to instanceof Node && event.currentTarget.contains(to)) return;
    if (!focused) return;
    setFocused(false);
    restart();
  };

  return (
    <section
      ref={sectionRef}
      className="bg-paper py-20 md:py-[104px]"
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {/* A <style> element renders nothing and takes no grid cell, so it
          can sit here inside the band that uses it. The child is a static
          module constant, never content from the dictionary or the CMS. */}
      <style>{BAND_CSS}</style>
      <div className="pc-shell">
        <div className="pc-grid">
          {/* Plain divs, not `Reveal`. The other home bands wrap nothing,
              so a JS-driven entrance on this one band alone made the
              middle of the page animate in and its neighbours not. The
              design is still by intent, and globals.css already gives
              every band the same CSS entrance through `[data-reveal]`. */}
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>
          <div className="col-span-4 md:col-span-6 flex flex-col items-start gap-5 md:items-end md:justify-end">
            <p className="text-[1.125rem] text-moss">{dict.intro}</p>
            <LocaleLink href="/insights" className="btn btn-primary">
              {dict.cta}
            </LocaleLink>
          </div>
        </div>

        {/* THE STRIP. Two boxes, not one, because a scroll container clips
            everything outside its padding box and the focus ring sits 4px
            outside a tab (2px outline at 2px offset). The outer box is the
            scroller: it wears 4px of padding on every side so the ring has
            room, and the same 4px of negative margin so the tags still
            start on the shell's edge and the hairline still sits where it
            would without the padding. The inner box is the tablist and
            carries the hairline; `min-w-max` is what makes the hairline
            run the full scroll width on the phone rather than stopping at
            the screen's edge, while on the page, where the tags fit, the
            box fills the shell and the line runs edge to edge. */}
        <div className="mt-16 md:mt-20">
          <div
            ref={stripRef}
            className="relative -m-1 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              role="tablist"
              aria-label={dict.title}
              className="flex min-w-max gap-10 border-b border-rule whitespace-nowrap"
            >
              {items.map((item, i) => {
                const active = i === openIndex;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="tab"
                    id={tabId(item.key)}
                    aria-selected={active}
                    aria-controls="insights-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => select(i)}
                    onKeyDown={onTabKeyDown}
                    className={`relative shrink-0 pb-5 text-[1.125rem] leading-[1.375] transition-colors duration-[240ms] ease-[var(--ease-io-attio)] ${
                      active ? "text-ink" : "text-moss hover:text-ink"
                    }`}
                  >
                    {item.tag}
                    {/* `-bottom-px` drops the bar one pixel so it covers the
                        tablist's hairline rather than resting on top of it,
                        which is what stops it reading as a 4px line with a
                        grey underside. The overhang stays inside the
                        scroller's padding, so it is not scrollable overflow.
                        The fill's key is the restart signal described at the
                        top of the file; under reduced motion it is simply
                        full width and still, with no key needed. */}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 -bottom-px h-[3px] bg-sage"
                      >
                        {reduced ? (
                          <span className="block h-full w-full bg-ink" />
                        ) : (
                          <span
                            key={`${openIndex}-${cycle}`}
                            data-paused={!running}
                            className="pc-insights-bar block h-full bg-ink"
                          />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* THE OPEN ITEM. The whole row is the tabpanel, image included,
            because the image belongs to the item and a reader arriving by
            the tab's `aria-controls` should land on all of it. */}
        <div
          role="tabpanel"
          id="insights-panel"
          aria-labelledby={tabId(current.key)}
          className="pc-grid mt-8 md:mt-12"
        >
          <div className="relative col-span-4 aspect-[4/3] overflow-hidden bg-paper-dim md:col-span-9 md:aspect-[16/9]">
            {items.map((item, i) => (
              <Image
                key={item.key}
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 767px) 100vw, 75vw"
                aria-hidden={i !== openIndex}
                data-open={i === openIndex}
                className="pc-insights-shot object-cover"
              />
            ))}
          </div>

          {/* On md the cell is as tall as the image beside it, and the
              standfirst and link sit on its floor while the tag and the
              headline hang from its ceiling: `mt-auto` on the second group
              does that, and the gap is the floor for the case where the
              column is narrow enough that the two groups would meet. On
              the phone the cell is only as tall as its text, so `mt-auto`
              has nothing to push against and the gap alone spaces them.

              The `key` is the restart: changing it remounts the two groups,
              which is what re-fires the CSS animation that lifts them into
              place. It costs nothing to remount, because nothing here holds
              state and nothing here holds focus while the clock is running:
              keyboard focus inside the panel stops the band. */}
          <div
            key={openIndex}
            className="pc-insights-copy col-span-4 flex flex-col gap-8 md:col-span-3"
          >
            <div>
              <p className="text-[0.875rem] text-moss">{current.tag}</p>
              <h3 className="mt-4 text-heading-md text-ink">{current.title}</h3>
            </div>
            <div className="md:mt-auto">
              <p className="text-[1.125rem] leading-[1.375] text-moss">
                {current.body}
              </p>
              {external ? (
                <a
                  href={current.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pc-link text-[1.125rem] mt-6 inline-block"
                >
                  {dict.readMore}
                </a>
              ) : (
                <LocaleLink
                  href={current.href}
                  className="pc-link text-[1.125rem] mt-6 inline-block"
                >
                  {dict.readMore}
                </LocaleLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
