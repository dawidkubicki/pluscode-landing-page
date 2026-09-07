/**
 * Renders the localized Open Graph cards (public/og/{en,pl,de}.png, 1200x630)
 * from the home hero copy in dictionaries/*.json.
 *
 * Run after changing the hero copy or the palette:
 *   pnpm generate:og
 *
 * The card is the hero band, flattened: the deep green ground, the wordmark
 * set in type rather than as a logo file, the headline at one weight, and the
 * domain at the foot. It carries no gradient, no accent dot, no rounded shape
 * and no uppercase label, because the site it advertises has none of those.
 *
 * September 2026: rewritten for the single-palette design. It also moved off
 * the old `hero` dictionary key, which described a headline split into three
 * coloured parts, onto `home.hero`, which is one plain string. That removed
 * the whole "glue" dance the previous version needed to keep a full stop
 * tight against an accent word: there is no accent word any more.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const LOCALES = ["en", "pl", "de"] as const;

/* The card is a baked PNG, so nothing in globals.css can reach it: these five
   constants are the site tokens copied by hand. Change one and every locale
   has to be re-rendered with `pnpm generate:og`. */
const DEEP = "#123836"; /* --color-deep, the hero ground */
const WHITE = "#ffffff"; /* --color-white */
const MIST = "#d0d7d7"; /* --color-mist, body copy on a dark ground */
const SAGE = "#91a6a4"; /* --color-sage, metadata on a dark ground */
const RULE_DEEP = "#23514e"; /* --color-rule-deep, the hairline on the green */

/* One family, one weight, like the site. satori cannot consume a variable
   font, so this needs a static instance. Inter is the site's face; Figtree is
   the previous one and is still checked in, so fall back to it rather than
   failing the build if Inter has not been fetched into scripts/fonts yet. The
   card is legible either way, and a missing font file should not be the thing
   that breaks a deploy. */
const FONT_CANDIDATES = [
  "scripts/fonts/Inter-Regular.ttf",
  "scripts/fonts/InterDisplay-Regular.ttf",
  "scripts/fonts/Figtree-Regular.ttf",
];

const fontPath = FONT_CANDIDATES.map((p) => path.join(root, p)).find((p) =>
  fs.existsSync(p),
);
if (!fontPath) {
  throw new Error(
    `no usable font found. Looked for:\n  ${FONT_CANDIDATES.join("\n  ")}`,
  );
}
const fontData = fs.readFileSync(fontPath);
console.log(`font: ${path.relative(root, fontPath)}`);

async function render(locale: (typeof LOCALES)[number]) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(root, `dictionaries/${locale}.json`), "utf8"),
  );
  const hero = dict.home.hero;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: DEEP,
          padding: "60px 72px 56px",
          fontFamily: "Inter",
          color: WHITE,
        }}
      >
        {/* The wordmark is set in the page's own face, at the size the site's
            header uses, scaled for a 1200px card. */}
        <div style={{ display: "flex", fontSize: 34, color: WHITE }}>
          Pluscode
        </div>

        <div style={{ display: "flex", flexGrow: 1 }} />

        {/* Weight 400 and tracking normal, exactly like the page. The 84px
            size with a line height of 1 is the hero's proportion, not a
            headline style invented for social. */}
        <div
          style={{
            display: "flex",
            maxWidth: 1000,
            fontSize: 84,
            fontWeight: 400,
            lineHeight: 1,
            color: WHITE,
          }}
        >
          {String(hero.headline)}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            maxWidth: 800,
            fontSize: 27,
            lineHeight: 1.375,
            color: MIST,
          }}
        >
          {String(hero.subline)}
        </div>

        <div style={{ display: "flex", flexGrow: 1 }} />

        {/* A hairline above the foot, which is how the page separates a block
            from what follows it. */}
        <div
          style={{
            display: "flex",
            height: 1,
            width: "100%",
            backgroundColor: RULE_DEEP,
            marginBottom: 28,
          }}
        />

        <div style={{ display: "flex", fontSize: 22, color: SAGE }}>
          pluscode.io
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Inter", data: fontData, weight: 400, style: "normal" }],
    },
  );

  const out = path.join(root, `public/og/${locale}.png`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await image.arrayBuffer()));
  console.log(`wrote ${path.relative(root, out)}`);
}

for (const locale of LOCALES) await render(locale);
