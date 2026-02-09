import { groq } from 'next-sanity'
import { client, revalidate } from '../client'

// Types
export interface CaseStudyCard {
  _id: string
  slug: string
  title: string
  category: string
  excerpt: string
  logo: {
    asset: {
      _ref: string
    }
    alt?: string
  } | null
  heroImage: {
    asset: {
      _ref: string
    }
    alt?: string
  } | null
  gradient: string | null
  featured: boolean
}

export interface CaseStudyFull extends CaseStudyCard {
  heroGradient: string | null
  overview: any[]
  challenge: any[]
  solution: any[]
  results: any[]
  stats: Array<{
    value: string
    label: string
  }> | null
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
}

// Queries
const caseStudyCardFields = (locale: string) => groq`
  _id,
  "slug": slug.current,
  "title": title.${locale},
  "category": category.${locale},
  "excerpt": excerpt.${locale},
  logo,
  heroImage,
  gradient,
  featured
`

const caseStudyFullFields = (locale: string) => groq`
  ${caseStudyCardFields(locale)},
  heroGradient,
  "overview": overview.${locale},
  "challenge": challenge.${locale},
  "solution": solution.${locale},
  "results": results.${locale},
  "stats": stats[] {
    value,
    "label": label.${locale}
  },
  "seoTitle": seoTitle.${locale},
  "seoDescription": seoDescription.${locale},
  publishedAt
`

// Fetch all case studies
export async function getCaseStudies(locale: string = 'en'): Promise<CaseStudyCard[]> {
  const query = groq`
    *[_type == "caseStudy"] | order(publishedAt desc) {
      ${caseStudyCardFields(locale)}
    }
  `
  
  return client.fetch(query, {}, { next: { revalidate, tags: ['caseStudy'] } })
}

// Fetch featured case studies for homepage
export async function getFeaturedCaseStudies(locale: string = 'en', limit: number = 4): Promise<CaseStudyCard[]> {
  const query = groq`
    *[_type == "caseStudy" && featured == true] | order(publishedAt desc) [0...${limit}] {
      ${caseStudyCardFields(locale)}
    }
  `
  
  return client.fetch(query, {}, { next: { revalidate, tags: ['caseStudy'] } })
}

// Fetch single case study by slug
export async function getCaseStudy(slug: string, locale: string = 'en'): Promise<CaseStudyFull | null> {
  const query = groq`
    *[_type == "caseStudy" && slug.current == $slug][0] {
      ${caseStudyFullFields(locale)}
    }
  `
  
  return client.fetch(query, { slug }, { next: { revalidate, tags: ['caseStudy', `caseStudy:${slug}`] } })
}

// Get all case study slugs for static generation
export async function getCaseStudySlugs(): Promise<string[]> {
  const query = groq`*[_type == "caseStudy"].slug.current`
  return client.fetch(query, {}, { next: { revalidate, tags: ['caseStudy'] } })
}
