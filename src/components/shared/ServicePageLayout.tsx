'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Navigation from '../Navigation';
import Footer from '../Footer';
import PageHeader from './PageHeader';

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface ServicePageLayoutProps {
  label: string;
  title: string;
  subtitle: string;
  gradient?: string;
  features: Feature[];
  processSteps: ProcessStep[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
}

export default function ServicePageLayout({
  label,
  title,
  subtitle,
  gradient = 'bg-gradient-to-br from-violet-50/50 via-white to-white',
  features,
  processSteps,
  ctaTitle,
  ctaSubtitle,
  ctaButtonText,
}: ServicePageLayoutProps) {
  const featuresRef = useRef(null);
  const processRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const processInView = useInView(processRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <PageHeader
        label={label}
        title={title}
        subtitle={subtitle}
        gradient={gradient}
      />

      {/* Features Section */}
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
              Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight max-w-2xl">
              What we offer
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="group p-6 md:p-8 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 transition-colors duration-300"
              >
                {feature.icon && (
                  <div className="w-12 h-12 mb-5 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                )}
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

      {/* Process Section */}
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
              Our Process
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight max-w-2xl">
              How we work
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="relative"
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

      {/* CTA Section */}
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
          >
            <Link
              href="/contact"
              className="
                inline-flex items-center gap-3 
                px-8 py-4 
                bg-white text-black 
                rounded-full 
                font-medium text-sm
                transition-all duration-300
                hover:bg-neutral-100 hover:shadow-xl hover:shadow-white/20
                hover:-translate-y-0.5
              "
            >
              {ctaButtonText}
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
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
