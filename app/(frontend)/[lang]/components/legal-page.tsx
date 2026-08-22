import { PageHero } from "./page-hero";
import Footer from "./footer";
import { Reveal } from "./motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type LegalDoc = "privacy" | "terms";

type Section = { title: string; content: string };
type LegalData = {
  title: string;
  subtitle: string;
  breadcrumb: string;
  lastUpdated: string;
  tableOfContents: string;
  sections: Record<string, Section>;
};

export default function LegalPage({
  locale,
  doc,
}: {
  locale: Locale;
  doc: LegalDoc;
}) {
  const d = getDictionary(locale).pages.legal[doc] as unknown as LegalData;
  const entries = Object.entries(d.sections);

  return (
    <main>
      <PageHero eyebrow={d.lastUpdated} title={d.title} intro={d.subtitle} />

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-10 sm:py-[6.25rem] lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* TOC */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
              {d.tableOfContents}
            </p>
            <nav className="mt-5 space-y-2.5 border-l border-cream-line pl-4">
              {entries.map(([key, s]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="block text-sm text-ink-soft transition-colors hover:text-lime-deep"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Sections */}
          <div className="max-w-3xl">
            {entries.map(([key, s], i) => (
              <Reveal key={key} delay={i === 0 ? 0 : 0.02}>
                <section id={key} className="scroll-mt-28 border-b border-cream-line py-8 first:pt-0 last:border-0">
                  <h2 className="font-serif text-[1.75rem] font-medium tracking-[-0.01em] text-ink">
                    {s.title}
                  </h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">
                    {s.content}
                  </p>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}

export function legalMetadata(locale: Locale, doc: LegalDoc) {
  const d = getDictionary(locale).pages.legal[doc] as unknown as LegalData;
  return { title: d.title, description: d.subtitle };
}
