/**
 * Industry scenes.
 *
 * Each cell of the industries grid lights up with a drawing of the place the
 * work actually happens: a trading desk, a ward, a warehouse aisle, a line.
 * They are drawn rather than photographed, but they are representational
 * rather than the abstract gradient art in `visual.tsx` — the point is that a
 * visitor recognises their own workplace in the cell they hover.
 *
 * Same slot as a photograph: to swap in real imagery later, render an
 * <img className="absolute inset-0 size-full object-cover" /> in place of
 * <IndustryScene /> and keep the gradient scrim above it.
 */

export type SceneKind =
  | "finance"
  | "healthcare"
  | "retail"
  | "hr"
  | "logistics"
  | "legal"
  | "saas"
  | "manufacturing";

/* One night, one metal, one accent, one warm light source. */
const DARK = "#071626";
const SURFACE = "#0e2338";
const RAISED = "#16304a";
const METAL = "#7e94ad";
const ACCENT = "#34d399";
const WARM = "#f2c579";

const skies: Record<SceneKind, string> = {
  finance: "linear-gradient(180deg, #16324f 0%, #0d2137 48%, #061220 100%)",
  healthcare: "linear-gradient(180deg, #17384d 0%, #0e2438 50%, #061220 100%)",
  retail: "linear-gradient(180deg, #123049 0%, #0c2035 52%, #061220 100%)",
  hr: "linear-gradient(180deg, #1a3550 0%, #0e2237 50%, #061220 100%)",
  logistics: "linear-gradient(180deg, #102c46 0%, #0b1e33 50%, #061220 100%)",
  legal: "linear-gradient(180deg, #1a3145 0%, #0e2032 52%, #061220 100%)",
  saas: "linear-gradient(180deg, #14304b 0%, #0c2034 50%, #061220 100%)",
  manufacturing: "linear-gradient(180deg, #13304a 0%, #0b1f34 50%, #061220 100%)",
};

/** A head-and-shoulders silhouette, the cheapest way to say "a person works here". */
function Person({
  x,
  y,
  s = 1,
  flip = false,
  fill = DARK,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  fill?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
      fill={fill}
    >
      <circle cx="0" cy="0" r="11" />
      <path d="M-21 46 C-21 22 -12 13 0 13 C12 13 21 22 21 46 Z" />
    </g>
  );
}

/* ------------------------------------------------------------------ *
 *  The scenes
 * ------------------------------------------------------------------ */

/** A trading desk at dusk: the city outside, the candles inside. */
function Finance() {
  const towers = [
    [8, 70, 34, 156],
    [46, 96, 26, 130],
    [76, 44, 40, 182],
    [120, 84, 30, 142],
    [154, 28, 44, 198],
    [202, 74, 28, 152],
    [234, 54, 38, 172],
    [276, 92, 32, 134],
    [312, 36, 42, 190],
    [358, 78, 34, 148],
  ];
  const candles = [
    [16, 48, 20, 1],
    [32, 42, 26, 1],
    [48, 54, 14, 0],
    [64, 36, 30, 1],
    [80, 46, 18, 0],
    [96, 28, 34, 1],
    [112, 34, 24, 1],
    [128, 20, 30, 1],
  ];
  return (
    <>
      {/* the city outside the window */}
      <g fill="#12314e">
        {towers.map(([x, y, w, h]) => (
          <rect key={`t${x}`} x={x} y={y} width={w} height={h} />
        ))}
      </g>
      <g fill={WARM}>
        {towers.flatMap(([x, y, w], ti) =>
          Array.from({ length: 10 }, (_, k) => {
            const cx = x + 5 + ((k * 7 + ti * 3) % Math.max(6, w - 10));
            const cy = y + 12 + ((k * 13 + ti * 11) % 120);
            return (
              <rect
                key={`w${ti}-${k}`}
                x={cx}
                y={cy}
                width="3.5"
                height="5"
                opacity={(k % 3) * 0.22 + 0.3}
              />
            );
          }),
        )}
      </g>

      {/* the desk this is all watched from */}
      <rect x="0" y="212" width="400" height="88" fill="#071a2c" />
      <rect x="0" y="207" width="400" height="6" fill="#28496b" />

      {/* the chart wall: candles and the trend through them */}
      <g>
        <rect x="26" y="82" width="200" height="124" rx="6" fill="#16324e" stroke={METAL} strokeWidth="2" />
        <rect x="32" y="88" width="188" height="112" fill="#0a1e35" />
        {candles.map(([x, y, h, up]) => (
          <g key={`c${x}`} fill={up ? ACCENT : "#f08a8a"}>
            <rect x={38 + x + 4} y={88 + y - 8} width="2" height={h + 16} opacity="0.7" />
            <rect x={38 + x} y={88 + y} width="10" height={h} rx="1" />
          </g>
        ))}
        <path
          d="M36 178 L68 162 L96 166 L126 142 L154 148 L182 122 L214 110"
          stroke={ACCENT}
          strokeWidth="2.4"
          fill="none"
        />
      </g>

      {/* the positions board next to it */}
      <g>
        <rect x="240" y="104" width="136" height="102" rx="6" fill="#16324e" stroke={METAL} strokeWidth="1.8" />
        {Array.from({ length: 7 }, (_, i) => (
          <g key={`r${i}`}>
            <rect x="250" y={116 + i * 12} width="48" height="4.5" rx="2.25" fill={METAL} opacity="0.75" />
            <rect
              x={i % 3 === 0 ? 336 : 322}
              y={116 + i * 12}
              width={i % 3 === 0 ? 22 : 36}
              height="4.5"
              rx="2.25"
              fill={i % 3 === 0 ? "#f08a8a" : ACCENT}
            />
          </g>
        ))}
      </g>
    </>
  );
}

/** A ward at night: the monitor, the drip, the bed. */
function Healthcare() {
  const ecg =
    "M0 22 H26 L32 22 L37 8 L43 36 L49 18 L55 22 H82 L88 22 L93 10 L99 34 L105 20 L110 22 H140";
  return (
    <>
      {/* window and blinds */}
      <rect x="16" y="26" width="150" height="106" rx="3" fill="#153c56" opacity="0.85" />
      <g stroke="#0b2134" strokeWidth="4" opacity="0.7">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="16" y1={34 + i * 13} x2="166" y2={34 + i * 13} />
        ))}
      </g>

      {/* vitals monitor on its arm */}
      <rect x="212" y="34" width="160" height="112" rx="6" fill={SURFACE} stroke={METAL} strokeWidth="1.8" />
      <rect x="220" y="42" width="144" height="96" fill="#08192c" />
      <g transform="translate(224 60)">
        <path d={ecg} stroke={ACCENT} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      </g>
      <g fill={METAL} opacity="0.55">
        <rect x="228" y="112" width="40" height="5" rx="2.5" />
        <rect x="280" y="112" width="28" height="5" rx="2.5" />
        <rect x="320" y="112" width="34" height="5" rx="2.5" />
      </g>
      <rect x="286" y="146" width="8" height="52" fill={METAL} opacity="0.5" />

      {/* IV pole */}
      <rect x="176" y="70" width="4" height="150" fill={METAL} opacity="0.6" />
      <path d="M164 76 h28 v26 a14 14 0 0 1 -28 0 Z" fill={ACCENT} opacity="0.45" />
      <line x1="178" y1="116" x2="178" y2="150" stroke={METAL} strokeWidth="1.4" opacity="0.6" />

      {/* bed */}
      <rect x="0" y="212" width="300" height="16" rx="4" fill={RAISED} />
      <rect x="0" y="228" width="300" height="72" fill="#061424" />
      <path d="M8 212 h96 a18 18 0 0 0 -96 0 Z" fill="#1d3b58" />
      <rect x="26" y="188" width="6" height="26" fill={METAL} opacity="0.5" />
      <rect x="262" y="188" width="6" height="26" fill={METAL} opacity="0.5" />

      <Person x={336} y={180} s={1.2} flip />
    </>
  );
}

/** A store aisle: shelves running back, a cart in the foreground. */
function Retail() {
  return (
    <>
      {/* the ceiling run of lights */}
      <g>
        {Array.from({ length: 4 }, (_, i) => (
          <rect
            key={i}
            x={150 - i * 36}
            y={12 + i * 11}
            width={100 + i * 72}
            height="7"
            rx="3.5"
            fill="#e8d7ae"
            opacity={0.3 - i * 0.05}
          />
        ))}
      </g>

      {/* the aisle floor running away from you */}
      <path d="M0 300 L152 158 L248 158 L400 300 Z" fill="#12304b" />
      <g stroke="#22486c" strokeWidth="1.4" opacity="0.8">
        {Array.from({ length: 4 }, (_, i) => (
          <line key={i} x1={200 - (i + 1) * 62} y1="300" x2={200 - (i + 1) * 13} y2="158" />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line key={`b${i}`} x1={200 + (i + 1) * 62} y1="300" x2={200 + (i + 1) * 13} y2="158" />
        ))}
      </g>

      {/* gondolas both sides, stocked */}
      {[0, 1].map((side) => (
        <g key={side}>
          <path
            d={
              side === 0
                ? "M0 62 L146 122 L146 232 L0 288 Z"
                : "M400 62 L254 122 L254 232 L400 288 Z"
            }
            fill="#173654"
          />
          {[0, 1, 2].map((r) => {
            const yNear = 104 + r * 58;
            const yFar = 140 + r * 32;
            return (
              <g key={r}>
                <path
                  d={
                    side === 0
                      ? `M0 ${yNear} L146 ${yFar} L146 ${yFar + 6} L0 ${yNear + 9} Z`
                      : `M400 ${yNear} L254 ${yFar} L254 ${yFar + 6} L400 ${yNear + 9} Z`
                  }
                  fill={METAL}
                  opacity="0.7"
                />
                {Array.from({ length: 6 }, (_, k) => {
                  const t = k / 6;
                  const x = side === 0 ? 4 + t * 136 : 396 - t * 136;
                  const y = yNear + (yFar - yNear) * t;
                  const w = 16 - t * 7;
                  const h = 26 - t * 12;
                  const tone = ["#3d6f96", "#2e5f88", ACCENT, "#4a7fa8", "#2e5f88", "#3d6f96"][k];
                  return (
                    <rect
                      key={k}
                      x={side === 0 ? x : x - w}
                      y={y - h}
                      width={w}
                      height={h}
                      rx="1.5"
                      fill={tone}
                      opacity={tone === ACCENT ? 0.7 : 0.95}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>
      ))}

      {/* the trolley in the aisle */}
      <g stroke="#9db4cc" strokeWidth="3.4" fill="none">
        <path d="M152 150 L168 150 L186 208 L258 208 L272 150" />
        <path d="M170 168 H268" strokeWidth="2" opacity="0.75" />
        <path d="M176 188 H264" strokeWidth="2" opacity="0.75" />
      </g>
      <circle cx="198" cy="218" r="7" fill="#9db4cc" />
      <circle cx="248" cy="218" r="7" fill="#9db4cc" />
    </>
  );
}

/** An interview: two people, a table, a CV between them. */
function Hr() {
  return (
    <>
      {/* the lit meeting room the two of them are sitting in */}
      <rect x="0" y="0" width="400" height="212" fill="#2a5f7e" opacity="0.5" />
      <rect x="18" y="14" width="364" height="176" rx="4" fill="#3d7f9c" opacity="0.5" />
      <g stroke="#0c2338" strokeWidth="4" opacity="0.45">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1="18" y1={22 + i * 16} x2="382" y2={22 + i * 16} />
        ))}
      </g>
      <rect x="196" y="14" width="7" height="176" fill="#0c2338" opacity="0.5" />

      {/* the table between them */}
      <path d="M-10 202 H410 L392 300 H8 Z" fill="#0c2740" />
      <path d="M-10 202 H410 V210 H-10 Z" fill="#3a6689" />

      {/* the interview itself, read as silhouettes against the window */}
      <Person x={88} y={126} s={1.7} fill="#08192b" />
      <Person x={312} y={126} s={1.7} flip fill="#08192b" />

      {/* the laptop taking notes */}
      <g>
        <path d="M244 202 L262 152 L322 152 L310 202 Z" fill="#16324e" stroke={METAL} strokeWidth="1.6" />
        <path d="M251 197 L266 157 L317 157 L307 197 Z" fill={ACCENT} opacity="0.22" />
      </g>

      {/* the CV on the table */}
      <g transform="rotate(-7 128 218)">
        <rect x="86" y="188" width="78" height="58" rx="2" fill="#eef3f8" />
        <circle cx="103" cy="204" r="7" fill="#7d93ab" />
        <g fill="#8fa3bd">
          <rect x="117" y="199" width="36" height="3.5" rx="1.75" />
          <rect x="117" y="207" width="24" height="3.5" rx="1.75" />
          <rect x="95" y="220" width="58" height="3.5" rx="1.75" />
          <rect x="95" y="228" width="48" height="3.5" rx="1.75" />
        </g>
        <rect x="95" y="236" width="30" height="3.5" rx="1.75" fill={ACCENT} />
      </g>
    </>
  );
}

/** A warehouse: racking, a forklift, a trailer on the dock. */
function Logistics() {
  return (
    <>
      {/* roof structure */}
      <g stroke="#12293f" strokeWidth="3" opacity="0.8">
        <line x1="0" y1="26" x2="400" y2="26" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={i * 50} y1="26" x2={i * 50 + 26} y2="0" strokeWidth="1.6" />
        ))}
      </g>

      {/* dock door, night outside, trailer backed in */}
      <rect x="252" y="52" width="132" height="164" rx="3" fill="#050e1a" />
      <rect x="262" y="66" width="112" height="150" rx="2" fill="#1a3752" opacity="0.55" />
      <rect x="272" y="86" width="92" height="130" fill="#0b2135" />
      <g fill={METAL} opacity="0.35">
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x="272" y={92 + i * 21} width="92" height="3" />
        ))}
      </g>
      <path d="M252 216 h132 v10 h-132 Z" fill={WARM} opacity="0.28" />

      {/* racking */}
      <g>
        <rect x="12" y="58" width="8" height="180" fill={METAL} opacity="0.55" />
        <rect x="196" y="58" width="8" height="180" fill={METAL} opacity="0.55" />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x="12" y={92 + r * 50} width="192" height="7" fill={METAL} opacity="0.5" />
            {[0, 1, 2, 3].map((k) => (
              <g key={k}>
                <rect
                  x={22 + k * 46}
                  y={92 + r * 50 - 30}
                  width="38"
                  height="30"
                  rx="1"
                  fill={(r + k) % 4 === 0 ? ACCENT : "#1c3956"}
                  opacity={(r + k) % 4 === 0 ? 0.45 : 1}
                />
                <rect x={22 + k * 46} y={92 + r * 50 - 8} width="38" height="8" fill="#0c2035" />
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* floor */}
      <rect x="0" y="238" width="400" height="62" fill="#081a2c" />
      <g stroke={WARM} strokeWidth="2" opacity="0.18">
        <line x1="0" y1="252" x2="400" y2="252" strokeDasharray="16 12" />
      </g>

      {/* forklift */}
      <g>
        <rect x="98" y="196" width="58" height="42" rx="4" fill="#1d3d5c" />
        <rect x="106" y="182" width="34" height="18" rx="3" fill={SURFACE} />
        <rect x="156" y="164" width="6" height="82" fill={METAL} opacity="0.8" />
        <rect x="168" y="164" width="6" height="82" fill={METAL} opacity="0.8" />
        <rect x="156" y="228" width="34" height="6" fill={METAL} opacity="0.9" />
        <rect x="172" y="200" width="30" height="28" fill="#26496b" />
        <circle cx="112" cy="248" r="12" fill="#0a1c2e" stroke={METAL} strokeWidth="2" />
        <circle cx="148" cy="248" r="12" fill="#0a1c2e" stroke={METAL} strokeWidth="2" />
        <path d="M96 210 L58 216 L58 226 L96 222 Z" fill={WARM} opacity="0.3" />
      </g>
    </>
  );
}

/** A legal office: the shelf of volumes, a contract under the lamp. */
function Legal() {
  return (
    <>
      {/* bookshelf */}
      <rect x="14" y="16" width="212" height="196" rx="3" fill="#0c2033" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x="14" y={80 + r * 64} width="212" height="7" fill="#1c3348" />
          {Array.from({ length: 11 }, (_, k) => {
            const h = 44 - ((k * 7) % 12);
            return (
              <rect
                key={k}
                x={22 + k * 18}
                y={80 + r * 64 - h}
                width={13 - (k % 3)}
                height={h}
                rx="1.5"
                fill={k % 5 === 0 ? "#2c5f6f" : k % 3 === 0 ? "#274160" : "#1e3852"}
              />
            );
          })}
        </g>
      ))}

      {/* desk */}
      <path d="M-10 244 H410 V300 H-10 Z" fill="#0a1d2f" />
      <rect x="-10" y="238" width="420" height="7" fill={RAISED} />

      {/* lamp and its pool of light */}
      <g>
        <rect x="316" y="150" width="5" height="88" fill={METAL} opacity="0.7" />
        <path d="M292 150 h54 l-14 -26 h-26 Z" fill="#1f4a5f" />
        <ellipse cx="300" cy="252" rx="112" ry="34" fill={WARM} opacity="0.14" />
      </g>

      {/* the contract, signed */}
      <g transform="rotate(-4 216 248)">
        <rect x="176" y="212" width="88" height="66" rx="2" fill="#e6ecf3" opacity="0.92" />
        <g fill="#6d8199" opacity="0.75">
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x="186" y={224 + i * 8} width={i === 5 ? 34 : 68} height="3" rx="1.5" />
          ))}
        </g>
        <path d="M188 268 c8 -10 14 6 20 -2 c6 -8 12 4 20 -6" stroke="#123a56" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="186" y="273" width="66" height="1.6" fill="#9fb0c4" />
      </g>

      {/* scales, the one symbol that needs no caption */}
      <g stroke={ACCENT} strokeWidth="2.4" fill="none" opacity="0.7" transform="translate(330 176) scale(0.9)">
        <line x1="0" y1="-30" x2="0" y2="34" />
        <line x1="-26" y1="-24" x2="26" y2="-24" />
        <path d="M-26 -24 L-38 -2 h24 Z" />
        <path d="M26 -24 L14 -2 h24 Z" />
        <line x1="-14" y1="34" x2="14" y2="34" />
      </g>
    </>
  );
}

/** A product desk after hours: the dashboard, the code, the wall of notes. */
function Saas() {
  return (
    <>
      {/* glass wall with sticky notes */}
      <rect x="18" y="16" width="170" height="132" rx="4" fill="#14344e" opacity="0.5" />
      <g>
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={30 + (i % 3) * 52}
            y={30 + Math.floor(i / 3) * 38}
            width="38"
            height="28"
            rx="2"
            fill={i % 4 === 0 ? ACCENT : i % 3 === 0 ? WARM : "#7fb6e0"}
            opacity="0.5"
            transform={`rotate(${(i % 3) - 1} ${49 + (i % 3) * 52} ${44 + Math.floor(i / 3) * 38})`}
          />
        ))}
      </g>

      {/* desk */}
      <path d="M-10 250 H410 V300 H-10 Z" fill="#091d30" />
      <rect x="-10" y="244" width="420" height="7" fill={RAISED} />

      {/* monitor: the dashboard */}
      <g>
        <rect x="206" y="52" width="176" height="122" rx="6" fill={SURFACE} stroke={METAL} strokeWidth="1.8" />
        <rect x="213" y="59" width="162" height="108" fill="#08192c" />
        <rect x="221" y="67" width="52" height="5" rx="2.5" fill={METAL} opacity="0.5" />
        <path
          d="M221 132 L248 118 L272 124 L300 100 L328 108 L366 82"
          stroke={ACCENT}
          strokeWidth="2.2"
          fill="none"
        />
        <g fill={ACCENT} opacity="0.35">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={221 + i * 25} y={160 - (10 + ((i * 13) % 26))} width="15" height={10 + ((i * 13) % 26)} rx="1.5" />
          ))}
        </g>
        <rect x="284" y="174" width="20" height="34" fill={METAL} opacity="0.4" />
        <rect x="262" y="208" width="64" height="6" rx="3" fill={METAL} opacity="0.5" />
      </g>

      {/* laptop: the code */}
      <g>
        <path d="M42 250 L58 174 L172 174 L162 250 Z" fill={SURFACE} stroke={METAL} strokeWidth="1.5" />
        <path d="M50 246 L64 179 L166 179 L157 246 Z" fill="#0a1e33" />
        <g opacity="0.8">
          {Array.from({ length: 8 }, (_, i) => (
            <rect
              key={i}
              x={70 + (i % 2) * 8}
              y={188 + i * 7}
              width={(i % 3) * 18 + 22}
              height="3"
              rx="1.5"
              fill={i % 4 === 0 ? ACCENT : METAL}
              opacity={i % 4 === 0 ? 0.8 : 0.45}
            />
          ))}
        </g>
        <path d="M30 254 H180 L176 262 H26 Z" fill={RAISED} />
      </g>

      {/* the mug */}
      <g fill={METAL} opacity="0.55">
        <rect x="192" y="226" width="22" height="24" rx="3" />
        <path d="M214 232 h8 a7 7 0 0 1 0 12 h-8 Z" fill="none" stroke={METAL} strokeWidth="2.4" />
      </g>
    </>
  );
}

/** A line: the arm, the belt, the parts coming through. */
function Manufacturing() {
  return (
    <>
      {/* hall structure */}
      <g stroke="#12293f" strokeWidth="2.4" opacity="0.75">
        <line x1="0" y1="22" x2="400" y2="22" />
        <line x1="0" y1="44" x2="400" y2="44" />
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={i * 34} y1="22" x2={i * 34 + 22} y2="44" strokeWidth="1.4" />
        ))}
      </g>
      <g fill={WARM} opacity="0.2">
        <rect x="52" y="46" width="60" height="5" rx="2.5" />
        <rect x="286" y="46" width="60" height="5" rx="2.5" />
      </g>

      {/* the robot arm, reaching down to the belt */}
      <g>
        <rect x="286" y="196" width="66" height="22" rx="4" fill="#1d3d5c" />
        <rect x="302" y="150" width="34" height="52" rx="6" fill="#24506f" />
        <g stroke="#2f627f" strokeWidth="20" strokeLinecap="round" fill="none">
          <path d="M318 158 L268 104" />
          <path d="M268 104 L166 122" />
        </g>
        <g stroke={METAL} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5">
          <path d="M318 158 L268 104" />
          <path d="M268 104 L166 122" />
        </g>
        <circle cx="318" cy="158" r="12" fill="#0e2c44" stroke={METAL} strokeWidth="2" />
        <circle cx="268" cy="104" r="11" fill="#0e2c44" stroke={METAL} strokeWidth="2" />
        {/* gripper */}
        <g stroke={METAL} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M166 122 L150 134" />
          <path d="M150 134 L138 128 M150 134 L146 148" />
        </g>
        <circle cx="150" cy="134" r="16" fill={ACCENT} opacity="0.16" />
      </g>

      {/* conveyor and what is on it */}
      <g>
        <rect x="-10" y="222" width="420" height="20" rx="4" fill="#173250" />
        <rect x="-10" y="240" width="420" height="10" fill="#0d2338" />
        <g fill={METAL} opacity="0.35">
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={-4 + i * 30} y="226" width="4" height="12" rx="2" />
          ))}
        </g>
        {[
          [28, 0],
          [96, 1],
          [188, 0],
          [252, 0],
          [330, 1],
        ].map(([x, flagged]) => (
          <g key={`p${x}`}>
            <rect x={x} y="200" width="34" height="22" rx="3" fill={flagged ? ACCENT : "#2a527a"} opacity={flagged ? 0.55 : 1} />
            <rect x={x + 6} y="206" width="22" height="4" rx="2" fill="#0b2135" opacity="0.7" />
          </g>
        ))}
        <g fill="#0a1c2e">
          <rect x="40" y="250" width="16" height="50" />
          <rect x="330" y="250" width="16" height="50" />
        </g>
      </g>

      <Person x={70} y={176} s={1.1} />
    </>
  );
}

const scenes: Record<SceneKind, () => React.ReactElement> = {
  finance: Finance,
  healthcare: Healthcare,
  retail: Retail,
  hr: Hr,
  logistics: Logistics,
  legal: Legal,
  saas: Saas,
  manufacturing: Manufacturing,
};

export function IndustryScene({
  kind,
  className = "",
}: {
  kind: SceneKind;
  className?: string;
}) {
  const Scene = scenes[kind];
  return (
    <div
      className={`grain relative isolate size-full overflow-hidden ${className}`}
      style={{ backgroundImage: skies[kind] }}
      aria-hidden
    >
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <Scene />
      </svg>
      {/* Depth: the scene falls off at the edges rather than ending at them. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 28%, transparent 38%, rgba(6,18,32,0.45) 100%)",
        }}
      />
    </div>
  );
}
