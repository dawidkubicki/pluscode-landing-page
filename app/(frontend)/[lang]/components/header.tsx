"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import LocaleLink from "./locale-link";
import { LinkedInIcon, InstagramIcon, FacebookIcon, GlobeIcon } from "./icons";
import { socialLinks, type SocialKey } from "@/lib/social";
import { locales, localeNames, localeLabels, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Nav = Dictionary["navigation"];

const EASE = [0.16, 1, 0.3, 1] as const;

/* Every interactive element in the bar answers in 50ms and relaxes over
   300ms, so the header feels immediate without flickering under a moving
   pointer. */
const HOVER =
  "transition-colors duration-300 ease-io-attio hover:duration-50 active:duration-50";

const aiDataLinks = [
  { key: "machineLearning", href: "/ai-data/machine-learning" },
  { key: "dataAnalytics", href: "/ai-data/analytics" },
  { key: "aiConsulting", href: "/ai-data/consulting" },
] as const;

// Engineering is split across two mega-menu columns so the panel stays a
// short grid rather than one long list.
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
  { key: "forwardDeployedEngineers", href: "/services/forward-deployed-engineers" },
] as const;

const socialIcons: Record<SocialKey, typeof LinkedInIcon> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

const socials = socialLinks.map((s) => ({ ...s, Icon: socialIcons[s.key] }));

const panelVariants: Variants = {
  hidden: { y: "-101%" },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: EASE, when: "beforeChildren", staggerChildren: 0.04, delayChildren: 0.08 },
  },
  exit: { y: "-101%", transition: { duration: 0.45, ease: EASE } },
};

/* The panel's own children resolve into focus rather than sliding, matching
   the site-wide reveal. The panel itself is the only thing that travels. */
const itemVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(1.5px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.4, ease: [0, 0, 0, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/* One row of the mega grid and of the phone sheet's service lists: a title
   only, 15px, in a 44px row. The description lines are gone; the owner's
   note was "too much text in menu", and the titles already say what each
   page is. The hover ground bleeds 12px past the text on either side so the
   row reads as a cell, like Quanty's mega items, without a border. */
const ITEM =
  "-mx-3 flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium text-ink-soft hover:bg-cream-surface hover:text-ink";

/* Column label in the mega grid and the phone sheet. The same voice as the
   footer's column titles, one step quieter. */
const COL_TITLE =
  "text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute";

function Logo({ onNavigate, onMouseEnter }: { onNavigate?: () => void; onMouseEnter?: () => void }) {
  return (
    <LocaleLink
      href="/"
      onClick={onNavigate}
      onMouseEnter={onMouseEnter}
      aria-label="Pluscode home"
      // min-h-11: the mark is 28px tall, so the anchor's own box was a 28px
      // tap target in a 72px bar. The height is on the link, not on the
      // image, so nothing about the wordmark's size or position changes.
      className="flex min-h-11 items-center"
    >
      {/* The white mark. The black one was invisible on the dark page. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo/pluscode-logo.svg"
        alt="Pluscode"
        className="h-7 w-auto"
      />
    </LocaleLink>
  );
}

function Caret({ open = false, className = "" }: { open?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      fill="none"
      className={`size-2.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

/** Compact language control for the top bar: a globe, the code, a caret. */
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
        className={`flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium text-ink-soft hover:text-ink ${HOVER}`}
      >
        <GlobeIcon className="size-3.5 text-ink-mute" />
        {localeNames[active]}
        <Caret open={open} className="text-ink-mute" />
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
        {/* One step off the page (`cream-dim`) with the stronger hairline, so
            the list has an edge on the dark ground where a shadow alone has
            nothing to fall on. The active row sits on `cream-surface`. */}
        <div
          role="menu"
          className="min-w-[10rem] overflow-hidden rounded-xl border border-cream-line-strong bg-cream-dim p-1 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.6)]"
        >
          {locales.map((loc) => {
            const isActive = loc === active;
            const target = `/${loc}${basePath === "/" ? "" : basePath}`;
            return (
              <Link
                key={loc}
                href={target}
                role="menuitem"
                onClick={() => setOpen(false)}
                aria-current={isActive ? "true" : undefined}
                className={`flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 ${HOVER} ${
                  isActive
                    ? "bg-cream-surface text-ink"
                    : "text-ink-soft hover:bg-cream-surface hover:text-ink"
                }`}
              >
                <span className="w-5 text-[12px] font-semibold">
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
  // Lenis drives the real scroll position; the hairline and the translucent
  // blur fade in once the page has moved off the top.
  const lenis = useLenis(({ scroll }) => setScrolled(scroll > 8));

  // Lock scrolling while the menu is open.
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

  // Four short links, like Quanty's bar. Services opens the mega grid on
  // hover (desktop); the hamburger stays as the phone entry point.
  const mainLinks = [
    { label: nav.allServices, href: "/services", mega: true },
    { label: nav.caseStudies, href: "/case-studies", mega: false },
    { label: nav.insights, href: "/insights", mega: false },
    { label: nav.about, href: "/about", mega: false },
  ];

  const menuColumns: {
    title: string;
    links: readonly { key: string; href: string }[];
    group: Record<string, { title: string; description: string } | undefined>;
  }[] = [
    { title: nav.aiData, links: aiDataLinks, group: nav.aiDataItems },
    { title: nav.services, links: servicesLinks, group: nav.servicesItems },
    { title: nav.platformTeam, links: platformLinks, group: nav.servicesItems },
  ];

  /** One muted line above the pill in the promo cell. `navigation.callNote`
   *  may not have landed in every dictionary yet. */
  const callNote =
    (nav as Nav & { callNote?: string }).callNote ??
    "30 minutes with an engineer, not a sales deck.";

  /* The service groups as they appear in the mega grid and the phone sheet.
     A key can be missing while a locale file is still catching up: skip the
     row rather than crash the whole header on `undefined.title`. */
  const groups = menuColumns.map((col) => ({
    title: col.title,
    items: col.links.flatMap((link) => {
      const entry = col.group[link.key];
      return entry ? [{ href: link.href, title: entry.title }] : [];
    }),
  }));

  return (
    // Sits below the announcement bar while <html data-announcement> is set;
    // snaps back to the very top the moment the bar is dismissed or absent.
    <header
      className="fixed inset-x-0 z-50 top-0 [[data-announcement]_&]:top-10"
      onMouseLeave={() => open && setOpen(false)}
    >
      {/* Solid page ground at the top of the page and while a panel is open
          (bar and panel then read as one surface, no seam between them). Once
          the page has moved, a translucent blur with the hairline under it:
          the page is uniformly dark now, so nothing pale ever shows through. */}
      <div
        className={`relative z-20 border-b transition-[background-color,border-color] duration-300 ${
          open
            ? "border-transparent bg-cream"
            : scrolled
              ? "border-cream-line bg-cream/80 backdrop-blur-xl"
              : "border-transparent bg-cream"
        }`}
      >
        {/* THE ONE GRID: the bar sits on the shell and the 24 column field,
            at `col-[2/-2]`, which is where the hero, the bands and the footer
            all start. */}
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-[2/-2] flex h-[72px] items-center gap-4">
              <Logo onNavigate={close} onMouseEnter={close} />

              {/* Links beside the logo, actions on the right: Quanty's bar. */}
              <nav className="ml-3 hidden items-center lg:flex">
                {mainLinks.map((l) => {
                  const active = basePath === l.href;
                  return (
                    <LocaleLink
                      key={l.href}
                      href={l.href}
                      onClick={close}
                      // Hovering Services opens the grid; hovering any other
                      // link, the logo or the actions closes it again, so the
                      // panel never sticks under a pointer that has moved on.
                      onMouseEnter={l.mega ? () => setOpen(true) : close}
                      className={`group inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-3 text-[14px] font-medium ${HOVER} ${
                        active || (l.mega && open) ? "text-ink" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      {/* The rule lives on an inner span: text-decoration does
                          not reach the anonymous flex item that the label
                          becomes once the link is `inline-flex`. */}
                      <span
                        className={
                          active
                            ? "underline decoration-ink-mute decoration-[1.5px] underline-offset-8"
                            : ""
                        }
                      >
                        {l.label}
                      </span>
                      {l.mega && (
                        <Caret open={open} className={`text-ink-mute group-hover:text-ink ${HOVER}`} />
                      )}
                    </LocaleLink>
                  );
                })}
              </nav>

              <div className="ml-auto flex items-center gap-2 lg:gap-3" onMouseEnter={close}>
                {/* Also on phones: the sheet's own switcher is at its foot,
                    a long scroll away. */}
                <LocaleDropdown active={locale} basePath={basePath} label={nav.language} />
                <div className="hidden lg:block">
                  <LocaleLink href="/book-a-call" onClick={close} className="btn btn-primary">
                    {nav.getInTouch}
                  </LocaleLink>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  className={`group relative flex size-11 items-center justify-center text-ink hover:text-ink-soft lg:hidden ${HOVER}`}
                >
                  <span className="relative block h-3 w-6">
                    <span className={`absolute left-0 block h-[2px] w-6 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                    <span className={`absolute left-0 top-3 block h-[2px] w-6 bg-current transition-all duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
                  </span>
                </button>
              </div>
            </div>
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
              className="fixed inset-0 -z-10 bg-cream/60 backdrop-blur-sm"
            />

            {/* DESKTOP: the mega grid. Three columns of titles and a slim
                promo cell, about half the height of the old panel. The
                company links are in the bar and the footer, so they have no
                column here any more. */}
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              // data-lenis-prevent: Lenis is stopped while the menu is open and
              // would otherwise swallow wheel events over the panel.
              data-lenis-prevent
              className="absolute inset-x-0 top-0 z-10 hidden max-h-[92vh] overflow-y-auto overscroll-contain border-b border-cream-line bg-cream text-ink lg:block"
            >
              <div className="pc-shell">
                <div className="pc-grid pb-7 pt-[92px]">
                  <div className="col-[2/-2] grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(14rem,0.8fr)] gap-x-10">
                    {groups.map((g) => (
                      <motion.div key={g.title} variants={itemVariants}>
                        <h3 className={`mb-2 border-b border-cream-line pb-2.5 ${COL_TITLE}`}>
                          {g.title}
                        </h3>
                        <ul>
                          {g.items.map((item) => (
                            <li key={item.href}>
                              <LocaleLink href={item.href} onClick={close} className={`${ITEM} ${HOVER}`}>
                                {item.title}
                              </LocaleLink>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}

                    {/* Flush, not a card: a hairline cell on the off ground,
                        one muted line and the pill. */}
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col justify-between border border-cream-line bg-cream-dim p-5"
                    >
                      <p className="max-w-[18em] text-[13px] leading-[1.5] text-ink-mute">
                        {callNote}
                      </p>
                      <div className="mt-6">
                        <LocaleLink href="/book-a-call" onClick={close} className="btn btn-primary">
                          {nav.getInTouch}
                        </LocaleLink>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* PHONE: a full-height sheet. The four top links set large, the
                three service groups as compact lists, the pill, then language
                and socials at the foot. `fixed` (not `absolute`) so its height
                is the viewport's, minus the announcement strip when shown;
                the bar paints over its first 72px. */}
            <motion.div
              key="sheet"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              // data-lenis-prevent: Lenis is stopped while the sheet is open and
              // would otherwise swallow touch events over it.
              data-lenis-prevent
              className="fixed inset-0 z-10 flex flex-col overflow-y-auto overscroll-contain bg-cream text-ink lg:hidden [[data-announcement]_&]:top-10"
            >
              <div className="pc-shell flex flex-1 flex-col pt-[72px]">
                <div className="pc-grid flex-1">
                  <div className="col-[2/-2] flex flex-col">
                    <motion.nav variants={itemVariants} className="pt-2">
                      {mainLinks.map((l) => (
                        <LocaleLink
                          key={l.href}
                          href={l.href}
                          onClick={close}
                          className={`display flex min-h-[56px] items-center text-[28px] ${HOVER} ${
                            basePath === l.href ? "text-ink" : "text-ink hover:text-ink-soft"
                          }`}
                        >
                          {l.label}
                        </LocaleLink>
                      ))}
                    </motion.nav>

                    <motion.div variants={itemVariants} className="mt-4 border-t border-cream-line pt-2">
                      {groups.map((g) => (
                        <div key={g.title} className="pt-4">
                          <h3 className={`pb-1 ${COL_TITLE}`}>{g.title}</h3>
                          <ul>
                            {g.items.map((item) => (
                              <li key={item.href}>
                                <LocaleLink href={item.href} onClick={close} className={`${ITEM} ${HOVER}`}>
                                  {item.title}
                                </LocaleLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>

                    {/* The foot. `mt-auto` pins it to the bottom of a short
                        sheet; on a long one it simply follows the lists. */}
                    <motion.div
                      variants={itemVariants}
                      className="mt-auto border-t border-cream-line pb-8 pt-6"
                    >
                      <LocaleLink href="/book-a-call" onClick={close} className="btn btn-primary w-full">
                        {nav.getInTouch}
                      </LocaleLink>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1" aria-label={nav.language}>
                          {locales.map((loc) => {
                            const target = `/${loc}${basePath === "/" ? "" : basePath}`;
                            const isActive = loc === locale;
                            return (
                              <Link
                                key={loc}
                                href={target}
                                onClick={close}
                                aria-current={isActive ? "true" : undefined}
                                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-[12px] font-semibold ${HOVER} ${
                                  isActive ? "bg-cream-surface text-ink" : "text-ink-mute hover:text-ink"
                                }`}
                              >
                                {localeNames[loc]}
                              </Link>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-1 text-ink-mute">
                          {socials.map(({ label, Icon, href }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`flex size-11 items-center justify-center rounded-full hover:text-ink ${HOVER}`}>
                              <Icon className="size-[18px]" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
