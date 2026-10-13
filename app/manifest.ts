import type { MetadataRoute } from "next";

import { COMPANY } from "@/lib/company";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* The dark of the hero, so the browser chrome and the splash screen match the
   first thing the page paints. Same value as `themeColor` in the layout. */
const NIGHT = "#0a0a0a";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY.name,
    short_name: COMPANY.name,
    description: getDictionary(defaultLocale).meta.ogDescription,
    lang: defaultLocale,
    // The proxy sends "/" to the visitor's language.
    start_url: "/",
    scope: "/",
    display: "minimal-ui",
    theme_color: NIGHT,
    background_color: NIGHT,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
