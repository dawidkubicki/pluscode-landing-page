import type { Metadata } from "next";
import { PageHero, CtaBand } from "../components/page-hero";
import Footer from "../components/footer";
import { Stagger, StaggerItem } from "../components/motion";
import { Arrow } from "../components/ui";
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

      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Stagger
            className="grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-4"
            gap={0.08}
          >
            {cards.map((c, i) => {
              const item = items[c.key];
              return (
                <StaggerItem key={c.key}>
                  <LocaleLink
                    href={c.href}
                    className="group flex h-full flex-col border-b border-r border-cream-line bg-white p-7 transition-colors duration-300 hover:bg-cream"
                  >
                    <div className="h-32 overflow-hidden rounded">
                      <Visual kind={c.visual} />
                    </div>
                    <span className="mt-6 font-mono text-xs text-ink-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-[1.65] text-ink-soft">
                      {item.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-lime transition-colors group-hover:text-ink">
                      {t.view}
                      <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
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
