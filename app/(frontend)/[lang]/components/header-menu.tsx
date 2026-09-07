"use client";

/* ------------------------------------------------------------------ *
 *  THE BAR AND THE FULLSCREEN OFFERINGS MENU (the interactive half)
 *
 *  "use client" because three things here cannot be expressed on the
 *  server: the bar's ground flips once the page has moved off the top,
 *  the offerings panel is a modal with a focus trap and a scroll lock,
 *  and Escape has to close it.
 *
 *  It lives beside header.tsx rather than inside it because the two
 *  halves cannot share a module: the dictionary is `server-only`, so a
 *  "use client" file may not import it, and a server file may not call
 *  hooks. header.tsx reads `home.menu` and hands the slice down here.
 *
 *  THE Z ORDER, which is the whole trick of this menu. The panel is
 *  `fixed inset-0` under the bar (z-10 against the bar's z-20), and the
 *  bar switches its own ground to carbon while the panel is open. The
 *  header row therefore never moves: bar and panel read as one carbon
 *  surface with the plus turned to a minus, and the panel's content
 *  simply starts below the 72px row.
 *
 *  The announcement strip is keyed off `data-announcement` on <html>
 *  (set pre-paint by layout.tsx). Both the bar and the panel drop 40px
 *  while it is up, so the panel never covers it.
 * ------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import LocaleLink from "./locale-link";
import { locales, localeNames, localeLabels, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Nav = Dictionary["navigation"];
type Menu = Dictionary["home"]["menu"];
type MenuColumn = Menu["columns"][number];

const PANEL_ID = "pc-offerings";

/* The panel's own easing. `as const` because framer-motion types a bezier as
   a four-tuple and a bare array literal widens to number[]. */
const EASE = [0.2, 0, 0, 1] as const;

/* The bar answers the scroll and the panel over the same 240ms as the
   buttons in globals.css, so the whole chrome moves as one thing. */
const SWAP = "transition-colors duration-[240ms] ease-io-attio";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* The panel always renders both layouts and hides one of them with
   `md:hidden`, so the raw query returns links that are display:none at
   this width. Calling focus() on one of those is a silent no-op, which
   would leave focus on the page behind the dialog. Client rects are the
   cheap test for "actually laid out"; the sr-only close button keeps its
   1px box and stays in the cycle. */
function focusablesIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

/* The reference's three columns are not equal: 5, 3 and 4 of the twelve,
   which is what lets the Solutions descriptions run to a comfortable
   measure while Platform stays a narrow list. Below md there are only
   four columns, so every one of them is full width. */
const COLUMN_SPAN = ["md:col-span-5", "md:col-span-3", "md:col-span-4"];

/** Strip the leading locale segment so we can re-prefix with another locale. */
function pathWithoutLocale(pathname: string): string {
  const stripped = pathname.replace(
    new RegExp(`^/(${locales.join("|")})(?=/|$)`),
    "",
  );
  return stripped || "/";
}

/** The offerings trigger: a plus that loses its upright while the panel is open. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className="size-3 shrink-0" fill="none">
      <path d="M0.5 6h11" stroke="currentColor" strokeWidth="1" />
      <path
        d="M6 0.5v11"
        stroke="currentColor"
        strokeWidth="1"
        className={`transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
      />
    </svg>
  );
}

/** The menu's one ornament: a square-capped arrow, on the column head and every row. */
function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="none" className={className}>
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

/* Every href in the menu is checked, not assumed: the whole Platform
   column points at quanty.ai and has to leave the app. */
function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function MenuLink({
  href,
  onNavigate,
  className,
  children,
}: {
  href: string;
  onNavigate: () => void;
  className?: string;
  children: ReactNode;
}) {
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <LocaleLink href={href} onClick={onNavigate} className={className}>
      {children}
    </LocaleLink>
  );
}

function Column({
  column,
  index,
  onNavigate,
}: {
  column: MenuColumn;
  index: number;
  onNavigate: () => void;
}) {
  return (
    <div
      className={`col-span-4 border-rule-dark pt-7 md:pt-0 ${
        COLUMN_SPAN[index] ?? "md:col-span-4"
      } ${index > 0 ? "border-t md:border-t-0 md:border-l md:pl-6" : ""}`}
    >
      <MenuLink
        href={column.href}
        onNavigate={onNavigate}
        className="group flex items-baseline gap-3"
      >
        <span className="text-heading-md text-white group-hover:underline group-hover:underline-offset-[6px]">
          {column.title}
        </span>
        <Arrow className={`size-4 shrink-0 text-sage ${SWAP} group-hover:text-white`} />
      </MenuLink>

      <ul className="mt-8 space-y-7">
        {column.items.map((item) => (
          <li key={item.title}>
            <MenuLink
              href={item.href}
              onNavigate={onNavigate}
              className="group flex gap-3"
            >
              <Arrow
                className={`mt-[0.4rem] size-3.5 shrink-0 text-sage ${SWAP} group-hover:text-white`}
              />
              <span className="block">
                <span className="block text-[1.125rem] leading-[1.375] text-white group-hover:underline group-hover:underline-offset-4">
                  {item.title}
                </span>
                <span
                  className={`block text-[1rem] leading-[1.375] text-sage ${SWAP} group-hover:text-mist`}
                >
                  {item.description}
                </span>
              </span>
            </MenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HeaderMenu({
  locale,
  nav,
  menu,
}: {
  locale: Locale;
  nav: Nav;
  menu: Menu;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // Lenis owns the real scroll position, so it is also what tells the bar
  // it has left the hero, and what stops the page under the open panel.
  const lenis = useLenis(({ scroll }) => setScrolled(scroll > 24));

  const close = useCallback(() => setOpen(false), []);

  // Reflect the position on a refresh taken mid-page, before Lenis has had
  // a scroll event to report. Deferred a frame so this is not a setState
  // fired synchronously inside the effect.
  useEffect(() => {
    const id = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    return () => cancelAnimationFrame(id);
  }, []);

  // The scroll lock. `lenis.stop()` puts `overflow: hidden` on <html> via
  // the `lenis-stopped` class in globals.css, which is the mechanism this
  // codebase already uses. Unmounting while open hands scrolling back.
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [open, lenis]);

  // Move focus into the panel as it opens.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const [first] = focusablesIn(panel);
    (first ?? panel).focus({ preventScroll: true });
  }, [open]);

  // Give focus back to the trigger on close, but only if we were the ones
  // holding it: a first render must not steal focus from the page.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  /* Escape, and the Tab trap. The cycle is the trigger plus everything in
     the panel: the trigger is this dialog's close button and it stays
     visible on the carbon bar, so locking it out would leave Escape as the
     only way back. Nothing on the page behind the panel is reachable. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = [triggerRef.current, ...focusablesIn(panel)].filter(
        (el): el is HTMLElement => el !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !items.includes(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const basePath = pathWithoutLocale(pathname);

  // ONLY the home page has a dark hero for the bar to sit on. Every other
  // route opens on the pale page ground, so a transparent bar with white
  // type there is white on #e7ecec: the whole navigation disappears until
  // the reader scrolls. The first build of this file keyed the transparent
  // state on scroll position alone and did exactly that on all 40-odd
  // inner routes.
  const overHero = basePath === "/";

  // Transparent over the hero, carbon under the open panel, the page
  // ground everywhere else. Two of the three are dark, and `on-dark` is
  // what turns the global focus ring white on them.
  const solid = !overHero || scrolled;
  const onDark = open || !solid;
  const barGround = open
    ? "bg-carbon text-white on-dark"
    : solid
      ? "bg-paper text-ink"
      : "bg-transparent text-white on-dark";
  const muted = onDark
    ? "text-sage hover:text-white"
    : "text-moss hover:text-ink";

  const links = [
    { label: nav.caseStudies, href: "/case-studies" },
    { label: nav.insights, href: "/insights" },
    { label: nav.about, href: "/about" },
    /* `getInTouch` reads "Book a call" in all three locales, so it
       points at /book-a-call, the same destination the footer and the
       founders band give it. It used to send people to /contact here, so
       one label had two destinations depending on where you clicked it. */
    { label: nav.getInTouch, href: "/book-a-call" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 [[data-announcement]_&]:top-10">
      {/* THE BAR. Above the panel in z order so the header row never moves
          when the menu opens; only its ground changes. */}
      <div className={`relative z-20 ${SWAP} ${barGround}`}>
        <div className="pc-shell">
          <div className="flex h-[72px] items-center gap-4">
            {/* The wordmark is type, not an image: the reference sets its own
                name in its own face, and so does this. */}
            <LocaleLink
              href="/"
              onClick={close}
              className="order-1 flex min-h-11 items-center text-[1.5rem] leading-none"
            >
              Pluscode
            </LocaleLink>

            {/* Below md only the offerings trigger survives, and it moves to
                the right of the row: the four links move inside the panel. */}
            <nav className="order-3 flex items-center gap-6 md:order-2 md:ml-10 md:mr-auto md:gap-7">
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={PANEL_ID}
                className="flex min-h-11 items-center gap-2 text-[1.125rem] leading-none"
              >
                {menu.label}
                <PlusMinus open={open} />
              </button>
              {links.map((l) => (
                <LocaleLink
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="hidden min-h-11 items-center text-[1.125rem] leading-none hover:underline hover:underline-offset-4 md:flex"
                >
                  {l.label}
                </LocaleLink>
              ))}
            </nav>

            <nav
              aria-label={nav.language}
              className="order-2 ml-auto flex items-center gap-3 md:order-3 md:ml-0"
            >
              {locales.map((loc) => {
                const target = `/${loc}${basePath === "/" ? "" : basePath}`;
                const isActive = loc === locale;
                return (
                  <Link
                    key={loc}
                    href={target}
                    hrefLang={loc}
                    title={localeLabels[loc]}
                    onClick={close}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex min-h-11 items-center text-[0.875rem] leading-none ${SWAP} ${
                      isActive ? "" : muted
                    }`}
                  >
                    {localeNames[loc]}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* THE FULLSCREEN MENU. The ground fades; the content is what slides,
          so the carbon never leaves a gap at the foot on the way in. Both
          are skipped outright under prefers-reduced-motion. */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="offerings"
            ref={panelRef}
            id={PANEL_ID}
            role="dialog"
            aria-modal="true"
            aria-label={menu.label}
            tabIndex={-1}
            // Lenis is stopped while the panel is open and would otherwise
            // swallow wheel and touch events over it.
            data-lenis-prevent
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduce ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="on-dark fixed inset-0 z-10 overflow-y-auto overscroll-contain bg-carbon [[data-announcement]_&]:top-10"
          >
            <motion.div
              initial={{ y: reduce ? 0 : -12 }}
              animate={{ y: 0 }}
              exit={{ y: reduce ? 0 : -12 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
              className="pc-shell pt-[72px]"
            >
              <div className="pc-grid pb-20 pt-10 md:pb-[104px] md:pt-14">
                {/* The bar's links, which are hidden below md, listed above
                    the columns so the phone panel is the whole navigation. */}
                <div className="col-span-4 border-b border-rule-dark pb-7 md:hidden">
                  <ul className="flex flex-col gap-4">
                    {links.map((l) => (
                      <li key={l.href}>
                        <LocaleLink
                          href={l.href}
                          onClick={close}
                          className="text-heading-sm text-white"
                        >
                          {l.label}
                        </LocaleLink>
                      </li>
                    ))}
                  </ul>
                </div>

                {menu.columns.map((column, i) => (
                  <Column
                    key={column.key}
                    column={column}
                    index={i}
                    onNavigate={close}
                  />
                ))}

                {/* `aria-modal` hides the bar, and with it the trigger, from
                    assistive technology, so the dialog carries its own way
                    out. Last in the order and invisible until focused, so it
                    never takes a place in the layout or in the eye. */}
                <div className="col-span-4 md:col-span-12">
                  <button
                    type="button"
                    onClick={close}
                    className="btn btn-invert sr-only focus:not-sr-only"
                  >
                    {menu.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
