'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function Testimonial() {
  const t = useTranslations('testimonial');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-gradient-to-b from-neutral-50 to-white"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative"
        >
          {/* Large decorative quote mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute -top-8 -left-4 md:-top-12 md:-left-8"
          >
            <svg
              className="w-16 h-16 md:w-24 md:h-24 text-purple-200"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
            </svg>
          </motion.div>

          {/* Main content card */}
          <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-[0_4px_60px_-12px_rgba(0,0,0,0.08)] border border-neutral-100">
            {/* Quote text */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-lg md:text-xl lg:text-2xl font-normal text-neutral-800 leading-relaxed tracking-tight mb-10 md:mb-12"
            >
              {t('quote')}
            </motion.blockquote>

            {/* Author section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex items-center gap-5"
            >
              {/* Profile image with gradient border */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-neutral-900 via-neutral-600 to-neutral-400 rounded-full opacity-20 blur-sm" />
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-2 ring-white">
                  <Image
                    src="/assets/testimonial/ceo-avatar.jpg"
                    alt={t('name')}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add('bg-gradient-to-br', 'from-neutral-800', 'to-neutral-600', 'flex', 'items-center', 'justify-center');
                        const initials = document.createElement('span');
                        initials.className = 'text-white font-semibold text-lg';
                        initials.textContent = 'DK';
                        parent.appendChild(initials);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Name and title */}
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-semibold text-neutral-900 tracking-tight">
                  {t('name')}
                </span>
                <span className="text-sm md:text-base text-neutral-500 font-medium">
                  {t('title')}
                </span>
              </div>

              {/* Decorative line */}
              <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-neutral-200 to-transparent ml-6" />
            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-full -z-10"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-neutral-200/50 to-transparent rounded-full -z-10 blur-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
