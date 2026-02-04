'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PageHeader } from '@/components/shared';

export default function PrivacyPolicyPage() {
  const t = useTranslations('pages.legal.privacy');

  const sections = [
    'introduction',
    'dataCollection',
    'dataUsage',
    'dataSecurity',
    'cookies',
    'thirdParty',
    'rights',
    'contact',
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Content */}
      <section className="py-16 md:py-24 lg:py-32 px-6 sm:px-12 md:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Last Updated */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-sm text-neutral-400 mb-12"
          >
            {t('lastUpdated')}
          </motion.p>

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="mb-16 p-6 bg-neutral-50 rounded-2xl"
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              {t('tableOfContents')}
            </h2>
            <nav className="space-y-2">
              {sections.map((section, index) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className="block text-neutral-600 hover:text-neutral-900 transition-colors duration-200 text-sm"
                >
                  {index + 1}. {t(`sections.${section}.title`)}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section}
                id={section}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.05,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="scroll-mt-32"
              >
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                  {index + 1}. {t(`sections.${section}.title`)}
                </h2>
                <div className="text-neutral-600 leading-relaxed space-y-4">
                  <p>{t(`sections.${section}.content`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
