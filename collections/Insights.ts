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
      admin: {
        description:
          "Short summary shown in listings. It is also the standfirst in the home page Insights band and the caption in the home page Stories band.",
      },
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
      admin: {
        description:
          "Cover art. Both home page bands need it: the Insights band shows it 16:9 beside the text, the Stories band shows it 16:9 above the headline. An insight without one is skipped by both.",
      },
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
        description:
          "Highlight as the lead article on the Insights page. It does NOT put the article on the home page: those are the two band checkboxes below.",
      },
    },
    {
      name: "showInInsightsBand",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Show in the Insights band near the top of the home page, the tab strip that advances by itself. It takes the first five in Home order and each one needs a Home tag and a cover image. When nothing is ticked the band falls back to the five items built into the site copy.",
      },
    },
    {
      name: "showInStoriesBand",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Show in the Stories band lower down the home page, the three staggered cards under Cases. It takes the first three in Home order and each one needs a cover image. When nothing is ticked the band falls back to the three stories built into the site copy.",
      },
    },
    {
      name: "homeTag",
      type: "text",
      localized: true,
      admin: {
        position: "sidebar",
        description:
          'The short label on the tab strip of the home page Insights band, e.g. "Retail" or "EU AI Act". One or two words: the tags sit on a single row. Required by that band and unused by the Stories band.',
      },
    },
    {
      name: "homeOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Position in whichever home page band this article is ticked for. Lower numbers show first.",
      },
    },
    {
      name: "homeHref",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          'Where the home page bands send a reader, when it should not be this article. Leave empty for the article itself. Use a path without a language prefix ("/services/forward-deployed-engineers") or a full address for somewhere else entirely ("https://quanty.ai"), which opens in a new tab.',
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
