import LocaleLink from "./locale-link";
import { SignetMark } from "./signet";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** The four destinations, in order. Shared with the footer and the hero. */
export const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

/* PLACEHOLDER: the home-and-chrome agent replaces this body. The props and
   the NAV_ITEMS export are the contract and stay as they are. */
export default function SiteHeader({
  nav,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] bg-white">
      <div className="pc-container flex h-full items-center justify-between">
        <LocaleLink href="/" aria-label={nav.homeLink}>
          <SignetMark className="h-8 w-auto text-ink" />
        </LocaleLink>
        <nav aria-label={nav.primary} className="flex gap-8">
          {NAV_ITEMS.map((item) => (
            <LocaleLink key={item.key} href={item.href} className="pc-nav-link text-grey">
              {nav[item.key]}
            </LocaleLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
