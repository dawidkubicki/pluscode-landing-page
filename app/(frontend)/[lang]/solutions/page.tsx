import type { Metadata } from "next";
import { PageHero, CtaBand } from "../components/page-hero";
import Footer from "../components/footer";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { SectionHeading } from "../components/service-page";
import LocaleLink from "../components/locale-link";
import {
  getSolutions,
  solutionsIndexMetadata,
  OnwardBand,
} from "../components/solution-page";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

/* ------------------------------------------------------------------ *
 *  /solutions. The six pages, on one grid.
 *
 *  It is a ruled list of six links rather than a grid of six cards, for
 *  the same reason the homepage Services band is: six cards on a twelve
 *  column page leaves every column too narrow for a sentence, and six
 *  rows read as a table of contents, which is exactly what this page is.
 *  Each row re-enters the grid, so the number lands on column 1, the name
 *  on 2 to 6 and the sentence on 7 to 12, the same three lines every
 *  other list on the site uses.
 *
 *  The band after it answers the question the list provokes, which is
 *  "yes, but how does this start". Then one onward band for the readers
 *  who are on the wrong page entirely.
 * ------------------------------------------------------------------ */

const num = (i: number) => String(i + 1).padStart(2, "0");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return solutionsIndexMetadata(resolve(lang));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const d = getSolutions(locale).index;

  return (
    <main>
      <PageHero
        eyebrow={d.label}
        title={d.title}
        intro={d.intro}
        cta={{ label: d.cta.button, href: "/book-a-call" }}
      />

      {/* THE SIX. Quiet at rest: the whole row is the target and the name
          takes the ember underline only on hover, which is the one place
          the contrast colour is allowed to appear. */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              title={d.listTitle}
              intro={d.listIntro}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.06}>
            {d.items.map((item, i) => (
              <StaggerItem
                key={item.key}
                className="col-span-4 md:col-span-12"
              >
                <LocaleLink
                  href={`/solutions/${item.slug}`}
                  className="group block border-t border-rule py-8"
                >
                  <div className="pc-grid">
                    <p className="col-span-4 text-[0.875rem] text-moss md:col-span-1">
                      {num(i)}
                    </p>
                    <h2 className="col-span-4 text-heading-md text-ink md:col-span-5">
                      {/* The underline sits on an inline span so it ends
                          where the words do rather than at the column edge:
                          `pc-link` paints the full width of its own box. */}
                      <span className="pc-link group-hover:[background-size:100%_1px]">
                        {item.name}
                      </span>
                    </h2>
                    <p className="col-span-4 text-[1.125rem] leading-[1.375] text-moss md:col-span-6">
                      {item.teaser}
                    </p>
                  </div>
                </LocaleLink>
              </StaggerItem>
            ))}
            {/* Every rule belongs to the row below it, so the list needs one
                more to close. Structure, not content. */}
            <div
              aria-hidden="true"
              className="col-span-4 border-t border-rule md:col-span-12"
            />
          </Stagger>
        </div>
      </section>

      {/* HOW AN ENGAGEMENT STARTS. The dark plate. */}
      <section className="on-dark bg-ink py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-8">
              <h2 className="text-heading-lg text-white">{d.startTitle}</h2>
            </Reveal>
            <Reveal delay={0.05} className="col-span-4 md:col-span-8">
              <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-mist">
                {d.startIntro}
              </p>
            </Reveal>
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
            {d.start.map((step, i) => (
              <StaggerItem
                key={step.title}
                className="col-span-4 border-t border-rule-dark pt-8"
              >
                <span className="text-[0.875rem] text-sage">{num(i)}</span>
                <h3 className="mt-3 text-heading-sm text-white">{step.title}</h3>
                <p className="mt-4 text-[1.125rem] leading-[1.375] text-mist">
                  {step.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <OnwardBand title={d.elsewhereTitle} items={d.elsewhere} />

      <CtaBand
        locale={locale}
        title={d.cta.title}
        text={d.cta.text}
        cta={{ label: d.cta.button, href: "/book-a-call" }}
      />
      <Footer locale={locale} />
    </main>
  );
}
