import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = '2024-01-01'

const isDev = process.env.NODE_ENV === 'development'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isDev,
})

// Image URL builder
const builder = createImageUrlBuilder({ projectId, dataset })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

// Revalidation time: 0 in dev (no cache), 1 hour in production
export const revalidate = isDev ? 0 : 3600

// Fetch options helper
export const fetchOptions = { next: { revalidate } }
