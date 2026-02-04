import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { nohemi } from './fonts';
import { AnnouncementProvider } from "@/components/AnnouncementContext";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";
import "./globals.css";

const siteConfig = {
  name: "Pluscode",
  description: "We build innovative digital solutions that transform businesses. Expert software development, AI & data services, and cloud solutions.",
  url: "https://pluscode.dev",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Software Development & AI Solutions`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "software development",
    "web development",
    "mobile app development",
    "AI solutions",
    "machine learning",
    "data analytics",
    "cloud services",
    "digital transformation",
    "custom software",
    "Pluscode",
  ],
  authors: [{ name: "Pluscode" }],
  creator: "Pluscode",
  publisher: "Pluscode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Software Development & AI Solutions`,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Software Development & AI Solutions`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Software Development & AI Solutions`,
    description: siteConfig.description,
    images: ["/og-image.png"],
    creator: "@pluscode",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`${nohemi.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ReCaptchaProvider>
            <AnnouncementProvider>
              {children}
            </AnnouncementProvider>
          </ReCaptchaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
