import type { CollectionConfig } from "payload";

/** Downloadable / linked research reports promoted on the landing page. */
export const Reports: CollectionConfig = {
  slug: "reports",
  labels: { singular: "Report", plural: "Reports" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "eyebrow", "featured", "publishedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: { description: 'Headline, e.g. "Jak polskie firmy wdrażają AI?".' },
    },
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      defaultValue: "AI Report",
      admin: { description: "Small accent label above the headline." },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: { description: "One or two supporting sentences." },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Large visual shown next to the copy." },
    },
    {
      name: "ctaLabel",
      type: "text",
      localized: true,
      admin: { description: 'Button label. Defaults to "Learn more".' },
    },
    {
      name: "href",
      type: "text",
      admin: {
        description:
          'Where the button leads: an internal path (e.g. "/insights/ai-report") or a full URL.',
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Show this report on the landing page.",
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
  ],
};
