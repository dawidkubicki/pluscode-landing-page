"use client";

import { useState } from "react";
import { Visual, type VisualKind } from "./visual";
import LocaleLink from "./locale-link";

type IndustryItem = { num: string; name: string; note: string };

/** Industry pages, in the same order as the dictionary's `industries.items`.
 *  `null` renders a plain cell (no dedicated page yet). */
const slugs: (string | null)[] = [
  "finance",
  "healthcare",
  "ecommerce",
  "hr",
  "logistics",
  null, // legal
  "saas",
  "manufacturing",
];

/** Art-directed hover backgrounds until per-industry imagery lands in the CMS. */
const visuals: VisualKind[] = [
  "grid",
  "mesh",
  "nodes",
  "aurora",
  "portrait",
  "code",
  "mesh",
  "nodes",
];

/**
 * One cell is always "active" (image background): the hovered one, falling
 * back to the first cell when the cursor leaves the grid.
 */
export default function IndustriesGrid({ items }: { items: IndustryItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div
      className="grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-4"
      onMouseLeave={() => setActive(0)}
    >
      {items.map((ind, i) => {
        const isActive = i === active;
        const inner = (
          <span className="relative z-10 flex h-full flex-col justify-between">
            <span
              className={`font-mono text-xs transition-colors duration-300 ${
                isActive ? "text-lime-soft" : "text-ink-mute"
              }`}
            >
              {ind.num}
            </span>
            {/* Fixed-height bottom block so every name sits on the same y line. */}
            <span className="block h-[4.75rem]">
              <span
                className={`mb-1.5 block text-[17px] font-semibold transition-colors duration-300 ${
                  isActive ? "text-white" : "text-ink"
                }`}
              >
                {ind.name}
              </span>
              <span
                className={`block text-[13.5px] leading-[1.5] transition-colors duration-300 ${
                  isActive ? "text-bone-soft" : "text-ink-soft"
                }`}
              >
                {ind.note}
              </span>
            </span>
          </span>
        );

        const cellCls =
          "relative isolate block h-[220px] overflow-hidden border-b border-r border-cream-line bg-white p-6 sm:p-7 lg:h-[250px]";

        const background = (
          <span
            aria-hidden
            className={`absolute inset-0 -z-10 transition-opacity duration-500 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Visual kind={visuals[i]} className="absolute inset-0" />
            <span className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/35 to-night/10" />
          </span>
        );

        return slugs[i] ? (
          <LocaleLink
            key={ind.num}
            href={`/industries/${slugs[i]}`}
            className={cellCls}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            {background}
            {inner}
          </LocaleLink>
        ) : (
          <div
            key={ind.num}
            className={cellCls}
            onMouseEnter={() => setActive(i)}
          >
            {background}
            {inner}
          </div>
        );
      })}
    </div>
  );
}
