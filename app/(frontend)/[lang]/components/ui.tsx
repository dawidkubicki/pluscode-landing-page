import type { ComponentProps, ReactNode } from "react";
import LocaleLink from "./locale-link";

/**
 * Shared primitives. Server safe: nothing here holds state.
 *
 * The matching CSS (`pc-container`, `pc-btn`, `pc-chip`, `pc-statement`,
 * `pc-label`, ...) is in globals.css. Reach for these before writing new
 * markup for the same job, so every page says the same thing the same way.
 */

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

/** The page column. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
}) {
  return <Tag className={cx("pc-container", className)}>{children}</Tag>;
}

/** The grey word above a section. */
export function Label({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "h2" | "h3" | "span";
}) {
  return <Tag className={cx("pc-label", className)}>{children}</Tag>;
}

/**
 * Splits CMS text into paragraphs on blank lines. A single line break inside
 * a paragraph is kept as a line break.
 */
export function Paragraphs({
  text,
  className,
  paragraphClassName,
}: {
  text: string;
  className?: string;
  paragraphClassName?: string;
}) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <div className={className}>
      {blocks.map((block, i) => (
        <p key={i} className={paragraphClassName}>
          {block.split("\n").map((line, j, all) => (
            <span key={j}>
              {line}
              {j < all.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

/**
 * The statement: a sentence with some of its words lifted into chips.
 * Editors mark a chip with square brackets, as in
 * "We build software for [documents] and [data]."
 */
export function Statement({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h2";
}) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <Tag className={cx("pc-statement", className)}>
      {parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <span key={i} className="pc-chip">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </Tag>
  );
}

type ButtonTone = "default" | "light" | "solid";

const buttonClass = (tone: ButtonTone, size: "md" | "lg", className?: string) =>
  cx(
    "pc-btn",
    tone === "light" && "pc-btn--light",
    tone === "solid" && "pc-btn--solid",
    size === "lg" && "pc-btn--lg",
    className,
  );

/**
 * The outline button with a chevron. Internal paths are given without a
 * locale ("/about") and stay in the visitor's language; anything else is
 * treated as external and opens in a new tab.
 */
export function ArrowLink({
  href,
  children,
  tone = "default",
  size = "md",
  className,
  newTabLabel,
}: {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  size?: "md" | "lg";
  className?: string;
  /** Screen reader suffix for external links, e.g. "opens in a new tab". */
  newTabLabel?: string;
}) {
  const external = /^https?:\/\//.test(href);
  const body = (
    <>
      <ChevronIcon />
      <span>{children}</span>
      {external && newTabLabel && <span className="sr-only">, {newTabLabel}</span>}
    </>
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={buttonClass(tone, size, className)}
      >
        {body}
      </a>
    );
  }
  return (
    <LocaleLink href={href} className={buttonClass(tone, size, className)}>
      {body}
    </LocaleLink>
  );
}

/** The same look on a real button (forms, dialogs). */
export function ArrowButton({
  children,
  tone = "default",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { tone?: ButtonTone; size?: "md" | "lg" }) {
  return (
    <button {...props} className={buttonClass(tone, size, className)}>
      <ChevronIcon />
      <span>{children}</span>
    </button>
  );
}

/* ---- Icons. All decorative: the control that holds one carries the name. ---- */

type IconProps = { className?: string };

const icon = (className: string | undefined, fallback: string) => ({
  className: className ?? fallback,
  "aria-hidden": true as const,
  focusable: false as const,
});

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 6 10" fill="none" {...icon(className, "h-2.5 w-1.5")}>
      <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" {...icon(className, "h-3 w-3")}>
      <path
        d="M4.5 2H2v8h8V7.5M7 2h3v3M10 2L5.5 6.5"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...icon(className, "h-5 w-5")}>
      <path d="M20.9 20.9h-3.73v-5.85c0-1.39-.03-3.19-1.95-3.19-1.94 0-2.24 1.52-2.24 3.09v5.95H9.25V8.88h3.58v1.64h.05c.5-.95 1.72-1.95 3.54-1.95 3.78 0 4.48 2.49 4.48 5.73v6.6zM5.01 7.23a2.17 2.17 0 110-4.33 2.17 2.17 0 010 4.33zM6.88 20.9H3.14V8.88h3.74V20.9z" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 10 10" fill="none" {...icon(className, "h-2.5 w-2.5")}>
      <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" {...icon(className, "h-3 w-3")}>
      <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 10" fill="none" {...icon(className, "h-2.5 w-4")}>
      <path d="M0 5h14M10.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
