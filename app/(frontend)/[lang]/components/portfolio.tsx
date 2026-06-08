import { Reveal, Stagger, StaggerItem } from "./motion";
import { TagPill, Pill, Arrow } from "./ui";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFeaturedCaseStudies } from "@/lib/case-studies";

export default async function Portfolio({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).portfolio;
  const shared = getDictionary(locale).shared;
  const caseStudies = await getFeaturedCaseStudies(locale, 4);

  return (
    <section id="case-studies" className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <TagPill className="text-ink-soft">{t.label}</TagPill>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {t.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t.subtitle}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Pill variant="dark" href="/case-studies">
              {t.cta}
            </Pill>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-6 md:grid-cols-2" gap={0.08}>
          {caseStudies.map((cs) => (
            <StaggerItem key={cs.slug}>
              <LocaleLink
                href={`/case-studies/${cs.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cream-line bg-cream-dim/40 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]"
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
                    <span className="rounded-xl bg-white/95 px-5 py-3 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cs.logo.url} alt={cs.logo.alt} className="h-7 w-auto" />
                    </span>
                  ) : (
                    <span className="text-2xl font-medium text-white/90">{cs.client ?? cs.title}</span>
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-night/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-bone backdrop-blur-sm">
                    {cs.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-xl font-medium text-ink transition-colors group-hover:text-lime-deep sm:text-2xl">
                    {cs.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {cs.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-lime-deep">
                    {shared.viewCaseStudy}
                    <Arrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
