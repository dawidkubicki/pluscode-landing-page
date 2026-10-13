import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Insights } from "./collections/Insights";
import { Team } from "./collections/Team";
import { Products } from "./collections/Products";
import { Media } from "./collections/Media";
import { Bookings } from "./collections/Bookings";
import { Users } from "./collections/Users";
import { CaseStudies } from "./collections/legacy/CaseStudies";
import { Announcements } from "./collections/legacy/Announcements";
import { Reports } from "./collections/legacy/Reports";
import { UseCases } from "./collections/legacy/UseCases";
import { TrustLogos } from "./collections/legacy/TrustLogos";
import { Clients } from "./collections/legacy/Clients";
import { HeroSlides } from "./collections/legacy/HeroSlides";
import { HomePage } from "./globals/HomePage";
import { AboutPage } from "./globals/AboutPage";
import { NewsPage } from "./globals/NewsPage";
import { ContactPage } from "./globals/ContactPage";
import { UseCasesSection } from "./globals/legacy/UseCasesSection";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: "· Pluscode CMS",
    },
  },
  // The order here is the order in the admin. The legacy collections and the
  // legacy global are hidden there: see the header of any file under legacy/.
  //
  // The sidebar lists entries without a group first, then the named groups,
  // collections before globals. Every collection therefore has a group and the
  // page globals have none: that is what puts them at the top, under the
  // heading renamed to "Pages" in `i18n` below. Give a new collection a group,
  // or it will sit above them.
  collections: [
    Insights,
    Team,
    Products,
    Media,
    Bookings,
    Users,
    CaseStudies,
    Announcements,
    Reports,
    UseCases,
    TrustLogos,
    Clients,
    HeroSlides,
  ],
  globals: [HomePage, AboutPage, NewsPage, ContactPage, UseCasesSection],
  // Multilingual content. EN is the default and the fallback, so a freshly
  // created PL document shows English until an editor translates it.
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "Polski", code: "pl" },
      { label: "Deutsch", code: "de" },
    ],
    defaultLocale: "en",
    fallback: true,
    // The site serves English and Polish only since October 2026. German stays
    // in `locales` because the `_locales` enum, the German rows already in the
    // database and the seed migrations that write `de` through the Local API
    // all need it to exist. It is only taken out of the admin's language menu.
    filterAvailableLocales: ({ locales }) =>
      locales.filter((locale) => locale.code !== "de"),
  },
  // The built in heading over ungrouped globals says "Globals". Editors know
  // those four entries as the pages of the site.
  i18n: {
    translations: {
      en: { general: { globals: "Pages" } },
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
});
