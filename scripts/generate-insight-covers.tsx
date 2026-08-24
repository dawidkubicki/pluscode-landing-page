/**
 * Renders the cover images for the AI-news insight posts
 * (scripts/content/covers/{slug}.png, 1600×900): abstract compositions on the
 * brand palette, one motif per post. Uploaded to the CMS by
 * scripts/seed-insights.ts.
 *
 * Run:  pnpm generate:covers
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import { posts } from "./content/insights-news";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const NIGHT = "#0a1929";
const NIGHT_SOFT = "#0f2237";
const NIGHT_LINE = "#22303e";
const BONE_DIM = "#8fa3bd";
const LIME = "#059669";
const LIME_SOFT = "#34d399";

const logoDataUri = `data:image/svg+xml;base64,${fs
  .readFileSync(path.join(root, "public/assets/logo/pluscode-logo.svg"))
  .toString("base64")}`;

const figtree400 = fs.readFileSync(path.join(root, "scripts/fonts/Figtree-Regular.ttf"));
const figtree600 = fs.readFileSync(path.join(root, "scripts/fonts/Figtree-SemiBold.ttf"));

const CATEGORY_LABEL: Record<string, string> = {
  ai: "AI & Machine Learning",
  development: "Development",
  business: "Business",
  technology: "Technology",
  cloud: "Cloud",
  mobile: "Mobile",
};

/** Documents + a ring of dots — regulation / compliance. */
function motifRegulation() {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 210 + Math.cos(a) * 190 - 9,
          top: 210 + Math.sin(a) * 190 - 9,
          width: 18,
          height: 18,
          borderRadius: 999,
          backgroundColor: i < 8 ? LIME_SOFT : NIGHT_LINE,
        }}
      />
    );
  });
  return (
    <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 1600, height: 900 }}>
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 230,
          width: 420,
          height: 420,
          display: "flex",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 60,
            width: 300,
            height: 300,
            borderRadius: 999,
            border: `3px solid ${NIGHT_LINE}`,
          }}
        />
        {dots}
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 150,
            top: 300 + i * 110,
            width: 560,
            height: 74,
            borderRadius: 10,
            backgroundColor: i === 0 ? LIME : NIGHT_SOFT,
            border: `2px solid ${i === 0 ? LIME : NIGHT_LINE}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 26,
            gap: 18,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              backgroundColor: i === 0 ? NIGHT : LIME_SOFT,
            }}
          />
          <div
            style={{
              width: i === 0 ? 330 : 260 - i * 40,
              height: 12,
              borderRadius: 6,
              backgroundColor: i === 0 ? "rgba(10,25,41,0.55)" : NIGHT_LINE,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/** Ascending tiers with a glowing top step — frontier model tiers. */
function motifTiers() {
  const steps = [
    { x: 430, h: 160 },
    { x: 720, h: 260 },
    { x: 1010, h: 380 },
    { x: 1300, h: 520 },
  ];
  return (
    <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 1600, height: 900 }}>
      {steps.map((s, i) => {
        const top = i === steps.length - 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              bottom: 0,
              width: 250,
              height: s.h,
              borderRadius: "14px 14px 0 0",
              backgroundColor: top ? "rgba(5,150,105,0.24)" : NIGHT_SOFT,
              border: `2px solid ${top ? LIME_SOFT : NIGHT_LINE}`,
              display: "flex",
              justifyContent: "center",
              paddingTop: 24,
            }}
          >
            <div
              style={{
                width: 54,
                height: 8,
                borderRadius: 4,
                backgroundColor: top ? LIME_SOFT : NIGHT_LINE,
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 1395,
          top: 300,
          width: 60,
          height: 60,
          borderRadius: 999,
          backgroundColor: LIME,
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

/** Bar chart, one outlined "cancelled" bar — adoption vs failure numbers. */
function motifBars() {
  const bars = [
    { h: 250, kind: "solid" },
    { h: 380, kind: "solid" },
    { h: 310, kind: "dim" },
    { h: 500, kind: "solid" },
    { h: 420, kind: "outline" },
    { h: 610, kind: "lime" },
  ];
  return (
    <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 1600, height: 900 }}>
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          bottom: 118,
          height: 2,
          backgroundColor: NIGHT_LINE,
        }}
      />
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 190 + i * 215,
            bottom: 120,
            width: 130,
            height: b.h,
            borderRadius: "10px 10px 0 0",
            backgroundColor:
              b.kind === "lime"
                ? LIME
                : b.kind === "outline"
                  ? "transparent"
                  : b.kind === "dim"
                    ? NIGHT_SOFT
                    : "rgba(52,211,153,0.35)",
            border: `2px ${b.kind === "outline" ? "dashed" : "solid"} ${
              b.kind === "lime" ? LIME : b.kind === "outline" ? BONE_DIM : NIGHT_LINE
            }`,
          }}
        />
      ))}
    </div>
  );
}

/** Code lines vs one flat delivery line — the coding paradox. */
function motifCode() {
  const lines = [340, 470, 250, 520, 300, 430, 380, 490];
  return (
    <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 1600, height: 900 }}>
      {lines.map((w, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 150 + (i % 2) * 44,
            top: 210 + i * 62,
            width: w,
            height: 18,
            borderRadius: 9,
            backgroundColor: i % 3 === 0 ? "rgba(52,211,153,0.55)" : NIGHT_SOFT,
            border: `1px solid ${i % 3 === 0 ? LIME_SOFT : NIGHT_LINE}`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 300,
          width: 480,
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 480,
            height: 220,
            borderRadius: 12,
            border: `2px solid ${NIGHT_LINE}`,
            backgroundColor: "rgba(15,34,55,0.6)",
            position: "relative",
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 40 + i * 70,
                bottom: 30,
                width: 26,
                height: 30 + i * 28,
                borderRadius: 4,
                backgroundColor: LIME_SOFT,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            width: 480,
            height: 120,
            borderRadius: 12,
            border: `2px solid ${NIGHT_LINE}`,
            backgroundColor: "rgba(15,34,55,0.6)",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginLeft: 40,
              width: 400,
              height: 4,
              borderRadius: 2,
              backgroundColor: BONE_DIM,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const MOTIFS: Record<string, () => ReactElement> = {
  "eu-ai-act-august-2026-what-actually-changed": motifRegulation,
  "frontier-models-h2-2026-claude-fable-5-gpt-5-6": motifTiers,
  "ai-agents-enterprise-2026-hype-vs-numbers": motifBars,
  "ai-coding-paradox-faster-developers-flat-delivery": motifCode,
};

async function render(slug: string, category: string) {
  const Motif = MOTIFS[slug];
  if (!Motif) throw new Error(`No motif for ${slug}`);

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: NIGHT,
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0) 55%)",
          fontFamily: "Figtree",
          position: "relative",
        }}
      >
        {Motif()}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUri}
          width={166}
          height={36}
          alt=""
          style={{ position: "absolute", left: 72, top: 64 }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 60,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: LIME }} />
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: BONE_DIM,
            }}
          >
            {CATEGORY_LABEL[category] ?? category}
          </div>
        </div>
      </div>
    ),
    {
      width: 1600,
      height: 900,
      fonts: [
        { name: "Figtree", data: figtree400, weight: 400, style: "normal" },
        { name: "Figtree", data: figtree600, weight: 600, style: "normal" },
      ],
    },
  );

  const out = path.join(root, `scripts/content/covers/${slug}.png`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await image.arrayBuffer()));
  console.log(`✓ ${path.relative(root, out)}`);
}

for (const p of posts) await render(p.slug, p.category);
