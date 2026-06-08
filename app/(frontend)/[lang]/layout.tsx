import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "./globals.css";
import { nohemi, geistMono } from "./fonts";
import SmoothScroll from "./components/smooth-scroll";
import Header from "./components/header";
import FloatingContact from "./components/floating-contact";
import AnnouncementBar from "./components/announcement-bar";
import { LocaleProvider } from "./components/locale-context";
import {
  locales,
  isLocale,
  localeHrefLang,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFeatured, contactLinks } from "@/lib/team";
import { getActiveAnnouncement } from "@/lib/announcement";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const ogLocale: Record<Locale, string> = {
  en: "en_GB",
  pl: "pl_PL",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  return {
    metadataBase: new URL("https://pluscode.io"),
    title: {
      default: "Pluscode — Software Development & AI Solutions",
      template: "%s · Pluscode",
    },
    description:
      "Pluscode is a software house and AI consultancy. From AI-driven innovation to custom applications, we deliver expert software development that drives measurable business impact.",
    keywords: [
      "software development",
      "AI solutions",
      "machine learning",
      "cloud",
      "data analytics",
      "Pluscode",
      "Poznań",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [localeHrefLang[l], `/${l}`]),
      ),
    },
    openGraph: {
      title: "Pluscode — Crafting software that matters",
      description:
        "Expert software development, AI and consultancy that drives measurable business impact.",
      type: "website",
      locale: ogLocale[locale],
      images: ["/og-image.png"],
    },
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
  const [featured, announcement] = await Promise.all([
    getFeatured(lang),
    getActiveAnnouncement(lang),
  ]);
  const { whatsappUrl, telUrl } = contactLinks(featured?.phone);

  const banner =
    announcement ??
    (dict.announcement.text
      ? {
          text: dict.announcement.text,
          linkText: dict.announcement.linkText || null,
          linkUrl: dict.announcement.linkUrl || null,
        }
      : null);

  return (
    <html
      lang={lang}
      className={`${nohemi.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-cream text-ink">
        <LocaleProvider locale={lang}>
          {banner && <AnnouncementBar announcement={banner} />}
          <SmoothScroll>
            <Header locale={lang} nav={dict.navigation} offset={!!banner} />
            {children}
          </SmoothScroll>
          <FloatingContact
            dict={dict.hero}
            name={featured?.name ?? dict.hero.fallbackName}
            role={featured?.role ?? dict.hero.fallbackRole}
            photo={featured?.photo ?? null}
            whatsappUrl={whatsappUrl}
            telUrl={telUrl}
          />
        </LocaleProvider>
      </body>
    </html>
  );
}
