'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import ProductVisual from './products/ProductVisual';
import { PRODUCTS, type ProductMeta } from './products/data';

interface ProductStat {
  value: string;
  label: string;
}

function ProductRow({
  product,
  reversed,
}: {
  product: ProductMeta;
  reversed: boolean;
}) {
  const t = useTranslations('products');
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, amount: 0.25 });

  const features = t.raw(`items.${product.key}.features`) as string[];
  const stats = t.raw(`items.${product.key}.stats`) as ProductStat[];

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center"
    >
      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
        className={reversed ? 'lg:order-2' : ''}
      >
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400">
            {t(`items.${product.key}.category`)}
          </span>
          <span className="h-px w-6 bg-neutral-200" />
          <span
            className={`text-[11px] font-medium tracking-[0.12em] uppercase ${product.accentText}`}
          >
            {t('builtBy')}
          </span>
        </div>

        <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight">
          {t(`items.${product.key}.name`)}
        </h3>
        <p className="mt-4 text-lg md:text-xl text-neutral-700 leading-relaxed max-w-xl">
          {t(`items.${product.key}.tagline`)}
        </p>
        <p className="mt-3 text-base text-neutral-500 leading-relaxed max-w-xl">
          {t(`items.${product.key}.description`)}
        </p>

        {/* Capabilities */}
        <ul className="mt-7 space-y-3">
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

        {/* Proof points */}
        <dl className="mt-8 grid grid-cols-3 gap-5 border-t border-neutral-200 pt-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">
                {stat.value}
              </dd>
              <p className="mt-1 text-xs text-neutral-500 leading-snug">{stat.label}</p>
            </div>
          ))}
        </dl>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-sm font-medium tracking-wide transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10"
          >
            {t('learnMore')}
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
      </motion.div>

      {/* Visual */}
      <div className={reversed ? 'lg:order-1' : ''}>
        <ProductVisual variant={product.visual} isInView={isInView} />
      </div>
    </div>
  );
}

export default function Products() {
  const t = useTranslations('products');
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-neutral-50">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-16 md:mb-20 lg:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4"
          >
            {t('label')}
          </motion.p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 max-w-3xl leading-[1.1] tracking-tight"
              >
                {t('title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                className="mt-3 text-lg md:text-xl text-neutral-500 max-w-2xl leading-relaxed"
              >
                {t('subtitle')}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-900 whitespace-nowrap"
              >
                {t('cta')}
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
        </div>

        {/* Product rows */}
        <div className="space-y-20 md:space-y-28 lg:space-y-36">
          {PRODUCTS.map((product, index) => (
            <ProductRow key={product.key} product={product} reversed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
