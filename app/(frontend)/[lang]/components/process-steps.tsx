"use client";

import { useState } from "react";
import { Stagger, StaggerItem } from "./motion";

export type ProcessStep = {
  num: string;
  title: string;
  desc: string;
};

/**
 * The four steps of the engagement, lit the same way the capability rows are:
 * one card is always the live one (the hovered card, falling back to 01), its
 * number sits on a glass tile and the card behind it warms up.
 */
export default function ProcessSteps({ steps }: { steps: readonly ProcessStep[] }) {
  const [active, setActive] = useState(0);

  return (
    <div onMouseLeave={() => setActive(0)}>
      <Stagger
        className="grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-4"
        gap={0.08}
      >
        {steps.map((step, i) => {
          const isActive = i === active;
          return (
            <StaggerItem key={step.num} className="h-full">
              <div
                onMouseEnter={() => setActive(i)}
                className="relative isolate flex h-full flex-col overflow-hidden border-b border-r border-cream-line bg-white p-7 sm:p-8"
              >
                {/* The live state: an accent rail, a warm wash and the bloom
                    the number tile blurs against. */}
                <span
                  aria-hidden
                  className={`absolute inset-0 -z-10 transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-lime/[0.09] via-cream to-white" />
                  <span className="absolute inset-x-0 top-0 h-[3px] bg-lime" />
                  <span className="absolute -left-12 -top-12 size-[220px] rounded-full bg-lime/25 blur-[70px]" />
                </span>

                <span
                  className={`relative flex size-[72px] items-center justify-center rounded-[20px] border font-serif text-[1.9rem] font-light leading-none backdrop-blur-md transition-all duration-500 ${
                    isActive
                      ? "-translate-y-0.5 border-white/80 bg-white/55 text-lime-deep shadow-[0_18px_40px_-18px_rgba(5,150,105,0.6),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-14px_26px_-18px_rgba(5,150,105,0.55)]"
                      : "border-cream-line bg-white/60 text-[#c3cede] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                  }`}
                >
                  {step.num}
                  {/* Specular highlight: the tile catching the light. */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/75 via-white/10 to-transparent transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </span>

                <h3 className="mt-6 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
