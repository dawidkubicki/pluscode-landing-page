'use client';

import { motion } from 'framer-motion';

/**
 * Abstract product mockups rendered in pure JSX/SVG so the section works
 * without screenshot assets. `variant` picks the mock that matches the product.
 */
export default function ProductVisual({
  variant,
  isInView = true,
}: {
  variant: 'graph' | 'phone';
  isInView?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className={`
        relative aspect-4/3 w-full overflow-hidden rounded-3xl ring-1 ring-inset ring-black/5
        ${
          variant === 'graph'
            ? 'bg-linear-to-br from-violet-50 via-indigo-50/60 to-white'
            : 'bg-linear-to-br from-emerald-50 via-teal-50/60 to-white'
        }
      `}
    >
      {variant === 'graph' ? <GraphMock /> : <PhoneMock />}
    </motion.div>
  );
}

function GraphMock() {
  const nodes = [
    { cx: 90, cy: 70, r: 7, label: 'NVDA' },
    { cx: 200, cy: 40, r: 5 },
    { cx: 265, cy: 110, r: 9, label: 'AI chips' },
    { cx: 150, cy: 150, r: 6 },
    { cx: 60, cy: 175, r: 5 },
    { cx: 235, cy: 205, r: 6, label: 'BTC' },
  ];
  const edges = [
    [0, 1],
    [0, 3],
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [2, 5],
  ];

  return (
    <div className="absolute inset-0 p-5 sm:p-7 md:p-9">
      {/* Window chrome */}
      <div className="h-full w-full rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 overflow-hidden flex flex-col">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-black/5">
          <span className="w-2 h-2 rounded-full bg-neutral-200" />
          <span className="w-2 h-2 rounded-full bg-neutral-200" />
          <span className="w-2 h-2 rounded-full bg-neutral-200" />
          <span className="ml-3 text-[10px] font-medium tracking-wide text-neutral-400">
            query &#123; insights(symbol: &quot;NVDA&quot;) &#125;
          </span>
        </div>

        <div className="relative flex-1">
          <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full">
            {edges.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a].cx}
                y1={nodes[a].cy}
                x2={nodes[b].cx}
                y2={nodes[b].cy}
                stroke="rgb(139 92 246)"
                strokeOpacity={0.25}
                strokeWidth={1}
              />
            ))}
            {nodes.map((n, i) => (
              <g key={i}>
                <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="rgb(139 92 246)" fillOpacity={0.08} />
                <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgb(124 58 237)" fillOpacity={0.75} />
                {n.label && (
                  <text
                    x={n.cx + n.r + 8}
                    y={n.cy + 3}
                    fontSize="9"
                    fill="rgb(82 82 82)"
                    fontWeight="500"
                  >
                    {n.label}
                  </text>
                )}
              </g>
            ))}
            {/* Sentiment sparkline */}
            <path
              d="M20 215 L60 200 L100 208 L140 182 L180 190 L220 165 L260 172 L300 148"
              fill="none"
              stroke="rgb(16 185 129)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>

          {/* Floating sentiment chip */}
          <div className="absolute bottom-4 left-4 rounded-xl bg-white shadow-lg shadow-black/5 ring-1 ring-black/5 px-3 py-2">
            <p className="text-[9px] uppercase tracking-[0.15em] text-neutral-400">Sentiment</p>
            <p className="text-sm font-semibold text-emerald-600">+0.72</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMock() {
  const rows = [
    { name: 'Push day A', meta: '6 exercises · 52 min', done: true },
    { name: 'Zone 2 run', meta: '40 min · HR 135', done: true },
    { name: 'Pull day B', meta: '7 exercises · 58 min', done: false },
    { name: 'Mobility', meta: '15 min', done: false },
  ];

  return (
    <div className="absolute inset-0 flex items-end justify-center pt-8 sm:pt-10">
      <div className="w-[46%] max-w-[220px] rounded-t-[2rem] bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5 overflow-hidden">
        {/* Status bar / notch */}
        <div className="relative h-7 bg-white">
          <div className="absolute left-1/2 top-1.5 -translate-x-1/2 h-2 w-14 rounded-full bg-neutral-100" />
        </div>

        <div className="px-4 pb-6">
          <p className="text-[9px] uppercase tracking-[0.15em] text-neutral-400">This week</p>
          <p className="text-sm font-semibold text-neutral-900 mt-0.5">Anna K. · Plan 12/16</p>

          {/* Progress */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-emerald-500" />
          </div>

          <div className="mt-4 space-y-2">
            {rows.map((row) => (
              <div
                key={row.name}
                className="flex items-center gap-2.5 rounded-xl bg-neutral-50 px-2.5 py-2"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    row.done ? 'bg-emerald-500' : 'bg-neutral-200'
                  }`}
                >
                  {row.done && (
                    <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-medium text-neutral-900">
                    {row.name}
                  </span>
                  <span className="block truncate text-[9px] text-neutral-400">{row.meta}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
