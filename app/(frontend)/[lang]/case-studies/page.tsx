import type { Metadata } from "next";
import { PageHero, CtaBand } from "../components/page-hero";
import Footer from "../components/footer";
import { Stagger, StaggerItem } from "../components/motion";
import { Arrow } from "../components/ui";
import LocaleLink from "../components/locale-link";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCaseStudies } from "@/lib/case-studies";

export const revalidate = 60;

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(resolve(lang)).pages.caseStudies;
  return { title: t.title, description: t.subtitle };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const t = getDictionary(locale).pages.caseStudies;
  const shared = getDictionary(locale).shared;
  const caseStudies = await getCaseStudies(locale);

  return (
    <main>
      <PageHero eyebrow={t.label} title={t.title} intro={t.subtitle} visual="mesh" />

      <section className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Stagger className="grid gap-6 md:grid-cols-2" gap={0.08}>
            {caseStudies.map((cs) => (
              <StaggerItem key={cs.slug}>
                <LocaleLink
                  href={`/case-studies/${cs.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cream-line bg-cream-dim/40 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]"
                >
                  <div className={`relative isolate flex h-52 items-center justify-center overflow-hidden ${cs.gradient}`}>
                    {cs.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cs.image.url} alt={cs.image.alt} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                    <h2 className="text-xl font-medium text-ink transition-colors group-hover:text-lime-deep sm:text-2xl">
                      {cs.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{cs.excerpt}</p>
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

      <CtaBand
        locale={locale}
        title={t.cta.title}
        text={t.cta.subtitle}
        cta={{ label: t.cta.button, href: "/contact" }}
      />
      <Footer locale={locale} />
    </main>
  );
}
