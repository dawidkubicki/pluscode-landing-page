'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PortableText } from '@/sanity/lib/portable-text';
import type { InsightDetailData, RelatedInsight } from './page';

interface InsightDetailClientProps {
  insight: InsightDetailData | null;
  relatedInsights: RelatedInsight[];
  translations: {
    relatedTitle: string;
    contentIntro: string;
    contentSection1Title: string;
    contentSection1Paragraph: string;
    contentSection2Title: string;
    contentSection2Paragraph: string;
    contentSection3Title: string;
    contentSection3Paragraph: string;
    keyTakeawaysTitle: string;
    keyTakeaways: string[];
  };
}

export default function InsightDetailClient({
  insight,
  relatedInsights,
  translations,
}: InsightDetailClientProps) {
  const contentRef = useRef(null);
  const relatedRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 });
  const relatedInView = useInView(relatedRef, { once: true, amount: 0.2 });

  if (!insight) {
    return (
      <main className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-40 pb-20 px-6 text-center">
          <h1 className="text-4xl font-semibold text-neutral-900 mb-4">Article not found</h1>
          <Link href="/insights" className="text-neutral-500 hover:text-neutral-700">
            Back to Insights
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const formattedDate = new Date(insight.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Article Header */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 lg:pt-48 lg:pb-20 px-6 sm:px-12 md:px-16">
        <div className="max-w-3xl mx-auto">
          {/* Category & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              {insight.category}
            </span>
            <span className="text-sm text-neutral-400">
              {insight.readTimeLabel}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.15] tracking-tight mb-6"
          >
            {insight.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg md:text-xl text-neutral-500 leading-relaxed mb-8"
          >
            {insight.excerpt}
          </motion.p>

          {/* Author & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex items-center gap-4 pb-8 border-b border-neutral-100"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">{insight.author}</p>
              <p className="text-sm text-neutral-400">{formattedDate}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-6 sm:px-12 md:px-16 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className={`relative aspect-video rounded-3xl overflow-hidden ${insight.gradient}`}
          >
            {insight.image ? (
              <Image
                src={insight.image}
                alt={insight.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-white/30 flex items-center justify-center">
                  <svg className="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section
        ref={contentRef}
        className="py-12 md:py-16 px-6 sm:px-12 md:px-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="max-w-3xl mx-auto"
        >
          {insight.useSanityContent && insight.content ? (
            <PortableText value={insight.content} />
          ) : (
            <div className="prose prose-lg prose-neutral">
              <p className="text-neutral-600 leading-relaxed">
                {translations.contentIntro}
              </p>

              <h2 className="text-2xl font-semibold text-neutral-900 mt-12 mb-4">
                {translations.contentSection1Title}
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                {translations.contentSection1Paragraph}
              </p>

              <h2 className="text-2xl font-semibold text-neutral-900 mt-12 mb-4">
                {translations.contentSection2Title}
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                {translations.contentSection2Paragraph}
              </p>

              <h2 className="text-2xl font-semibold text-neutral-900 mt-12 mb-4">
                {translations.contentSection3Title}
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                {translations.contentSection3Paragraph}
              </p>

              <div className="mt-12 p-6 bg-neutral-50 rounded-2xl">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {translations.keyTakeawaysTitle}
                </h3>
                <ul className="space-y-2 text-neutral-600">
                  {translations.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Related Articles */}
      {relatedInsights.length > 0 && (
        <section
          ref={relatedRef}
          className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-neutral-50"
        >
          <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={relatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
                {translations.relatedTitle}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedInsights.map((related, index) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 40 }}
                  animate={relatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                >
                  <Link href={`/insights/${related.slug}`} className="group block">
                    <div className={`aspect-4/3 rounded-2xl mb-4 ${related.gradient} flex items-center justify-center`}>
                      <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400 mb-2 block">
                      {related.category}
                    </span>
                    <h3 className="text-lg font-semibold text-neutral-900 leading-tight group-hover:text-neutral-700 transition-colors duration-300">
                      {related.title}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
