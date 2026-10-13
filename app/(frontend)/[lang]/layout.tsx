import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "./globals.css";
import { orbiter } from "./fonts";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import GoogleAnalytics from "./components/google-analytics";
import CookieConsent from "./components/cookie-consent";
import JsonLd from "./components/json-ld";
import { LocaleProvider } from "./components/locale-context";
import { SITE_URL } from "@/lib/company";
import { locales, isLocale, resolveLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { organizationLd, websiteLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const meta = getDictionary(locale).meta;
  // The defaults every page starts from. `alternates` is left out on purpose:
  // a canonical inherited from here would point a page that forgot its own
  // `generateMetadata` at the home page, and it would do so silently. Each
  // page states its own canonical and hreflang through `pageMetadata`.
  const { alternates: _homeOnly, ...defaults } = pageMetadata(locale, {
    path: "",
    absoluteTitle: meta.title,
  });
  void _homeOnly;
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "Pluscode",
    keywords: meta.keywords,
    ...defaults,
    // After the spread: the home page's absolute title is the default, and
    // every other page's own title goes through the template.
    title: { default: meta.title, template: "%s · Pluscode" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${orbiter.variable} antialiased`}>
      <body className="min-h-screen bg-white text-ink">
        <a href="#main" className="pc-skip">
          {dict.nav.skip}
        </a>
        <LocaleProvider locale={lang}>
          <SiteHeader locale={lang} nav={dict.nav} />
          {children}
          <SiteFooter locale={lang} dict={dict} />
          <CookieConsent dict={dict.cookies} privacyLabel={dict.footer.privacy} />
        </LocaleProvider>
        <JsonLd data={[organizationLd(lang), websiteLd(lang)]} />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
