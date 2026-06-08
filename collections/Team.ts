import type { CollectionConfig } from "payload";

export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Team Member", plural: "Team Members" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "featuredOnHome", "order"],
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
      localized: true,
      admin: { description: 'e.g. "Product Manager".' },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "bio",
      type: "textarea",
      localized: true,
    },
    {
      name: "email",
      type: "email",
    },
    {
      name: "phone",
      type: "text",
      admin: { description: 'Full phone number, e.g. "+48 61 847-31-79".' },
    },
    {
      name: "linkedin",
      type: "text",
      admin: { description: "Full LinkedIn profile URL." },
    },
    {
      name: "featuredOnHome",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Show this person in the homepage hero card. The first featured member is used.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first.",
      },
    },
  ],
};
