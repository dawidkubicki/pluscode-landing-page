'use client';

import { useTranslations } from 'next-intl';
import ServicePageLayout from '@/components/shared/ServicePageLayout';

export default function AnalyticsPage() {
  const t = useTranslations('pages.services.analytics');

  const features = [
    {
      title: t('features.businessIntelligence.title'),
      description: t('features.businessIntelligence.description'),
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: t('features.dataVisualization.title'),
      description: t('features.dataVisualization.description'),
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
    {
      title: t('features.dataWarehousing.title'),
      description: t('features.dataWarehousing.description'),
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      title: t('features.realTimeAnalytics.title'),
      description: t('features.realTimeAnalytics.description'),
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: t('features.predictiveAnalytics.title'),
      description: t('features.predictiveAnalytics.description'),
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      title: t('features.dataGovernance.title'),
      description: t('features.dataGovernance.description'),
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: t('process.assessment.title'),
      description: t('process.assessment.description'),
    },
    {
      number: '02',
      title: t('process.architecture.title'),
      description: t('process.architecture.description'),
    },
    {
      number: '03',
      title: t('process.implementation.title'),
      description: t('process.implementation.description'),
    },
    {
      number: '04',
      title: t('process.optimization.title'),
      description: t('process.optimization.description'),
    },
  ];

  return (
    <ServicePageLayout
      label={t('label')}
      title={t('title')}
      subtitle={t('subtitle')}
      gradient="bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-white"
      features={features}
      processSteps={processSteps}
      ctaTitle={t('cta.title')}
      ctaSubtitle={t('cta.subtitle')}
      ctaButtonText={t('cta.button')}
    />
  );
}
