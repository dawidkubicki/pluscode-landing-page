'use client';

import { useTranslations } from 'next-intl';
import ServicePageLayout from '@/components/shared/ServicePageLayout';

export default function MachineLearningPage() {
  const t = useTranslations('pages.services.machineLearning');

  const features = [
    {
      title: t('features.predictive.title'),
      description: t('features.predictive.description'),
      icon: (
        <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: t('features.nlp.title'),
      description: t('features.nlp.description'),
      icon: (
        <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: t('features.computerVision.title'),
      description: t('features.computerVision.description'),
      icon: (
        <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: t('features.deepLearning.title'),
      description: t('features.deepLearning.description'),
      icon: (
        <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: t('features.mlOps.title'),
      description: t('features.mlOps.description'),
      icon: (
        <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: t('features.customModels.title'),
      description: t('features.customModels.description'),
      icon: (
        <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
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
      title: t('process.dataPrep.title'),
      description: t('process.dataPrep.description'),
    },
    {
      number: '03',
      title: t('process.development.title'),
      description: t('process.development.description'),
    },
    {
      number: '04',
      title: t('process.deployment.title'),
      description: t('process.deployment.description'),
    },
  ];

  return (
    <ServicePageLayout
      label={t('label')}
      title={t('title')}
      subtitle={t('subtitle')}
      gradient="bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-white"
      features={features}
      processSteps={processSteps}
      ctaTitle={t('cta.title')}
      ctaSubtitle={t('cta.subtitle')}
      ctaButtonText={t('cta.button')}
    />
  );
}
