import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

/** Editorial serif display — headlines & pull quotes. Variable font: we keep the
 *  full wght range and the optical-size axis so large display lines stay crisp
 *  and high-contrast. (next/font forbids combining a fixed `weight` with `axes`.) */
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Primary UI / body — humanist grotesque (variable wght). */
export const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Monospace — eyebrow labels, tags and the wordmark. */
export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});
