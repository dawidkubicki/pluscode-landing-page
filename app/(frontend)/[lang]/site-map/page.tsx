import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import Footer from "../components/footer";
import { Stagger, StaggerItem } from "../components/motion";
import { Eyebrow } from "../components/ui";
import LocaleLink from "../components/locale-link";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

/** Maps `${section}.${link}` keys to routes. */
const hrefMap: Record<string, string> = {
  "main.home": "/",
  "main.about": "/about",
  "main.contact": "/contact",
  "aiData.machineLearning": "/ai-data/machine-learning",
  "aiData.analytics": "/ai-data/analytics",
  "aiData.consulting": "/ai-data/consulting",
  "services.forwardDeployedEngineers": "/services/forward-deployed-engineers",
  "services.softwareDevelopment": "/services/software-development",
  "services.webDevelopment": "/services/web-development",
  "services.mobile": "/services/mobile",
  "services.mvpDevelopment": "/services/mvp-development",
  "services.apiDevelopment": "/services/api-development",
  "services.cloud": "/services/cloud",
  "services.technologies": "/services/technologies",
  "industries.finance": "/industries/finance",
  "industries.healthcare": "/industries/healthcare",
  "industries.ecommerce": "/industries/ecommerce",
  "industries.hr": "/industries/hr",
  "industries.logistics": "/industries/logistics",
  "industries.legal": "/industries/legal",
  "industries.ai": "/industries/ai",
  "industries.saas": "/industries/saas",
  "industries.manufacturing": "/industries/manufacturing",
  "content.caseStudies": "/case-studies",
  "content.insights": "/insights",
  "legal.privacy": "/privacy-policy",
  "legal.terms": "/terms-of-use",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(resolve(lang)).pages.sitemap;
  return { title: t.title, description: t.subtitle };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const t = getDictionary(locale).pages.sitemap;
  const sections = Object.entries(t.sections) as [
    string,
    { title: string; links: Record<string, string> },
  ][];

  return (
    <main>
      <PageHero eyebrow={t.breadcrumb} title={t.title} intro={t.subtitle} visual="grid" />

      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          {/* One section per grid third, each opened by a hairline. The
              section title was a two-pixel accent rule over a mono caps
              label; it is a plain hairline and a sentence case label now. */}
          <Stagger className="pc-grid" gap={0.06}>
            {sections.map(([sectionKey, section]) => (
              <StaggerItem
                key={sectionKey}
                className="col-span-4 border-t border-rule pt-8 "
              >
                <h2>
                  <Eyebrow>{section.title}</Eyebrow>
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {Object.entries(section.links).map(([linkKey, label]) => (
                    <li key={linkKey}>
                      <LocaleLink
                        href={hrefMap[`${sectionKey}.${linkKey}`] ?? "/"}
                        className="pc-link text-[1.125rem] text-ink"
                      >
                        {label}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
