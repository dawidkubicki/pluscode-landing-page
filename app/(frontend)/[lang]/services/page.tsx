import type { Metadata } from "next";
import { PageHero, CtaBand } from "../components/page-hero";
import Footer from "../components/footer";
import { Stagger, StaggerItem } from "../components/motion";
import { Visual, type VisualKind } from "../components/visual";
import LocaleLink from "../components/locale-link";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// Picks up dictionary/CMS edits while still prerendering.
export const revalidate = 60;

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

/** The Services-category offerings, in display order. */
const cards: {
  key:
    | "forwardDeployedEngineers"
    | "softwareDevelopment"
    | "webDevelopment"
    | "mobileApps"
    | "mvpDevelopment"
    | "apiDevelopment"
    | "cloudSolutions"
    | "teamExtension"
    | "technologies";
  href: string;
  visual: VisualKind;
}[] = [
  {
    key: "forwardDeployedEngineers",
    href: "/services/forward-deployed-engineers",
    visual: "nodes",
  },
  { key: "softwareDevelopment", href: "/services/software-development", visual: "code" },
  { key: "webDevelopment", href: "/services/web-development", visual: "code" },
  { key: "mobileApps", href: "/services/mobile", visual: "grid" },
  { key: "mvpDevelopment", href: "/services/mvp-development", visual: "aurora" },
  { key: "apiDevelopment", href: "/services/api-development", visual: "nodes" },
  { key: "cloudSolutions", href: "/services/cloud", visual: "mesh" },
  { key: "teamExtension", href: "/services/team-extension", visual: "aurora" },
  { key: "technologies", href: "/services/technologies", visual: "grid" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(resolve(lang)).pages.services.index;
  return { title: t.metaTitle, description: t.metaDescription };
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const dict = getDictionary(locale);
  const t = dict.pages.services.index;
  const items = dict.navigation.servicesItems;

  return (
    <main>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.intro}
        visual="grid"
        cta={{ label: t.cta, href: "/contact" }}
      />

      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          {/* Nine offerings, three to a row. Each cell is ruled at the top and
              carries its own plate: no boxes, no hover lift, and the headline
              is the thing that answers a hover. */}
          <Stagger className="pc-grid" gap={0.08}>
            {cards.map((c, i) => {
              const item = items[c.key];
              return (
                <StaggerItem key={c.key} className="col-span-4">
                  <LocaleLink
                    href={c.href}
                    className="group block border-t border-rule pt-8"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-paper-dim">
                      <Visual kind={c.visual} />
                    </div>
                    <span className="mt-6 block text-[0.875rem] text-moss">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-heading-md text-ink">
                      <span className="pc-link group-hover:[background-size:100%_1px]">
                        {item.title}
                      </span>
                    </h3>
                    <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-block text-[1rem] text-moss">
                      {t.view}
                    </span>
                  </LocaleLink>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <CtaBand locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
