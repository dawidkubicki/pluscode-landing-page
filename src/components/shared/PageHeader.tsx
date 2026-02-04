'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  gradient?: string;
  centered?: boolean;
}

export default function PageHeader({
  label,
  title,
  subtitle,
  gradient,
  centered = false,
}: PageHeaderProps) {
  return (
    <section
      className={`relative pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 px-6 sm:px-12 md:px-16 overflow-hidden ${
        gradient || 'bg-white'
      }`}
    >
      {/* Gradient overlay for visual interest */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 pointer-events-none" />
      )}

      <div
        className={`relative max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto ${
          centered ? 'text-center' : ''
        }`}
      >

        {/* Label */}
        {label && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4"
          >
            {label}
          </motion.p>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-neutral-900 leading-[1.1] tracking-tight ${
            centered ? '' : 'max-w-4xl'
          }`}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className={`mt-6 text-lg md:text-xl lg:text-2xl text-neutral-500 leading-relaxed ${
              centered ? 'max-w-3xl mx-auto' : 'max-w-2xl'
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
