import { Reveal, Stagger, StaggerItem } from "./motion";
import { Arrow } from "./ui";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

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

/** Dedicated booking page per offering, index-aligned with `offerings.items`. */
const SLUGS = [
  "ai-opportunity-workshop",
  "ai-discovery-sprint",
  "genai-proof-of-concept",
  "fractional-ai-team",
];

/**
 * Productized engagements — the "how to buy" layer that turns a curious visitor
 * into a booked call. A de-risk ladder (workshop, sprint, PoC, embedded team)
 * on a dark surface; the featured card carries the emerald accent.
 */
export default function Offerings({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).offerings;

  return (
    <section
      id="workshops"
      className="relative isolate scroll-mt-24 overflow-hidden bg-night text-bone"
    >
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16)_0%,rgba(16,185,129,0)_65%)]" />

      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.875rem]">
        <div className="max-w-[760px]">
          <Reveal>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime-soft">
              {t.label}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-bone sm:text-5xl">
              {t.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[17px] leading-[1.7] text-bone-soft">
              {t.subtitle}
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2" gap={0.08}>
          {t.items.map((item, i) => (
            <StaggerItem key={item.name} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded border p-7 transition-colors duration-300 sm:p-8 ${
                  item.featured
                    ? "border-lime bg-night-soft shadow-[0_30px_60px_-30px_rgba(16,185,129,0.55)]"
                    : "border-white/10 bg-night-soft/60 hover:border-white/25"
                }`}
              >
                {item.featured && (
                  <span className="absolute -top-3 left-8 rounded-[2px] bg-lime px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-night">
                    {t.featuredLabel}
                  </span>
                )}

                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-[1.7rem] font-medium leading-tight text-bone">
                    {item.name}
                  </h3>
                </div>
                <div className="mt-2.5 font-mono text-[12.5px] uppercase tracking-[0.1em] text-lime-soft">
                  {item.meta}
                </div>

                <p className="mt-5 text-[15px] leading-[1.65] text-bone-soft">
                  {item.desc}
                </p>

                <div className="mt-6 text-[12px] uppercase tracking-[0.12em] text-bone-dim">
                  {t.forLabel}
                  <span className="ml-2 normal-case tracking-normal text-bone-soft">
                    {item.for}
                  </span>
                </div>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <div className="mb-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-bone-dim">
                    {t.deliverablesLabel}
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {item.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-[14.5px] text-bone-soft">
                        <Check className="mt-0.5 size-4 shrink-0 text-lime-soft" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
                  <LocaleLink
                    href={`/workshops/${SLUGS[i]}`}
                    className={`group inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] px-6 py-3.5 text-[15px] font-semibold transition-colors duration-300 ${
                      item.featured
                        ? "bg-lime text-night hover:bg-lime-bright"
                        : "border border-white/25 text-bone hover:border-lime hover:bg-lime hover:text-night"
                    }`}
                  >
                    {item.cta}
                    <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                  </LocaleLink>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-3 text-center text-[15px] leading-[1.6] text-bone-dim">
            <span className="hidden size-1.5 shrink-0 rounded-full bg-lime sm:inline-block" />
            {t.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
