import type { Metadata } from "next";
import CompanyFacts from "../components/company-facts";
import JsonLd from "../components/json-ld";
import PageHero from "../components/page-hero";
import People from "../components/people";
import { ArrowLink, Container, Label, Paragraphs } from "../components/ui";
import { resolveLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAboutPage } from "@/lib/pages";
import { getPeople } from "@/lib/people";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbLd, personLd, webPageLd } from "@/lib/structured-data";

export const revalidate = 60;

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const about = await getAboutPage(locale);
  return pageMetadata(locale, {
    path: "/about",
    title: about.seoTitle,
    description: about.seoDescription,
  });
}

/* A label in the left third and its content in the right two thirds, under
   one hairline. The story, the principles and the company details all sit in
   it, so the page reads as one ruled sheet. */
const RULED = "grid gap-x-8 gap-y-6 border-t border-grey-mid pt-8 lg:grid-cols-12";
const RULED_LABEL = "lg:col-span-4";
const RULED_BODY = "lg:col-span-8";

export default async function AboutPage({ params }: { params: Params }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const [about, people] = await Promise.all([getAboutPage(locale), getPeople(locale)]);

  const principles = about.principles.filter((p) => p.title || p.text);

  return (
    <main id="main">
      <PageHero size="tall" image="about" locale={locale} title={about.heading} />

      <section className="pc-section">
        <Container>
          <Paragraphs text={about.intro} className="max-w-[46rem] space-y-[1em] text-title" />
        </Container>
      </section>

      <Container className="flex flex-col gap-[clamp(4rem,9vw,7.5rem)]">
        <section className={RULED}>
          {/* The nudge sets the label on the baseline of the larger copy beside it. */}
          <Label as="h2" className={`${RULED_LABEL} lg:pt-1`}>
            {about.storyLabel}
          </Label>
          <Paragraphs
            text={about.storyBody}
            className={`${RULED_BODY} max-w-[40rem] space-y-[1em] text-lead`}
          />
        </section>

        {principles.length > 0 && (
          <section className={RULED}>
            <Label as="h2" className={RULED_LABEL}>
              {about.principlesLabel}
            </Label>
            <ol className={`${RULED_BODY} -mt-5`}>
              {principles.map((p, i) => (
                <li
                  key={i}
                  className="grid gap-x-8 gap-y-2 border-b border-grey-mid py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
                >
                  <h3 className="text-lead font-medium">{p.title}</h3>
                  <p className="text-grey">{p.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </Container>

      <People people={people} heading={dict.ui.people} ui={dict.ui} />

      <Container className="pb-[clamp(4rem,9vw,7.5rem)]">
        <section className={RULED}>
          <Label as="h2" className={RULED_LABEL}>
            {dict.ui.company}
          </Label>
          <div className={RULED_BODY}>
            <CompanyFacts labels={dict.company} className="-mt-4 border-t-0" />
            <ArrowLink href="/contact" className="mt-10">
              {dict.ui.contactUs}
            </ArrowLink>
          </div>
        </section>
      </Container>

      <JsonLd
        data={[
          webPageLd(locale, {
            path: "/about",
            name: about.seoTitle || about.heading,
            description: about.seoDescription,
            type: "AboutPage",
          }),
          ...people.map(personLd),
          breadcrumbLd(locale, [
            { name: dict.nav.home, path: "" },
            { name: about.heading, path: "/about" },
          ]),
        ]}
      />
    </main>
  );
}
