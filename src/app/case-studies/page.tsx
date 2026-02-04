import { getTranslations } from 'next-intl/server';
import { getCaseStudies, type CaseStudyCard as SanityCaseStudy } from '@/sanity/queries/caseStudies';
import { urlFor } from '@/sanity/client';
import { getLocale } from '@/sanity/lib/getLocale';
import CaseStudiesPageClient from './CaseStudiesPageClient';

// Fallback data when Sanity is not configured or returns empty
const fallbackCaseStudies = [
  {
    slug: 'zabka',
    image: '/assets/portfolio/zabka-case-study.jpg',
    logo: '/assets/portfolio/zabka-logo.svg',
    logoAlt: 'Żabka',
    gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400',
  },
  {
    slug: 'ubs',
    image: '/assets/portfolio/ubs-case-study.jpg',
    logo: '/assets/portfolio/ubs-logo.svg',
    logoAlt: 'UBS',
    gradient: 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white',
  },
];

export interface CaseStudyForList {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  logo: string;
  logoAlt: string;
  gradient: string;
}

async function getCaseStudiesData(locale: string): Promise<CaseStudyForList[]> {
  try {
    const sanityCaseStudies = await getCaseStudies(locale);
    
    if (sanityCaseStudies && sanityCaseStudies.length > 0) {
      return sanityCaseStudies.map((cs) => ({
        slug: cs.slug,
        title: cs.title || '',
        category: cs.category || '',
        excerpt: cs.excerpt || '',
        logo: cs.logo?.asset?._ref ? urlFor(cs.logo).url() : '/assets/portfolio/placeholder-logo.svg',
        logoAlt: cs.logo?.alt || cs.title || '',
        gradient: cs.gradient || 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white',
      }));
    }
  } catch (error) {
    console.log('Sanity fetch failed, using fallback data:', error);
  }
  
  // Use fallback with translations
  const portfolioT = await getTranslations('portfolio');
  return fallbackCaseStudies.map((cs) => ({
    slug: cs.slug,
    title: portfolioT(`items.${cs.slug}.title`),
    category: portfolioT(`items.${cs.slug}.category`),
    excerpt: portfolioT(`items.${cs.slug}.description`),
    logo: cs.logo,
    logoAlt: cs.logoAlt,
    gradient: cs.gradient,
  }));
}

export default async function CaseStudiesPage() {
  const locale = await getLocale();
  const t = await getTranslations('pages.caseStudies');
  
  const caseStudies = await getCaseStudiesData(locale);

  return (
    <CaseStudiesPageClient
      caseStudies={caseStudies}
      translations={{
        label: t('label'),
        title: t('title'),
        subtitle: t('subtitle'),
        ctaTitle: t('cta.title'),
        ctaSubtitle: t('cta.subtitle'),
        ctaButton: t('cta.button'),
      }}
    />
  );
}
