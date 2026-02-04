'use client'

import { PortableText as BasePortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../client'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-semibold text-neutral-900 mt-6 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-neutral-600 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-6 italic text-neutral-600 bg-neutral-50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-neutral-100 text-purple-600 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || ''
      const isExternal = href.startsWith('http')
      
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 underline underline-offset-2"
          >
            {children}
          </a>
        )
      }
      
      return (
        <Link href={href} className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
          {children}
        </Link>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      
      return (
        <figure className="my-8">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || ''}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-neutral-500 mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-600">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-neutral-600">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
}

interface PortableTextProps {
  value: any[]
  className?: string
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null
  }
  
  return (
    <div className={className}>
      <BasePortableText value={value} components={components} />
    </div>
  )
}
