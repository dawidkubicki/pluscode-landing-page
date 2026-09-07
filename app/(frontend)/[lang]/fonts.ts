import { Inter } from "next/font/google";

/**
 * ONE family, ONE weight, for the entire site.
 *
 * The reference build runs a single custom grotesque at weight 400 for every
 * word on the page, headline and caption alike. Inter is the closest freely
 * licensed match: same large x-height, same single-storey `g` with an open
 * tail, same near-identical width. It was picked by rendering the reference's
 * own headline string side by side against Inter, Inter Tight, Geist and
 * Instrument Sans; Inter matched the reference's width and letterforms, the
 * other three ran narrow.
 *
 * Only 400 is loaded, on purpose. Nothing on this site is bold, so a second
 * weight would be dead bytes on the critical path, and shipping only 400
 * means a stray `font-bold` left in an old component cannot quietly
 * reintroduce a heavier voice (`globals.css` also flattens those utilities
 * back to 400, so neither real nor synthetic bolding can get through).
 *
 * `latin-ext` is required: the site ships Polish and German.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400"],
});
