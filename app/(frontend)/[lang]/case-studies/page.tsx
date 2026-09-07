import type { Metadata } from "next";
import { PageHero, CtaBand } from "../components/page-hero";
import Footer from "../components/footer";
import { Stagger, StaggerItem } from "../components/motion";
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

      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          {/* Three to a row, on the same shape as the homepage case band: the
              caption sits above the headline, the whole cell is the link and
              the headline is what moves. */}
          <Stagger className="pc-grid" gap={0.08}>
            {caseStudies.map((cs) => (
              <StaggerItem key={cs.slug} className="col-span-4">
                <LocaleLink
                  href={`/case-studies/${cs.slug}`}
                  className="group block"
                >
                  <div
                    className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden ${cs.gradient}`}
                  >
                    {cs.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cs.image.url} alt={cs.image.alt} className="absolute inset-0 size-full object-cover" />
                    ) : cs.logo ? (
                      <span className="bg-white px-5 py-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cs.logo.url} alt={cs.logo.alt} className="h-7 w-auto" />
                      </span>
                    ) : (
                      <span className="text-heading-sm text-white">
                        {cs.client ?? cs.title}
                      </span>
                    )}
                  </div>
                  <p className="mt-6 text-[1.125rem] text-moss">{cs.category}</p>
                  <h2 className="mt-2 text-heading-md text-ink">
                    <span className="pc-link group-hover:[background-size:100%_1px]">
                      {cs.title}
                    </span>
                  </h2>
                  <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                    {cs.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-[1rem] text-moss">
                    {shared.viewCaseStudy}
                  </span>
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
