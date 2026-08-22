import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { CaseStudies } from "./collections/CaseStudies";
import { Insights } from "./collections/Insights";
import { Announcements } from "./collections/Announcements";
import { Team } from "./collections/Team";
import { Reports } from "./collections/Reports";
import { UseCases } from "./collections/UseCases";
import { Bookings } from "./collections/Bookings";

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
  collections: [Users, Media, CaseStudies, Insights, Announcements, Team, Reports, UseCases, Bookings],
  // Multilingual content. EN is the default and the fallback, so a freshly
  // created PL document shows English until an editor translates it.
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "Polski", code: "pl" },
    ],
    defaultLocale: "en",
    fallback: true,
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
