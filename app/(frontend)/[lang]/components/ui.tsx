import type { ReactNode } from "react";
import LocaleLink from "./locale-link";

/* ------------------------------------------------------------------ *
 *  SHARED PRIMITIVES, restyled onto the September 2026 system.
 *
 *  Twenty files import from here, so every export below is kept with the
 *  props it always had. What changed is only what they render: square
 *  geometry, one weight, no tracking, no shadow, no glow and no accent
 *  hue. Anything that existed purely to decorate the old dark surfaces
 *  now returns null rather than being deleted, so no caller has to be
 *  edited to keep compiling.
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 *  Spacer: vertical space between two bands.
 *
 *  It used to draw the two vertical hairlines of the old ruled grid. The
 *  rebuilt bands separate by ground and padding instead, so this is now
 *  plain space on the page ground, at the same two heights it always
 *  offered, collapsing on a phone where the taller value reads as a hole.
 * ------------------------------------------------------------------ */
export function Spacer({ h = 120 }: { h?: 120 | 96 }) {
  return (
    <div
      aria-hidden
      className={`bg-paper h-10 ${h === 96 ? "md:h-[96px]" : "md:h-[120px]"}`}
    />
  );
}

/* ------------------------------------------------------------------ *
 *  BandGlow: gone.
 *
 *  This was a radial accent light rising under a closing band on the old
 *  dark design. The new system has no glows and no gradients at all:
 *  separation comes from a hairline or from a change of ground, never
 *  from light. The export stays because four components still render it,
 *  and it renders nothing.
 * ------------------------------------------------------------------ */
export function BandGlow(_props: { className?: string }) {
  void _props;
  return null;
}

/* The "+" marker, used as a list bullet on the industry and about pages.
   Hairline stroke and square caps so it reads as ruling rather than as an
   icon. It inherits its colour from the text around it. */
export function Plus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  Eyebrow: the label above a heading.
 *
 *  Not a pill any more, and never uppercase: 14px, sentence case, in the
 *  muted green. `dark` is the only thing the component needs to know,
 *  because the muted green has no contrast on ink and sage is its
 *  counterpart there.
 * ------------------------------------------------------------------ */
export function Eyebrow({
  children,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center text-[0.875rem] leading-[1.15] ${
        dark ? "text-sage" : "text-moss"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/** @deprecated Use `Eyebrow`. Kept so older imports keep resolving. */
export function MonoLabel({
  children,
  withPlus = false,
  className = "",
}: {
  children: ReactNode;
  withPlus?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[0.875rem] leading-[1.15] text-moss ${className}`}
    >
      {withPlus && <Plus className="size-3" />}
      {children}
    </span>
  );
}

/** @deprecated Use `Eyebrow`. A hairline box, no fill and no marker: the
 *  system has no tinted chips left to render one in. */
export function TagPill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`border-rule inline-flex items-center border px-3 py-1.5 text-[0.875rem] leading-[1.15] text-moss ${className}`}
    >
      {children}
    </span>
  );
}

/* Arrow used inside buttons and editorial links. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5 12h14m0 0-5.5-5.5M19 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

type PillProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "dark" | "light" | "outline";
  withArrow?: boolean;
  onClick?: React.MouseEventHandler;
};

/* The four variants map onto the four sanctioned button styles in
   globals.css, which carry the sizing, the square edge and the hover.
   `primary` is the dark button on a pale ground and `light` is its white
   counterpart on a dark one.

   The default used to be called `lime`, back when there was a lime accent
   to spend. There is no accent in this system at all, so a variant named
   after one told the next reader something false about what it paints.
   Callers that still pass `variant="lime"` keep working through the alias
   below; it can go once none are left. */
const pillVariants: Record<
  NonNullable<PillProps["variant"]> | "lime",
  string
> = {
  primary: "btn-primary",
  lime: "btn-primary", // deprecated alias for `primary`
  dark: "btn-outline",
  light: "btn-invert",
  outline: "btn-outline-dark",
};

/* Primary call-to-action button (renders as link when href is given) */
export function Pill({
  children,
  href,
  className = "",
  variant = "primary",
  withArrow = true,
  onClick,
}: PillProps) {
  const cls = `btn ${pillVariants[variant]} ${className}`;

  /* The arrow no longer slides on hover. This design is still: a hover may
     change a ground or a colour, and nothing moves. */
  const inner = (
    <>
      {children}
      {withArrow && <Arrow className="size-4" />}
    </>
  );

  if (href) {
    return (
      <LocaleLink href={href} className={cls} onClick={onClick}>
        {inner}
      </LocaleLink>
    );
  }
  return (
    <button className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
