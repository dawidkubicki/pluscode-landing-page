import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "./globals.css";
import { inter } from "./fonts";
import SmoothScroll from "./components/smooth-scroll";
import Header from "./components/header";
import FloatingContact from "./components/floating-contact";
import AnnouncementBar from "./components/announcement-bar";
import AnnouncementScript from "./components/announcement-script";
import { LocaleProvider } from "./components/locale-context";
import { locales, isLocale, localeHrefLang } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildOpenGraph } from "@/lib/seo";
import { contactLinks } from "@/lib/team";
import { CONTACT_PERSON } from "@/lib/contact-person";
import { getActiveAnnouncement } from "@/lib/announcement";
import { announcementStorageKey } from "@/lib/announcement-key";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const meta = getDictionary(locale).meta;
  return {
    metadataBase: new URL("https://pluscode.io"),
    title: {
      default: meta.title,
      template: "%s · Pluscode",
    },
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [localeHrefLang[l], `/${l}`]),
      ),
    },
    openGraph: buildOpenGraph(locale),
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
  const announcement = await getActiveAnnouncement(lang);
  // The contact person is a static constant, not a CMS lookup: the widget
  // renders on every route, so a database round trip here would cost every
  // page a query that can no longer change the answer. `getFeatured` stays
  // exported from lib/team.ts for a caller that needs the CMS entry.
  const { whatsappUrl, telUrl } = contactLinks(CONTACT_PERSON.phone);

  const banner =
    announcement ??
    (dict.announcement.text
      ? {
          text: dict.announcement.text,
          linkText: dict.announcement.linkText || null,
          linkUrl: dict.announcement.linkUrl || null,
        }
      : null);

  // The announcement bar, the header's 40px offset and the matching page
  // padding are all keyed off a `data-announcement` attribute on <html>. This
  // inline script sets it before first paint only when the visitor hasn't
  // dismissed this announcement, so a dismissed bar never leaves an empty
  // strip above the header (and there's no flash for returning visitors).
  // It only runs on the initial document load; after locale switches the
  // AnnouncementBar layout effect owns the attribute.
  const announcementScript = banner
    ? `try{if(localStorage.getItem(${JSON.stringify(
        announcementStorageKey(banner.text),
      )})!=="dismissed")document.documentElement.setAttribute("data-announcement","")}catch(e){document.documentElement.setAttribute("data-announcement","")}`
    : null;

  return (
    <html
      lang={lang}
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-paper text-ink">
        {announcementScript && <AnnouncementScript code={announcementScript} />}
        <LocaleProvider locale={lang}>
          {banner && <AnnouncementBar announcement={banner} />}
          <SmoothScroll>
            <Header locale={lang} nav={dict.navigation} />
            <div className="[[data-announcement]_&]:pt-10">{children}</div>
          </SmoothScroll>
          <FloatingContact
            dict={dict.hero}
            name={CONTACT_PERSON.name}
            role={CONTACT_PERSON.role}
            photo={CONTACT_PERSON.photo}
            whatsappUrl={whatsappUrl}
            telUrl={telUrl}
          />
        </LocaleProvider>
      </body>
    </html>
  );
}
