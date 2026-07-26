'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PageHeader } from '@/components/shared';
import ProductVisual from '@/components/products/ProductVisual';
import { PRODUCTS, type ProductMeta } from '@/components/products/data';

interface Stat {
  value: string;
  label: string;
}

function ProductCard({ product, index }: { product: ProductMeta; index: number }) {
  const shared = useTranslations('products');
  const t = useTranslations('pages.products');
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const stats = shared.raw(`items.${product.key}.stats`) as Stat[];
  const features = shared.raw(`items.${product.key}.features`) as string[];

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className="overflow-hidden rounded-3xl bg-neutral-50 ring-1 ring-inset ring-black/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className={`p-8 md:p-10 lg:p-12 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400">
              {shared(`items.${product.key}.category`)}
            </span>
            <span className="h-px w-6 bg-neutral-200" />
            <span
              className={`text-[11px] font-medium tracking-[0.12em] uppercase ${product.accentText}`}
            >
              {shared('builtBy')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 leading-[1.1] tracking-tight">
            {shared(`items.${product.key}.name`)}
          </h2>
          <p className="mt-4 text-lg text-neutral-700 leading-relaxed">
            {shared(`items.${product.key}.tagline`)}
          </p>
          <p className="mt-3 text-[15px] text-neutral-500 leading-relaxed">
            {shared(`items.${product.key}.description`)}
          </p>

          <ul className="mt-6 space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${product.accentBg}`}
                >
                  <svg
                    className={`h-3 w-3 ${product.accentText}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-[15px] text-neutral-600 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-7 grid grid-cols-3 gap-5 border-t border-neutral-200 pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-lg md:text-xl font-semibold text-neutral-900 tracking-tight">
                  {stat.value}
                </dd>
                <p className="mt-1 text-xs text-neutral-500 leading-snug">{stat.label}</p>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-sm font-medium tracking-wide transition-all duration-300 hover:bg-neutral-800"
            >
              {t('viewProduct')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium text-neutral-900 ring-1 ring-inset ring-neutral-200 transition-all duration-300 hover:ring-neutral-900"
            >
              {product.domain}
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7m0 0H9m8 0v8" />
              </svg>
            </a>
          </div>
        </div>

        <div
          className={`p-6 md:p-8 lg:p-10 flex items-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}
        >
          <ProductVisual variant={product.visual} isInView={isInView} />
        </div>
      </div>
    </motion.article>
  );
}

export default function ProductsPage() {
  const t = useTranslations('pages.products');
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      <PageHeader
        label={t('label')}
        title={t('title')}
        subtitle={t('subtitle')}
        gradient="bg-gradient-to-br from-violet-50/50 via-emerald-50/20 to-white"
      />

      <section className="pb-16 md:pb-20 lg:pb-24 px-6 sm:px-12 md:px-16 bg-white">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-10 md:space-y-14">
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.key} product={product} index={index} />
          ))}
        </div>
      </section>

      {/* Build-with-us CTA */}
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
            {t('cta.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            {t('cta.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium text-sm transition-all duration-300 hover:bg-neutral-100 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5"
            >
              {t('cta.button')}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
