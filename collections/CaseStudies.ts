import type { CollectionConfig } from "payload";
import { formatSlug } from "./formatSlug";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case Study", plural: "Case Studies" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "order", "_status"],
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
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
        description: 'URL path, e.g. "zabka".',
      },
      hooks: { beforeValidate: [formatSlug] },
    },
    {
      name: "category",
      type: "text",
      localized: true,
      admin: { description: 'e.g. "Cloud Development".' },
    },
    {
      name: "client",
      type: "text",
      admin: { description: "Client / company name." },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: { description: "Short summary shown on cards." },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Client logo (shown on the card)." },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gradient",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          'Optional Tailwind gradient classes used when there is no image, e.g. "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400".',
      },
    },
    {
      name: "overview",
      type: "richText",
      localized: true,
    },
    {
      name: "challenge",
      type: "richText",
      localized: true,
    },
    {
      name: "solution",
      type: "richText",
      localized: true,
    },
    {
      name: "results",
      type: "richText",
      localized: true,
    },
    {
      name: "stats",
      type: "array",
      labels: { singular: "Stat", plural: "Stats" },
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", localized: true },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Show on the homepage portfolio section.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers appear first." },
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
