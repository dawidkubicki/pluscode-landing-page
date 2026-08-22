import localFont from "next/font/local";

/**
 * Figtree — a single humanist sans used across the whole site: display
 * headlines, body copy, and the eyebrow / label / wordmark slots that used to be
 * monospace. Loaded as a variable font (weight 300–900) with a matching italic
 * file, so every weight and slant comes from one family.
 */
export const figtree = localFont({
  variable: "--font-figtree",
  display: "swap",
  src: [
    { path: "./fonts/Figtree.ttf", weight: "300 900", style: "normal" },
    { path: "./fonts/Figtree-Italic.ttf", weight: "300 900", style: "italic" },
  ],
});
