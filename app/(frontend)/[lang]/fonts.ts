import { TASA_Orbiter } from "next/font/google";

/**
 * One family for the whole site: TASA Orbiter, the face the reference design
 * is set in. It is a variable font, so 400 (text), 500 (display) and 700
 * (names, the nav) come from a single file per subset.
 *
 * `latin-ext` is required: the site ships Polish.
 */
export const orbiter = TASA_Orbiter({
  variable: "--font-orbiter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
