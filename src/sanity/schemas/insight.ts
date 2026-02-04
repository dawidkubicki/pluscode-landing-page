import { defineType, defineField } from 'sanity'

export const insight = defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'meta', title: 'Meta' },
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localeText',
      group: 'content',
      description: 'Short description for listings and previews',
    }),

    // Category
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'AI', value: 'ai' },
          { title: 'Development', value: 'development' },
          { title: 'Business', value: 'business' },
          { title: 'Technology', value: 'technology' },
          { title: 'Cloud', value: 'cloud' },
          { title: 'Mobile', value: 'mobile' },
        ],
      },
    }),

    // Media
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
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
      group: 'media',
      description: 'Tailwind CSS gradient classes for the card background',
    }),

    // Content
    defineField({
      name: 'content',
      title: 'Content',
      type: 'localeBlockContent',
      group: 'content',
    }),

    // Meta
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      group: 'meta',
      validation: (Rule) => Rule.min(1).max(60),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      description: 'Show this insight as the featured article',
      initialValue: false,
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
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'category',
      media: 'featuredImage',
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
