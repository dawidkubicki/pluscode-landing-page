import type { CSSProperties } from "react";

/**
 * Art for the "Ambition in action" cards.
 *
 * Unlike the generic `Visual` placeholders, each of these draws the actual
 * shape of the use case (a document being read into a system, a forecast cone,
 * an inspected part) so a card says something before its headline is read.
 * Blueprint-style line work, no text, so it needs no translation. A real image
 * uploaded in Payload still wins: the card only falls back to this.
 */

export type UseCaseArtKind =
  | "document"
  | "assistant"
  | "forecast"
  | "vision"
  | "knowledge";

/** Used when a card has no `art` set in the CMS. Matches the seeded card order. */
export const artFallback: UseCaseArtKind[] = [
  "document",
  "assistant",
  "forecast",
  "vision",
  "knowledge",
];

export function isArtKind(value: unknown): value is UseCaseArtKind {
  return (
    typeof value === "string" &&
    (artFallback as string[]).includes(value)
  );
}

const gradients: Record<UseCaseArtKind, string> = {
  document:
    "linear-gradient(155deg, #13324e 0%, #0d2137 55%, #0a1929 100%)",
  assistant:
    "radial-gradient(120% 110% at 78% 12%, #0b5f47 0%, #0f2237 55%, #0a1929 100%)",
  forecast: "linear-gradient(180deg, #113049 0%, #0c1e33 58%, #0a1929 100%)",
  vision:
    "radial-gradient(115% 110% at 22% 10%, #076048 0%, #0e2136 55%, #0a1929 100%)",
  knowledge:
    "linear-gradient(145deg, #102841 0%, #0b1d31 55%, #0a1929 100%)",
};

const ACCENT = "#34d399";
const LINE = "rgba(255,255,255,0.30)";
const FILL = "rgba(255,255,255,0.06)";

/** Shared arrowhead, pointing right from (x, y). */
function Arrowhead({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 7} ${y - 5} L${x} ${y} L${x - 7} ${y + 5}`}
      fill="none"
      stroke={ACCENT}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Document() {
  return (
    <>
      {/* the invoice, with two fields picked out */}
      <rect x="6" y="16" width="104" height="140" rx="5" fill={FILL} stroke={LINE} strokeWidth="1.2" />
      <g stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeLinecap="round">
        <line x1="20" y1="36" x2="72" y2="36" />
        <line x1="20" y1="52" x2="96" y2="52" />
        <line x1="20" y1="94" x2="84" y2="94" />
        <line x1="20" y1="126" x2="66" y2="126" />
      </g>
      <g fill="rgba(52,211,153,0.16)" stroke={ACCENT} strokeWidth="1.2">
        <rect x="14" y="62" width="82" height="18" rx="3" />
        <rect x="14" y="104" width="60" height="18" rx="3" />
      </g>
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="2.4" strokeLinecap="round">
        <line x1="22" y1="71" x2="60" y2="71" />
        <line x1="22" y1="113" x2="48" y2="113" />
      </g>

      <line x1="116" y1="86" x2="140" y2="86" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" />
      <Arrowhead x={144} y={86} />

      {/* what reads it */}
      <rect x="152" y="46" width="78" height="80" rx="7" fill="rgba(52,211,153,0.10)" stroke="rgba(52,211,153,0.55)" strokeWidth="1.2" />
      <g fill={ACCENT} opacity="0.85">
        <rect x="164" y="62" width="34" height="6" rx="3" />
        <rect x="164" y="78" width="54" height="6" rx="3" />
        <rect x="164" y="94" width="24" height="6" rx="3" />
      </g>
      <circle cx="210" cy="97" r="3.5" fill={ACCENT} />

      <line x1="236" y1="86" x2="258" y2="86" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" />
      <Arrowhead x={262} y={86} />

      {/* the system it lands in */}
      <g fill="rgba(255,255,255,0.05)" stroke={LINE} strokeWidth="1.2">
        <ellipse cx="286" cy="52" rx="26" ry="8.5" />
        <path d="M260 52 v68 a26 8.5 0 0 0 52 0 V52" />
      </g>
      <g fill="none" stroke={LINE} strokeWidth="1.2">
        <path d="M260 74 a26 8.5 0 0 0 52 0" />
        <path d="M260 97 a26 8.5 0 0 0 52 0" />
      </g>
    </>
  );
}

function Assistant() {
  return (
    <>
      {/* what the customer wrote */}
      <path d="M6 22 h124 a9 9 0 0 1 9 9 v34 a9 9 0 0 1 -9 9 H26 l-12 12 v-12 h-8 a9 9 0 0 1 -9 -9 V31 a9 9 0 0 1 9 -9 z" fill={FILL} stroke={LINE} strokeWidth="1.2" />
      <g stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round">
        <line x1="18" y1="40" x2="108" y2="40" />
        <line x1="18" y1="54" x2="76" y2="54" />
      </g>

      {/* the assistant, and the fork it comes to */}
      <circle cx="176" cy="95" r="21" fill="rgba(52,211,153,0.12)" stroke={ACCENT} strokeWidth="1.3" />
      <g fill={ACCENT}>
        <circle cx="167" cy="95" r="3" />
        <circle cx="176" cy="95" r="3" />
        <circle cx="185" cy="95" r="3" />
      </g>
      <line x1="142" y1="72" x2="160" y2="86" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />

      <path d="M196 84 C 218 76 224 58 244 52" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />
      <Arrowhead x={248} y={51} />
      <path d="M196 108 C 218 118 224 134 244 140" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />

      {/* answered on its own */}
      <rect x="254" y="24" width="62" height="46" rx="9" fill="rgba(52,211,153,0.12)" stroke={ACCENT} strokeWidth="1.2" />
      <path d="m268 47 6 6 12 -14" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* or handed to a person */}
      <g fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6">
        <circle cx="278" cy="128" r="11" />
        <path d="M258 162 a20 20 0 0 1 40 0" />
      </g>
    </>
  );
}

function Forecast() {
  return (
    <>
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="1">
        <line x1="16" y1="164" x2="314" y2="164" />
        <line x1="16" y1="18" x2="16" y2="164" />
        {[44, 80, 116].map((y) => (
          <line key={y} x1="16" y1={y} x2="314" y2={y} strokeDasharray="2 6" />
        ))}
      </g>

      {/* what already happened */}
      <polyline
        points="22,132 48,118 74,138 100,104 126,116 152,86 178,96"
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="rgba(255,255,255,0.75)">
        {[
          [22, 132],
          [74, 138],
          [126, 116],
          [178, 96],
        ].map(([cx, cy]) => (
          <circle key={`${cx}`} cx={cx} cy={cy} r="2.6" />
        ))}
      </g>

      <line x1="178" y1="20" x2="178" y2="164" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 5" />

      {/* the range it expects next */}
      <path d="M178 96 L238 62 L306 34 L306 96 L238 106 Z" fill="rgba(52,211,153,0.18)" />
      <polyline
        points="178,96 238,84 306,62"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="7 5"
      />
      <circle cx="306" cy="62" r="4" fill={ACCENT} />
    </>
  );
}

function Vision() {
  return (
    <>
      {/* the part on the line */}
      <path
        d="M84 44 h132 a12 12 0 0 1 12 12 v34 l-16 16 v30 a12 12 0 0 1 -12 12 H84 a12 12 0 0 1 -12 -12 V56 a12 12 0 0 1 12 -12 z"
        fill={FILL}
        stroke={LINE}
        strokeWidth="1.2"
      />
      <g fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="1.1">
        <circle cx="96" cy="62" r="6" />
        <circle cx="96" cy="130" r="6" />
        <line x1="118" y1="96" x2="188" y2="96" />
      </g>

      {/* what the camera frames */}
      <g fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
        <path d="M54 50 v-18 h18" />
        <path d="M266 50 v-18 h-18" />
        <path d="M54 140 v18 h18" />
        <path d="M266 140 v18 h-18" />
      </g>

      {/* the flaw it caught, called out the way an inspector would */}
      <path
        d="M233 59 l-13 12 l-9 -5 l-10 14 l-8 -4"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="miter"
      />
      <rect
        x="182"
        y="54"
        width="56"
        height="34"
        rx="2"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.4"
        strokeDasharray="5 4"
      />
      <line x1="238" y1="54" x2="262" y2="34" stroke={ACCENT} strokeWidth="1.2" />
      <circle cx="264" cy="32" r="3.5" fill={ACCENT} />

      {/* the pass it is making right now */}
      <line x1="72" y1="172" x2="248" y2="172" stroke={ACCENT} strokeWidth="1.6" strokeDasharray="6 6" opacity="0.75" />
      <circle cx="248" cy="172" r="3.5" fill={ACCENT} />
    </>
  );
}

function Knowledge() {
  return (
    <>
      {/* where the documents already live */}
      <g fill={FILL} stroke={LINE} strokeWidth="1.2">
        <rect x="6" y="30" width="72" height="94" rx="4" />
        <rect x="18" y="42" width="72" height="94" rx="4" />
        <rect x="30" y="54" width="72" height="94" rx="4" />
      </g>
      <g stroke="rgba(255,255,255,0.34)" strokeWidth="2.6" strokeLinecap="round">
        <line x1="42" y1="72" x2="88" y2="72" />
        <line x1="42" y1="86" x2="78" y2="86" />
        <line x1="42" y1="100" x2="90" y2="100" />
        <line x1="42" y1="114" x2="70" y2="114" />
      </g>

      <line x1="112" y1="94" x2="134" y2="94" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" />
      <Arrowhead x={138} y={94} />

      {/* the answer, with the passage it came from */}
      <rect x="150" y="32" width="164" height="124" rx="6" fill="rgba(255,255,255,0.05)" stroke={LINE} strokeWidth="1.2" />
      <line x1="162" y1="50" x2="162" y2="96" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" />
      <g stroke="rgba(255,255,255,0.42)" strokeWidth="3" strokeLinecap="round">
        <line x1="174" y1="54" x2="292" y2="54" />
        <line x1="174" y1="70" x2="276" y2="70" />
        <line x1="174" y1="86" x2="248" y2="86" />
      </g>
      <rect x="162" y="112" width="96" height="20" rx="4" fill="rgba(52,211,153,0.16)" stroke={ACCENT} strokeWidth="1.1" />
      <g stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" opacity="0.9">
        <line x1="174" y1="122" x2="212" y2="122" />
      </g>
      <circle cx="240" cy="122" r="4" fill="none" stroke={ACCENT} strokeWidth="1.4" />
      <line x1="243" y1="125" x2="248" y2="130" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

const scenes: Record<UseCaseArtKind, () => React.JSX.Element> = {
  document: Document,
  assistant: Assistant,
  forecast: Forecast,
  vision: Vision,
  knowledge: Knowledge,
};

export function UseCaseArt({
  kind,
  className = "",
  featured = false,
  style,
}: {
  kind: UseCaseArtKind;
  className?: string;
  /** The tall mosaic tile: the drawing drops lower so the card is not top-heavy. */
  featured?: boolean;
  style?: CSSProperties;
}) {
  const Scene = scenes[kind];

  return (
    <div
      className={`grain relative isolate size-full overflow-hidden ${className}`}
      style={{ backgroundImage: gradients[kind], ...style }}
    >
      <div className="blueprint-grid absolute inset-0 opacity-70" />
      {/* Drawn at a fixed aspect in the upper part of the card so the headline
          sits over empty gradient, never over the line work. */}
      <svg
        viewBox="0 0 320 190"
        className={`absolute left-1/2 w-[80%] max-w-[340px] -translate-x-1/2 ${
          featured ? "top-[16%] lg:top-[22%]" : "top-[12%]"
        }`}
        fill="none"
        aria-hidden
      >
        <Scene />
      </svg>
    </div>
  );
}
