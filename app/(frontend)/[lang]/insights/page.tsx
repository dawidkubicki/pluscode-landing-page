import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import Footer from "../components/footer";
import { Stagger, StaggerItem } from "../components/motion";
import { Arrow } from "../components/ui";
import LocaleLink from "../components/locale-link";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getInsights } from "@/lib/insights";

export const revalidate = 60;

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(resolve(lang)).pages.insights;
  return { title: t.title, description: t.subtitle };
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const t = getDictionary(locale).pages.insights;
  const labels = getDictionary(locale).insights;
  const insights = await getInsights(locale);

  return (
    <main>
      <PageHero eyebrow={t.label} title={t.title} intro={t.subtitle} visual="aurora" />

      <section className="bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {insights.map((insight) => (
              <StaggerItem key={insight.slug} className="h-full">
                <LocaleLink
                  href={`/insights/${insight.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded border border-cream-line bg-white transition-colors duration-300 hover:border-lime"
                >
                  <div className={`relative h-48 overflow-hidden ${insight.gradient}`}>
                    {insight.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={insight.image.url} alt={insight.image.alt} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-7">
                    <div className="font-mono text-xs uppercase tracking-[0.1em] text-lime">
                      {labels.categories[insight.category]}
                      <span className="normal-case tracking-normal text-ink-mute"> · {insight.readTime} {labels.minRead}</span>
                    </div>
                    <h2 className="text-xl font-semibold leading-[1.35] text-ink">
                      {insight.title}
                    </h2>
                    <p className="line-clamp-3 flex-1 text-[15px] leading-[1.65] text-ink-soft">
                      {insight.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-lime transition-colors group-hover:text-ink">
                      {labels.readMore}
                      <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </LocaleLink>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
