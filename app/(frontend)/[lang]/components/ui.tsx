import type { ReactNode } from "react";
import LocaleLink from "./locale-link";

/* The lime "+" marker dotted around the layout */
export function Plus({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`text-lime ${className}`}
    >
      <path
        d="M12 3v18M3 12h18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Monospace eyebrow label, optionally tagged with a plus */
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
      className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] ${className}`}
    >
      {withPlus && <Plus className="size-3" />}
      {children}
    </span>
  );
}

/* Mono eyebrow label, e.g. "+ WHAT WE DO" */
export function TagPill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.14em] ${className}`}
    >
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

const pillVariants: Record<NonNullable<PillProps["variant"]>, string> = {
  lime: "bg-lime text-night hover:bg-lime-bright",
  dark: "bg-night text-white hover:bg-lime hover:text-night",
  light: "bg-white text-ink hover:bg-night hover:text-white",
  outline:
    "border border-current/25 text-current hover:bg-current/5",
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
  const cls = `group inline-flex items-center gap-2.5 rounded-[2px] px-7 py-4 text-[15px] font-semibold transition-colors duration-300 ${pillVariants[variant]} ${className}`;

  const inner = (
    <>
      {children}
      {withArrow && (
        <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
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
