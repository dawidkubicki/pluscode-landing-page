import { Inter, Inter_Tight } from "next/font/google";

/** Body, UI, labels. The base weight in `globals.css` is 500, not 400. */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"], // latin-ext is required for pl and de
  display: "swap",
  weight: ["400", "500", "600"],
});

/** Display face for h1/h2/h3 and stat figures. Google's tighter cut of Inter,
 *  reached from every headline through the `--font-serif` alias. */
export const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["500", "600"],
});
