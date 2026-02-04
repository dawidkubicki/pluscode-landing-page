import { getTranslations } from 'next-intl/server';
import { getCaseStudy, getCaseStudySlugs, type CaseStudyFull } from '@/sanity/queries/caseStudies';
import { urlFor } from '@/sanity/client';
import { getLocale } from '@/sanity/lib/getLocale';
import CaseStudyDetailClient from './CaseStudyDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fallback data when Sanity is not configured
const fallbackCaseStudiesData: Record<string, {
  logo: string;
  logoAlt: string;
  gradient: string;
  heroGradient: string;
}> = {
  zabka: {
    logo: '/assets/portfolio/zabka-logo.svg',
    logoAlt: 'Żabka',
    gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400',
    heroGradient: 'bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-white',
  },
  ubs: {
    logo: '/assets/portfolio/ubs-logo.svg',
    logoAlt: 'UBS',
    gradient: 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white',
    heroGradient: 'bg-gradient-to-br from-neutral-100/50 via-neutral-50/30 to-white',
  },
};

export interface CaseStudyDetailData {
  slug: string;
  title: string;
  category: string;
  description: string;
  logo: string;
  logoAlt: string;
  gradient: string;
  heroGradient: string;
  overview: any[] | null;
  challenge: any[] | null;
  solution: any[] | null;
  results: any[] | null;
  stats: Array<{ value: string; label: string }> | null;
  useSanityContent: boolean;
}

async function getCaseStudyData(slug: string, locale: string): Promise<CaseStudyDetailData | null> {
  try {
    const sanityCaseStudy = await getCaseStudy(slug, locale);
    
    if (sanityCaseStudy) {
      return {
        slug: sanityCaseStudy.slug,
        title: sanityCaseStudy.title || '',
        category: sanityCaseStudy.category || '',
        description: sanityCaseStudy.excerpt || '',
        logo: sanityCaseStudy.logo?.asset?._ref ? urlFor(sanityCaseStudy.logo).url() : '/assets/portfolio/placeholder-logo.svg',
        logoAlt: sanityCaseStudy.logo?.alt || sanityCaseStudy.title || '',
        gradient: sanityCaseStudy.gradient || 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white',
        heroGradient: sanityCaseStudy.heroGradient || 'bg-gradient-to-br from-neutral-100/50 via-neutral-50/30 to-white',
        overview: sanityCaseStudy.overview || null,
        challenge: sanityCaseStudy.challenge || null,
        solution: sanityCaseStudy.solution || null,
        results: sanityCaseStudy.results || null,
        stats: sanityCaseStudy.stats || null,
        useSanityContent: true,
      };
    }
  } catch (error) {
    console.log('Sanity fetch failed, using fallback data:', error);
  }
  
  // Use fallback data
  const fallback = fallbackCaseStudiesData[slug];
  if (!fallback) {
    return null;
  }
  
  const portfolioT = await getTranslations('portfolio');
  
  return {
    slug,
    title: portfolioT(`items.${slug}.title`),
    category: portfolioT(`items.${slug}.category`),
    description: portfolioT(`items.${slug}.description`),
    logo: fallback.logo,
    logoAlt: fallback.logoAlt,
    gradient: fallback.gradient,
    heroGradient: fallback.heroGradient,
    overview: null,
    challenge: null,
    solution: null,
    results: null,
    stats: null,
    useSanityContent: false,
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getCaseStudySlugs();
    if (slugs && slugs.length > 0) {
      return slugs.map((slug) => ({ slug }));
    }
  } catch (error) {
    console.log('Failed to get slugs from Sanity:', error);
  }
  
  // Fallback to hardcoded slugs
  return [{ slug: 'zabka' }, { slug: 'ubs' }];
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('pages.caseStudies.detail');
  
  const caseStudy = await getCaseStudyData(slug, locale);

  if (!caseStudy) {
    return (
      <CaseStudyDetailClient
        caseStudy={null}
        translations={{
          client: t('client'),
          overviewLabel: t('overview.label'),
          overviewTitle: t('overview.title'),
          overviewDescription: t('overview.description'),
          overviewIndustry: t('overview.industry'),
          overviewIndustryValue: t('overview.industryValue'),
          overviewServices: t('overview.services'),
          overviewServicesValue: t('overview.servicesValue'),
          challengeLabel: t('challenge.label'),
          challengeTitle: t('challenge.title'),
          challengeDescription: t('challenge.description'),
          solutionLabel: t('solution.label'),
          solutionTitle: t('solution.title'),
          solutionDescription: t('solution.description'),
          solutionSteps: [
            { title: t('solution.steps.step1.title'), description: t('solution.steps.step1.description') },
            { title: t('solution.steps.step2.title'), description: t('solution.steps.step2.description') },
            { title: t('solution.steps.step3.title'), description: t('solution.steps.step3.description') },
          ],
          resultsLabel: t('results.label'),
          resultsTitle: t('results.title'),
          resultsMetrics: [
            { value: t('results.metrics.metric1.value'), label: t('results.metrics.metric1.label') },
            { value: t('results.metrics.metric2.value'), label: t('results.metrics.metric2.label') },
            { value: t('results.metrics.metric3.value'), label: t('results.metrics.metric3.label') },
            { value: t('results.metrics.metric4.value'), label: t('results.metrics.metric4.label') },
          ],
          ctaTitle: t('cta.title'),
          ctaSubtitle: t('cta.subtitle'),
          ctaButton: t('cta.button'),
          ctaViewAll: t('cta.viewAll'),
        }}
      />
    );
  }

  return (
    <CaseStudyDetailClient
      caseStudy={caseStudy}
      translations={{
        client: t('client'),
        overviewLabel: t('overview.label'),
        overviewTitle: t('overview.title'),
        overviewDescription: t('overview.description'),
        overviewIndustry: t('overview.industry'),
        overviewIndustryValue: t('overview.industryValue'),
        overviewServices: t('overview.services'),
        overviewServicesValue: t('overview.servicesValue'),
        challengeLabel: t('challenge.label'),
        challengeTitle: t('challenge.title'),
        challengeDescription: t('challenge.description'),
        solutionLabel: t('solution.label'),
        solutionTitle: t('solution.title'),
        solutionDescription: t('solution.description'),
        solutionSteps: [
          { title: t('solution.steps.step1.title'), description: t('solution.steps.step1.description') },
          { title: t('solution.steps.step2.title'), description: t('solution.steps.step2.description') },
          { title: t('solution.steps.step3.title'), description: t('solution.steps.step3.description') },
        ],
        resultsLabel: t('results.label'),
        resultsTitle: t('results.title'),
        resultsMetrics: [
          { value: t('results.metrics.metric1.value'), label: t('results.metrics.metric1.label') },
          { value: t('results.metrics.metric2.value'), label: t('results.metrics.metric2.label') },
          { value: t('results.metrics.metric3.value'), label: t('results.metrics.metric3.label') },
          { value: t('results.metrics.metric4.value'), label: t('results.metrics.metric4.label') },
        ],
        ctaTitle: t('cta.title'),
        ctaSubtitle: t('cta.subtitle'),
        ctaButton: t('cta.button'),
        ctaViewAll: t('cta.viewAll'),
      }}
    />
  );
}
