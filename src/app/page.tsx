import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import AnnouncementBar, { type AnnouncementData } from "@/components/AnnouncementBar";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Portfolio, { type PortfolioCaseStudy } from "@/components/Portfolio";
import Testimonial from "@/components/Testimonial";
import Insights, { type InsightForList } from "@/components/Insights";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getCaseStudies } from "@/sanity/queries/caseStudies";
import { getInsights, getFeaturedInsight } from "@/sanity/queries/insights";
import { getActiveAnnouncement } from "@/sanity/queries/announcement";
import { urlFor } from "@/sanity/client";
import { getLocale } from "@/sanity/lib/getLocale";

export const metadata: Metadata = {
  title: "Pluscode | Software Development & AI Solutions",
  description:
    "Transform your business with custom software development, AI solutions, and cloud services. We build innovative digital products that drive growth.",
  openGraph: {
    title: "Pluscode | Software Development & AI Solutions",
    description:
      "Transform your business with custom software development, AI solutions, and cloud services. We build innovative digital products that drive growth.",
  },
};

// Fallback case studies data
const fallbackCaseStudiesData = [
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

// Fallback insights data
const fallbackInsightsData = [
  {
    slug: 'ai-transforming-business',
    category: 'ai',
    readTime: 8,
    featured: true,
    gradient: 'bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400',
  },
  {
    slug: 'scalable-microservices',
    category: 'development',
    readTime: 5,
    featured: false,
    gradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400',
  },
  {
    slug: 'startup-to-scaleup',
    category: 'business',
    readTime: 6,
    featured: false,
    gradient: 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400',
  },
  {
    slug: 'cloud-native-best-practices',
    category: 'technology',
    readTime: 4,
    featured: false,
    gradient: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400',
  },
];

async function getAnnouncementData(locale: string): Promise<AnnouncementData | null> {
  try {
    const sanityAnnouncement = await getActiveAnnouncement(locale);
    
    if (sanityAnnouncement && sanityAnnouncement.text) {
      return {
        text: sanityAnnouncement.text,
        linkText: sanityAnnouncement.linkText,
        linkUrl: sanityAnnouncement.linkUrl,
      };
    }
  } catch (error) {
    // Fallback to translations if Sanity fetch fails
  }
  
  // Use fallback from translations
  const announcementT = await getTranslations('announcement');
  return {
    text: announcementT('text'),
    linkText: announcementT('linkText', { defaultValue: '' }) || null,
    linkUrl: announcementT('linkUrl', { defaultValue: '' }) || null,
  };
}

async function getPortfolioData(locale: string): Promise<PortfolioCaseStudy[]> {
  try {
    const sanityCaseStudies = await getCaseStudies(locale);
    
    if (sanityCaseStudies && sanityCaseStudies.length > 0) {
      return sanityCaseStudies.slice(0, 4).map((cs) => ({
        slug: cs.slug,
        title: cs.title || '',
        category: cs.category || '',
        excerpt: cs.excerpt || '',
        logo: cs.logo?.asset?._ref ? urlFor(cs.logo).url() : '/assets/portfolio/placeholder-logo.svg',
        logoAlt: cs.logo?.alt || cs.title || '',
        gradient: cs.gradient || 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white',
        image: cs.heroImage?.asset?._ref ? urlFor(cs.heroImage).width(800).height(600).url() : undefined,
      }));
    }
  } catch (error) {
    // Fallback to translations if Sanity fetch fails
  }
  
  // Use fallback with translations
  const portfolioT = await getTranslations('portfolio');
  return fallbackCaseStudiesData.map((cs) => ({
    slug: cs.slug,
    title: portfolioT(`items.${cs.slug}.title`),
    category: portfolioT(`items.${cs.slug}.category`),
    excerpt: portfolioT(`items.${cs.slug}.description`),
    logo: cs.logo,
    logoAlt: cs.logoAlt,
    gradient: cs.gradient,
    image: cs.image,
  }));
}

async function getInsightsData(locale: string): Promise<{ featured: InsightForList | null; posts: InsightForList[] }> {
  try {
    const [featured, allInsights] = await Promise.all([
      getFeaturedInsight(locale),
      getInsights(locale),
    ]);
    
    if (allInsights && allInsights.length > 0) {
      const featuredPost = featured || allInsights[0];
      const otherPosts = allInsights.filter(i => i.slug !== featuredPost?.slug).slice(0, 3);
      
      const mapInsight = (insight: typeof allInsights[0]): InsightForList => ({
        slug: insight.slug,
        title: insight.title || '',
        excerpt: insight.excerpt || '',
        category: insight.category || 'technology',
        readTime: insight.readTime || 5,
        featured: insight.featured || false,
        gradient: insight.gradient || 'bg-gradient-to-br from-neutral-200 via-neutral-100 to-white',
        image: insight.featuredImage?.asset?._ref ? urlFor(insight.featuredImage).width(1600).height(1200).quality(90).url() : undefined,
      });
      
      return {
        featured: featuredPost ? mapInsight(featuredPost) : null,
        posts: otherPosts.map(mapInsight),
      };
    }
  } catch (error) {
    // Fallback to translations if Sanity fetch fails
  }
  
  // Use fallback with translations
  const insightsT = await getTranslations('insights');
  const featuredData = fallbackInsightsData.find(i => i.featured) || fallbackInsightsData[0];
  const otherData = fallbackInsightsData.filter(i => i.slug !== featuredData.slug).slice(0, 3);
  
  const keyMap: Record<string, string> = {
    'ai-transforming-business': 'featured',
    'scalable-microservices': 'post1',
    'startup-to-scaleup': 'post2',
    'cloud-native-best-practices': 'post3',
  };
  
  const mapFallback = (data: typeof fallbackInsightsData[0]): InsightForList => ({
    slug: data.slug,
    title: insightsT(`items.${keyMap[data.slug]}.title`),
    excerpt: insightsT(`items.${keyMap[data.slug]}.excerpt`),
    category: data.category,
    readTime: data.readTime,
    featured: data.featured,
    gradient: data.gradient,
  });
  
  return {
    featured: mapFallback(featuredData),
    posts: otherData.map(mapFallback),
  };
}

export default async function Home() {
  const locale = await getLocale();
  const [portfolioT, insightsT] = await Promise.all([
    getTranslations('portfolio'),
    getTranslations('insights'),
  ]);
  
  const [announcement, caseStudies, insightsData] = await Promise.all([
    getAnnouncementData(locale),
    getPortfolioData(locale),
    getInsightsData(locale),
  ]);

  return (
    <div className="min-h-screen">
      <AnnouncementBar announcement={announcement} />
      <Navigation />
      <Hero />
      <Services />
      <Industries />
      <Portfolio 
        caseStudies={caseStudies}
        translations={{
          label: portfolioT('label'),
          title: portfolioT('title'),
          subtitle: portfolioT('subtitle'),
          cta: portfolioT('cta'),
        }}
      />
      <Testimonial />
      <Insights 
        featured={insightsData.featured}
        posts={insightsData.posts}
        translations={{
          label: insightsT('label'),
          title: insightsT('title'),
          subtitle: insightsT('subtitle'),
          readMore: insightsT('readMore'),
          minRead: insightsT('minRead'),
          cta: insightsT('cta'),
          categories: {
            ai: insightsT('categories.ai'),
            development: insightsT('categories.development'),
            business: insightsT('categories.business'),
            technology: insightsT('categories.technology'),
            cloud: insightsT('categories.cloud'),
            mobile: insightsT('categories.mobile'),
          },
        }}
      />
      <Contact />
      <Footer />
    </div>
  );
}
