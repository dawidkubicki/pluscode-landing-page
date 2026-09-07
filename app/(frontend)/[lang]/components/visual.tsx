import type { CSSProperties } from "react";

/**
 * Art-directed placeholder visuals.
 *
 * Layered gradient + SVG compositions themed around software / data so the
 * layout reads as finished without external photography. To use real imagery
 * later, drop an <img>/<Image> into the same slots in place of <Visual />. The
 * framing/aspect classes live on the parent.
 *
 * The page is dark, so these are lit rather than shaded. The previous set was
 * dark art drawn for a white page and it vanished into the ground. Every kind
 * now sits on the `night` ground with a hairline ring so it has an edge, and
 * the colour is the accent blue with cyan and violet as the second and third
 * voices, which is the one place outside a WebGL scene they are allowed.
 */

/* The palette, matching the tokens in globals.css. Written out as literals
   because these are SVG paint attributes and inline gradient strings, neither
   of which Tailwind can resolve. */
const ACCENT = "#3366ff"; /* --color-lime */
const ACCENT_BRIGHT = "#4d7aff"; /* --color-lime-bright */
const ACCENT_SOFT = "#8ab0ff"; /* --color-lime-soft */
const CYAN = "#22d3ee"; /* --color-signal-cyan */
const VIOLET = "#7c5cff"; /* --color-signal-violet */
const GROUND = "#111219"; /* --color-night */
const GROUND_SOFT = "#1a1b26"; /* --color-night-soft */
const GROUND_DEEP = "#07080b"; /* --color-night-deep */

export type VisualKind =
  | "aurora"
  | "grid"
  | "nodes"
  | "mesh"
  | "code"
  | "portrait";

const gradients: Record<VisualKind, string> = {
  aurora: `radial-gradient(95% 95% at 18% 12%, ${VIOLET} 0%, ${ACCENT} 34%, ${GROUND} 82%)`,
  grid: `linear-gradient(180deg, ${GROUND_SOFT} 0%, ${GROUND} 55%, ${GROUND_DEEP} 100%)`,
  nodes: `radial-gradient(120% 100% at 82% 8%, ${ACCENT} 0%, ${GROUND} 58%, ${GROUND_DEEP} 100%)`,
  mesh: `linear-gradient(135deg, ${ACCENT} 0%, ${VIOLET} 52%, ${CYAN} 100%)`,
  code: `linear-gradient(180deg, ${GROUND_SOFT} 0%, ${GROUND_DEEP} 100%)`,
  portrait: `radial-gradient(120% 120% at 70% 10%, ${VIOLET} 0%, ${GROUND} 55%, ${GROUND_DEEP} 100%)`,
};

export function Visual({
  kind,
  className = "",
  style,
}: {
  kind: VisualKind;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative isolate size-full overflow-hidden rounded-[inherit] ${className}`}
      style={{ backgroundImage: gradients[kind], ...style }}
    >
      {kind === "aurora" && (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <circle cx="90" cy="70" r="120" fill={ACCENT_SOFT} opacity="0.22" />
          <circle cx="320" cy="300" r="140" fill={ACCENT} opacity="0.22" />
          <circle cx="260" cy="90" r="60" fill={CYAN} opacity="0.2" />
        </svg>
      )}

      {kind === "grid" && (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <circle cx="320" cy="70" r="80" fill={ACCENT} opacity="0.38" />
          <circle cx="320" cy="70" r="36" fill={ACCENT_BRIGHT} opacity="0.5" />
          {/* perspective floor */}
          <g stroke={CYAN} strokeWidth="1" opacity="0.4" fill="none">
            {Array.from({ length: 12 }).map((_, i) => {
              const t = i / 11;
              const xTop = 200 + (t - 0.5) * 60;
              const xBot = 200 + (t - 0.5) * 1000;
              return <path key={i} d={`M${xTop} 235 L${xBot} 400`} />;
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 250 + i * i * 5;
              return <line key={`h${i}`} x1="-200" y1={y} x2="600" y2={y} />;
            })}
          </g>
        </svg>
      )}

      {kind === "nodes" && (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <g stroke={ACCENT_SOFT} strokeWidth="1.1" opacity="0.55">
            <line x1="70" y1="110" x2="180" y2="80" />
            <line x1="180" y1="80" x2="300" y2="150" />
            <line x1="180" y1="80" x2="160" y2="220" />
            <line x1="160" y1="220" x2="300" y2="150" />
            <line x1="160" y1="220" x2="90" y2="320" />
            <line x1="300" y1="150" x2="330" y2="290" />
            <line x1="90" y1="320" x2="240" y2="330" />
            <line x1="330" y1="290" x2="240" y2="330" />
          </g>
          <g>
            {[
              [70, 110],
              [180, 80],
              [300, 150],
              [160, 220],
              [90, 320],
              [330, 290],
              [240, 330],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i % 3 === 0 ? 6 : 4}
                fill={i % 3 === 0 ? CYAN : ACCENT_SOFT}
              />
            ))}
          </g>
        </svg>
      )}

      {kind === "code" && (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <g strokeWidth="6" strokeLinecap="round" opacity="0.55">
            {Array.from({ length: 9 }).map((_, i) => {
              const y = 70 + i * 30;
              const x1 = 60 + (i % 3) * 24;
              const x2 = x1 + 80 + ((i * 37) % 140);
              const stroke = i % 4 === 1 ? CYAN : i % 4 === 3 ? VIOLET : ACCENT_SOFT;
              return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke={stroke} />;
            })}
          </g>
          <rect
            x="40"
            y="44"
            width="320"
            height="312"
            rx="16"
            fill="none"
            stroke={ACCENT_SOFT}
            strokeWidth="1.2"
            opacity="0.35"
          />
        </svg>
      )}

      {kind === "portrait" && (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 500"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <circle cx="220" cy="250" r="120" fill={CYAN} opacity="0.1" />
          <path
            d="M-20 360 C 120 300 240 360 420 300 C 260 420 140 420 -20 470 Z"
            fill={ACCENT_SOFT}
            opacity="0.3"
          />
          <path
            d="M-40 420 C 120 380 260 430 440 380 C 280 470 120 480 -40 520 Z"
            fill={ACCENT}
            opacity="0.3"
          />
        </svg>
      )}

      {kind === "mesh" && (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {/* A white disc on a saturated field, not on the page: this is the
              one hard-coded white that is right on a dark site. */}
          <circle cx="300" cy="90" r="120" fill="#ffffff" opacity="0.12" />
          <circle cx="90" cy="320" r="100" fill={GROUND_DEEP} opacity="0.18" />
        </svg>
      )}

      {/* The edge. A dark box on a dark page has no outline of its own, so a
          hairline ring is drawn above the art. `rounded-[inherit]` lets it
          follow whatever radius the parent slot set. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.1)]"
      />
    </div>
  );
}
