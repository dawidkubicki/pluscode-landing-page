'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';

interface CaseStudy {
  key: string;
  image: string;
  logo: string;
  logoAlt: string;
  gradient: string;
}

function CaseStudyCard({
  image,
  logo,
  logoAlt,
  category,
  title,
  description,
  index,
  isInView,
  gradient,
}: {
  image: string;
  logo: string;
  logoAlt: string;
  category: string;
  title: string;
  description: string;
  index: number;
  isInView: boolean;
  gradient: string;
}) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.7,
        delay: index * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group cursor-pointer"
    >
      {/* Image Container */}
      <div className={`relative aspect-4/3 rounded-2xl overflow-hidden mb-6 ${gradient}`}>
        {!imageError ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white/60 text-sm font-medium">Case Study Image</p>
            </div>
          </div>
        )}
        {/* Subtle overlay on hover */}
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
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const t = useTranslations('portfolio');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const caseStudies: CaseStudy[] = [
    {
      key: 'zabka',
      image: '/assets/portfolio/zabka-case-study.jpg',
      logo: '/assets/portfolio/zabka-logo.svg',
      logoAlt: 'Żabka',
      gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400',
    },
    {
      key: 'ubs',
      image: '/assets/portfolio/ubs-case-study.jpg',
      logo: '/assets/portfolio/ubs-logo.svg',
      logoAlt: 'UBS',
      gradient: 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-white"
    >
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4"
          >
            {t('label')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 max-w-4xl leading-[1.1] tracking-tight"
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

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={study.key}
              image={study.image}
              logo={study.logo}
              logoAlt={study.logoAlt}
              category={t(`items.${study.key}.category`)}
              title={t(`items.${study.key}.title`)}
              description={t(`items.${study.key}.description`)}
              index={index}
              isInView={isInView}
              gradient={study.gradient}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="mt-16 md:mt-20 flex justify-center"
        >
          <a
            href="/case-studies"
            className="
              group inline-flex items-center gap-3 
              px-8 py-4 
              bg-neutral-900 text-white 
              rounded-full 
              font-medium text-sm
              transition-all duration-300
              hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20
              hover:-translate-y-0.5
            "
          >
            {t('cta')}
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
          </a>
        </motion.div>
      </div>
    </section>
  );
}
