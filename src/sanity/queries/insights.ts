import { groq } from 'next-sanity'
import { client, revalidate } from '../client'

// Types
export interface InsightCard {
  _id: string
  slug: string
  title: string
  category: string
  excerpt: string
  featuredImage: {
    asset: {
      _ref: string
    }
    alt?: string
  } | null
  gradient: string | null
  author: string | null
  readTime: number | null
  publishedAt: string | null
  featured: boolean
}

export interface InsightFull extends InsightCard {
  content: any[]
  seoTitle: string | null
  seoDescription: string | null
}

// Queries
const insightCardFields = (locale: string) => groq`
  _id,
  "slug": slug.current,
  "title": title.${locale},
  category,
  "excerpt": excerpt.${locale},
  featuredImage,
  gradient,
  author,
  readTime,
  publishedAt,
  featured
`

const insightFullFields = (locale: string) => groq`
  ${insightCardFields(locale)},
  "content": content.${locale},
  "seoTitle": seoTitle.${locale},
  "seoDescription": seoDescription.${locale}
`

// Fetch all insights
export async function getInsights(locale: string = 'en'): Promise<InsightCard[]> {
  const query = groq`
    *[_type == "insight"] | order(publishedAt desc) {
      ${insightCardFields(locale)}
    }
  `
  
  return client.fetch(query, {}, { next: { revalidate, tags: ['insight'] } })
}

// Fetch featured insight for homepage
export async function getFeaturedInsight(locale: string = 'en'): Promise<InsightCard | null> {
  const query = groq`
    *[_type == "insight" && featured == true] | order(publishedAt desc) [0] {
      ${insightCardFields(locale)}
    }
  `
  
  return client.fetch(query, {}, { next: { revalidate, tags: ['insight'] } })
}

// Fetch recent insights for homepage (excluding featured)
export async function getRecentInsights(locale: string = 'en', limit: number = 3): Promise<InsightCard[]> {
  const query = groq`
    *[_type == "insight" && featured != true] | order(publishedAt desc) [0...${limit}] {
      ${insightCardFields(locale)}
    }
  `
  
  return client.fetch(query, {}, { next: { revalidate, tags: ['insight'] } })
}

// Fetch single insight by slug
export async function getInsight(slug: string, locale: string = 'en'): Promise<InsightFull | null> {
  const query = groq`
    *[_type == "insight" && slug.current == $slug][0] {
      ${insightFullFields(locale)}
    }
  `
  
  return client.fetch(query, { slug }, { next: { revalidate, tags: ['insight', `insight:${slug}`] } })
}

// Get related insights (same category, excluding current)
export async function getRelatedInsights(
  slug: string,
  category: string,
  locale: string = 'en',
  limit: number = 3
): Promise<InsightCard[]> {
  const query = groq`
    *[_type == "insight" && slug.current != $slug && category == $category] | order(publishedAt desc) [0...${limit}] {
      ${insightCardFields(locale)}
    }
  `
  
  return client.fetch(query, { slug, category }, { next: { revalidate, tags: ['insight'] } })
}

// Get all insight slugs for static generation
export async function getInsightSlugs(): Promise<string[]> {
  const query = groq`*[_type == "insight"].slug.current`
  return client.fetch(query, {}, { next: { revalidate, tags: ['insight'] } })
}
