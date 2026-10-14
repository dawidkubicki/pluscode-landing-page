import { Inter, Inter_Tight } from "next/font/google";

/**
 * Two cuts of one design. Inter sets everything that is read: paragraphs,
 * labels, the navigation. Inter Tight, the same letterforms drawn closer
 * together for large sizes, sets everything that is looked at: the tagline,
 * section headings, the statement. Together they are the nearest freely
 * licensed match for the quiet, tightly spaced grotesque the brief asked for.
 *
 * Both are variable fonts, so every weight comes from one file per subset.
 * `latin-ext` is required: the site ships Polish.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["opsz"],
});

export const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
