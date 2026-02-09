import { getTranslations } from 'next-intl/server';
import { getInsight, getInsightSlugs, getRelatedInsights, type InsightFull } from '@/sanity/queries/insights';
import { urlFor } from '@/sanity/client';
import { getLocale } from '@/sanity/lib/getLocale';
import InsightDetailClient from './InsightDetailClient';

const siteConfig = {
  name: "Pluscode",
  url: "https://pluscode.dev",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fallback data when Sanity is not configured
const fallbackArticlesData: Record<string, {
  translationKey: string;
  category: string;
  categoryKey: string;
  readTime: number;
  author: string;
  date: string;
  gradient: string;
}> = {
  'ai-transforming-business': {
    translationKey: 'featured',
    category: 'AI & Machine Learning',
    categoryKey: 'ai',
    readTime: 8,
    author: 'Dawid Kubicki',
    date: '2025-01-15',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-50',
  },
  'scalable-microservices': {
    translationKey: 'post1',
    category: 'Development',
    categoryKey: 'development',
    readTime: 6,
    author: 'Tech Team',
    date: '2025-01-10',
    gradient: 'bg-gradient-to-br from-blue-100 to-cyan-50',
  },
  'startup-to-scaleup': {
    translationKey: 'post2',
    category: 'Business',
    categoryKey: 'business',
    readTime: 5,
    author: 'Dawid Kubicki',
    date: '2025-01-05',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-50',
  },
  'cloud-native-best-practices': {
    translationKey: 'post3',
    category: 'Technology',
    categoryKey: 'technology',
    readTime: 7,
    author: 'Tech Team',
    date: '2024-12-28',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-50',
  },
};

export interface InsightDetailData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryKey: string;
  readTime: number;
  readTimeLabel: string;
  author: string;
  publishedAt: string;
  gradient: string;
  image?: string;
  content: any[] | null;
  useSanityContent: boolean;
}

export interface RelatedInsight {
  slug: string;
  title: string;
  category: string;
  gradient: string;
}

async function getInsightData(slug: string, locale: string, insightsT: Awaited<ReturnType<typeof getTranslations>>): Promise<InsightDetailData | null> {
  try {
    const sanityInsight = await getInsight(slug, locale);
    
    if (sanityInsight) {
      const minutes = sanityInsight.readTime || 5;
      return {
        slug: sanityInsight.slug,
        title: sanityInsight.title || '',
        excerpt: sanityInsight.excerpt || '',
        category: sanityInsight.category || 'technology',
        categoryKey: sanityInsight.category || 'technology',
        readTime: minutes,
        readTimeLabel: insightsT('readTime', { minutes }),
        author: sanityInsight.author || 'Team',
        publishedAt: sanityInsight.publishedAt || new Date().toISOString(),
        gradient: sanityInsight.gradient || 'bg-gradient-to-br from-neutral-100 to-neutral-50',
        image: sanityInsight.featuredImage?.asset?._ref ? urlFor(sanityInsight.featuredImage).width(1200).height(675).url() : undefined,
        content: sanityInsight.content || null,
        useSanityContent: true,
      };
    }
  } catch (error) {
    console.log('Sanity insight fetch failed, using fallback:', error);
  }
  
  // Use fallback data
  const fallback = fallbackArticlesData[slug];
  if (!fallback) {
    return null;
  }
  
  return {
    slug,
    title: insightsT(`items.${fallback.translationKey}.title`),
    excerpt: insightsT(`items.${fallback.translationKey}.excerpt`),
    category: insightsT(`categories.${fallback.categoryKey}`),
    categoryKey: fallback.categoryKey,
    readTime: fallback.readTime,
    readTimeLabel: insightsT('readTime', { minutes: fallback.readTime }),
    author: fallback.author,
    publishedAt: fallback.date,
    gradient: fallback.gradient,
    content: null,
    useSanityContent: false,
  };
}

async function getRelatedInsightsData(slug: string, category: string, locale: string): Promise<RelatedInsight[]> {
  try {
    const sanityRelated = await getRelatedInsights(slug, category, locale, 3);
    
    if (sanityRelated && sanityRelated.length > 0) {
      return sanityRelated.map((insight) => ({
        slug: insight.slug,
        title: insight.title || '',
        category: insight.category || 'technology',
        gradient: insight.gradient || 'bg-gradient-to-br from-neutral-100 to-neutral-50',
      }));
    }
  } catch (error) {
    console.log('Sanity related fetch failed, using fallback:', error);
  }
  
  // Use fallback
  const insightsT = await getTranslations('insights');
  return Object.entries(fallbackArticlesData)
    .filter(([key]) => key !== slug)
    .slice(0, 3)
    .map(([key, data]) => ({
      slug: key,
      title: insightsT(`items.${data.translationKey}.title`),
      category: insightsT(`categories.${data.categoryKey}`),
      gradient: data.gradient,
    }));
}

export async function generateStaticParams() {
  try {
    const slugs = await getInsightSlugs();
    if (slugs && slugs.length > 0) {
      return slugs.map((slug) => ({ slug }));
    }
  } catch (error) {
    console.log('Failed to get slugs from Sanity:', error);
  }
  
  // Fallback to hardcoded slugs
  return Object.keys(fallbackArticlesData).map((slug) => ({ slug }));
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const [t, insightsT] = await Promise.all([
    getTranslations('pages.insights.article'),
    getTranslations('insights'),
  ]);
  
  const [insight, relatedInsights] = await Promise.all([
    getInsightData(slug, locale, insightsT),
    getRelatedInsightsData(slug, fallbackArticlesData[slug]?.categoryKey || 'technology', locale),
  ]);

  // Article JSON-LD structured data for SEO
  const articleJsonLd = insight ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    author: {
      "@type": "Person",
      name: insight.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/assets/logo/pluscode-logo.svg`,
      },
    },
    datePublished: insight.publishedAt,
    dateModified: insight.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/insights/${slug}`,
    },
    ...(insight.image && {
      image: {
        "@type": "ImageObject",
        url: insight.image,
      },
    }),
  } : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <InsightDetailClient
        insight={insight}
        relatedInsights={relatedInsights}
        translations={{
          relatedTitle: t('related.title'),
          contentIntro: t('content.intro'),
          contentSection1Title: t('content.section1.title'),
          contentSection1Paragraph: t('content.section1.paragraph'),
          contentSection2Title: t('content.section2.title'),
          contentSection2Paragraph: t('content.section2.paragraph'),
          contentSection3Title: t('content.section3.title'),
          contentSection3Paragraph: t('content.section3.paragraph'),
          keyTakeawaysTitle: t('content.keyTakeaways.title'),
          keyTakeaways: [
            t('content.keyTakeaways.item1'),
            t('content.keyTakeaways.item2'),
            t('content.keyTakeaways.item3'),
          ],
        }}
      />
    </>
  );
}
