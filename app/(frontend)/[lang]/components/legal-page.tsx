import { Fragment } from "react";
import type { Metadata } from "next";
import JsonLd from "./json-ld";
import PageHero from "./page-hero";
import { Container, PlusIcon } from "./ui";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbLd, webPageLd } from "@/lib/structured-data";

export type LegalDoc = "privacy" | "terms";

const PATH: Record<LegalDoc, string> = {
  privacy: "/privacy-policy",
  terms: "/terms-of-use",
};

type Section = { title: string; content: string };

function read(locale: Locale, doc: LegalDoc) {
  const dict = getDictionary(locale);
  const d = dict.legal[doc];
  const sections = Object.entries(d.sections as Record<string, Section>);
  return { dict, d, sections };
}

export function legalMetadata(locale: Locale, doc: LegalDoc): Metadata {
  const { d } = read(locale, doc);
  return pageMetadata(locale, {
    path: PATH[doc],
    title: d.title,
    description: d.subtitle,
  });
}

const paragraphs = (content: string) =>
  content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/**
 * Privacy Policy and Terms of use. The text lives in the dictionaries under
 * `legal`, one entry per section, and each section's key is its anchor: the
 * cookie banner links to `/privacy-policy#cookies`, so the keys are addresses
 * and must not be renamed.
 */
export default function LegalPage({ locale, doc }: { locale: Locale; doc: LegalDoc }) {
  const { dict, d, sections } = read(locale, doc);

  const links = (itemClass: string) =>
    sections.map(([key, s]) => (
      <li key={key}>
        <a href={`#${key}`} className={itemClass}>
          {s.title}
        </a>
      </li>
    ));

  return (
    <main id="main">
      <PageHero size="short" title={d.title} intro={d.lastUpdated} />

      <Container className="pc-section">
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            {/* Below the two-column layout the contents fold away, so the
                document starts on the first screen of a phone. */}
            <details className="group border-y border-grey-mid lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-small text-grey [&::-webkit-details-marker]:hidden">
                {d.tableOfContents}
                <PlusIcon className="size-3 transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <nav aria-label={d.tableOfContents} className="pb-3">
                <ol>{links("flex min-h-11 items-center text-small hover:text-blue")}</ol>
              </nav>
            </details>

            <nav
              aria-label={d.tableOfContents}
              className="sticky top-[calc(var(--header-h)+2rem)] hidden lg:block"
            >
              <p className="pc-label">{d.tableOfContents}</p>
              <ol className="mt-4 space-y-2.5 border-l border-grey-mid pl-5">
                {links("block text-small text-grey transition-colors duration-200 hover:text-ink")}
              </ol>
            </nav>
          </div>

          <div className="pc-prose max-w-[44rem] lg:col-span-8 lg:col-start-5">
            {sections.map(([key, s]) => (
              <Fragment key={key}>
                <h2 id={key} className="scroll-mt-8 first:mt-0">
                  {s.title}
                </h2>
                {paragraphs(s.content).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </Container>

      <JsonLd
        data={[
          webPageLd(locale, { path: PATH[doc], name: d.title, description: d.subtitle }),
          breadcrumbLd(locale, [
            { name: dict.nav.home, path: "" },
            { name: d.breadcrumb, path: PATH[doc] },
          ]),
        ]}
      />
    </main>
  );
}
