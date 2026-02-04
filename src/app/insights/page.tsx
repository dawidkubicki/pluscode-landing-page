import { getTranslations } from 'next-intl/server';
import { getInsights, getFeaturedInsight, type InsightCard as SanityInsight } from '@/sanity/queries/insights';
import { urlFor } from '@/sanity/client';
import { getLocale } from '@/sanity/lib/getLocale';
import InsightsPageClient from './InsightsPageClient';

// Fallback data when Sanity is not configured
const fallbackInsightsData = [
  {
    slug: 'ai-transforming-business',
    category: 'ai',
    readTime: 8,
    featured: true,
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-50',
  },
  {
    slug: 'scalable-microservices',
    category: 'development',
    readTime: 6,
    featured: false,
    gradient: 'bg-gradient-to-br from-blue-100 to-cyan-50',
  },
  {
    slug: 'startup-to-scaleup',
    category: 'business',
    readTime: 5,
    featured: false,
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-50',
  },
  {
    slug: 'cloud-native-best-practices',
    category: 'technology',
    readTime: 7,
    featured: false,
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-50',
  },
];

export interface InsightForPage {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryKey: string;
  readTime: number;
  featured: boolean;
  gradient: string;
  image?: string;
}

async function getInsightsData(locale: string): Promise<InsightForPage[]> {
  try {
    const sanityInsights = await getInsights(locale);
    
    if (sanityInsights && sanityInsights.length > 0) {
      return sanityInsights.map((insight) => ({
        slug: insight.slug,
        title: insight.title || '',
        excerpt: insight.excerpt || '',
        category: insight.category || 'technology',
        categoryKey: insight.category || 'technology',
        readTime: insight.readTime || 5,
        featured: insight.featured || false,
        gradient: insight.gradient || 'bg-gradient-to-br from-neutral-100 to-neutral-50',
        image: insight.featuredImage?.asset?._ref ? urlFor(insight.featuredImage).width(800).height(600).url() : undefined,
      }));
    }
  } catch (error) {
    console.log('Sanity insights fetch failed, using fallback:', error);
  }
  
  // Use fallback with translations
  const insightsT = await getTranslations('insights');
  const keyMap: Record<string, string> = {
    'ai-transforming-business': 'featured',
    'scalable-microservices': 'post1',
    'startup-to-scaleup': 'post2',
    'cloud-native-best-practices': 'post3',
  };
  
  return fallbackInsightsData.map((insight) => ({
    slug: insight.slug,
    title: insightsT(`items.${keyMap[insight.slug]}.title`),
    excerpt: insightsT(`items.${keyMap[insight.slug]}.excerpt`),
    category: insightsT(`categories.${insight.category}`),
    categoryKey: insight.category,
    readTime: insight.readTime,
    featured: insight.featured,
    gradient: insight.gradient,
  }));
}

export default async function InsightsPage() {
  const locale = await getLocale();
  const [t, insightsT] = await Promise.all([
    getTranslations('pages.insights'),
    getTranslations('insights'),
  ]);
  
  const insights = await getInsightsData(locale);
  const featuredInsight = insights.find((i) => i.featured) || insights[0];
  const regularInsights = insights.filter((i) => i.slug !== featuredInsight?.slug);

  return (
    <InsightsPageClient
      featured={featuredInsight || null}
      insights={regularInsights}
      translations={{
        label: t('label'),
        title: t('title'),
        subtitle: t('subtitle'),
        allArticles: t('allArticles'),
        readTime: (minutes: number) => insightsT('readTime', { minutes }),
        newsletterTitle: t('newsletter.title'),
        newsletterSubtitle: t('newsletter.subtitle'),
        newsletterPlaceholder: t('newsletter.placeholder'),
        newsletterButton: t('newsletter.button'),
      }}
    />
  );
}
