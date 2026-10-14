"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { COMPANY } from "@/lib/company";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import LocaleLink from "../locale-link";
import { Logo } from "../signet";
import { CloseIcon } from "../ui";
import LanguageSwitch, { pathAfterLocale } from "./language-switch";
import { NAV_ITEMS, type NavKey } from "./nav-items";
import { useModal } from "./use-modal";

/** Scroll distance after which the bar stops being transparent. */
const SOLID_AFTER = 40;
/** Share of the first screen that must have gone before the bar joins the home page. */
const HERO_GONE = 0.72;
const DESKTOP = "(min-width: 1024px)";

function subscribeToScroll(notify: () => void) {
  window.addEventListener("scroll", notify, { passive: true });
  window.addEventListener("resize", notify);
  return () => {
    window.removeEventListener("scroll", notify);
    window.removeEventListener("resize", notify);
  };
}

const isScrolled = () => window.scrollY > SOLID_AFTER;
const isPastHero = () => window.scrollY > window.innerHeight * HERO_GONE;
// The server has no scroll position: it renders the top of the page, which is
// also what the browser shows before it restores one.
const atTop = () => false;

function currentKey(pathname: string): NavKey | null {
  const rest = pathAfterLocale(pathname);
  for (const item of NAV_ITEMS) {
    if (item.href === "/" ? rest === "" : rest === item.href || rest.startsWith(`${item.href}/`)) {
      return item.key;
    }
  }
  return null;
}

/**
 * The fixed bar and, under 1024px, the menu it opens.
 *
 * Every route opens on a dark band, so at the top of a page the bar is
 * transparent with white content, and it turns white once the page has moved.
 * The home page's first screen carries the navigation itself on a wide
 * screen, so there the bar stays out of the way until that screen has mostly
 * gone, and is unreachable by keyboard while it is hidden.
 *
 * The bar carries the whole logo, signet and wordmark. The one exception is
 * the top of the home page on a narrow screen: the wordmark already stands
 * inside the ring there, so the bar shows the signet alone and the letters
 * fade in as soon as the page moves.
 *
 * The menu is a sibling of the bar, not a child: the bar is moved with a
 * transform, and the panel must not inherit anything from it.
 */
export default function HeaderBar({ nav }: { nav: Dictionary["nav"] }) {
  const pathname = usePathname() ?? "/";
  const current = currentKey(pathname);
  const isHome = current === "home";

  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, atTop);
  const pastHero = useSyncExternalStore(subscribeToScroll, isPastHero, atTop);
  const { open, close, dialogProps } = useModal();

  // Back and forward change the route without a click on a link.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // The button that opens the menu does not exist on a wide screen, so the
  // menu must not stay open (and the page inert) across that boundary.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [close]);

  const tone = scrolled ? "light" : "dark";
  const linkClass = (key: NavKey) => {
    if (tone === "dark") return key === current ? "text-white" : "text-grey-soft hover:text-white";
    return key === current ? "text-navy" : "text-grey hover:text-blue";
  };

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b transition-[translate,visibility,background-color,border-color,color] duration-300 ease-out motion-reduce:transition-none",
          scrolled
            ? "border-grey-light bg-white text-ink"
            : "border-transparent bg-transparent text-white",
          isHome && !pastHero ? "lg:invisible lg:-translate-y-full" : "",
        ].join(" ")}
      >
        {/* While the bar is transparent it brings its own shade, so the
            white mark and links hold up over whatever photograph a page
            opens with. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[160%] bg-linear-to-b from-night/80 via-night/55 to-transparent transition-opacity duration-300 motion-reduce:transition-none ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className="pc-container flex h-full items-center justify-between">
          <LocaleLink
            href="/"
            aria-label={nav.homeLink}
            className={`-ml-1 inline-flex min-h-11 items-center px-1 transition-colors duration-200 ${
              scrolled ? "text-ink hover:text-blue" : "text-white"
            }`}
          >
            <Logo
              title={nav.homeLink}
              className={`h-7 w-auto sm:h-8 [&_[data-logo-word]]:transition-opacity [&_[data-logo-word]]:duration-300 motion-reduce:[&_[data-logo-word]]:transition-none ${
                isHome && !scrolled ? "[&_[data-logo-word]]:opacity-0" : ""
              }`}
            />
          </LocaleLink>

          <nav aria-label={nav.primary} className="hidden items-center lg:flex">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <LocaleLink
                    href={item.href}
                    aria-current={item.key === current ? "page" : undefined}
                    className={`pc-nav-link inline-flex min-h-11 items-center px-4 ${linkClass(item.key)}`}
                  >
                    {nav[item.key]}
                  </LocaleLink>
                </li>
              ))}
            </ul>
            <LanguageSwitch label={nav.language} tone={tone} className="-mr-2 ml-6" />
          </nav>

          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className="pc-nav-link -mr-2 inline-flex min-h-11 items-center gap-3 px-2 lg:hidden"
          >
            <span>{nav.menu}</span>
            <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
              <span className="h-px bg-current" />
              <span className="h-px bg-current" />
            </span>
          </button>
        </div>
      </header>

      <dialog
        {...dialogProps}
        aria-label={nav.menu}
        className="fixed inset-0 z-[60] m-0 h-full max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-night p-0 text-white opacity-0 transition-[opacity,display,overlay] transition-discrete duration-300 ease-out open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none"
      >
        <div className="flex min-h-full flex-col">
          <div className="pc-container flex h-[var(--header-h)] flex-none items-center justify-between">
            <LocaleLink
              href="/"
              aria-label={nav.homeLink}
              onClick={close}
              className="-ml-1 inline-flex min-h-11 items-center px-1"
            >
              <Logo title={nav.homeLink} className="h-7 w-auto sm:h-8" />
            </LocaleLink>
            <button
              type="button"
              onClick={close}
              className="pc-nav-link -mr-2 inline-flex min-h-11 items-center gap-3 px-2"
            >
              <span>{nav.close}</span>
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          <nav aria-label={nav.primary} className="pc-container flex flex-1 flex-col justify-center py-10">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <LocaleLink
                    href={item.href}
                    aria-current={item.key === current ? "page" : undefined}
                    onClick={close}
                    className={`block py-2.5 text-display transition-colors duration-200 ${
                      item.key === current ? "text-white" : "text-grey-soft hover:text-white"
                    }`}
                  >
                    {nav[item.key]}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pc-container flex-none">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/15 py-5">
              <LanguageSwitch
                label={nav.language}
                tone="dark"
                onNavigate={close}
                className="-ml-2"
              />
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex min-h-11 items-center text-small text-grey-light transition-colors duration-200 hover:text-white"
              >
                {COMPANY.email}
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
