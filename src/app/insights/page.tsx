'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PageHeader, ContentCard } from '@/components/shared';

interface Article {
  slug: string;
  category: string;
  readTime: number;
  gradient: string;
  featured?: boolean;
}

export default function InsightsPage() {
  const t = useTranslations('pages.insights');
  const insightsT = useTranslations('insights');

  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  const articles: Article[] = [
    {
      slug: 'ai-transforming-business',
      category: insightsT('categories.ai'),
      readTime: 8,
      gradient: 'bg-gradient-to-br from-violet-100 to-purple-50',
      featured: true,
    },
    {
      slug: 'scalable-microservices',
      category: insightsT('categories.development'),
      readTime: 6,
      gradient: 'bg-gradient-to-br from-blue-100 to-cyan-50',
    },
    {
      slug: 'startup-to-scaleup',
      category: insightsT('categories.business'),
      readTime: 5,
      gradient: 'bg-gradient-to-br from-emerald-100 to-teal-50',
    },
    {
      slug: 'cloud-native-best-practices',
      category: insightsT('categories.technology'),
      readTime: 7,
      gradient: 'bg-gradient-to-br from-rose-100 to-pink-50',
    },
  ];

  const featuredArticle = articles.find((a) => a.featured);
  const regularArticles = articles.filter((a) => !a.featured);

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <PageHeader
        label={t('label')}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('breadcrumb') }]}
      />

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-8 md:py-12 px-6 sm:px-12 md:px-16 bg-white">
          <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Link href={`/insights/${featuredArticle.slug}`} className="group block">
                <div className={`relative aspect-video md:aspect-21/9 rounded-3xl overflow-hidden mb-6 ${featuredArticle.gradient}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/30 flex items-center justify-center">
                      <svg className="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
                    {featuredArticle.category}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {insightsT('readTime', { minutes: featuredArticle.readTime })}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-neutral-900 leading-tight tracking-tight group-hover:text-neutral-700 transition-colors duration-300 mb-4 max-w-3xl">
                  {insightsT('items.featured.title')}
                </h2>
                <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-3xl">
                  {insightsT('items.featured.excerpt')}
                </p>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section
        ref={gridRef}
        className="py-16 md:py-24 lg:py-32 px-6 sm:px-12 md:px-16 bg-white"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              {t('allArticles')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {regularArticles.map((article, index) => {
              const postKey = `post${index + 1}` as 'post1' | 'post2' | 'post3';
              return (
                <ContentCard
                  key={article.slug}
                  href={`/insights/${article.slug}`}
                  category={article.category}
                  title={insightsT(`items.${postKey}.title`)}
                  description={insightsT(`items.${postKey}.excerpt`)}
                  gradient={article.gradient}
                  metadata={insightsT('readTime', { minutes: article.readTime })}
                  index={index}
                  isInView={gridInView}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-neutral-50">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight mb-6">
              {t('newsletter.title')}
            </h2>
            <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10">
              {t('newsletter.subtitle')}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-6 py-4 rounded-full border border-neutral-200 focus:border-neutral-400 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-black text-white rounded-full font-medium text-sm transition-all duration-300 hover:bg-neutral-800"
              >
                {t('newsletter.button')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
