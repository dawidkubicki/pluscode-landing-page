import type { Metadata } from "next";
import PageHero from "./components/page-hero";
import { ArrowLink, Container } from "./components/ui";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: true },
};

/* A not-found page is handed no params, and nothing on the request says which
   locale segment it belongs to. The layout above it does know, and writes it
   to `<html lang>`. So each string is rendered once per language and CSS
   shows the one that matches: `:lang()` reads the inherited language, and the
   others are `display: none`, which also keeps them from screen readers. */
const SHOW: Record<Locale, string> = {
  en: "hidden [&:lang(en)]:inline",
  pl: "hidden [&:lang(pl)]:inline",
};

function Localized({ pick }: { pick: (t: Dictionary["notFound"]) => string }) {
  return (
    <>
      {locales.map((locale) => (
        <span key={locale} className={SHOW[locale]}>
          {pick(getDictionary(locale).notFound)}
        </span>
      ))}
    </>
  );
}

export default function NotFound() {
  return (
    <main id="main">
      <PageHero size="short" title={<Localized pick={(t) => t.title} />} />
      <Container className="pc-section">
        <p className="text-lead text-grey">
          <Localized pick={(t) => t.text} />
        </p>
        <ArrowLink href="/" className="mt-8">
          <Localized pick={(t) => t.home} />
        </ArrowLink>
      </Container>
    </main>
  );
}
