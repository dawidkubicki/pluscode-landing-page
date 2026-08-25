"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FlowIcon from "./flow-icons";
import { BrandMark } from "./brand-marks";

/* ------------------------------------------------------------------ *
 *  Shapes mirror `useCaseFlows` in the dictionaries.
 * ------------------------------------------------------------------ */

/**
 * A record, a system or an outcome. Products whose owners allow referential
 * logo use carry `brand` and render their own vendor mark; everything else,
 * including the marks we may not reproduce, falls back to a line glyph.
 */
export type FlowNode = {
  icon?: string;
  brand?: string;
  label: string;
};

export type FlowStep = {
  icon: string;
  title: string;
  tools: readonly FlowNode[];
};

export type Flow = {
  id: string;
  tab: string;
  icon: string;
  title: string;
  in: readonly FlowNode[];
  steps: readonly FlowStep[];
  decision: { question: string; pass: string; fail: string };
  out: readonly FlowNode[];
  human: string;
};

export type FlowLegend = {
  in: string;
  run: string;
  out: string;
  tools: string;
  decision: string;
  pass: string;
  fail: string;
  human: string;
};

/* ------------------------------------------------------------------ *
 *  Canvas geometry
 *
 *  The diagram is laid out in one fixed pixel space rather than by CSS, so
 *  the wiring can be drawn exactly: an SVG carries the cards, ports and
 *  connectors, and an HTML layer sits on top carrying the glyphs and labels
 *  (so text still wraps per language). Both read the same coordinates.
 * ------------------------------------------------------------------ */

const NODE = 76; // main node square
const SUB = 46; // system sub-node circle
const GAP_X = 56; // horizontal gap between main nodes
const FIRST_GAP = 78; // wider first hop, so the fan-in clears the source labels
const IN_PITCH = 142; // vertical pitch of the source stack
const OUT_PITCH = 142; // vertical pitch of the result stack
const SUB_PITCH = 74; // horizontal pitch of the system band
const BAND_DY = 168; // system band, below the main rail
const HUMAN_DROP = 150; // how far the exception branch drops
const BRANCH_GAP = 104; // room for the branch labels
const LAB_W = 120;
const SUB_LAB_W = 72;
const LABEL_TALL = 84; // label + sub-label under a step
const LABEL_SHORT = 55; // label alone under a record
const SUB_LABEL_H = 36;
const PAD = 18;

/** One wiring colour, one weight: the semantics live in the port shapes. */
const LINE = "#8fa3bd";
const CANVAS = "#0a1929";
const ACCENT = "#34d399";

type Pt = { x: number; y: number };

function layout(flow: Flow) {
  const nIn = flow.in.length;
  const nOut = flow.out.length;

  /** A step is as wide as the band of systems hanging under it. */
  const halfW = flow.steps.map(
    (s) => Math.max(NODE, s.tools.length * SUB_PITCH - (SUB_PITCH - SUB)) / 2,
  );

  const xIn = LAB_W / 2 + 10;
  const stepX: number[] = [];
  let px = xIn;
  let ph = NODE / 2;
  halfW.forEach((h, i) => {
    const x = px + ph + (i === 0 ? FIRST_GAP : GAP_X) + h;
    stepX.push(x);
    px = x;
    ph = h;
  });
  const xDec = px + ph + GAP_X + NODE / 2;
  const xRight = xDec + NODE / 2 + BRANCH_GAP + NODE / 2;
  const W = Math.round(xRight + NODE / 2 + LAB_W / 2 + 40);

  const inHalf = ((nIn - 1) / 2) * IN_PITCH;
  const outHalf = ((nOut - 1) / 2) * OUT_PITCH;
  // Rail nodes carry their caption above, because the systems hang below them.
  const midY = Math.round(
    Math.max(inHalf + NODE / 2, outHalf + NODE / 2, NODE / 2 + LABEL_TALL) + 6 + PAD,
  );
  const humanY = midY + outHalf + HUMAN_DROP;
  const H = Math.round(
    Math.max(
      midY + inHalf + NODE / 2 + LABEL_SHORT,
      humanY + NODE / 2 + LABEL_SHORT,
      midY + BAND_DY + SUB / 2 + SUB_LABEL_H,
    ) + PAD,
  );

  return {
    W,
    H,
    midY,
    humanY,
    xIn,
    xDec,
    xRight,
    stepX,
    bandY: midY + BAND_DY,
    inY: (i: number) => midY + (i - (nIn - 1) / 2) * IN_PITCH,
    outY: (k: number) => midY + (k - (nOut - 1) / 2) * OUT_PITCH,
    toolX: (i: number, j: number, m: number) =>
      stepX[i] + (j - (m - 1) / 2) * SUB_PITCH,
  };
}

/**
 * Rounded rect with per-corner radii, drawn with a longer edge cutoff and
 * shorter handles than a circular arc. That is the squircle that separates a
 * product-UI node from a flowchart box. A corner as large as half the height
 * falls back to a true semicircle, which is how the source nodes get their
 * rounded-off left edge.
 */
function nodePath(x: number, y: number, w: number, h: number, radii: number[]) {
  const [tl, tr, br, bl] = radii;
  const seg = (r: number) => {
    const full = r >= Math.min(w, h) / 2;
    return { s: r * (full ? 1 : 1.25), k: r * (full ? 0.5523 : 0.42) };
  };
  const a = seg(tl);
  const b = seg(tr);
  const c = seg(br);
  const d = seg(bl);
  return [
    `M${x + a.s} ${y}`,
    `H${x + w - b.s}`,
    `C${x + w - b.k} ${y}, ${x + w} ${y + b.k}, ${x + w} ${y + b.s}`,
    `V${y + h - c.s}`,
    `C${x + w} ${y + h - c.k}, ${x + w - c.k} ${y + h}, ${x + w - c.s} ${y + h}`,
    `H${x + d.s}`,
    `C${x + d.k} ${y + h}, ${x} ${y + h - d.k}, ${x} ${y + h - d.s}`,
    `V${y + a.s}`,
    `C${x} ${y + a.k}, ${x + a.k} ${y}, ${x + a.s} ${y}`,
    "Z",
  ].join(" ");
}

/** Cubic that leaves and enters horizontally, so every hop reads as one rail. */
function hCurve(a: Pt, b: Pt) {
  const dx = Math.max(36, (b.x - a.x) * 0.55);
  return `M${a.x} ${a.y} C${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

/** Same idea rotated: the drop from a step down to the systems it touches. */
function vCurve(a: Pt, b: Pt) {
  const dy = Math.max(28, (b.y - a.y) * 0.55);
  return `M${a.x} ${a.y} C${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
}

/**
 * Rounded orthogonal elbow, for the one edge that has to travel: the exception
 * branch drops below the result stack rather than cutting across its labels.
 */
function elbow(a: Pt, b: Pt, xMid: number, r = 16) {
  const dir = b.y > a.y ? 1 : -1;
  return [
    `M${a.x} ${a.y}`,
    `H${xMid - r}`,
    `Q${xMid} ${a.y}, ${xMid} ${a.y + dir * r}`,
    `V${b.y - dir * r}`,
    `Q${xMid} ${b.y}, ${xMid + r} ${b.y}`,
    `H${b.x}`,
  ].join(" ");
}

/* ---- Ports: shape carries the meaning, never colour ---------------- */

/** Data leaves here. */
function OutPort({ x, y }: Pt) {
  return <circle cx={x} cy={y} r={5} fill={LINE} />;
}

/** Data arrives here: arrowhead into a bar, flush with the node edge. */
function InPort({ x, y }: Pt) {
  return (
    <g fill={LINE}>
      <path d={`M${x - 10} ${y - 5.5} L${x - 2} ${y} L${x - 10} ${y + 5.5} Z`} />
      <rect x={x - 2} y={y - 5.5} width={2} height={11} rx={1} />
    </g>
  );
}

/** A capability port rather than a data port: the system band hangs off these. */
function ToolPort({ x, y }: Pt) {
  return (
    <rect
      x={x - 4.5}
      y={y - 4.5}
      width={9}
      height={9}
      fill={LINE}
      transform={`rotate(45 ${x} ${y})`}
    />
  );
}

/** The one warm mark on the canvas: this is where the work starts. */
function Bolt({ x, y }: Pt) {
  return (
    <path
      d={`M${x + 6.5} ${y - 8} L${x - 1} ${y + 1.5} H${x + 3.2} L${x + 1.5} ${y + 8} L${x + 9} ${y - 1.5} H${x + 4.8} Z`}
      fill={ACCENT}
    />
  );
}

/* ------------------------------------------------------------------ *
 *  The canvas
 * ------------------------------------------------------------------ */

function FlowCanvas({ flow, legend }: { flow: Flow; legend: FlowLegend }) {
  const g = layout(flow);
  const lastStep = flow.steps.length - 1;

  const passPort = { x: g.xDec + NODE / 2, y: g.midY - 15 };
  const failPort = { x: g.xDec + NODE / 2, y: g.midY + 15 };
  const insertAt = {
    x: g.xRight + NODE / 2 + 56,
    y: g.outY(Math.floor(flow.out.length / 2)),
  };

  /** Node cards, in draw order: wiring first, then the cards on top of it. */
  const card = (x: number, y: number, radii = [13, 13, 13, 13], stroke = LINE) => (
    <path
      d={nodePath(x - NODE / 2, y - NODE / 2, NODE, NODE, radii)}
      fill="#132639"
      stroke={stroke}
      strokeWidth={1.4}
    />
  );

  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
      <div className="relative mx-auto" style={{ width: g.W, height: g.H }}>
        {/* Canvas texture: dots to the edge, faded off so the frame reads as a
            window onto a bigger workspace rather than a bounded picture. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 0)",
            backgroundSize: "15px 15px",
            maskImage:
              "radial-gradient(95% 95% at 50% 45%, #000 0, #000 34%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(95% 95% at 50% 45%, #000 0, #000 34%, transparent 88%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[42%] h-[38%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[80px]"
        />

        <svg
          aria-hidden
          width={g.W}
          height={g.H}
          viewBox={`0 0 ${g.W} ${g.H}`}
          className="absolute inset-0"
          fill="none"
        >
          {/* Sources into the first step */}
          {flow.in.map((n, i) => (
            <path
              key={`in-${n.label}`}
              d={hCurve(
                { x: g.xIn + NODE / 2 + 9, y: g.inY(i) },
                { x: g.stepX[0] - NODE / 2 - 11, y: g.midY },
              )}
              stroke={LINE}
              strokeWidth={1.5}
            />
          ))}

          {/* Step to step, last step into the decision */}
          {flow.steps.slice(0, -1).map((s, i) => (
            <path
              key={`hop-${s.title}`}
              d={hCurve(
                { x: g.stepX[i] + NODE / 2 + 9, y: g.midY },
                { x: g.stepX[i + 1] - NODE / 2 - 11, y: g.midY },
              )}
              stroke={LINE}
              strokeWidth={1.5}
            />
          ))}
          <path
            d={hCurve(
              { x: g.stepX[lastStep] + NODE / 2 + 9, y: g.midY },
              { x: g.xDec - NODE / 2 - 11, y: g.midY },
            )}
            stroke={LINE}
            strokeWidth={1.5}
          />

          {/* The systems each step touches: a different class of edge */}
          {flow.steps.map((s, i) =>
            s.tools.map((t, j) => (
              <path
                key={`tool-${s.title}-${t.label}`}
                d={vCurve(
                  { x: g.stepX[i], y: g.midY + NODE / 2 + 7 },
                  { x: g.toolX(i, j, s.tools.length), y: g.bandY - SUB / 2 - 7 },
                )}
                stroke={LINE}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )),
          )}

          {/* Both branches out of the decision */}
          {flow.out.map((n, k) => (
            <path
              key={`out-${n.label}`}
              d={hCurve(
                { x: passPort.x + 9, y: passPort.y },
                { x: g.xRight - NODE / 2 - 11, y: g.outY(k) },
              )}
              stroke={LINE}
              strokeWidth={1.5}
            />
          ))}
          <path
            d={elbow(
              { x: failPort.x + 9, y: failPort.y },
              { x: g.xRight - NODE / 2 - 11, y: g.humanY },
              failPort.x + 46,
            )}
            stroke={LINE}
            strokeWidth={1.5}
          />

          {/* Whatever you plug in next */}
          <path
            d={`M${g.xRight + NODE / 2 + 9} ${insertAt.y} H${insertAt.x - 11}`}
            stroke={LINE}
            strokeWidth={1.5}
          />
          <rect
            x={insertAt.x - 10.5}
            y={insertAt.y - 10.5}
            width={21}
            height={21}
            rx={3.25}
            stroke={LINE}
            strokeWidth={1.5}
          />
          <path
            d={`M${insertAt.x - 5.25} ${insertAt.y} h10.5 M${insertAt.x} ${insertAt.y - 5.25} v10.5`}
            stroke={LINE}
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Cards */}
          {flow.in.map((n, i) => (
            <g key={`inc-${n.label}`}>
              {card(g.xIn, g.inY(i), [13, 13, 13, 13].map((r, k) =>
                k === 0 || k === 3 ? NODE / 2 : r,
              ))}
              <OutPort x={g.xIn + NODE / 2} y={g.inY(i)} />
            </g>
          ))}
          <Bolt x={g.xIn - NODE / 2 - 16} y={g.inY(0)} />

          {flow.steps.map((s, i) => (
            <g key={`stepc-${s.title}`}>
              {card(g.stepX[i], g.midY)}
              <InPort x={g.stepX[i] - NODE / 2} y={g.midY} />
              <OutPort x={g.stepX[i] + NODE / 2} y={g.midY} />
              <ToolPort x={g.stepX[i]} y={g.midY + NODE / 2 + 7} />
              {s.tools.map((t, j) => (
                <g key={`toolc-${t.label}`}>
                  <circle
                    cx={g.toolX(i, j, s.tools.length)}
                    cy={g.bandY}
                    r={SUB / 2}
                    fill="#132639"
                    stroke={LINE}
                    strokeWidth={1.4}
                  />
                  <ToolPort x={g.toolX(i, j, s.tools.length)} y={g.bandY - SUB / 2 - 7} />
                </g>
              ))}
            </g>
          ))}

          {/* The decision is the one node allowed to carry the accent */}
          {card(g.xDec, g.midY, [13, 13, 13, 13], ACCENT)}
          <InPort x={g.xDec - NODE / 2} y={g.midY} />
          <OutPort x={passPort.x} y={passPort.y} />
          <OutPort x={failPort.x} y={failPort.y} />

          {flow.out.map((n, k) => (
            <g key={`outc-${n.label}`}>
              {card(g.xRight, g.outY(k))}
              <InPort x={g.xRight - NODE / 2} y={g.outY(k)} />
            </g>
          ))}
          <g>
            {card(g.xRight, g.humanY)}
            <InPort x={g.xRight - NODE / 2} y={g.humanY} />
          </g>
          <OutPort x={g.xRight + NODE / 2} y={insertAt.y} />

          {/* Branch labels sit on the wiring, so they carry a canvas-coloured
              halo rather than a background chip. */}
          <text
            x={passPort.x + 18}
            y={g.midY - 34}
            fill={ACCENT}
            fontSize={11}
            fontWeight={600}
            letterSpacing="0.09em"
            paintOrder="stroke"
            stroke={CANVAS}
            strokeWidth={3.5}
            strokeLinejoin="round"
          >
            {legend.pass.toUpperCase()}
          </text>
          <text
            x={failPort.x + 12}
            y={g.midY + 38}
            fill="#8fa3bd"
            fontSize={11}
            fontWeight={600}
            letterSpacing="0.09em"
            paintOrder="stroke"
            stroke={CANVAS}
            strokeWidth={3.5}
            strokeLinejoin="round"
          >
            {legend.fail.toUpperCase()}
          </text>
        </svg>

        {/* Glyphs and labels ride on top so they wrap in every language. */}
        <div className="absolute inset-0">
          {flow.in.map((n, i) => (
            <CanvasNode
              key={`inl-${n.label}`}
              x={g.xIn}
              y={g.inY(i)}
              node={n}
              tone="record"
              label={n.label}
            />
          ))}

          {flow.steps.map((s, i) => (
            <div key={`stepl-${s.title}`}>
              <CanvasNode
                x={g.stepX[i]}
                y={g.midY}
                node={{ icon: s.icon, label: s.title }}
                tone="step"
                index={i + 1}
                label={s.title}
                place="above"
              />
              {s.tools.map((t, j) => (
                <div
                  key={`tooll-${t.label}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: g.toolX(i, j, s.tools.length), top: g.bandY }}
                >
                  <span className="flex size-[22px] items-center justify-center text-bone-soft">
                    {t.brand ? (
                      <BrandMark name={t.brand} className="size-[18px]" />
                    ) : (
                      <FlowIcon name={t.icon ?? "plug"} className="size-[21px] text-bone-dim" />
                    )}
                  </span>
                  <span
                    className="absolute left-1/2 top-[30px] -translate-x-1/2 hyphens-auto break-words text-center text-[10.5px] leading-[1.3] text-bone-dim"
                    style={{ width: SUB_LAB_W }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          ))}

          <CanvasNode
            x={g.xDec}
            y={g.midY}
            node={{ icon: "diamond", label: legend.decision }}
            tone="decision"
            label={legend.decision}
            sub={flow.decision.question}
            place="above"
          />

          {flow.out.map((n, k) => (
            <CanvasNode
              key={`outl-${n.label}`}
              x={g.xRight}
              y={g.outY(k)}
              node={n}
              tone="record"
              label={n.label}
            />
          ))}
          <CanvasNode
            x={g.xRight}
            y={g.humanY}
            node={{ icon: "user", label: legend.human }}
            tone="human"
            label={legend.human}
          />
        </div>
      </div>
    </div>
  );
}

/** One node's glyph plus the text under it, positioned in canvas coordinates. */
function CanvasNode({
  x,
  y,
  node,
  tone,
  label,
  sub,
  index,
  place = "below",
}: {
  x: number;
  y: number;
  node: FlowNode;
  tone: "record" | "step" | "decision" | "human";
  label: string;
  sub?: string;
  index?: number;
  place?: "above" | "below";
}) {
  const glyph =
    tone === "step" || tone === "decision" ? "text-lime-soft" : "text-bone-soft";
  return (
    <>
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: x, top: y }}
      >
        <span className={`flex size-8 items-center justify-center ${glyph}`}>
          {node.brand ? (
            <BrandMark name={node.brand} className="size-[30px]" />
          ) : (
            <FlowIcon name={node.icon ?? "doc"} className="size-[30px]" />
          )}
        </span>
        {index !== undefined && (
          <span className="absolute -right-[30px] -top-[30px] flex size-[19px] items-center justify-center rounded-full bg-lime text-[11px] font-bold text-night">
            {index}
          </span>
        )}
      </div>
      <div
        className={`absolute flex -translate-x-1/2 flex-col text-center ${
          place === "above" ? "justify-end" : "justify-start"
        }`}
        style={{
          left: x,
          top: place === "above" ? y - NODE / 2 - 10 - LABEL_TALL : y + NODE / 2 + 10,
          width: LAB_W,
          height: place === "above" ? LABEL_TALL : undefined,
        }}
      >
        <div className="text-[12.5px] font-semibold leading-[1.25] text-bone">
          {label}
        </div>
        {sub && (
          <div className="mt-1 text-[11px] leading-[1.35] text-bone-dim">{sub}</div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ *
 *  Section
 * ------------------------------------------------------------------ */

/**
 * "Follow the data" — one use case at a time, drawn as the workflow it really
 * is: the records that trigger it, what runs, the systems each step touches,
 * the point where it decides on its own, and where it hands back to a person.
 * The canvas carries names only; the two sentences that need saying sit beside
 * it as notes.
 */
export default function UseCaseFlow({
  items,
  legend,
}: {
  items: readonly Flow[];
  legend: FlowLegend;
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const flow = items[active];

  function onTabKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      (active + (e.key === "ArrowRight" ? 1 : items.length - 1)) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      {/* Which use case is on the canvas */}
      <div
        role="tablist"
        aria-label={legend.run}
        onKeyDown={onTabKeyDown}
        className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`flow-tab-${item.id}`}
            aria-selected={i === active}
            aria-controls={`flow-panel-${item.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`flex shrink-0 snap-start items-center gap-2 rounded-[2px] border px-3.5 py-2.5 text-[14px] font-semibold transition-colors duration-300 ${
              i === active
                ? "border-lime bg-lime text-night"
                : "border-white/15 text-bone-soft hover:border-white/40 hover:text-bone"
            }`}
          >
            <FlowIcon name={item.icon} className="size-[18px]" />
            {item.tab}
          </button>
        ))}
      </div>

      <motion.div
        key={flow.id}
        id={`flow-panel-${flow.id}`}
        role="tabpanel"
        aria-labelledby={`flow-tab-${flow.id}`}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8"
      >
        <h3 className="text-center font-serif text-[1.6rem] font-medium leading-tight text-bone sm:text-[1.9rem]">
          {flow.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-dim">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-lime" />
            {legend.in}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-lime" />
            {legend.run}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rotate-45 bg-lime" />
            {legend.tools}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-lime" />
            {legend.out}
          </span>
        </div>

        <div className="mt-6">
          <FlowCanvas flow={flow} legend={legend} />
        </div>

        {/* The three things the wiring cannot draw, as chips rather than prose. */}
        <div className="mx-auto mt-7 grid max-w-[900px] gap-2.5 sm:grid-cols-3">
          {[
            { key: "pass", icon: "check", label: legend.pass, text: flow.decision.pass },
            { key: "fail", icon: "alert", label: legend.fail, text: flow.decision.fail },
            { key: "human", icon: "user", label: legend.human, text: flow.human },
          ].map((note) => {
            const accent = note.key === "pass";
            return (
              <div
                key={note.key}
                className={`flex items-start gap-3 rounded border p-3.5 ${
                  accent
                    ? "border-lime/35 bg-lime/[0.06]"
                    : "border-white/12 bg-white/[0.03]"
                }`}
              >
                <span
                  className={`mt-px flex size-7 shrink-0 items-center justify-center rounded-full ${
                    accent
                      ? "bg-lime/15 text-lime-soft"
                      : "bg-white/[0.06] text-bone-dim"
                  }`}
                >
                  <FlowIcon name={note.icon} className="size-4" />
                </span>
                <span className="block">
                  <span className="block font-mono text-[10.5px] uppercase tracking-[0.12em] text-bone-dim">
                    {note.label}
                  </span>
                  <span className="mt-1 block text-[13px] leading-[1.45] text-bone-soft">
                    {note.text}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
