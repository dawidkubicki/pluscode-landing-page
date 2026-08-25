"use client";

import { useState } from "react";
import { Stagger, StaggerItem } from "./motion";
import LocaleLink from "./locale-link";

export type ServiceItem = {
  num: string;
  title: string;
  desc: string;
  tags: string;
};

/**
 * The capability rows. One row is always lit rather than waiting for a cursor:
 * the hovered one, falling back to the first when the pointer leaves. The lit
 * row gets a tinted wash and its number turns into a glass tile, so the list
 * reads as a stack of cards rather than a table of links.
 */
export default function ServicesList({
  items,
  hrefs,
}: {
  items: readonly ServiceItem[];
  hrefs: readonly string[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div onMouseLeave={() => setActive(0)}>
      <Stagger className="flex flex-col" gap={0.08}>
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <StaggerItem key={item.num}>
              <LocaleLink
                href={hrefs[i]}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative isolate grid gap-4 border-t border-cream-line px-3 py-8 sm:grid-cols-[minmax(0,104px)_1fr] sm:gap-x-12 sm:px-7 sm:py-9"
              >
                {/* The lit state: a tinted wash, an accent rail, and a soft
                    lime bloom that the number tile blurs against. */}
                <span
                  aria-hidden
                  className={`absolute inset-0 -z-10 overflow-hidden transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-lime/[0.08] via-cream to-white" />
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-lime" />
                  <span className="absolute -left-14 top-1/2 size-[240px] -translate-y-1/2 rounded-full bg-lime/25 blur-[70px]" />
                </span>

                <span
                  className={`relative flex size-[72px] shrink-0 items-center justify-center rounded-[20px] border font-serif text-[1.9rem] font-light leading-none backdrop-blur-md transition-all duration-500 ${
                    isActive
                      ? "-translate-y-0.5 border-white/80 bg-white/55 text-lime-deep shadow-[0_18px_40px_-18px_rgba(5,150,105,0.6),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-14px_26px_-18px_rgba(5,150,105,0.55)]"
                      : "border-cream-line bg-white/60 text-[#c3cede] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                  }`}
                >
                  {item.num}
                  {/* Specular highlight: the tile catching the light. */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/75 via-white/10 to-transparent transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </span>

                <span className="block">
                  <span className="flex items-start gap-3">
                    <h3 className="text-xl font-semibold text-ink sm:text-[22px]">
                      {item.title}
                    </h3>
                    <span
                      aria-hidden
                      className={`mt-1 shrink-0 text-lime transition-all duration-500 ${
                        isActive
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0"
                      }`}
                    >
                      ›
                    </span>
                  </span>
                  <p className="mt-2.5 max-w-[520px] text-[15.5px] leading-[1.6] text-ink-soft">
                    {item.desc}
                  </p>
                  <div
                    className={`mt-3.5 font-mono text-[12px] tracking-[0.02em] transition-colors duration-500 ${
                      isActive ? "text-lime-deep" : "text-ink-mute"
                    }`}
                  >
                    {item.tags}
                  </div>
                </span>
              </LocaleLink>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
