"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { Plus, Pill } from "./ui";
import LocaleLink from "./locale-link";
import { LinkedInIcon, InstagramIcon } from "./icons";
import { locales, localeNames, localeLabels, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Nav = Dictionary["navigation"];

const EASE = [0.16, 1, 0.3, 1] as const;

const aiDataLinks = [
  { key: "machineLearning", href: "/ai-data/machine-learning" },
  { key: "dataAnalytics", href: "/ai-data/analytics" },
  { key: "aiConsulting", href: "/ai-data/consulting" },
] as const;

// Engineering is split across two mega-menu columns so the panel fits a
// laptop viewport without scrolling.
const servicesLinks = [
  { key: "softwareDevelopment", href: "/services/software-development" },
  { key: "webDevelopment", href: "/services/web-development" },
  { key: "mobileApps", href: "/services/mobile" },
  { key: "mvpDevelopment", href: "/services/mvp-development" },
  { key: "apiDevelopment", href: "/services/api-development" },
] as const;

const platformLinks = [
  { key: "cloudSolutions", href: "/services/cloud" },
  { key: "teamExtension", href: "/services/team-extension" },
  { key: "technologies", href: "/services/technologies" },
] as const;

const socials = [
  { label: "LinkedIn", Icon: LinkedInIcon, href: "https://www.linkedin.com/company/pluscode" },
  { label: "Instagram", Icon: InstagramIcon, href: "https://www.instagram.com/pluscode" },
];

const panelVariants: Variants = {
  hidden: { y: "-101%" },
  show: {
    y: 0,
    transition: { duration: 0.7, ease: EASE, when: "beforeChildren", staggerChildren: 0.05, delayChildren: 0.12 },
  },
  exit: { y: "-101%", transition: { duration: 0.5, ease: EASE } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <LocaleLink
      href="/"
      onClick={onNavigate}
      aria-label="Pluscode home"
      className="flex items-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo/pluscode-logo.svg"
        alt="Pluscode"
        className="h-7 w-auto"
      />
    </LocaleLink>
  );
}

/** Strip the leading locale segment so we can re-prefix with another locale. */
function pathWithoutLocale(pathname: string): string {
  const stripped = pathname.replace(
    new RegExp(`^/(${locales.join("|")})(?=/|$)`),
    "",
  );
  return stripped || "/";
}

/** Compact language control for the top bar. */
function LocaleDropdown({
  active,
  basePath,
  label,
}: {
  active: Locale;
  basePath: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hover-to-open only where a pointer can actually hover. On touch the same
  // tap fires mouseenter and click, which opened and instantly re-closed it.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  // A grace period on leave, so a diagonal path from the trigger towards the
  // list doesn't close the menu out from under the pointer.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 240);
  };
  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={canHover ? () => { cancelClose(); setOpen(true); } : undefined}
      onMouseLeave={canHover ? scheduleClose : undefined}
      // No open-on-focus: a tap focuses the button before it clicks it, which
      // would toggle the menu straight back shut. Enter/Space fire the click
      // handler, so the keyboard path is covered either way.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => { cancelClose(); setOpen((v) => !v); }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${localeLabels[active]}`}
        className="flex items-center gap-1 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:text-lime-soft"
      >
        {localeNames[active]}
        <svg viewBox="0 0 12 12" aria-hidden className={`size-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none">
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* The panel hangs off a padded wrapper rather than sitting on a margin:
          padding is part of the hover region, a margin is a dead zone that
          fired mouseleave halfway to the list. */}
      <div
        className={`absolute right-0 top-full z-30 pt-2 transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0"
        }`}
      >
        <div
          role="menu"
          className="min-w-[9.5rem] overflow-hidden rounded-[2px] border border-white/10 bg-night-soft/95 p-1 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {locales.map((loc) => {
            const target = `/${loc}${basePath === "/" ? "" : basePath}`;
            const isActive = loc === active;
            return (
              <Link
                key={loc}
                href={target}
                role="menuitem"
                onClick={() => setOpen(false)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-2.5 rounded-[2px] px-2.5 py-1.5 transition-colors ${
                  isActive ? "bg-lime text-night" : "text-bone-soft hover:bg-white/5 hover:text-bone"
                }`}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
                  {localeNames[loc]}
                </span>
                <span className="text-[13px]">{localeLabels[loc]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Header({
  locale,
  nav,
}: {
  locale: Locale;
  nav: Nav;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Lenis drives the real scroll position; fade the header chrome in once the
  // page has moved off the top.
  const lenis = useLenis(({ scroll }) => setScrolled(scroll > 8));

  // Lock scrolling while the mega menu is open.
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reflect the initial scroll position (e.g. on a refresh mid-page) before the
  // first Lenis scroll event fires. Deferred a frame so we don't setState
  // synchronously inside the effect.
  useEffect(() => {
    const id = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    return () => cancelAnimationFrame(id);
  }, []);

  const close = () => setOpen(false);
  const basePath = pathWithoutLocale(pathname);

  // Flat top-bar links — the Services entry opens the mega-menu on hover
  // (desktop); the hamburger stays as the mobile entry point.
  const mainLinks = [
    { label: nav.allServices, href: "/services", mega: true },
    { label: nav.workshops, href: "/workshops", mega: false },
    { label: nav.insights, href: "/insights", mega: false },
    { label: nav.about, href: "/about", mega: false },
  ];

  const menuColumns: {
    title: string;
    links: readonly { key: string; href: string }[];
    group: Record<string, { title: string; description: string }>;
  }[] = [
    { title: nav.aiData, links: aiDataLinks, group: nav.aiDataItems },
    { title: nav.services, links: servicesLinks, group: nav.servicesItems },
    { title: nav.platformTeam, links: platformLinks, group: nav.servicesItems },
  ];

  const companyLinks = [
    { label: nav.about, href: "/about" },
    { label: nav.workshops, href: "/workshops" },
    { label: nav.insights, href: "/insights" },
    { label: nav.caseStudies, href: "/case-studies" },
    { label: nav.getInTouch, href: "/book-a-call" },
  ];

  return (
    // Sits below the announcement bar while <html data-announcement> is set;
    // snaps back to the very top the moment the bar is dismissed or absent.
    <header
      className="fixed inset-x-0 z-50 top-0 [[data-announcement]_&]:top-10"
      onMouseLeave={() => open && setOpen(false)}
    >
      <div
        className={`relative z-20 border-b transition-colors duration-300 ${
          scrolled || open
            ? "border-white/10 bg-night/90 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-10">
          <Logo onNavigate={close} />

          <div className="flex items-center gap-4 lg:gap-9">
            <nav className="hidden items-center gap-9 lg:flex">
              {mainLinks.map((l) => {
                const active = basePath === l.href;
                return (
                  <LocaleLink
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    // Hovering the Services entry opens the mega-menu; leaving
                    // the header (bar + panel) closes it again.
                    onMouseEnter={l.mega ? () => setOpen(true) : undefined}
                    className={`text-[14.5px] font-medium transition-colors ${
                      active
                        ? "text-bone underline decoration-lime-soft decoration-[1.5px] underline-offset-8"
                        : "text-bone hover:text-lime-soft"
                    }`}
                  >
                    {l.label}
                  </LocaleLink>
                );
              })}
              <LocaleLink
                href="/book-a-call"
                onClick={close}
                className={`rounded-[2px] border-[1.5px] px-[22px] py-[11px] text-sm font-semibold transition-colors ${
                  scrolled || open
                    ? "border-lime bg-lime text-night hover:border-lime-bright hover:bg-lime-bright"
                    : "border-white/60 text-bone hover:border-lime hover:bg-lime hover:text-night"
                }`}
              >
                {nav.getInTouch}
              </LocaleLink>
            </nav>

            {/* Also on phones: the only other switcher lives at the bottom of
                the mega menu, which is a long scroll away. */}
            <LocaleDropdown active={locale} basePath={basePath} label={nav.language} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="group relative flex size-11 items-center justify-center text-bone transition-colors hover:text-lime-soft lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span className={`absolute left-0 block h-[2px] w-6 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-3 block h-[2px] w-6 bg-current transition-all duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setOpen(false)}
              // The backdrop is a header child, so `onMouseLeave` on <header>
              // never fires while it covers the viewport; entering it means
              // the pointer left the bar/panel, which closes the hover menu.
              onMouseEnter={() => setOpen(false)}
              className="fixed inset-0 -z-10 bg-night-deep/60 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              // data-lenis-prevent: Lenis is stopped while the menu is open and
              // would otherwise swallow touch/wheel events over the panel.
              // dvh (with vh fallback): in-app browsers report vh as the large
              // viewport, which pushed the panel below the fold unscrollably.
              data-lenis-prevent
              className="absolute inset-x-0 top-0 z-10 max-h-[92vh] overflow-y-auto overscroll-contain border-b border-white/10 bg-night text-bone shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] supports-[height:100dvh]:max-h-[88dvh]"
            >
              <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-24 sm:px-10">
                <div className="grid gap-10 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.25fr]">
                  {menuColumns.map((col) => (
                    <motion.div key={col.title} variants={itemVariants}>
                      <h3 className="mb-4 font-serif text-2xl font-medium tracking-[-0.01em] text-bone">
                        {col.title}
                      </h3>
                      <ul className="space-y-3">
                        {col.links.map((link) => (
                          <li key={link.href}>
                            <LocaleLink href={link.href} onClick={close} className="group block">
                              <span className="text-lg text-bone transition-colors group-hover:text-lime-soft">
                                {col.group[link.key].title}
                              </span>
                              <span className="block text-sm text-bone-dim">
                                {col.group[link.key].description}
                              </span>
                            </LocaleLink>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}

                  {/* Company links + a fixed-height promo card share the last
                      column so no column outgrows the viewport. */}
                  <motion.div variants={itemVariants}>
                    <h3 className="mb-4 font-serif text-2xl font-medium tracking-[-0.01em] text-bone">
                      {nav.about}
                    </h3>
                    <ul className="space-y-3">
                      {companyLinks.map((l) => (
                        <li key={l.href}>
                          <LocaleLink href={l.href} onClick={close} className="text-lg text-bone transition-colors hover:text-lime-soft">
                            {l.label}
                          </LocaleLink>
                        </li>
                      ))}
                    </ul>

                    <div className="blueprint-grid relative isolate mt-6 flex h-48 flex-col justify-end overflow-hidden rounded border border-white/10 bg-night-soft p-8">
                      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.25)_0%,rgba(16,185,129,0)_65%)]" />
                      <p className="max-w-xs font-serif text-2xl font-medium leading-tight text-bone">
                        {nav.getInTouch}
                      </p>
                      <div className="mt-6">
                        <Pill variant="lime" href="/book-a-call" onClick={close}>
                          {nav.getInTouch}
                        </Pill>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom row */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6 flex flex-col gap-6 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-dim">
                    <Plus className="size-3" /> {nav.language}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {locales.map((loc) => {
                        const target = `/${loc}${basePath === "/" ? "" : basePath}`;
                        const isActive = loc === locale;
                        return (
                          <Link
                            key={loc}
                            href={target}
                            onClick={close}
                            className={`rounded-[2px] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                              isActive ? "bg-lime text-night" : "text-bone-dim hover:text-bone"
                            }`}
                          >
                            {localeNames[loc]}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 text-bone-dim">
                      {socials.map(({ label, Icon, href }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition-colors hover:text-bone">
                          <Icon className="size-[18px]" />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
