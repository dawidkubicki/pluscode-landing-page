import { Reveal, Parallax } from "./motion";
import { TagPill, Plus } from "./ui";
import { Visual } from "./visual";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Homepage "About" band — mirrors the FH Trade template: a centred two-tone
 * heading over an offset parallax image pair.
 */
export default function AboutIntro({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.about;
  return (
    <section id="about" className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="flex justify-center">
          <TagPill className="text-ink-soft">{t.tag}</TagPill>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-8 max-w-4xl text-balance text-center text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-ink">{t.headingLead}</span>{" "}
            <span className="text-ink-soft">{t.headingRest}</span>
          </h2>
        </Reveal>

        {/* parallax image pair */}
        <div className="relative mt-20 grid gap-5 md:grid-cols-2 md:gap-10">
          <div className="pointer-events-none absolute left-1/2 top-1/4 hidden -translate-x-1/2 md:block">
            <Plus className="size-7" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-3/4 hidden -translate-x-1/2 md:block">
            <Plus className="size-7" />
          </div>

          <Reveal>
            <Parallax amount={40}>
              <div className="aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[5/6]">
                <Visual kind="nodes" />
              </div>
            </Parallax>
          </Reveal>

          <Reveal delay={0.1}>
            <Parallax amount={-40} className="md:mt-24">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[5/6]">
                <Visual kind="code" />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
