import type { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------ *
 *  OFFERING ART
 *
 *  One small animated drawing per engagement in the "Four ways to start"
 *  band, and a fifth for the Forward Deployed Engineers row under it.
 *  Inline SVG in the site's own line language: 1.5px strokes in ink-soft,
 *  fills in cream-surface, the accent on the one thing that moves, cyan
 *  at most once per drawing. No text inside a drawing.
 *
 *  Each is a story a person who has never heard of AI can read:
 *
 *    0  Requirement Analysis: a magnifier scans a process line and a row
 *       of hour blocks is counted up as it passes.
 *    1  MVP Deployment: blocks drop and stack into a small building; when
 *       the last one lands, a live dot starts to pulse and users appear.
 *    2  AI Native Development: envelopes flow along a line. At a switch,
 *       the routine ones go on to a tray by themselves, and the one that
 *       needs a human is lifted to a person.
 *    3  AI Workshops: half a clock face fills and three bulbs light up in
 *       turn.
 *    4  Forward Deployed Engineers: an engineer slides into the open seat
 *       in a row of people and the baseline extends to include them.
 *
 *  Motion is CSS keyframes only, 8 to 9 second loops. The base styles ARE
 *  the final frame, and every keyframe lives inside a
 *  `prefers-reduced-motion: no-preference` block, so a reader who has
 *  asked for less motion gets the finished picture and nothing moves.
 *  Nothing here needs JavaScript to appear.
 *
 *  Hover states are transitions, not faster loops: changing an animation's
 *  duration mid-flight makes it jump. The cell (class `oa-cell`) lights
 *  the magnifier ring, the exception route, the live dot's halo and the
 *  bulbs' glow instead.
 * ------------------------------------------------------------------ */

export type ArtKind = 0 | 1 | 2 | 3 | 4;

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* --- geometry shared by the CSS and the JSX ------------------------ */

/** Hour blocks in drawing 0: 8 of them, 22 wide on a 28 pitch from x=31. */
const HOUR_BLOCKS = range(8);
const hourBlockX = (i: number) => 31 + i * 28;

/** Building blocks in drawing 1, in the order they drop: base row left to
 *  right, then up. 34 by 22 each. */
const BLOCKS: Array<[number, number]> = [
  [89, 112],
  [123, 112],
  [157, 112],
  [89, 90],
  [123, 90],
  [157, 90],
  [106, 68],
  [140, 68],
  [123, 46],
];

/** Where the four pulses of the live dot start, in percent of the cycle. */
const PINGS = [60, 68, 76, 84];

/** When each bulb in drawing 3 switches on, in percent of the cycle. */
const BULBS = [22, 42, 62];
const BULB_X = [158, 200, 242];
const BULB_Y = 74;

/* --- generated keyframes -------------------------------------------- *
 *  Anything that fires at a per-element moment gets its own keyframe
 *  rule rather than an `animation-delay`: a delayed copy of one loop
 *  also resets late, so the base of the building would drop in again
 *  while its roof was still standing. */

const hourBlockCss = HOUR_BLOCKS.map((i) => {
  const at = 6 + i * 7.5;
  return `@keyframes oa-hb${i}{0%,${at}%{opacity:0;transform:translateY(3px)}${at + 2}%,88%{opacity:1;transform:none}93%,100%{opacity:0;transform:none}}
.oa-hb${i}{animation-name:oa-hb${i}}`;
}).join("\n");

const dropCss = BLOCKS.map((_, i) => {
  const at = 3 + i * 5.5;
  return `@keyframes oa-drop${i}{0%,${at}%{opacity:0;transform:translateY(-26px);animation-timing-function:cubic-bezier(.2,0,0,1)}${at + 4}%,92%{opacity:1;transform:none}96%,100%{opacity:0;transform:none}}
.oa-b${i}{animation-name:oa-drop${i}}`;
}).join("\n");

const pingCss = `@keyframes oa-ping{0%,${PINGS[0] - 0.1}%{transform:scale(1);opacity:0}${PINGS.map(
  (s) =>
    `${s}%{transform:scale(1);opacity:.7}${s + 6}%{transform:scale(3.2);opacity:0}${s + 6.1}%{transform:scale(1);opacity:0}`,
).join("")}100%{transform:scale(1);opacity:0}}`;

const bulbCss = BULBS.map(
  (s, k) =>
    `@keyframes oa-on${k}{0%,${s}%{opacity:0}${s + 1.5}%,90%{opacity:1}93%,100%{opacity:0}}
.oa-on${k}{animation-name:oa-on${k}}`,
).join("\n");

/* The arc of half a clock face of radius 36 is pi times 36, and so is the
   circumference of the radius 18 circle whose 36-wide stroke paints the
   wedge, so both share one dash length and one keyframe. */
const HALF_ARC = "113.1px";
const QUARTER_ARC = "56.55px";

export const OFFERING_ART_CSS = `
.oa{display:block;width:100%;height:100%;overflow:visible}
.oa-lens,.oa-branch{transition:stroke .3s var(--ease-io-attio)}
.oa-halo,.oa-glow{transition:opacity .3s var(--ease-io-attio)}
.oa-halo{opacity:0}
.oa-glow{opacity:.16}
.oa-cell:hover .oa-lens,.oa-cell:hover .oa-branch{stroke:var(--color-lime)}
.oa-cell:hover .oa-halo{opacity:.4}
.oa-cell:hover .oa-glow{opacity:.34}
.oa-scan{transform:translateX(196px)}
.oa-ping,.oa-take{opacity:0;transform-box:fill-box;transform-origin:center}
.oa-wedge,.oa-rim{stroke-dashoffset:${QUARTER_ARC}}
.oa-hand{transform:rotate(180deg);transform-box:fill-box;transform-origin:50% 100%}
.oa-arm,.oa-seg{transform-box:fill-box;transform-origin:0 50%}
.oa-slot{opacity:0}
.oa-mail{transform-box:fill-box;transform-origin:center}
.oa-m0{transform:translate(64px,92px)}
.oa-m1{transform:translate(112px,92px)}
.oa-mx{transform:translate(186px,66px)}
.oa-m3{transform:translate(226px,92px)}
@media (prefers-reduced-motion: no-preference){
.oa-hb,.oa-scan,.oa-blk,.oa-win,.oa-live,.oa-ping,.oa-users,.oa-mail,.oa-arm,.oa-take,.oa-wedge,.oa-rim,.oa-hand,.oa-on,.oa-join,.oa-slot,.oa-seg{animation-duration:8s;animation-iteration-count:infinite;animation-fill-mode:both;animation-timing-function:linear}
.oa-blk,.oa-win,.oa-live,.oa-ping,.oa-users,.oa-wedge,.oa-rim,.oa-hand,.oa-on{animation-duration:9s}
.oa-scan{animation-name:oa-scan}
.oa-win{animation-name:oa-win}
.oa-live{animation-name:oa-live}
.oa-ping{animation-name:oa-ping}
.oa-users{animation-name:oa-users}
.oa-m0,.oa-m1,.oa-m3{animation-name:oa-mail}
.oa-mx{animation-name:oa-mail-x}
.oa-arm{animation-name:oa-arm}
.oa-take{animation-name:oa-take}
.oa-wedge,.oa-rim{animation-name:oa-fill}
.oa-hand{animation-name:oa-hand}
.oa-join{animation-name:oa-join}
.oa-slot{animation-name:oa-slot}
.oa-seg{animation-name:oa-seg}
.oa-m1{animation-delay:-2s}
.oa-mx,.oa-arm,.oa-take{animation-delay:-4s}
.oa-m3{animation-delay:-6s}
${hourBlockCss}
@keyframes oa-scan{0%{transform:translateX(0);opacity:1}62%{transform:translateX(196px);opacity:1}90%{transform:translateX(196px);opacity:1}94%{transform:translateX(196px);opacity:0}95%{transform:translateX(0);opacity:0}100%{transform:translateX(0);opacity:1}}
${dropCss}
@keyframes oa-win{0%,57%{opacity:0}60%,92%{opacity:1}96%,100%{opacity:0}}
@keyframes oa-live{0%,55%{opacity:0}57%,92%{opacity:1}96%,100%{opacity:0}}
${pingCss}
@keyframes oa-users{0%,58%{opacity:0;transform:translateY(4px)}64%,92%{opacity:1;transform:none}96%,100%{opacity:0;transform:none}}
@keyframes oa-mail{0%{transform:translate(20px,92px);opacity:0}4%{transform:translate(36px,92px);opacity:1}56%{transform:translate(232px,92px);opacity:1}62%{transform:translate(248px,98px) scale(.6);opacity:0}100%{transform:translate(248px,98px) scale(.6);opacity:0}}
@keyframes oa-mail-x{0%{transform:translate(20px,92px);opacity:0}4%{transform:translate(36px,92px);opacity:1}30%{transform:translate(150px,92px);opacity:1}50%{transform:translate(214px,45px);opacity:1}56%{transform:translate(222px,40px) scale(.5);opacity:0}100%{transform:translate(222px,40px) scale(.5);opacity:0}}
@keyframes oa-arm{0%,26%{transform:rotate(0)}29%,48%{transform:rotate(-36.4deg)}52%,100%{transform:rotate(0)}}
@keyframes oa-take{0%,52%{transform:scale(1);opacity:0}54%{transform:scale(1);opacity:.7}62%{transform:scale(2.2);opacity:0}62.1%,100%{transform:scale(1);opacity:0}}
@keyframes oa-fill{0%{stroke-dashoffset:${HALF_ARC};opacity:var(--oa-o,1)}60%,90%{stroke-dashoffset:${QUARTER_ARC};opacity:var(--oa-o,1)}93%{stroke-dashoffset:${QUARTER_ARC};opacity:0}93.1%{stroke-dashoffset:${HALF_ARC};opacity:0}100%{stroke-dashoffset:${HALF_ARC};opacity:var(--oa-o,1)}}
@keyframes oa-hand{0%{transform:rotate(0);opacity:1}60%,90%{transform:rotate(180deg);opacity:1}93%{transform:rotate(180deg);opacity:0}93.1%{transform:rotate(0);opacity:0}100%{transform:rotate(0);opacity:1}}
${bulbCss}
@keyframes oa-join{0%{transform:translateX(56px);opacity:0}6%{transform:translateX(50px);opacity:1;animation-timing-function:cubic-bezier(.2,0,0,1)}28%,86%{transform:translateX(0);opacity:1}92%{transform:translateX(0);opacity:0}93%,100%{transform:translateX(56px);opacity:0}}
@keyframes oa-slot{0%,22%{opacity:1}30%,88%{opacity:0}94%,100%{opacity:1}}
@keyframes oa-seg{0%,26%{transform:scaleX(0)}34%,88%{transform:scaleX(1)}92%,100%{transform:scaleX(0)}}
}`;

/** Render once per page, above the first drawing. */
export function OfferingArtStyles() {
  return <style dangerouslySetInnerHTML={{ __html: OFFERING_ART_CSS }} />;
}

/* --- small parts ----------------------------------------------------- */

/** A head and a pair of shoulders. `r` is the head radius; the shoulders
 *  are twice that and sit four units under the chin. Fill and stroke are
 *  inherited from the group around it. */
function Person({
  x,
  y,
  r = 6,
  children,
}: {
  x: number;
  y: number;
  r?: number;
  children?: ReactNode;
}) {
  const s = r * 2;
  return (
    <g>
      <circle cx={x} cy={y} r={r} />
      <path d={`M${x - s} ${y + r + s + 4}a${s} ${s} 0 0 1 ${s * 2} 0`} />
      {children}
    </g>
  );
}

/** An envelope centred on the origin, 22 by 14, flap drawn as a V. */
function Envelope({ accent = false }: { accent?: boolean }) {
  return (
    <>
      <rect
        x={-11}
        y={-7}
        width={22}
        height={14}
        rx={1.5}
        className={accent ? "fill-lime stroke-lime" : "fill-cream-surface"}
      />
      <path d="M-11 -7L0 1L11 -7" className={accent ? "stroke-cream" : undefined} />
    </>
  );
}

/* --- the five drawings ----------------------------------------------- */

function RequirementAnalysis() {
  return (
    <>
      {/* The hour blocks, and the accent fill that counts them up. */}
      {HOUR_BLOCKS.map((i) => (
        <g key={i}>
          <rect
            x={hourBlockX(i)}
            y={30}
            width={22}
            height={14}
            rx={2}
            className="fill-cream-surface"
          />
          <rect
            x={hourBlockX(i)}
            y={30}
            width={22}
            height={14}
            rx={2}
            className={`oa-hb oa-hb${i} fill-lime stroke-lime`}
          />
        </g>
      ))}

      {/* The process line: four steps and one decision. */}
      <line x1={30} y1={104} x2={256} y2={104} />
      {[45, 94, 192, 241].map((x) => (
        <rect
          key={x}
          x={x - 8}
          y={98}
          width={16}
          height={12}
          rx={2}
          className="fill-cream-surface"
        />
      ))}
      <path d="M143 96l8 8-8 8-8-8z" className="fill-cream-surface" />

      {/* The magnifier. The outer group places it over the first step, the
          inner one carries the scan. */}
      <g transform="translate(45 104)">
        <g className="oa-scan">
          <line x1={12.5} y1={12.5} x2={27} y2={27} strokeWidth={3.5} />
          <circle
            r={17}
            className="oa-lens fill-cream-surface stroke-ink"
            fillOpacity={0.55}
          />
          <path
            d="M-10 -5a11 11 0 0 1 6-7"
            className="stroke-signal-cyan"
            strokeWidth={2}
          />
        </g>
      </g>
    </>
  );
}

function MvpDeployment() {
  return (
    <>
      <line x1={36} y1={134} x2={244} y2={134} />

      {BLOCKS.map(([x, y], i) => (
        <g key={i} className={`oa-blk oa-b${i}`}>
          <rect x={x} y={y} width={34} height={22} className="fill-cream-surface" />
          <rect
            x={x + 13}
            y={y + 7}
            width={8}
            height={8}
            rx={1}
            className="fill-ink-mute"
            fillOpacity={0.35}
            stroke="none"
          />
          {/* The lit window. The top one is the drawing's one cyan. */}
          <rect
            x={x + 13}
            y={y + 7}
            width={8}
            height={8}
            rx={1}
            className={`oa-win ${i === BLOCKS.length - 1 ? "fill-signal-cyan" : "fill-lime-soft"}`}
            stroke="none"
          />
        </g>
      ))}

      {/* The mast and the live dot. */}
      <g className="oa-live">
        <line x1={140} y1={46} x2={140} y2={33} />
        <circle cx={140} cy={27} r={10} className="oa-halo fill-lime" stroke="none" />
        <circle cx={140} cy={27} r={4} className="fill-lime stroke-lime" />
      </g>
      <circle cx={140} cy={27} r={4} className="oa-ping stroke-lime" strokeWidth={1.25} />

      {/* Real users, not a demo. */}
      <g className="oa-users fill-cream-surface">
        <Person x={62} y={116.5} r={4.5} />
        <Person x={208} y={116.5} r={4.5} />
        <Person x={226} y={116.5} r={4.5} />
      </g>
    </>
  );
}

function AiNativeDevelopment() {
  return (
    <>
      {/* The line, the route to a person, the tray. */}
      <line x1={14} y1={92} x2={232} y2={92} />
      <line
        x1={150}
        y1={92}
        x2={214}
        y2={45}
        className="oa-branch"
        strokeDasharray="3 4"
      />
      <path d="M232 86v20h32v-20" className="fill-cream-surface" />
      <line x1={239} y1={96} x2={257} y2={96} />
      <line x1={239} y1={101} x2={257} y2={101} />
      <circle cx={264} cy={80} r={2.5} className="fill-signal-cyan" stroke="none" />

      {/* The person who takes the exception. */}
      <g className="fill-cream-surface">
        <Person x={222} y={30} r={6} />
      </g>
      <circle cx={222} cy={38} r={13} className="oa-take stroke-lime" />

      {/* The switch at the junction. */}
      <g transform="translate(150 92)">
        <line x1={0} y1={0} x2={22} y2={0} className="oa-arm stroke-lime" strokeWidth={2} />
        <circle r={3.5} className="fill-cream-surface stroke-ink" />
      </g>

      {/* Four envelopes in flight, one of them the exception. */}
      <g className="oa-mail oa-m0">
        <Envelope />
      </g>
      <g className="oa-mail oa-m1">
        <Envelope />
      </g>
      <g className="oa-mail oa-mx">
        <Envelope accent />
      </g>
      <g className="oa-mail oa-m3">
        <Envelope />
      </g>
    </>
  );
}

function AiWorkshops() {
  const wedgeStyle = { "--oa-o": 0.35 } as CSSProperties;
  return (
    <>
      {/* The clock. The wedge is a wide-stroked small circle, the classic
          pie trick, rotated so its dash starts at twelve. */}
      <circle cx={72} cy={82} r={36} className="fill-cream-surface" />
      <circle
        cx={72}
        cy={82}
        r={18}
        className="oa-wedge stroke-lime"
        strokeWidth={36}
        strokeDasharray={HALF_ARC}
        strokeLinecap="butt"
        transform="rotate(-90 72 82)"
        style={wedgeStyle}
      />
      <circle cx={72} cy={82} r={36} />
      <path
        d="M72 46A36 36 0 0 1 72 118"
        className="oa-rim stroke-lime"
        strokeWidth={2.5}
        strokeDasharray={HALF_ARC}
        strokeLinecap="butt"
      />
      <line x1={72} y1={46} x2={72} y2={52} />
      <line x1={108} y1={82} x2={102} y2={82} />
      <line x1={72} y1={118} x2={72} y2={112} />
      <line x1={36} y1={82} x2={42} y2={82} />
      <line x1={72} y1={82} x2={72} y2={54} className="oa-hand stroke-ink" strokeWidth={2} />
      <circle cx={72} cy={82} r={2.5} className="fill-ink" stroke="none" />

      {/* Three bulbs, off underneath and on above. */}
      {BULB_X.map((x, k) => (
        <g key={k}>
          <circle cx={x} cy={BULB_Y} r={12} className="fill-cream-surface" />
          <rect
            x={x - 5}
            y={BULB_Y + 11}
            width={10}
            height={6}
            rx={1}
            className="fill-cream-surface"
          />
          <line x1={x - 3} y1={BULB_Y + 21} x2={x + 3} y2={BULB_Y + 21} />
          <path d={`M${x - 3} ${BULB_Y + 4}l3 -7l3 7`} />
          <g className={`oa-on oa-on${k}`}>
            <circle cx={x} cy={BULB_Y} r={20} className="oa-glow fill-lime" stroke="none" />
            <circle cx={x} cy={BULB_Y} r={12} className="fill-lime stroke-lime-bright" />
            <path d={`M${x - 3} ${BULB_Y + 4}l3 -7l3 7`} className="stroke-cream" />
            <g className="stroke-lime-soft">
              <line x1={x} y1={BULB_Y - 15} x2={x} y2={BULB_Y - 20} />
              <line
                x1={x - 10.6}
                y1={BULB_Y - 10.6}
                x2={x - 14.1}
                y2={BULB_Y - 14.1}
              />
              <line
                x1={x + 10.6}
                y1={BULB_Y - 10.6}
                x2={x + 14.1}
                y2={BULB_Y - 14.1}
              />
            </g>
          </g>
        </g>
      ))}
    </>
  );
}

function ForwardDeployed() {
  return (
    <>
      <line x1={20} y1={66} x2={134} y2={66} />
      <line x1={134} y1={66} x2={166} y2={66} className="oa-seg stroke-lime" strokeWidth={2} />

      {/* The team. */}
      <g className="fill-cream-surface">
        <Person x={40} y={32} r={7} />
        <Person x={76} y={32} r={7} />
        <Person x={112} y={32} r={7} />
      </g>

      {/* The open seat, and the engineer who takes it. */}
      <g className="oa-slot stroke-ink-mute" strokeDasharray="3 3">
        <Person x={148} y={32} r={7} />
      </g>
      <g className="oa-join">
        <g className="fill-lime-tint stroke-lime">
          <Person x={148} y={32} r={7}>
            <path d="M139 30a9 9 0 0 1 18 0" />
            <line x1={137} y1={30.5} x2={159} y2={30.5} />
          </Person>
        </g>
      </g>
    </>
  );
}

const DRAWINGS: Record<ArtKind, () => ReactNode> = {
  0: RequirementAnalysis,
  1: MvpDeployment,
  2: AiNativeDevelopment,
  3: AiWorkshops,
  4: ForwardDeployed,
};

/**
 * The drawing for one engagement. Decorative: the cell's copy is the
 * accessible content, so the SVG is hidden from assistive technology.
 * Strokes and fills come from the theme tokens through Tailwind's
 * `stroke-*` and `fill-*` utilities, so the light palette recolours the
 * drawings with everything else.
 */
export default function OfferingArt({
  kind,
  className = "",
}: {
  kind: ArtKind;
  className?: string;
}) {
  const Drawing = DRAWINGS[kind];
  return (
    <svg
      viewBox={kind === 4 ? "0 0 240 96" : "0 0 280 160"}
      preserveAspectRatio="xMidYMid meet"
      className={`oa text-ink-soft ${className}`}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Drawing />
    </svg>
  );
}
