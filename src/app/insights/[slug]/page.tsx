'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Breadcrumb } from '@/components/shared';

interface ArticleData {
  slug: string;
  translationKey: string;
  category: string;
  categoryKey: string;
  readTime: number;
  author: string;
  date: string;
  gradient: string;
}

const articlesData: Record<string, ArticleData> = {
  'ai-transforming-business': {
    slug: 'ai-transforming-business',
    translationKey: 'featured',
    category: 'AI & Machine Learning',
    categoryKey: 'ai',
    readTime: 8,
    author: 'Dawid Kubicki',
    date: '2025-01-15',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-50',
  },
  'scalable-microservices': {
    slug: 'scalable-microservices',
    translationKey: 'post1',
    category: 'Development',
    categoryKey: 'development',
    readTime: 6,
    author: 'Tech Team',
    date: '2025-01-10',
    gradient: 'bg-gradient-to-br from-blue-100 to-cyan-50',
  },
  'startup-to-scaleup': {
    slug: 'startup-to-scaleup',
    translationKey: 'post2',
    category: 'Business',
    categoryKey: 'business',
    readTime: 5,
    author: 'Dawid Kubicki',
    date: '2025-01-05',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-50',
  },
  'cloud-native-best-practices': {
    slug: 'cloud-native-best-practices',
    translationKey: 'post3',
    category: 'Technology',
    categoryKey: 'technology',
    readTime: 7,
    author: 'Tech Team',
    date: '2024-12-28',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-50',
  },
};

export default function InsightDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations('pages.insights.article');
  const insightsT = useTranslations('insights');

  const contentRef = useRef(null);
  const relatedRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 });
  const relatedInView = useInView(relatedRef, { once: true, amount: 0.2 });

  const article = articlesData[slug];

  if (!article) {
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

  const title = insightsT(`items.${article.translationKey}.title`);
  const excerpt = insightsT(`items.${article.translationKey}.excerpt`);
  const category = insightsT(`categories.${article.categoryKey}`);

  // Get related articles (exclude current)
  const relatedArticles = Object.values(articlesData)
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Article Header */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 lg:pt-48 lg:pb-20 px-6 sm:px-12 md:px-16">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: t('breadcrumbParent'), href: '/insights' },
                { label: title },
              ]}
            />
          </div>

          {/* Category & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              {category}
            </span>
            <span className="text-sm text-neutral-400">
              {insightsT('readTime', { minutes: article.readTime })}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.15] tracking-tight mb-6"
          >
            {title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg md:text-xl text-neutral-500 leading-relaxed mb-8"
          >
            {excerpt}
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
              <p className="text-sm font-medium text-neutral-900">{article.author}</p>
              <p className="text-sm text-neutral-400">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
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
            className={`aspect-video rounded-3xl ${article.gradient} flex items-center justify-center`}
          >
            <div className="w-20 h-20 rounded-2xl bg-white/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
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
          className="max-w-3xl mx-auto prose prose-lg prose-neutral"
        >
          {/* Placeholder content sections */}
          <p className="text-neutral-600 leading-relaxed">
            {t('content.intro')}
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 mt-12 mb-4">
            {t('content.section1.title')}
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            {t('content.section1.paragraph')}
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 mt-12 mb-4">
            {t('content.section2.title')}
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            {t('content.section2.paragraph')}
          </p>

          <h2 className="text-2xl font-semibold text-neutral-900 mt-12 mb-4">
            {t('content.section3.title')}
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            {t('content.section3.paragraph')}
          </p>

          <div className="mt-12 p-6 bg-neutral-50 rounded-2xl">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {t('content.keyTakeaways.title')}
            </h3>
            <ul className="space-y-2 text-neutral-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('content.keyTakeaways.item1')}
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('content.keyTakeaways.item2')}
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('content.keyTakeaways.item3')}
              </li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Related Articles */}
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
              {t('related.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related, index) => (
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
                    {insightsT(`categories.${related.categoryKey}`)}
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-900 leading-tight group-hover:text-neutral-700 transition-colors duration-300">
                    {insightsT(`items.${related.translationKey}.title`)}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
