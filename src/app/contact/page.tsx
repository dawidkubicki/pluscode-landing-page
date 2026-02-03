'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { PageHeader } from '@/components/shared';

export default function ContactPage() {
  const t = useTranslations('pages.contact');
  const contactT = useTranslations('contact');

  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 });

  const faqs = [
    {
      question: t('faq.items.timeline.question'),
      answer: t('faq.items.timeline.answer'),
    },
    {
      question: t('faq.items.process.question'),
      answer: t('faq.items.process.answer'),
    },
    {
      question: t('faq.items.technologies.question'),
      answer: t('faq.items.technologies.answer'),
    },
    {
      question: t('faq.items.support.question'),
      answer: t('faq.items.support.answer'),
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <PageHeader
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
      />

      {/* Contact Form Section */}
      <Contact />

      {/* Map/Location Section */}
      <section className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-white">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
                {t('location.label')}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight mb-6">
                {t('location.title')}
              </h2>
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-8">
                {t('location.description')}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 mb-1">{t('location.address.title')}</p>
                    <p className="text-neutral-500 text-sm">{t('location.address.line1')}</p>
                    <p className="text-neutral-500 text-sm">{t('location.address.line2')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 mb-1">{t('location.hours.title')}</p>
                    <p className="text-neutral-500 text-sm">{t('location.hours.weekdays')}</p>
                    <p className="text-neutral-500 text-sm">{t('location.hours.timezone')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative aspect-square rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-50 overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <p className="text-neutral-400 text-sm">Map placeholder</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        ref={faqRef}
        className="py-20 md:py-28 lg:py-36 px-6 sm:px-12 md:px-16 bg-neutral-50"
      >
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
              {t('faq.label')}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-[1.1] tracking-tight">
              {t('faq.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="p-6 md:p-8 rounded-2xl bg-white"
              >
                <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
