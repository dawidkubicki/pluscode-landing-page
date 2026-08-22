"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { Plus, Pill } from "./ui";
import LocaleLink from "./locale-link";
import { LinkedInIcon, InstagramIcon } from "./icons";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Nav = Dictionary["navigation"];

const EASE = [0.16, 1, 0.3, 1] as const;

const aiDataLinks = [
  { key: "machineLearning", href: "/ai-data/machine-learning" },
  { key: "dataAnalytics", href: "/ai-data/analytics" },
  { key: "aiConsulting", href: "/ai-data/consulting" },
] as const;

const servicesLinks = [
  { key: "webDevelopment", href: "/services/web-development" },
  { key: "mobileApps", href: "/services/mobile" },
  { key: "cloudSolutions", href: "/services/cloud" },
  { key: "teamExtension", href: "/services/team-extension" },
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="flex items-center gap-1 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-soft transition-colors hover:text-bone"
      >
        {localeNames[active]}
        <svg viewBox="0 0 12 12" aria-hidden className={`size-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none">
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        role="menu"
        className={`absolute right-0 top-full z-10 mt-1.5 min-w-[3.5rem] overflow-hidden rounded-[2px] border border-white/10 bg-night-soft/95 p-1 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
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
              className={`block rounded-[2px] px-2.5 py-1 text-center font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                isActive ? "bg-lime text-white" : "text-bone-soft hover:bg-white/5 hover:text-bone"
              }`}
            >
              {localeNames[loc]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Header({
  locale,
  nav,
  offset = false,
}: {
  locale: Locale;
  nav: Nav;
  offset?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

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

  const close = () => setOpen(false);
  const basePath = pathWithoutLocale(pathname);

  // Flat top-bar links — categories point at their lead sub-page; the full
  // breakdown lives in the mega-menu below.
  const mainLinks = [
    { label: nav.aiData, href: "/ai-data/consulting" },
    { label: nav.workshops, href: "/workshops" },
    { label: nav.caseStudies, href: "/case-studies" },
    { label: nav.insights, href: "/insights" },
    { label: nav.about, href: "/about" },
  ];

  const menuColumns: {
    title: string;
    links: readonly { key: string; href: string }[];
    group: Record<string, { title: string; description: string }>;
  }[] = [
    { title: nav.aiData, links: aiDataLinks, group: nav.aiDataItems },
    { title: nav.services, links: servicesLinks, group: nav.servicesItems },
  ];

  const companyLinks = [
    { label: nav.about, href: "/about" },
    { label: nav.workshops, href: "/workshops" },
    { label: nav.insights, href: "/insights" },
    { label: nav.caseStudies, href: "/case-studies" },
    { label: nav.getInTouch, href: "/contact" },
  ];

  return (
    <header className={`fixed inset-x-0 z-50 ${offset ? "top-10" : "top-0"}`}>
      <div className="relative z-20 border-b border-white/10 bg-night/90 backdrop-blur-xl">
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
                    className={`text-[14.5px] font-medium transition-colors ${
                      active ? "text-lime-soft" : "text-bone hover:text-lime-soft"
                    }`}
                  >
                    {l.label}
                  </LocaleLink>
                );
              })}
              <LocaleLink
                href="/contact"
                onClick={close}
                className="rounded-[2px] bg-lime px-[22px] py-[11px] text-sm font-semibold text-white transition-colors hover:bg-lime-bright"
              >
                {nav.getInTouch}
              </LocaleLink>
            </nav>

            <div className="hidden sm:block">
              <LocaleDropdown active={locale} basePath={basePath} label={nav.language} />
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="group relative flex size-11 items-center justify-center text-bone transition-colors hover:text-lime-soft"
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
              className="fixed inset-0 -z-10 bg-night-deep/60 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-x-0 top-0 z-10 max-h-[92vh] overflow-y-auto border-b border-white/10 bg-night text-bone shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
            >
              <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-28 sm:px-10">
                <div className="grid gap-10 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.25fr]">
                  {menuColumns.map((col) => (
                    <motion.div key={col.title} variants={itemVariants}>
                      <h3 className="mb-6 font-serif text-2xl font-medium tracking-[-0.01em] text-bone">
                        {col.title}
                      </h3>
                      <ul className="space-y-5">
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

                  <motion.div variants={itemVariants}>
                    <h3 className="mb-6 font-serif text-2xl font-medium tracking-[-0.01em] text-bone">
                      {nav.about}
                    </h3>
                    <ul className="space-y-4">
                      {companyLinks.map((l) => (
                        <li key={l.href}>
                          <LocaleLink href={l.href} onClick={close} className="text-lg text-bone transition-colors hover:text-lime-soft">
                            {l.label}
                          </LocaleLink>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Promo card */}
                  <motion.div variants={itemVariants}>
                    <div className="blueprint-grid relative isolate flex h-full min-h-64 flex-col justify-end overflow-hidden rounded border border-white/10 bg-night-soft p-8">
                      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-[radial-gradient(circle,rgba(43,92,255,0.25)_0%,rgba(43,92,255,0)_65%)]" />
                      <p className="max-w-xs font-serif text-2xl font-medium leading-tight text-bone">
                        {nav.getInTouch}
                      </p>
                      <div className="mt-6">
                        <Pill variant="lime" href="/contact" onClick={close}>
                          {nav.getInTouch}
                        </Pill>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom row */}
                <motion.div
                  variants={itemVariants}
                  className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
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
                              isActive ? "bg-lime text-white" : "text-bone-dim hover:text-bone"
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
