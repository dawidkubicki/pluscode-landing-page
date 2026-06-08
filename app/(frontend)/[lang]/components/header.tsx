"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { Plus, Pill } from "./ui";
import { Visual } from "./visual";
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
] as const;

const socials = [
  { label: "LinkedIn", Icon: LinkedInIcon, href: "https://www.linkedin.com/company/pluscode" },
  { label: "Instagram", Icon: InstagramIcon, href: "https://instagram.com" },
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
      aria-label="Pluscode — home"
      className="flex items-baseline text-xl font-semibold tracking-tight text-ink"
    >
      Pluscode
      <sup className="ml-0.5 text-[0.7em] font-bold text-lime">+</sup>
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

/** Desktop dropdown for a nav category (AI & Data, Services). */
function NavDropdown({
  label,
  items,
  group,
  onNavigate,
}: {
  label: string;
  items: readonly { key: string; href: string }[];
  group: Record<string, { title: string; description: string }>;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 text-[15px] text-ink/80 transition-colors hover:text-ink"
      >
        {label}
        <svg
          viewBox="0 0 12 12"
          aria-hidden
          className={`size-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        role="menu"
        className={`absolute left-1/2 top-full z-10 w-72 -translate-x-1/2 pt-3 transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-cream-line/70 bg-cream/95 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {items.map((item) => (
            <LocaleLink
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={onNavigate}
              className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-ink/5"
            >
              <span className="block text-sm font-medium text-ink transition-colors group-hover:text-lime-deep">
                {group[item.key].title}
              </span>
              <span className="block text-xs text-ink-soft">
                {group[item.key].description}
              </span>
            </LocaleLink>
          ))}
        </div>
      </div>
    </div>
  );
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
        className="flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/80 transition-colors hover:text-ink"
      >
        {localeNames[active]}
        <svg viewBox="0 0 12 12" aria-hidden className={`size-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none">
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        role="menu"
        className={`absolute right-0 top-full z-10 mt-1.5 min-w-[3.5rem] overflow-hidden rounded-xl border border-cream-line/70 bg-cream/95 p-1 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 ${
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
              className={`block rounded-lg px-2.5 py-1 text-center font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                isActive ? "bg-ink text-cream" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);
  const solid = scrolled || open;
  const basePath = pathWithoutLocale(pathname);

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
    { label: nav.insights, href: "/insights" },
    { label: "Case Studies", href: "/case-studies" },
    { label: nav.getInTouch, href: "/contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 z-50 ${offset ? "top-10" : "top-0"}`}
    >
      <div
        className={`relative z-20 transition-colors duration-500 ${
          solid
            ? "border-b border-cream-line/60 bg-cream/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto grid h-20 max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8">
          <Logo onNavigate={close} />

          <nav className="hidden items-center gap-9 md:flex">
            <NavDropdown label={nav.aiData} items={aiDataLinks} group={nav.aiDataItems} onNavigate={close} />
            <NavDropdown label={nav.services} items={servicesLinks} group={nav.servicesItems} onNavigate={close} />
            <LocaleLink href="/insights" onClick={close} className="text-[15px] text-ink/80 transition-colors hover:text-ink">
              {nav.insights}
            </LocaleLink>
            <LocaleLink href="/about" onClick={close} className="text-[15px] text-ink/80 transition-colors hover:text-ink">
              {nav.about}
            </LocaleLink>
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <div className="hidden sm:block">
              <LocaleDropdown active={locale} basePath={basePath} label={nav.language} />
            </div>
            <div className="hidden md:block">
              <Pill variant="lime" href="/contact" withArrow={false} className="px-5 py-2.5 text-[13px]">
                {nav.getInTouch}
              </Pill>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="group relative flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
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
              className="fixed inset-0 -z-10 bg-ink/40 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-x-0 top-0 z-10 max-h-[92vh] overflow-y-auto rounded-b-[2rem] bg-cream shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)]"
            >
              <div className="mx-auto max-w-[1500px] px-5 pb-10 pt-28 sm:px-8">
                <div className="grid gap-10 lg:grid-cols-[repeat(2,minmax(0,1fr))_1fr_1.1fr]">
                  {menuColumns.map((col) => (
                    <motion.div key={col.title} variants={itemVariants}>
                      <h3 className="mb-6 text-2xl font-medium tracking-tight text-ink">
                        {col.title}
                      </h3>
                      <ul className="space-y-5">
                        {col.links.map((link) => (
                          <li key={link.href}>
                            <LocaleLink href={link.href} onClick={close} className="group block">
                              <span className="text-lg text-ink transition-colors group-hover:text-lime-deep">
                                {col.group[link.key].title}
                              </span>
                              <span className="block text-sm text-ink-soft">
                                {col.group[link.key].description}
                              </span>
                            </LocaleLink>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}

                  <motion.div variants={itemVariants}>
                    <h3 className="mb-6 text-2xl font-medium tracking-tight text-ink">
                      {nav.about}
                    </h3>
                    <ul className="space-y-4">
                      {companyLinks.map((l) => (
                        <li key={l.href}>
                          <LocaleLink href={l.href} onClick={close} className="text-lg text-ink transition-colors hover:text-lime-deep">
                            {l.label}
                          </LocaleLink>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Promo card */}
                  <motion.div variants={itemVariants}>
                    <div className="relative isolate flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-3xl p-8">
                      <Visual kind="aurora" className="absolute inset-0 -z-10" />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
                      <p className="max-w-xs text-2xl font-medium leading-tight text-bone">
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
                  className="mt-10 flex flex-col gap-6 border-t border-cream-line pt-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
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
                            className={`rounded-full px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                              isActive ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"
                            }`}
                          >
                            {localeNames[loc]}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 text-ink-soft">
                      {socials.map(({ label, Icon, href }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition-colors hover:text-ink">
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
