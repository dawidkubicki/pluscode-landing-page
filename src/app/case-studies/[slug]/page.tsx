'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PageHeader } from '@/components/shared';

interface CaseStudyData {
  slug: string;
  logo: string;
  logoAlt: string;
  gradient: string;
  heroGradient: string;
}

const caseStudiesData: Record<string, CaseStudyData> = {
  zabka: {
    slug: 'zabka',
    logo: '/assets/portfolio/zabka-logo.svg',
    logoAlt: 'Żabka',
    gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400',
    heroGradient: 'bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-white',
  },
  ubs: {
    slug: 'ubs',
    logo: '/assets/portfolio/ubs-logo.svg',
    logoAlt: 'UBS',
    gradient: 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white',
    heroGradient: 'bg-gradient-to-br from-neutral-100/50 via-neutral-50/30 to-white',
  },
};

export default function CaseStudyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations('pages.caseStudies.detail');
  const portfolioT = useTranslations('portfolio');

  const overviewRef = useRef(null);
  const challengeRef = useRef(null);
  const solutionRef = useRef(null);
  const resultsRef = useRef(null);
  const ctaRef = useRef(null);

  const overviewInView = useInView(overviewRef, { once: true, amount: 0.3 });
  const challengeInView = useInView(challengeRef, { once: true, amount: 0.3 });
  const solutionInView = useInView(solutionRef, { once: true, amount: 0.3 });
  const resultsInView = useInView(resultsRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  const caseStudy = caseStudiesData[slug];

  if (!caseStudy) {
    return (
      <main className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-40 pb-20 px-6 text-center">
          <h1 className="text-4xl font-semibold text-neutral-900 mb-4">Case study not found</h1>
          <Link href="/case-studies" className="text-neutral-500 hover:text-neutral-700">
            Back to case studies
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const category = portfolioT(`items.${slug}.category`);
  const title = portfolioT(`items.${slug}.title`);
  const description = portfolioT(`items.${slug}.description`);

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <PageHeader
        label={category}
        title={title}
        subtitle={description}
        breadcrumbs={[
          { label: t('breadcrumbParent'), href: '/case-studies' },
          { label: caseStudy.logoAlt },
        ]}
        gradient={caseStudy.heroGradient}
      />

      {/* Client Logo Section */}
      <section className="py-12 px-6 sm:px-12 md:px-16 bg-white border-b border-neutral-100">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
              {t('client')}
            </span>
            <Image
              src={caseStudy.logo}
              alt={caseStudy.logoAlt}
              width={100}
              height={30}
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section
        ref={overviewRef}
        className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-white"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={overviewInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
              {t('overview.label')}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight mb-8 max-w-3xl">
              {t('overview.title')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <p className="text-neutral-500 text-base md:text-lg leading-relaxed">
                  {t('overview.description')}
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400 mb-2">
                    {t('overview.industry')}
                  </p>
                  <p className="text-neutral-900 font-medium">{t('overview.industryValue')}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400 mb-2">
                    {t('overview.services')}
                  </p>
                  <p className="text-neutral-900 font-medium">{t('overview.servicesValue')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Challenge Section */}
      <section
        ref={challengeRef}
        className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-neutral-50"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={challengeInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
                {t('challenge.label')}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight mb-6">
                {t('challenge.title')}
              </h2>
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed">
                {t('challenge.description')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={challengeInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className={`aspect-4/3 rounded-3xl ${caseStudy.gradient} flex items-center justify-center`}
            >
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section
        ref={solutionRef}
        className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-white"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="mb-12 md:mb-16"
          >
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
              {t('solution.label')}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight mb-6 max-w-3xl">
              {t('solution.title')}
            </h2>
            <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-3xl">
              {t('solution.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((num, index) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 40 }}
                animate={solutionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="p-6 md:p-8 rounded-2xl bg-neutral-50"
              >
                <span className="text-5xl font-bold text-neutral-200 mb-4 block">0{num}</span>
                <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3">
                  {t(`solution.steps.step${num}.title`)}
                </h3>
                <p className="text-neutral-500 text-sm md:text-[15px] leading-relaxed">
                  {t(`solution.steps.step${num}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section
        ref={resultsRef}
        className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-black"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={resultsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/40 mb-4">
              {t('results.label')}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-tight">
              {t('results.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[1, 2, 3, 4].map((num, index) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 30 }}
                animate={resultsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {t(`results.metrics.metric${num}.value`)}
                </div>
                <div className="text-white/60 text-sm md:text-base">
                  {t(`results.metrics.metric${num}.label`)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-white"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-neutral-900 leading-[1.1] tracking-tight mb-6"
          >
            {t('cta.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10"
          >
            {t('cta.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="
                inline-flex items-center justify-center gap-3 
                px-8 py-4 
                bg-black text-white 
                rounded-full 
                font-medium text-sm
                transition-all duration-300
                hover:bg-neutral-800 hover:shadow-xl hover:shadow-black/20
                hover:-translate-y-0.5
              "
            >
              {t('cta.button')}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/case-studies"
              className="
                inline-flex items-center justify-center gap-3 
                px-8 py-4 
                bg-neutral-100 text-neutral-900 
                rounded-full 
                font-medium text-sm
                transition-all duration-300
                hover:bg-neutral-200
              "
            >
              {t('cta.viewAll')}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
