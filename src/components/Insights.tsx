'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface InsightForList {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  featured: boolean;
  gradient: string;
  image?: string;
}

interface InsightsProps {
  featured: InsightForList | null;
  posts: InsightForList[];
  translations: {
    label: string;
    title: string;
    subtitle: string;
    readMore: string;
    minRead: string;
    cta: string;
    categories: Record<string, string>;
  };
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  ai: { bg: 'bg-violet-100', text: 'text-violet-700' },
  development: { bg: 'bg-blue-100', text: 'text-blue-700' },
  business: { bg: 'bg-amber-100', text: 'text-amber-700' },
  technology: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  cloud: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  mobile: { bg: 'bg-orange-100', text: 'text-orange-700' },
};

function InsightCard({
  post,
  index,
  isInView,
  featured = false,
  translations,
}: {
  post: InsightForList;
  index: number;
  isInView: boolean;
  featured?: boolean;
  translations: InsightsProps['translations'];
}) {
  const [imageError, setImageError] = useState(false);
  const colors = categoryColors[post.category] || categoryColors.technology;
  const categoryLabel = translations.categories[post.category] || post.category;

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.25, 0.4, 0.25, 1],
        }}
        className="group cursor-pointer col-span-full lg:col-span-2"
      >
        <Link href={`/insights/${post.slug}`}>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 bg-neutral-50 rounded-3xl overflow-hidden hover:bg-neutral-100/80 transition-colors duration-500">
            {/* Featured Image */}
            <div className={`relative aspect-4/3 lg:aspect-auto lg:min-h-[400px] overflow-hidden ${!post.image ? post.gradient : ''}`}>
              {post.image && !imageError ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/40 flex items-center justify-center">
                      <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-neutral-500 text-sm font-medium">Featured Article</p>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Content */}
            <div className="p-6 lg:p-10 lg:py-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                  {categoryLabel}
                </span>
                <span className="text-neutral-400 text-sm">{post.readTime} {translations.minRead}</span>
              </div>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-neutral-900 leading-tight tracking-tight mb-4 group-hover:text-neutral-700 transition-colors duration-300">
                {post.title}
              </h3>

              <p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-6">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-2 text-neutral-900 font-medium group/link">
                <span className="group-hover/link:underline">{translations.readMore}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.7,
        delay: 0.2 + index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group cursor-pointer"
    >
      <Link href={`/insights/${post.slug}`}>
        {/* Image */}
        <div className={`relative aspect-16/10 rounded-2xl overflow-hidden mb-5 ${!post.image ? post.gradient : 'bg-neutral-100'}`}>
          {post.image && !imageError ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={85}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-lg bg-white/60 flex items-center justify-center">
                <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${colors.bg} ${colors.text}`}>
              {categoryLabel}
            </span>
            <span className="text-neutral-400 text-xs">{post.readTime} {translations.minRead}</span>
          </div>

          <h3 className="text-lg md:text-xl font-semibold text-neutral-900 leading-snug tracking-tight group-hover:text-neutral-700 transition-colors duration-300">
            {post.title}
          </h3>

          <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Insights({ featured, posts, translations }: InsightsProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-white"
    >
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4"
            >
              {translations.label}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 leading-[1.1] tracking-tight"
            >
              {translations.title}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <Link
              href="/insights"
              className="hidden md:inline-flex group items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors shrink-0"
            >
              {translations.cta}
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

        {/* Featured Post */}
        {featured && (
          <div className="md:mb-14">
            <InsightCard
              post={featured}
              index={0}
              isInView={isInView}
              featured
              translations={translations}
            />
          </div>
        )}

        {/* Regular Posts Grid - Hidden on mobile */}
        {posts.length > 0 && (
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-10">
            {posts.map((post, index) => (
              <InsightCard
                key={post.slug}
                post={post}
                index={index}
                isInView={isInView}
                translations={translations}
              />
            ))}
          </div>
        )}

        {/* Mobile CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="mt-8 md:hidden"
        >
          <Link
            href="/insights"
            className="
              group flex items-center justify-center gap-3 w-full
              px-6 py-4
              bg-neutral-900 text-white
              rounded-full
              font-medium text-sm
              transition-all duration-300
              hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20
              active:scale-[0.98]
            "
          >
            {translations.cta}
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
  );
}
