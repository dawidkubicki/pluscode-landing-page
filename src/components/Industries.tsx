'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';

function IndustryItem({ 
  name, 
  slug,
  index, 
  isInView 
}: { 
  name: string; 
  slug: string;
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link href={`/industries/${slug}`}>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{
          duration: 0.6,
          delay: 0.3 + index * 0.1,
          ease: [0.25, 0.4, 0.25, 1],
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group border-t border-neutral-700/50 py-6 md:py-8 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-6 md:gap-10">
          <div className="flex items-center gap-6 md:gap-10">
            {/* Number */}
            <span className="text-sm text-neutral-600 font-medium w-4 tabular-nums">
              {index + 1}
            </span>
            
            {/* Industry Name */}
            <h3 
              className={`
                text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light tracking-tight italic
                transition-colors duration-300
                ${isHovered ? 'text-white' : 'text-neutral-500'}
              `}
            >
              {name}
            </h3>
          </div>
          
          {/* Arrow indicator */}
          <svg 
            className={`
              w-5 h-5 md:w-6 md:h-6 transition-all duration-300 -rotate-45
              ${isHovered ? 'text-white translate-x-1 -translate-y-1' : 'text-neutral-600'}
            `}
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
      </motion.div>
    </Link>
  );
}

export default function Industries() {
  const t = useTranslations('industries');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const industries = [
    'finance',
    'healthcare',
    'ecommerce',
    'hr',
    'logistics',
    'ai',
    'saas',
    'manufacturing',
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-neutral-900"
    >
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white max-w-md leading-[1.1] tracking-tight"
            >
              {t('title')}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-6 text-lg text-neutral-400 max-w-sm leading-relaxed"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-10"
            >
              <a 
                href="#contact"
                className="
                  group inline-flex items-center gap-2 px-6 py-3.5
                  bg-white text-neutral-900 rounded-full
                  text-sm font-medium
                  transition-all duration-300
                  hover:bg-neutral-100 hover:gap-3
                "
              >
                {t('cta')}
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 -rotate-45"
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
              </a>
            </motion.div>
          </div>

          {/* Right Column - Industries List */}
          <div className="space-y-0">
            {industries.map((industry, index) => (
              <IndustryItem
                key={industry}
                name={t(`items.${industry}`)}
                slug={industry}
                index={index}
                isInView={isInView}
              />
            ))}
            {/* Bottom border for last item */}
            <div className="border-t border-neutral-700/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
