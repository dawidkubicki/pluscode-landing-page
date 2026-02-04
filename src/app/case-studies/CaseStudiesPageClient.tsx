'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PageHeader } from '@/components/shared';
import type { CaseStudyForList } from './page';

interface CaseStudiesPageClientProps {
  caseStudies: CaseStudyForList[];
  translations: {
    label: string;
    title: string;
    subtitle: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
  };
}

function CaseStudyCard({
  slug,
  logo,
  logoAlt,
  category,
  title,
  description,
  gradient,
  index,
  isInView,
}: {
  slug: string;
  logo: string;
  logoAlt: string;
  category: string;
  title: string;
  description: string;
  gradient: string;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <Link href={`/case-studies/${slug}`} className="group block">
        {/* Image Container */}
        <div className={`relative aspect-4/3 rounded-2xl overflow-hidden mb-6 ${gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Logo and Category Row */}
          <div className="flex items-center justify-between">
            <div className="h-6 relative">
              <Image
                src={logo}
                alt={logoAlt}
                width={80}
                height={24}
                className="h-6 w-auto object-contain"
              />
            </div>
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
              {category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 leading-tight tracking-tight group-hover:text-neutral-700 transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-neutral-500 text-sm md:text-[15px] leading-relaxed">
            {description}
          </p>

          {/* Read more indicator */}
          <div className="flex items-center gap-2 text-neutral-400 group-hover:text-neutral-900 transition-colors duration-300 pt-1">
            <span className="text-sm font-medium">View case study</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CaseStudiesPageClient({
  caseStudies,
  translations,
}: CaseStudiesPageClientProps) {
  const gridRef = useRef(null);
  const ctaRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <PageHeader
        label={translations.label}
        title={translations.title}
        subtitle={translations.subtitle}
      />

      {/* Case Studies Grid */}
      <section
        ref={gridRef}
        className="py-16 md:py-24 lg:py-32 px-6 sm:px-12 md:px-16 bg-white"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
            {caseStudies.map((study, index) => (
              <CaseStudyCard
                key={study.slug}
                slug={study.slug}
                logo={study.logo}
                logoAlt={study.logoAlt}
                category={study.category}
                title={study.title}
                description={study.excerpt}
                gradient={study.gradient}
                index={index}
                isInView={gridInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-neutral-50"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-neutral-900 leading-[1.1] tracking-tight mb-6"
          >
            {translations.ctaTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10"
          >
            {translations.ctaSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <Link
              href="/contact"
              className="
                inline-flex items-center gap-3 
                px-8 py-4 
                bg-black text-white 
                rounded-full 
                font-medium text-sm
                transition-all duration-300
                hover:bg-neutral-800 hover:shadow-xl hover:shadow-black/20
                hover:-translate-y-0.5
              "
            >
              {translations.ctaButton}
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
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
