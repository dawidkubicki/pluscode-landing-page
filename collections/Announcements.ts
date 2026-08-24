import type { CollectionConfig } from "payload";
import { slugify } from "./formatSlug";

export const Announcements: CollectionConfig = {
  slug: "announcements",
  labels: { singular: "Announcement", plural: "Announcements" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "isActive", "updatedAt"],
    description:
      "The top banner. The most recently updated active announcement is shown. " +
      'An announcement with a slug also gets its own page at "/announcements/<slug>".',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "Internal label (not shown on the site)." },
    },
    {
      name: "text",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Banner message." },
    },
    {
      name: "linkText",
      type: "text",
      localized: true,
      admin: { description: "Optional call-to-action label." },
    },
    {
      name: "linkUrl",
      type: "text",
      admin: { description: 'Optional link, e.g. "/contact".' },
    },
    {
      name: "pageTitle",
      type: "text",
      localized: true,
      admin: {
        description:
          "Heading of the announcement's own page. Falls back to the banner message.",
      },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      admin: {
        description:
          'Full content of the announcement page at "/announcements/<slug>".',
      },
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description:
          'URL of the announcement page, e.g. "free-ai-consultations-for-startups". Leave empty for banner-only announcements.',
      },
      // Unlike insights, no auto-fill from the title: an empty slug means
      // "banner only, no page", so only normalize what the editor typed.
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === "string" && value.length > 0 ? slugify(value) : value,
        ],
      },
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
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Only active announcements can be shown.",
      },
    },
  ],
};
