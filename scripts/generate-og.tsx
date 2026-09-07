/**
 * Renders the localized Open Graph images (public/og/{en,pl,de}.png, 1200×630)
 * from the hero copy in dictionaries/*.json, on the same ground as the site's
 * closing CTA band: neutral near-black, one soft indigo wash in the top right,
 * a white Figtree headline with the em-phrase in indigo, and the white wordmark.
 * It is the same family as the baked insight covers, never navy, never emerald.
 *
 * Run after changing hero copy or the brand palette:
 *   pnpm generate:og
 *
 * Fonts: satori can't consume the variable Figtree.ttf the site uses, so the
 * static 400/600 instances live in scripts/fonts/ (cut with fontTools
 * varLib.instancer from the same file).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const LOCALES = ["en", "pl", "de"] as const;

/* The card is a baked PNG, so nothing in globals.css can reach it: these six
   constants are the site tokens copied by hand. Change one and every locale
   has to be re-rendered with `pnpm generate:og`. */
const NIGHT = "#0b0c10"; /* --color-cream, the page ground */
const BONE = "#ffffff"; /* --color-bone */
const BONE_SOFT = "#b4b4c4"; /* --color-bone-soft */
const BONE_DIM = "#7e7e90"; /* --color-bone-dim */
const LIME = "#3366ff"; /* --color-lime, electric blue */
const LIME_SOFT = "#8ab0ff"; /* --color-lime-soft, the accent on dark */

const logoDataUri = `data:image/svg+xml;base64,${fs
  .readFileSync(path.join(root, "public/assets/logo/pluscode-logo.svg"))
  .toString("base64")}`;

const figtree400 = fs.readFileSync(path.join(root, "scripts/fonts/Figtree-Regular.ttf"));
const figtree600 = fs.readFileSync(path.join(root, "scripts/fonts/Figtree-SemiBold.ttf"));

async function render(locale: (typeof LOCALES)[number]) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(root, `dictionaries/${locale}.json`), "utf8"),
  );
  const hero = dict.hero;

  // headlineEnd is appended to headlineEm with no separator on the page. Split
  // off whatever runs up to the first space (a full stop, usually) so it can be
  // set tight against the accent word; the rest wraps as ordinary words.
  const end = String(hero.headlineEnd || "");
  const glue = end.slice(0, end.search(/\s|$/));
  const endWords = end.slice(glue.length).split(/\s+/).filter(Boolean);

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: NIGHT,
          backgroundImage: `radial-gradient(circle at 85% 10%, rgba(91,91,214,0.16) 0%, rgba(91,91,214,0) 55%)`,
          padding: "60px 72px 56px",
          fontFamily: "Figtree",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri} width={176} height={38} alt="" />

        <div style={{ display: "flex", flexGrow: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: LIME,
            }}
          />
          <div
            style={{
              fontSize: 21,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: BONE_DIM,
            }}
          >
            {hero.eyebrow}
          </div>
        </div>

        {/* satori can't wrap mixed-color inline text, so the headline is a
            flex-wrapped row of word spans (margin ≈ one space at 68px). */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 26,
            maxWidth: 1020,
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: "-0.015em",
          }}
        >
          {String(hero.headlineStart)
            .split(/\s+/)
            .map((word, i) => (
              <span key={`s${i}`} style={{ color: BONE, marginRight: 17 }}>
                {word}
              </span>
            ))}
          {/* The em phrase wraps as one unit so it never splits across lines,
              and it carries `glue` with it: the page joins headlineEm and
              headlineEnd with no space, so a trailing full stop has to sit
              tight against the accent word instead of a word-gap away. */}
          <span style={{ display: "flex", marginRight: 17 }}>
            <span style={{ color: LIME_SOFT }}>{hero.headlineEm}</span>
            {glue && <span style={{ color: BONE }}>{glue}</span>}
          </span>
          {endWords.map((word, i) => (
            <span key={`e${i}`} style={{ color: BONE, marginRight: 17 }}>
              {word}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 26,
            maxWidth: 760,
            fontSize: 25,
            lineHeight: 1.55,
            color: BONE_SOFT,
          }}
        >
          {hero.subtext}
        </div>

        <div style={{ display: "flex", flexGrow: 1.35 }} />

        <div
          style={{
            fontSize: 20,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: BONE_DIM,
          }}
        >
          pluscode.io
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Figtree", data: figtree400, weight: 400, style: "normal" },
        { name: "Figtree", data: figtree600, weight: 600, style: "normal" },
      ],
    },
  );

  const out = path.join(root, `public/og/${locale}.png`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await image.arrayBuffer()));
  console.log(`✓ ${path.relative(root, out)}`);
}

for (const locale of LOCALES) await render(locale);
