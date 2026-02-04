'use client';

import { useTranslations } from 'next-intl';
import { useParams, notFound } from 'next/navigation';
import IndustryPageLayout from '@/components/shared/IndustryPageLayout';

// Valid industry slugs
const validIndustries = [
  'finance',
  'healthcare',
  'ecommerce',
  'hr',
  'logistics',
  'ai',
  'saas',
  'manufacturing',
];

// Industry-specific gradient colors
const industryGradients: Record<string, string> = {
  finance: 'bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-white',
  healthcare: 'bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-white',
  ecommerce: 'bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-white',
  hr: 'bg-gradient-to-br from-purple-50/50 via-violet-50/30 to-white',
  logistics: 'bg-gradient-to-br from-slate-50/50 via-gray-50/30 to-white',
  ai: 'bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white',
  saas: 'bg-gradient-to-br from-pink-50/50 via-rose-50/30 to-white',
  manufacturing: 'bg-gradient-to-br from-yellow-50/50 via-orange-50/30 to-white',
};

// Icon components for challenges
function ChallengeIcon({ type }: { type: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    security: (
      <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    compliance: (
      <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    legacy: (
      <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    data: (
      <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    scale: (
      <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    efficiency: (
      <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    integration: (
      <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    talent: (
      <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  return iconMap[type] || iconMap.data;
}

// Icon components for solutions
function SolutionIcon({ type }: { type: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    ai: (
      <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    web: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    mobile: (
      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    cloud: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  };

  return iconMap[type] || iconMap.ai;
}

export default function IndustryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations('pages.industries');

  // Validate the slug
  if (!validIndustries.includes(slug)) {
    notFound();
  }

  // Get challenge icon types for each industry
  const challengeIconTypes: Record<string, string[]> = {
    finance: ['security', 'compliance', 'legacy', 'data'],
    healthcare: ['data', 'compliance', 'integration', 'security'],
    ecommerce: ['scale', 'data', 'integration', 'efficiency'],
    hr: ['talent', 'efficiency', 'data', 'integration'],
    logistics: ['efficiency', 'data', 'scale', 'integration'],
    ai: ['data', 'talent', 'scale', 'integration'],
    saas: ['scale', 'efficiency', 'security', 'data'],
    manufacturing: ['legacy', 'efficiency', 'data', 'integration'],
  };

  // Build challenges array
  const challenges = [];
  for (let i = 1; i <= 4; i++) {
    challenges.push({
      title: t(`${slug}.challenges.challenge${i}.title`),
      description: t(`${slug}.challenges.challenge${i}.description`),
      icon: <ChallengeIcon type={challengeIconTypes[slug]?.[i - 1] || 'data'} />,
    });
  }

  // Build solutions array with links to service pages
  const solutionLinks: Record<string, string> = {
    ai: '/ai-data/machine-learning',
    web: '/services/web-development',
    mobile: '/services/mobile',
    cloud: '/services/cloud',
  };

  const solutionTypes = ['ai', 'web', 'mobile', 'cloud'];
  const solutions = solutionTypes.map((type) => ({
    title: t(`${slug}.solutions.${type}.title`),
    description: t(`${slug}.solutions.${type}.description`),
    link: solutionLinks[type],
    icon: <SolutionIcon type={type} />,
  }));

  // Build use cases array
  const useCases = [];
  for (let i = 1; i <= 3; i++) {
    useCases.push({
      title: t(`${slug}.useCases.case${i}.title`),
      description: t(`${slug}.useCases.case${i}.description`),
    });
  }

  return (
    <IndustryPageLayout
      label={t(`${slug}.label`)}
      title={t(`${slug}.title`)}
      subtitle={t(`${slug}.subtitle`)}
      gradient={industryGradients[slug]}
      challenges={challenges}
      challengesTitle={t('shared.challengesTitle')}
      challengesSubtitle={t('shared.challengesSubtitle')}
      solutions={solutions}
      solutionsTitle={t('shared.solutionsTitle')}
      solutionsSubtitle={t('shared.solutionsSubtitle')}
      useCases={useCases}
      useCasesTitle={t('shared.useCasesTitle')}
      useCasesSubtitle={t('shared.useCasesSubtitle')}
      ctaTitle={t(`${slug}.cta.title`)}
      ctaSubtitle={t(`${slug}.cta.subtitle`)}
      ctaButtonText={t(`${slug}.cta.button`)}
    />
  );
}
