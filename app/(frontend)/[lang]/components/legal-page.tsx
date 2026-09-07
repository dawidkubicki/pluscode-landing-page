import { PageHero } from "./page-hero";
import Footer from "./footer";
import { Reveal } from "./motion";
import { Eyebrow } from "./ui";
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

      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            {/* The contents sit in three columns and the document in eight,
                starting at column five. Below 768px the grid is four wide,
                so the two stack and the contents lead. */}
            <aside className="col-span-4 md:col-span-3 md:sticky md:top-28 md:self-start">
              <Eyebrow>{d.tableOfContents}</Eyebrow>
              <nav className="mt-5 flex flex-col gap-2.5 border-l border-rule pl-4">
                {entries.map(([key, s]) => (
                  <a
                    key={key}
                    href={`#${key}`}
                    className="block text-[1rem] text-moss transition-colors duration-300 ease-io-attio hover:text-ink hover:duration-50"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="col-span-4 md:col-span-8 md:col-start-5">
              {entries.map(([key, s], i) => (
                <Reveal key={key} delay={i === 0 ? 0 : 0.02}>
                  <section
                    id={key}
                    className="scroll-mt-28 border-b border-rule py-8 first:pt-0 last:border-0"
                  >
                    <h2 className="text-heading-sm text-ink">{s.title}</h2>
                    <p className="mt-4 max-w-[64ch] whitespace-pre-line text-[1.125rem] leading-[1.375] text-moss">
                      {s.content}
                    </p>
                  </section>
                </Reveal>
              ))}
            </div>
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
