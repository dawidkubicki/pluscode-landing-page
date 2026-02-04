import { groq } from 'next-sanity'
import { client } from '../client'

// Types
export interface Announcement {
  _id: string
  text: string
  linkText: string | null
  linkUrl: string | null
  isActive: boolean
  expiresAt: string | null
}

// Fetch active announcement
export async function getActiveAnnouncement(locale: string = 'en'): Promise<Announcement | null> {
  const query = groq`
    *[_type == "announcement" && isActive == true && (expiresAt == null || expiresAt > now())] | order(_createdAt desc) [0] {
      _id,
      "text": text.${locale},
      "linkText": linkText.${locale},
      linkUrl,
      isActive,
      expiresAt
    }
  `
  
  // No cache in development, 5 min revalidation in production
  const isDev = process.env.NODE_ENV === 'development'
  return client.fetch(query, {}, { 
    next: isDev ? { revalidate: 0 } : { revalidate: 300 } 
  })
}
