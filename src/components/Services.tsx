'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Service card component with hover animations
function ServiceCard({ 
  title, 
  description, 
  tagline, 
  index, 
  variant = 'default',
  gradient,
  isInView
}: { 
  title: string; 
  description: string; 
  tagline: string;
  index: number;
  variant?: 'featured' | 'medium' | 'default';
  gradient: string;
  isInView: boolean;
}) {
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }
      }}
      className={`
        group relative overflow-hidden rounded-3xl bg-neutral-50 h-full
        transition-shadow duration-500 ease-out cursor-pointer
        hover:shadow-2xl hover:shadow-black/8
      `}
    >
      {/* Gradient overlay that appears on hover */}
      <div 
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-500 ease-out
          ${gradient}
        `}
      />
      
      {/* Subtle border */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/4 group-hover:ring-black/8 transition-all duration-300" />
      
      {/* Content */}
      <div className={`
        relative z-10 h-full flex flex-col justify-between
        ${isFeatured ? 'p-8 md:p-10 lg:p-12' : 'p-6 md:p-8'}
      `}>
        {/* Top section */}
        <div>
          {/* Tagline */}
          <span 
            className="
              inline-block text-[11px] font-medium tracking-[0.2em] uppercase
              text-neutral-400 group-hover:text-neutral-500
              transition-colors duration-300
              mb-4 md:mb-5
            "
          >
            {tagline}
          </span>
          
          {/* Title */}
          <h3 className={`
            font-semibold text-neutral-900 
            group-hover:text-neutral-800
            transition-colors duration-300
            ${isFeatured ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl md:text-2xl'}
            leading-[1.15] tracking-tight
          `}>
            {title}
          </h3>
        </div>
        
        {/* Bottom section */}
        <div className={`${isFeatured ? 'mt-auto pt-8 md:pt-12' : 'mt-6'}`}>
          <p className={`
            text-neutral-500 group-hover:text-neutral-600
            transition-colors duration-300 leading-relaxed
            ${isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-[15px]'}
          `}>
            {description}
          </p>
          
          {/* Animated arrow indicator */}
          <div 
            className="
              mt-6 flex items-center gap-2 text-neutral-400
              group-hover:text-neutral-900 transition-colors duration-300
            "
          >
            <span className="text-sm font-medium">Learn more</span>
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
      </div>

      {/* Decorative glow element */}
      <div className={`
        absolute -bottom-32 -right-32 w-64 h-64 rounded-full
        bg-linear-to-br from-neutral-200/30 to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-700 ease-out
        blur-3xl pointer-events-none
      `} />
    </motion.div>
  );
}

export default function Services() {
  const t = useTranslations('services');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const services = [
    {
      key: 'ai',
      variant: 'featured' as const,
      gradient: 'bg-linear-to-br from-violet-100/80 via-purple-50/50 to-transparent',
    },
    {
      key: 'web',
      variant: 'medium' as const,
      gradient: 'bg-linear-to-br from-blue-100/80 via-cyan-50/50 to-transparent',
    },
    {
      key: 'mobile',
      variant: 'default' as const,
      gradient: 'bg-linear-to-br from-rose-100/80 via-pink-50/50 to-transparent',
    },
    {
      key: 'cloud',
      variant: 'default' as const,
      gradient: 'bg-linear-to-br from-emerald-100/80 via-teal-50/50 to-transparent',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-white"
    >
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4"
          >
            Services
          </motion.p>
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
            className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {/* Featured AI Card - Takes 2 rows on larger screens */}
          <div className="lg:row-span-2 min-h-[320px] md:min-h-[400px]">
            <ServiceCard
              title={t('items.ai.title')}
              description={t('items.ai.description')}
              tagline={t('items.ai.tagline')}
              index={0}
              variant="featured"
              gradient={services[0].gradient}
              isInView={isInView}
            />
          </div>

          {/* Web Development - Spans 2 columns */}
          <div className="lg:col-span-2 min-h-[220px] md:min-h-[260px]">
            <ServiceCard
              title={t('items.web.title')}
              description={t('items.web.description')}
              tagline={t('items.web.tagline')}
              index={1}
              variant="medium"
              gradient={services[1].gradient}
              isInView={isInView}
            />
          </div>

          {/* Mobile Apps */}
          <div className="min-h-[220px] md:min-h-[260px]">
            <ServiceCard
              title={t('items.mobile.title')}
              description={t('items.mobile.description')}
              tagline={t('items.mobile.tagline')}
              index={2}
              variant="default"
              gradient={services[2].gradient}
              isInView={isInView}
            />
          </div>

          {/* Cloud Solutions */}
          <div className="min-h-[220px] md:min-h-[260px]">
            <ServiceCard
              title={t('items.cloud.title')}
              description={t('items.cloud.description')}
              tagline={t('items.cloud.tagline')}
              index={3}
              variant="default"
              gradient={services[3].gradient}
              isInView={isInView}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
