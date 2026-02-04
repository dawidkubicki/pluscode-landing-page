import { defineType, defineField } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'styling', title: 'Styling' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'localeString',
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localeText',
      group: 'content',
      description: 'Short description for listings and previews',
    }),

    // Media
    defineField({
      name: 'logo',
      title: 'Client Logo',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),

    // Styling
    defineField({
      name: 'gradient',
      title: 'Card Gradient',
      type: 'string',
      group: 'styling',
      description: 'Tailwind CSS gradient classes (e.g., bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400)',
    }),
    defineField({
      name: 'heroGradient',
      title: 'Hero Section Gradient',
      type: 'string',
      group: 'styling',
      description: 'Tailwind CSS gradient classes for the hero section background',
    }),

    // Content Sections
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'localeBlockContent',
      group: 'content',
    }),
    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'localeBlockContent',
      group: 'content',
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'localeBlockContent',
      group: 'content',
    }),
    defineField({
      name: 'results',
      title: 'Results',
      type: 'localeBlockContent',
      group: 'content',
    }),

    // Stats
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Value' },
            { name: 'label', type: 'localeString', title: 'Label' },
          ],
          preview: {
            select: {
              title: 'value',
              subtitle: 'label.en',
            },
          },
        },
      ],
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'localeString',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'localeText',
      group: 'seo',
    }),

    // Publishing
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'content',
      description: 'Show this case study in featured sections',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'category.en',
      media: 'logo',
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
