"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ *
 *  Shapes mirror `useCaseFlows` in the dictionaries.
 * ------------------------------------------------------------------ */

export type FlowStep = {
  title: string;
  desc: string;
  tools: readonly string[];
};

export type Flow = {
  id: string;
  tab: string;
  title: string;
  in: readonly string[];
  steps: readonly FlowStep[];
  decision: { question: string; pass: string; fail: string };
  out: readonly string[];
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
 *  Glyphs
 * ------------------------------------------------------------------ */

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 12h14m0 0-5.5-5.5M18 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Hand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 20a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Between-column arrow: pointing right on desktop, down once the flow stacks. */
function Connector() {
  return (
    <div className="flex items-center justify-center py-1 lg:py-0">
      <span className="flex size-8 rotate-90 items-center justify-center rounded-full border border-white/15 bg-night-soft/70 text-lime-soft lg:rotate-0">
        <Chevron className="size-4" />
      </span>
    </div>
  );
}

/** The "data in" / "data out" panels: a labelled list of concrete records. */
function DataPanel({
  label,
  items,
  align = "start",
}: {
  label: string;
  items: readonly string[];
  align?: "start" | "end";
}) {
  return (
    <div className="flex h-full flex-col rounded border border-white/10 bg-night-soft/60 p-6">
      <div className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-lime-soft">
        <span className="size-1.5 rounded-full bg-lime" />
        {label}
      </div>
      <ul className="mt-5 flex flex-col gap-3.5">
        {items.map((item) => (
          <li
            key={item}
            className={`border-l pl-3.5 text-[14px] leading-[1.6] text-bone-soft ${
              align === "end" ? "border-lime/45" : "border-white/15"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  The diagram
 * ------------------------------------------------------------------ */

/**
 * "Follow the data" — one use case at a time, drawn as the flow it really is:
 * what comes in, which systems each step touches, the point where the process
 * decides on its own, and what lands where. The specifics are the argument
 * here, so the copy names real records and real systems rather than
 * capabilities.
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
      {/* Which use case is on the table */}
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
            className={`shrink-0 snap-start rounded-[2px] border px-4 py-2.5 text-[14px] font-semibold transition-colors duration-300 ${
              i === active
                ? "border-lime bg-lime text-night"
                : "border-white/15 text-bone-soft hover:border-white/40 hover:text-bone"
            }`}
          >
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

        <div className="mt-8 grid gap-2 lg:grid-cols-[minmax(0,0.95fr)_auto_minmax(0,1.75fr)_auto_minmax(0,0.95fr)] lg:gap-3">
          <DataPanel label={legend.in} items={flow.in} />

          <Connector />

          {/* What runs, and the point where it decides */}
          <div className="flex h-full flex-col rounded border border-white/10 bg-night-soft/60 p-6 sm:p-7">
            <div className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-lime-soft">
              <span className="size-1.5 rounded-full bg-lime" />
              {legend.run}
            </div>

            <ol className="mt-5 flex flex-col">
              {flow.steps.map((step, i) => (
                <li key={step.title} className="relative pl-11 pb-6 last:pb-0">
                  {/* rail linking the steps into one path */}
                  {i < flow.steps.length - 1 && (
                    <span className="absolute left-[13px] top-8 h-[calc(100%-1rem)] w-px bg-white/12" />
                  )}
                  <span className="absolute left-0 top-0 flex size-[27px] items-center justify-center rounded-full border border-lime/50 bg-night text-[12.5px] font-semibold text-lime-soft">
                    {i + 1}
                  </span>
                  <h4 className="text-[15.5px] font-semibold leading-tight text-bone">
                    {step.title}
                  </h4>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-bone-soft">
                    {step.desc}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-bone-dim">
                      {legend.tools}
                    </span>
                    {step.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-[2px] border border-white/15 bg-white/[0.04] px-2 py-1 text-[12px] text-bone-soft"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>

            {/* The decision point: the whole reason this is a diagram */}
            <div className="mt-2 rounded border border-lime/35 bg-lime/[0.06] p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 size-3.5 shrink-0 rotate-45 border border-lime bg-lime/25" />
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-lime-soft">
                    {legend.decision}
                  </div>
                  <p className="mt-1.5 text-[15px] font-medium leading-[1.5] text-bone">
                    {flow.decision.question}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[2px] border border-lime/40 bg-night/40 p-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-lime-soft">
                    <Check className="size-3.5" />
                    {legend.pass}
                  </div>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-bone-soft">
                    {flow.decision.pass}
                  </p>
                </div>
                <div className="rounded-[2px] border border-white/20 bg-night/40 p-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-bone">
                    <Hand className="size-3.5" />
                    {legend.fail}
                  </div>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-bone-soft">
                    {flow.decision.fail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Connector />

          <DataPanel label={legend.out} items={flow.out} align="end" />
        </div>

        <p className="mt-6 flex items-start justify-center gap-3 text-center text-[14.5px] leading-[1.65] text-bone-dim">
          <Hand className="mt-0.5 hidden size-4 shrink-0 text-lime-soft sm:block" />
          <span>
            <span className="text-bone-soft">{legend.human}: </span>
            {flow.human}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
