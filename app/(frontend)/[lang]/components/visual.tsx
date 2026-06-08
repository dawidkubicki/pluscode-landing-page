import type { CSSProperties } from "react";

/**
 * Art-directed placeholder visuals.
 *
 * Layered gradient + SVG compositions themed around software / data so the
 * layout reads as finished without external photography. To use real imagery
 * later, drop an <img>/<Image> into the same slots in place of <Visual /> — the
 * framing/aspect classes live on the parent.
 */

export type VisualKind =
  | "aurora"
  | "grid"
  | "nodes"
  | "mesh"
  | "code"
  | "portrait";

const gradients: Record<VisualKind, string> = {
  aurora:
    "radial-gradient(120% 120% at 20% 10%, #1e3a8a 0%, #1e293b 45%, #0c111b 100%)",
  grid: "linear-gradient(180deg, #16223b 0%, #111a2e 55%, #0c111b 100%)",
  nodes:
    "radial-gradient(120% 100% at 80% 10%, #312e81 0%, #1e293b 50%, #0c111b 100%)",
  mesh: "linear-gradient(135deg, #2563eb 0%, #4f46e5 45%, #06b6d4 100%)",
  code: "linear-gradient(180deg, #111a2e 0%, #0c111b 100%)",
  portrait:
    "radial-gradient(120% 120% at 70% 10%, #1d4ed8 0%, #1e293b 50%, #0c111b 100%)",
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
      className={`grain relative isolate size-full overflow-hidden ${className}`}
      style={{ backgroundImage: gradients[kind], ...style }}
    >
      {kind === "aurora" && (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <circle cx="90" cy="70" r="120" fill="#3ba5f5" opacity="0.18" />
          <circle cx="320" cy="300" r="140" fill="#7c5cff" opacity="0.16" />
          <circle cx="260" cy="90" r="60" fill="#06b6d4" opacity="0.18" />
        </svg>
      )}

      {kind === "grid" && (
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <circle cx="320" cy="70" r="80" fill="#3ba5f5" opacity="0.18" />
          {/* perspective floor */}
          <g stroke="#3ba5f5" strokeWidth="1" opacity="0.32" fill="none">
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
          <g stroke="#3ba5f5" strokeWidth="1.1" opacity="0.45">
            <line x1="70" y1="110" x2="180" y2="80" />
            <line x1="180" y1="80" x2="300" y2="150" />
            <line x1="180" y1="80" x2="160" y2="220" />
            <line x1="160" y1="220" x2="300" y2="150" />
            <line x1="160" y1="220" x2="90" y2="320" />
            <line x1="300" y1="150" x2="330" y2="290" />
            <line x1="90" y1="320" x2="240" y2="330" />
            <line x1="330" y1="290" x2="240" y2="330" />
          </g>
          <g fill="#7cc4ff">
            {[
              [70, 110],
              [180, 80],
              [300, 150],
              [160, 220],
              [90, 320],
              [330, 290],
              [240, 330],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 6 : 4} />
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
          <g
            stroke="#3ba5f5"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.28"
          >
            {Array.from({ length: 9 }).map((_, i) => {
              const y = 70 + i * 30;
              const x1 = 60 + (i % 3) * 24;
              const x2 = x1 + 80 + ((i * 37) % 140);
              return <line key={i} x1={x1} y1={y} x2={x2} y2={y} />;
            })}
          </g>
          <rect
            x="40"
            y="44"
            width="320"
            height="312"
            rx="16"
            fill="none"
            stroke="#3ba5f5"
            strokeWidth="1.2"
            opacity="0.3"
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
          <circle cx="220" cy="250" r="120" fill="#3ba5f5" opacity="0.1" />
          <path
            d="M-20 360 C 120 300 240 360 420 300 C 260 420 140 420 -20 470 Z"
            fill="#3ba5f5"
            opacity="0.25"
          />
          <path
            d="M-40 420 C 120 380 260 430 440 380 C 280 470 120 480 -40 520 Z"
            fill="#7c5cff"
            opacity="0.2"
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
          <circle cx="300" cy="90" r="120" fill="#fff" opacity="0.12" />
          <circle cx="90" cy="320" r="100" fill="#0c111b" opacity="0.18" />
        </svg>
      )}
    </div>
  );
}
