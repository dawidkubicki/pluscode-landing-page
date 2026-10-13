import type { CSSProperties, ReactNode } from "react";

/**
 * Entrance wrappers. They are plain DOM: each emits a `data-` attribute and a
 * custom property, and the animation itself lives in globals.css on a
 * `view()` scroll timeline whose floor is `opacity: 1`. Nothing waits on
 * JavaScript to become visible, so these are safe above the fold and in
 * server components.
 */

type RevealStyle = CSSProperties & { "--reveal-delay"?: string };
type StaggerStyle = CSSProperties & { "--reveal-gap"?: string };

/** Fades and lifts its content as it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** A fraction of the entry range (0 to about 0.3), not a duration. */
  delay?: number;
  as?: "div" | "span" | "li" | "section" | "p" | "h1" | "h2" | "h3";
}) {
  const style: RevealStyle = { "--reveal-delay": String(delay) };
  return (
    <Tag className={className} data-reveal style={style}>
      {children}
    </Tag>
  );
}

/** Reveals its direct children one after another, by position. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const style: StaggerStyle = { "--reveal-gap": String(gap) };
  return (
    <Tag className={className} data-reveal-stagger style={style}>
      {children}
    </Tag>
  );
}

/** One child of a `Stagger`. */
export function StaggerItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag className={className} data-reveal>
      {children}
    </Tag>
  );
}
