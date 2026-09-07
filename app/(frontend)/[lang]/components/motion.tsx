"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ *
 *  THE ENTRANCE WRAPPERS
 *
 *  These used to be framer-motion elements carrying `initial="hidden"`
 *  with `whileInView="show"`. That shipped 44 elements from the server at
 *  `opacity:0;filter:blur(1.5px)` and then depended on an intersection
 *  callback plus a running frame loop to undo it. Above the fold that
 *  covered the hero eyebrow, the subtext and both calls to action, so
 *  three separate faults each produced a hero that was a headline on
 *  white: JavaScript off or still hydrating, a missed callback for an
 *  element already inside the viewport at mount, or a starved frame loop
 *  in a background tab or under low power.
 *
 *  They are now plain DOM. All three emit a `data-` attribute and, where
 *  it applies, a `--reveal-delay` custom property, and every pixel of the
 *  animation lives in `globals.css` under a `view()` scroll timeline with
 *  `opacity: 1` as its floor. Nothing on the page depends on JavaScript
 *  to become visible any more, and the worst case is now "it appeared
 *  without animating".
 *
 *  Every prop is kept. Ten files import these and none of them change.
 * ------------------------------------------------------------------ */

type RevealStyle = CSSProperties & { "--reveal-delay"?: string };
type StaggerStyle = CSSProperties & { "--reveal-gap"?: string };

/* ------------------------------------------------------------------ *
 *  Reveal: resolves content into focus as it enters the viewport
 *
 *  It blurs, it does not move. Nothing shifts under the reader's eye, so
 *  a reveal that fires mid-sentence never costs anyone their place.
 *  `delay` is a fraction of the entry range, not a duration: the CSS
 *  reads it as `entry calc(delay * 30%)`, which keeps the existing call
 *  sites (0 to 0.2) landing in the same order they always did.
 * ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** @deprecated Reveals blur, they do not translate. Accepted and ignored. */
  y?: number;
  /** @deprecated The reveal is a scroll timeline now, so there is nothing to
   *  re-fire. Accepted and ignored. */
  once?: boolean;
  as?: "div" | "span" | "li" | "section";
}) {
  const Tag = as;
  const style: RevealStyle = { "--reveal-delay": String(delay) };

  return (
    <Tag className={className} data-reveal style={style}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 *  Stagger: reveals children one after another
 *
 *  The container animates nothing itself. It publishes `--reveal-gap` and
 *  the CSS gives each direct child its step by position, so `StaggerItem`
 *  needs no index and no call site changes. The default gap is 70ms worth
 *  of the entry range: above roughly 80ms the last card in a row arrives
 *  visibly late and the grid reads as a queue.
 * ------------------------------------------------------------------ */
export function Stagger({
  children,
  className,
  gap = 0.07,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  /** @deprecated Nothing to re-fire on a scroll timeline. Accepted and ignored. */
  once?: boolean;
}) {
  const style: StaggerStyle = { "--reveal-gap": String(gap) };
  return (
    <div className={className} data-reveal-stagger style={style}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** @deprecated Same rule as `Reveal`: blur, never translate. Ignored. */
  y?: number;
}) {
  return (
    <div className={className} data-reveal>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  CountUp: animates a number once it scrolls into view
 *
 *  The one wrapper that legitimately needs JavaScript, because there is
 *  no CSS that counts. It is not used on the homepage any more, and its
 *  failure mode is safe by construction: the FINAL value is what the
 *  server renders, so the figure is right from the first paint and with
 *  JavaScript off, and the count from zero only starts once the span is
 *  in view. What the reader sees is a number settling, never a page
 *  waiting.
 * ------------------------------------------------------------------ */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.8,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- jump to final value when reduced motion is preferred
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
