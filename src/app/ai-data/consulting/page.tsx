'use client';

import { useTranslations } from 'next-intl';
import ServicePageLayout from '@/components/shared/ServicePageLayout';

export default function ConsultingPage() {
  const t = useTranslations('pages.services.consulting');

  const features = [
    {
      title: t('features.strategy.title'),
      description: t('features.strategy.description'),
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: t('features.assessment.title'),
      description: t('features.assessment.description'),
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: t('features.implementation.title'),
      description: t('features.implementation.description'),
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      title: t('features.training.title'),
      description: t('features.training.description'),
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: t('features.governance.title'),
      description: t('features.governance.description'),
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      title: t('features.optimization.title'),
      description: t('features.optimization.description'),
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: t('process.discovery.title'),
      description: t('process.discovery.description'),
    },
    {
      number: '02',
      title: t('process.strategy.title'),
      description: t('process.strategy.description'),
    },
    {
      number: '03',
      title: t('process.execution.title'),
      description: t('process.execution.description'),
    },
    {
      number: '04',
      title: t('process.support.title'),
      description: t('process.support.description'),
    },
  ];

  return (
    <ServicePageLayout
      label={t('label')}
      title={t('title')}
      subtitle={t('subtitle')}
      breadcrumbLabel={t('breadcrumb')}
      breadcrumbParentLabel="AI & Data"
      breadcrumbParentHref="/ai-data/consulting"
      gradient="bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-white"
      features={features}
      processSteps={processSteps}
      ctaTitle={t('cta.title')}
      ctaSubtitle={t('cta.subtitle')}
      ctaButtonText={t('cta.button')}
    />
  );
}
