import type { CollectionConfig } from "payload";
import { formatSlug } from "./formatSlug";

export const Insights: CollectionConfig = {
  slug: "insights",
  labels: { singular: "Insight", plural: "Insights" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "publishedAt", "_status"],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: 'URL path, e.g. "ai-transforming-business".',
      },
      hooks: { beforeValidate: [formatSlug] },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: { description: "Short summary shown in listings." },
    },
    {
      name: "category",
      type: "select",
      defaultValue: "technology",
      options: [
        { label: "AI & Machine Learning", value: "ai" },
        { label: "Development", value: "development" },
        { label: "Business", value: "business" },
        { label: "Technology", value: "technology" },
        { label: "Cloud", value: "cloud" },
        { label: "Mobile", value: "mobile" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gradient",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          'Optional Tailwind gradient classes used when there is no image, e.g. "bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400".',
      },
    },
    {
      name: "content",
      type: "richText",
      localized: true,
    },
    {
      name: "author",
      type: "text",
      defaultValue: "Pluscode",
      admin: { position: "sidebar" },
    },
    {
      name: "readTime",
      type: "number",
      defaultValue: 5,
      min: 1,
      admin: { position: "sidebar", description: "Estimated read time (minutes)." },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Highlight as the lead article on the Insights page / home.",
      },
    },
    {
      name: "seoTitle",
      type: "text",
      localized: true,
      admin: { position: "sidebar" },
    },
    {
      name: "seoDescription",
      type: "textarea",
      localized: true,
      admin: { position: "sidebar" },
    },
  ],
};
