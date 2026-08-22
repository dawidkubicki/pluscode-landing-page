import { Reveal, Stagger, StaggerItem } from "./motion";
import { Arrow, Pill } from "./ui";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFeaturedCaseStudies } from "@/lib/case-studies";

export default async function Portfolio({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).portfolio;
  const shared = getDictionary(locale).shared;
  const caseStudies = await getFeaturedCaseStudies(locale, 3);

  return (
    <section id="case-studies" className="bg-cream">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
        <div className="mb-12 flex flex-col justify-between gap-8 sm:mb-[3.375rem] md:flex-row md:items-end">
          <div>
            <Reveal>
              <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
                {t.label}
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {t.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Pill variant="dark" href="/case-studies">
              {t.cta}
            </Pill>
          </Reveal>
        </div>

        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
          {caseStudies.map((cs) => (
            <StaggerItem key={cs.slug} className="h-full">
              <LocaleLink
                href={`/case-studies/${cs.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded border border-cream-line bg-white transition-colors duration-300 hover:border-lime"
              >
                <div className={`relative isolate flex h-52 items-center justify-center overflow-hidden ${cs.gradient}`}>
                  {cs.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cs.image.url}
                      alt={cs.image.alt}
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : cs.logo ? (
                    <span className="rounded bg-white/95 px-5 py-3 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cs.logo.url} alt={cs.logo.alt} className="h-7 w-auto" />
                    </span>
                  ) : (
                    <span className="text-2xl font-medium text-white/90">
                      {cs.client ?? cs.title}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-7">
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-lime">
                    {cs.category}
                  </span>
                  <h3 className="font-serif text-[22px] font-semibold leading-[1.25] text-ink">
                    {cs.title}
                  </h3>
                  <p className="flex-1 text-[15px] leading-[1.65] text-ink-soft">
                    {cs.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-lime transition-colors group-hover:text-ink">
                    {shared.viewCaseStudy}
                    <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </LocaleLink>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
