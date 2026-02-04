'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PageHeader } from '@/components/shared';

interface SitemapSection {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

export default function SitemapPage() {
  const t = useTranslations('pages.sitemap');

  const sections: SitemapSection[] = [
    {
      title: t('sections.main.title'),
      links: [
        { label: t('sections.main.links.home'), href: '/' },
        { label: t('sections.main.links.about'), href: '/about' },
        { label: t('sections.main.links.contact'), href: '/contact' },
      ],
    },
    {
      title: t('sections.aiData.title'),
      links: [
        { label: t('sections.aiData.links.machineLearning'), href: '/ai-data/machine-learning' },
        { label: t('sections.aiData.links.analytics'), href: '/ai-data/analytics' },
        { label: t('sections.aiData.links.consulting'), href: '/ai-data/consulting' },
      ],
    },
    {
      title: t('sections.services.title'),
      links: [
        { label: t('sections.services.links.webDevelopment'), href: '/services/web-development' },
        { label: t('sections.services.links.mobile'), href: '/services/mobile' },
        { label: t('sections.services.links.cloud'), href: '/services/cloud' },
      ],
    },
    {
      title: t('sections.industries.title'),
      links: [
        { label: t('sections.industries.links.finance'), href: '/industries/finance' },
        { label: t('sections.industries.links.healthcare'), href: '/industries/healthcare' },
        { label: t('sections.industries.links.ecommerce'), href: '/industries/ecommerce' },
        { label: t('sections.industries.links.hr'), href: '/industries/hr' },
        { label: t('sections.industries.links.logistics'), href: '/industries/logistics' },
        { label: t('sections.industries.links.ai'), href: '/industries/ai' },
        { label: t('sections.industries.links.saas'), href: '/industries/saas' },
        { label: t('sections.industries.links.manufacturing'), href: '/industries/manufacturing' },
      ],
    },
    {
      title: t('sections.content.title'),
      links: [
        { label: t('sections.content.links.caseStudies'), href: '/case-studies' },
        { label: t('sections.content.links.insights'), href: '/insights' },
      ],
    },
    {
      title: t('sections.legal.title'),
      links: [
        { label: t('sections.legal.links.privacy'), href: '/privacy-policy' },
        { label: t('sections.legal.links.terms'), href: '/terms-of-use' },
      ],
    },
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
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: sectionIndex * 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
              >
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
