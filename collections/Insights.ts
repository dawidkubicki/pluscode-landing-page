import type { CollectionConfig } from "payload";
import { formatSlug } from "./formatSlug";

/**
 * News. The slug and tables are the original `insights` ones, so every
 * published article and its versions carry over; only the labels changed.
 * lib/news.ts reads the published documents, newest first.
 *
 * The hidden fields fed the home page bands and the lead card of the old
 * Insights page. Nothing reads them now. They stay in the config so the
 * columns, and what editors stored in them, are not dropped.
 */
export const Insights: CollectionConfig = {
  slug: "insights",
  labels: { singular: "News item", plural: "News" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    description: "Articles on the News page. Only published items are shown, newest first.",
  },
  access: {
    // The collection has drafts, and the REST and GraphQL APIs are public:
    // without this, an unpublished item could be read by anyone who asked
    // the API for it. Editors see everything; everyone else sees what is
    // published. The site itself reads through the Local API and applies the
    // same rule in lib/news.ts.
    read: ({ req }) =>
      req.user ? true : { _status: { equals: "published" } },
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
      admin: { description: "Headline, on the news card and at the top of the article." },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: 'Address of the article, e.g. "quanty-is-live". Filled from the title when left blank.',
      },
      hooks: { beforeValidate: [formatSlug] },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: { description: "Short summary, on the news card and under the headline." },
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
      admin: { position: "sidebar", description: "Small label on the news card." },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Cover picture, shown 16:9 on the news card and above the article." },
    },
    {
      name: "gradient",
      type: "text",
      admin: { hidden: true, position: "sidebar" },
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      admin: { description: "The article itself." },
    },
    {
      name: "author",
      type: "text",
      defaultValue: "Pluscode",
      admin: { position: "sidebar", description: "Shown beside the date on the article." },
    },
    {
      name: "readTime",
      type: "number",
      defaultValue: 5,
      min: 1,
      admin: { position: "sidebar", description: "Estimated read time in minutes." },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        description: "Date shown on the article. It also sets the order: newest first.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { hidden: true, position: "sidebar" },
    },
    {
      name: "showInInsightsBand",
      type: "checkbox",
      defaultValue: false,
      admin: { hidden: true, position: "sidebar" },
    },
    {
      name: "showInStoriesBand",
      type: "checkbox",
      defaultValue: false,
      admin: { hidden: true, position: "sidebar" },
    },
    {
      name: "homeTag",
      type: "text",
      localized: true,
      admin: { hidden: true, position: "sidebar" },
    },
    {
      name: "homeOrder",
      type: "number",
      defaultValue: 0,
      admin: { hidden: true, position: "sidebar" },
    },
    {
      name: "homeHref",
      type: "text",
      admin: { hidden: true, position: "sidebar" },
    },
    {
      name: "seoTitle",
      type: "text",
      localized: true,
      admin: {
        position: "sidebar",
        description: "Title for search engines. Empty: the headline is used.",
      },
    },
    {
      name: "seoDescription",
      type: "textarea",
      localized: true,
      admin: {
        position: "sidebar",
        description: "Description for search engines. Empty: the summary is used.",
      },
    },
  ],
};
