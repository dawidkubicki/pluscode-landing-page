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

      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          {date && (
            <Reveal>
              <div className="mb-10 border-b border-cream-line pb-6 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute">
                {date}
              </div>
            </Reveal>
          )}

          <Reveal>
            <div className="prose-pc">
              {data.body ? <Rich data={data.body} /> : <p>{data.bannerText}</p>}
            </div>
          </Reveal>

          <div className="mt-12">
            <LocaleLink
              href="/"
              className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-lime transition-colors hover:text-ink"
            >
              ← {t.back}
            </LocaleLink>
          </div>
        </div>
      </article>

      <CtaBand locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
