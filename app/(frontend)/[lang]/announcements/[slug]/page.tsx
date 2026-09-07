import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { PageHero, CtaBand } from "../../components/page-hero";
import Footer from "../../components/footer";
import { Reveal } from "../../components/motion";
import LocaleLink from "../../components/locale-link";
import {
  isLocale,
  defaultLocale,
  localeDateTag,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAnnouncementPage } from "@/lib/announcement";
import { buildOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = resolve(lang);
  const data = await getAnnouncementPage(slug, locale);
  if (!data) return {};
  return {
    title: data.title,
    description: data.bannerText,
    alternates: { canonical: `/${locale}/announcements/${slug}` },
    openGraph: buildOpenGraph(locale, {
      title: data.title,
      description: data.bannerText,
      path: `/announcements/${slug}`,
      type: "article",
    }),
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function Rich({ data }: { data: unknown }) {
  return <RichText data={data as any} />;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default async function AnnouncementPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = resolve(lang);
  const data = await getAnnouncementPage(slug, locale);
  if (!data) notFound();

  const t = getDictionary(locale).pages.announcements;

  const date = data.publishedAt
    ? new Date(data.publishedAt).toLocaleDateString(localeDateTag[locale], {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main>
      <PageHero eyebrow={t.eyebrow} title={data.title} />

      <article className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            {/* The document runs in seven of twelve columns: a reading
                column on the grid, not a centred sheet. */}
            <div className="col-span-4 md:col-span-7">
              {date && (
                <Reveal>
                  <div className="mb-10 border-b border-rule pb-6 text-[0.875rem] text-moss">
                    {date}
                  </div>
                </Reveal>
              )}

              <Reveal>
                <div className="prose-pc">
                  {data.body ? <Rich data={data.body} /> : <p>{data.bannerText}</p>}
                </div>
              </Reveal>

              {/* The announcement itself is the offer, so the ask sits where the
                  reader finishes the text, not only in the CtaBand at the foot. */}
              <Reveal>
                <div className="mt-12 border-t border-rule pt-10">
                  <LocaleLink href={t.cta.href} className="btn btn-primary">
                    {t.cta.label}
                  </LocaleLink>
                </div>
              </Reveal>

              <div className="mt-12">
                <LocaleLink
                  href="/"
                  className="pc-link inline-block text-[1.125rem] text-moss"
                >
                  ← {t.back}
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </article>

      <CtaBand locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
