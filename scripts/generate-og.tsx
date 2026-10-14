/**
 * Paints the share cards, public/og/{en,pl}.png (1200 x 630), from the home
 * hero: the hero photograph, darkened and run out to black, the signet as a
 * thin ring, the wordmark inside it and the tagline beside it.
 *
 * Run after changing the hero photograph, the tagline or the logo:
 *   pnpm generate:og
 * then bump OG_CARD_VERSION in lib/seo.ts, because scrapers cache by URL.
 * On this Mac, prefix with `arch -arm64` (sharp is a native module).
 *
 * Everything on the card is read from the site rather than copied into this
 * file: the tagline from dictionaries/<locale>.json (`homePage.heroTagline`),
 * the mark from signet-paths.ts, the photograph from public/assets/nature.
 * The CMS can override the tagline on the page itself; the card keeps the
 * dictionary's, which is what a fresh database is seeded with.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";
import sharp from "sharp";

import {
  SIGNET,
  WORDMARK_PATHS,
  WORDMARK_VIEWBOX,
} from "../app/(frontend)/[lang]/components/signet-paths";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const LOCALES = ["en", "pl"] as const;

const WIDTH = 1200;
const HEIGHT = 630;

/* The card is a baked PNG, so nothing in globals.css can reach it: these are
   the site tokens copied by hand. */
const NIGHT = "#0a0a0a";
const WHITE = "#ffffff";
const GREY_SOFT = "#999999";
/** The ring's stroke, as SignetRing draws it on a dark ground. */
const RING_STOPS = [WHITE, "#152644", WHITE];

const HERO = "public/assets/nature/hero-2.webp";
const FONT = "scripts/fonts/InterTight-Regular.ttf";

/* The big disc, in card pixels. It sits left of centre and the small disc runs
   off the left edge, as on the hero, which leaves the right half for words. */
const DISC = { cx: 314, cy: HEIGHT / 2, r: 252 };
const SCALE = DISC.r / SIGNET.big.r;
const RING = {
  left: DISC.cx - SIGNET.big.cx * SCALE,
  top: DISC.cy - SIGNET.big.cy * SCALE,
  width: SIGNET.width * SCALE,
  height: SIGNET.height * SCALE,
  /** In the drawing's units, so it scales with the mark: about 3px here. */
  weight: 0.27,
};

/** Left edge of the words: a little clear of the ring. */
const TEXT_LEFT = DISC.cx + DISC.r + 44;
const TEXT_WIDTH = WIDTH - TEXT_LEFT - 56;
/** The largest size at which the Polish tagline still breaks into two lines. */
const TAGLINE_SIZE = 41;
const TAGLINE_LINE = 1.26;
/** The wordmark is as tall as a line of the tagline and ends inside the ring. */
const [, , WORDMARK_W, WORDMARK_H] = WORDMARK_VIEWBOX.split(" ").map(Number);
const WORDMARK_HEIGHT = 43;
const WORDMARK_WIDTH = (WORDMARK_HEIGHT * WORDMARK_W) / WORDMARK_H;
const WORDMARK_LEFT = DISC.cx + DISC.r - 40 - WORDMARK_WIDTH;
/** The wordmark and the tagline's first line share the disc's horizontal axis. */
const ROW_TOP = DISC.cy - (TAGLINE_SIZE * TAGLINE_LINE) / 2;

/**
 * The photograph as the card's ground: cropped from the top, where the surf
 * is, dimmed, and faded into the site's near black so the words below the
 * wave always sit on a dark field. Without the file, plain near black.
 */
async function ground(): Promise<string> {
  const file = path.join(root, HERO);
  const base = sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: NIGHT },
  });
  if (!fs.existsSync(file)) {
    console.warn(`${HERO} is missing: painting the card on ${NIGHT}`);
    return dataUri(await base.png().toBuffer(), "image/png");
  }

  const photo = await sharp(file)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
    .modulate({ brightness: 0.9 })
    .toBuffer();
  const fade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${NIGHT}" stop-opacity="0.1"/>
          <stop offset="0.3" stop-color="${NIGHT}" stop-opacity="0.24"/>
          <stop offset="0.62" stop-color="${NIGHT}" stop-opacity="0.9"/>
          <stop offset="0.82" stop-color="${NIGHT}" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#fade)"/>
    </svg>`,
  );
  const painted = await sharp(photo)
    .composite([{ input: fade }])
    .jpeg({ quality: 92 })
    .toBuffer();
  return dataUri(painted, "image/jpeg");
}

const dataUri = (data: Buffer, type: string) =>
  `data:${type};base64,${data.toString("base64")}`;

async function render(locale: (typeof LOCALES)[number], background: string, font: Buffer) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(root, `dictionaries/${locale}.json`), "utf8"),
  );
  const tagline = String(dict.homePage.heroTagline);
  const pad = RING.weight;

  const image = new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: NIGHT,
          fontFamily: "Inter Tight",
          color: WHITE,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={background}
          width={WIDTH}
          height={HEIGHT}
          style={{ position: "absolute", left: 0, top: 0 }}
        />

        <svg
          viewBox={`${-pad} ${-pad} ${SIGNET.width + pad * 2} ${SIGNET.height + pad * 2}`}
          width={RING.width + pad * 2 * SCALE}
          height={RING.height + pad * 2 * SCALE}
          fill="none"
          style={{
            position: "absolute",
            left: RING.left - pad * SCALE,
            top: RING.top - pad * SCALE,
          }}
        >
          <defs>
            <linearGradient
              id="ring"
              gradientUnits="userSpaceOnUse"
              x1={SIGNET.width * 0.86}
              y1={SIGNET.height * 0.9}
              x2={SIGNET.width * 0.2}
              y2={SIGNET.height * 0.08}
            >
              <stop offset="0" stopColor={RING_STOPS[0]} />
              <stop offset="0.5" stopColor={RING_STOPS[1]} />
              <stop offset="1" stopColor={RING_STOPS[2]} />
            </linearGradient>
          </defs>
          <path d={SIGNET.bigPath} stroke="url(#ring)" strokeWidth={RING.weight} />
          <circle
            cx={SIGNET.small.cx}
            cy={SIGNET.small.cy}
            r={SIGNET.small.r}
            stroke="url(#ring)"
            strokeWidth={RING.weight}
          />
        </svg>

        <svg
          viewBox={WORDMARK_VIEWBOX}
          width={WORDMARK_WIDTH}
          height={WORDMARK_HEIGHT}
          fill={WHITE}
          style={{
            position: "absolute",
            left: WORDMARK_LEFT,
            // Centred on the tagline's first line.
            top: ROW_TOP + (TAGLINE_SIZE * TAGLINE_LINE - WORDMARK_HEIGHT) / 2,
          }}
        >
          {WORDMARK_PATHS.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </svg>

        <div
          style={{
            position: "absolute",
            left: TEXT_LEFT,
            top: ROW_TOP,
            width: TEXT_WIDTH,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: TAGLINE_SIZE,
              fontWeight: 400,
              lineHeight: TAGLINE_LINE,
              // Two even lines, as the hero sets it, not one long and one short.
              textWrap: "balance",
            }}
          >
            {tagline}
          </div>
          <div
            style={{
              display: "flex",
              height: 1,
              width: "100%",
              marginTop: 34,
              backgroundColor: "rgba(255, 255, 255, 0.28)",
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 21,
              letterSpacing: 0.4,
              color: GREY_SOFT,
            }}
          >
            pluscode.io
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: "Inter Tight", data: font, weight: 400, style: "normal" }],
    },
  );

  /* A photograph as a plain PNG is well over a megabyte. Eight-bit colour
     with dithering keeps the gradients smooth at a fifth of that, small
     enough for every scraper's size limit. */
  const png = await sharp(Buffer.from(await image.arrayBuffer()))
    .png({ palette: true, colours: 256, dither: 1, effort: 10, compressionLevel: 9 })
    .toBuffer();

  const out = path.join(root, `public/og/${locale}.png`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, png);
  console.log(`wrote ${path.relative(root, out)} (${Math.round(png.length / 1024)} kB)`);
}

const fontFile = path.join(root, FONT);
if (!fs.existsSync(fontFile)) {
  throw new Error(`${FONT} is missing. It ships with the repository: see scripts/fonts/.`);
}
const font = fs.readFileSync(fontFile);
const background = await ground();
for (const locale of LOCALES) await render(locale, background, font);
