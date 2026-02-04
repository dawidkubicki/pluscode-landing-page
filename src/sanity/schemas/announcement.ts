import { defineType, defineField } from 'sanity'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'For internal reference only (not displayed on the site)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Announcement Text',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'localeString',
      description: 'Text for the call-to-action link (optional)',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
      description: 'URL for the call-to-action link',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Only one announcement should be active at a time',
      initialValue: false,
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'Optional: Announcement will automatically hide after this date',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'text.en',
      isActive: 'isActive',
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title: `${isActive ? '🟢' : '⚪'} ${title}`,
        subtitle: subtitle,
      }
    },
  },
})
