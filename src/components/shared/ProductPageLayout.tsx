'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Navigation from '../Navigation';
import Footer from '../Footer';
import ProductVisual from '../products/ProductVisual';
import type { ProductMeta } from '../products/data';

interface Feature {
  title: string;
  description: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface ProductPageLayoutProps {
  product: ProductMeta;
  label: string;
  title: string;
  tagline: string;
  intro: string;
  builtByLabel: string;
  visitLabel: string;
  stats: Stat[];
  featuresLabel: string;
  featuresTitle: string;
  features: Feature[];
  processLabel: string;
  processTitle: string;
  processSteps: ProcessStep[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export default function ProductPageLayout({
  product,
  label,
  title,
  tagline,
  intro,
  builtByLabel,
  visitLabel,
  stats,
  featuresLabel,
  featuresTitle,
  features,
  processLabel,
  processTitle,
  processSteps,
  ctaTitle,
  ctaSubtitle,
  ctaPrimary,
  ctaSecondary,
}: ProductPageLayoutProps) {
  const featuresRef = useRef(null);
  const processRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const processInView = useInView(processRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero: copy + product visual side by side */}
      <section
        className={`relative pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-28 px-6 sm:px-12 md:px-16 overflow-hidden ${product.gradient}`}
      >
        <div className="relative max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400">
                {label}
              </span>
              <span className="h-px w-6 bg-neutral-300" />
              <span
                className={`text-[11px] font-medium tracking-[0.12em] uppercase ${product.accentText}`}
              >
                {builtByLabel}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 leading-[1.1] tracking-tight"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-5 text-lg md:text-xl lg:text-2xl text-neutral-600 leading-relaxed max-w-xl"
            >
              {tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-4 text-base text-neutral-500 leading-relaxed max-w-xl"
            >
              {intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-black text-white px-6 py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10"
              >
                {visitLabel}
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7m0 0H9m8 0v8" />
                </svg>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-medium text-neutral-900 ring-1 ring-inset ring-neutral-300 transition-all duration-300 hover:ring-neutral-900 hover:bg-white/60"
              >
                {ctaSecondary}
              </Link>
            </motion.div>
          </div>

          <ProductVisual variant={product.visual} />
        </div>
      </section>

      {/* Stat band */}
      <section className="px-6 sm:px-12 md:px-16 bg-white">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-3xl bg-neutral-200 ring-1 ring-neutral-200">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="bg-white px-6 py-8 md:px-8 md:py-10"
              >
                <dd className="text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-sm text-neutral-500 leading-snug">{stat.label}</dt>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* Capabilities */}
      <section
        ref={featuresRef}
        className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-white"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="mb-12 md:mb-16"
          >
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
              {featuresLabel}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight max-w-2xl">
              {featuresTitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="group p-6 md:p-8 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors duration-300"
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${product.accentBg} mb-5`}
                >
                  <svg
                    className={`h-4 w-4 ${product.accentText}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-sm md:text-[15px] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        ref={processRef}
        className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-neutral-50"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="mb-12 md:mb-16"
          >
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
              {processLabel}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight max-w-2xl">
              {processTitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <span className="text-6xl md:text-7xl font-bold text-neutral-200 mb-4 block">
                  {step.number}
                </span>
                <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-500 text-sm md:text-[15px] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section
        ref={ctaRef}
        className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-black"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-6"
          >
            {ctaTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            {ctaSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium text-sm transition-all duration-300 hover:bg-neutral-100 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5"
            >
              {ctaPrimary}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7m0 0H9m8 0v8" />
              </svg>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium text-sm text-white ring-1 ring-inset ring-white/25 transition-all duration-300 hover:ring-white/60"
            >
              {ctaSecondary}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
