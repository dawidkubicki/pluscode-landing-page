import type { CollectionConfig } from "payload";

export const Announcements: CollectionConfig = {
  slug: "announcements",
  labels: { singular: "Announcement", plural: "Announcements" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "isActive", "updatedAt"],
    description:
      "The top banner. The most recently updated active announcement is shown.",
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
