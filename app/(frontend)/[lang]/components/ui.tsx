import type { ReactNode } from "react";
import LocaleLink from "./locale-link";

/* ------------------------------------------------------------------ *
 *  Spacer: the hairline spacer band
 *
 *  A band that holds nothing but the two vertical rules. It is not
 *  padding and it is not an empty div: it is 120px or 96px of visible
 *  rule between two anchors, which is the only seam on the page that
 *  is not a padding value. The page runs two of them, at deliberately
 *  different heights so they never read as one repeated component.
 *
 *  Below 768px `.pc-rules` draws no borders, so a full-height spacer
 *  there would be genuinely empty. It collapses to 40px instead.
 * ------------------------------------------------------------------ */
export function Spacer({ h = 120 }: { h?: 120 | 96 }) {
  return (
    <div aria-hidden className="bg-cream">
      <div className="pc-shell">
        <div
          className={`pc-rules h-10 ${h === 96 ? "md:h-[96px]" : "md:h-[120px]"}`}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  BandGlow: the light under a closing band
 *
 *  `night` is one step above the page, so a closing band on its own reads
 *  as a gap between two dark things rather than as a lifted ground. The
 *  band gets two things: `border-y border-night-line` on the section, and
 *  this. One CSS radial of the accent (`lime` at 18%) rising from the
 *  bottom centre and gone by two thirds of the way up, then masked with a
 *  linear fade so it stops short of the headline, which keeps a plain dark
 *  ground behind it. No canvas, no WebGL, nothing moves, so reduced motion
 *  needs no special case. The section must be `relative isolate`.
 * ------------------------------------------------------------------ */
const GLOW =
  "radial-gradient(80% 95% at 50% 100%, rgb(51 102 255 / 0.18) 0%, rgb(51 102 255 / 0.07) 42%, transparent 74%)";
const GLOW_MASK = "linear-gradient(to top, #000 0%, #000 32%, transparent 68%)";

export function BandGlow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
      style={{
        backgroundImage: GLOW,
        WebkitMaskImage: GLOW_MASK,
        maskImage: GLOW_MASK,
      }}
    />
  );
}

/* The "+" marker dotted around the layout. It inherits its colour: the
   accent is rationed to buttons, one word per headline, chart bars, the
   eyebrow pill, small rules and focus rings, and an icon is none of those. */
export function Plus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 3v18M3 12h18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  Eyebrow: the section label above a heading
 *
 *  A sentence-case tinted pill, one to three words. It replaces the
 *  uppercase monospaced labels the site used to open every section with:
 *  a label voice from a terminal is exactly wrong for this audience.
 *  `dark` is for the CTA band and the footer.
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
    <span className={`pc-pill ${dark ? "pc-pill-dark" : ""} ${className}`}>
      {children}
    </span>
  );
}

/** @deprecated Use `Eyebrow`. No call sites remain; delete on the next sweep. */
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
    <span className={`inline-flex items-center gap-2 text-[13px] ${className}`}>
      {withPlus && <Plus className="size-3" />}
      {children}
    </span>
  );
}

/** @deprecated Use `Eyebrow`. No call sites remain; delete on the next sweep. */
export function TagPill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 text-[13px] ${className}`}>
      <Plus className="size-3" />
      {children}
    </span>
  );
}

/* Arrow used inside buttons */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5 12h14m0 0-5.5-5.5M19 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PillProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "lime" | "dark" | "light" | "outline";
  withArrow?: boolean;
  onClick?: React.MouseEventHandler;
};

/* The variant names are historical. They map onto the three sanctioned
   button styles in globals.css, which carry the sizing, the radius and the
   asymmetric 50ms-in / 300ms-out hover. `lime` is the only one that spends
   the accent, and it is the primary action. */
const pillVariants: Record<NonNullable<PillProps["variant"]>, string> = {
  lime: "btn-primary",
  dark: "btn-outline",
  light: "border-bone bg-bone text-night hover:bg-bone-soft",
  outline: "btn-outline-dark",
};

/* Primary call-to-action button (renders as link when href is given) */
export function Pill({
  children,
  href,
  className = "",
  variant = "lime",
  withArrow = true,
  onClick,
}: PillProps) {
  const cls = `btn group ${pillVariants[variant]} ${className}`;

  const inner = (
    <>
      {children}
      {withArrow && (
        <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
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
