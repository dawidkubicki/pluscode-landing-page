import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import Footer from "../components/footer";
import { Stagger, StaggerItem } from "../components/motion";
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

      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          {/* The category and the reading time are one caption line above the
              headline, which is the editorial order the homepage bands use. */}
          <Stagger className="pc-grid" gap={0.08}>
            {insights.map((insight) => (
              <StaggerItem key={insight.slug} className="col-span-4">
                <LocaleLink href={`/insights/${insight.slug}`} className="group block">
                  <div
                    className={`relative aspect-[4/3] overflow-hidden ${insight.gradient}`}
                  >
                    {insight.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={insight.image.url} alt={insight.image.alt} className="absolute inset-0 size-full object-cover" />
                    )}
                  </div>
                  <p className="mt-6 text-[1.125rem] text-moss">
                    {labels.categories[insight.category]} · {insight.readTime}{" "}
                    {labels.minRead}
                  </p>
                  <h2 className="mt-2 text-heading-md text-ink">
                    <span className="pc-link group-hover:[background-size:100%_1px]">
                      {insight.title}
                    </span>
                  </h2>
                  <p className="mt-4 line-clamp-3 text-[1.125rem] leading-[1.375] text-moss">
                    {insight.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-[1rem] text-moss">
                    {labels.readMore}
                  </span>
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
