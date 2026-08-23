import type { CollectionConfig } from "payload";

export const TrustLogos: CollectionConfig = {
  slug: "trust-logos",
  labels: { singular: "Trust logo", plural: "Trust logos" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "isActive", "order", "updatedAt"],
    description:
      'Client logos for the hero\'s "Trusted by" strip. Active logos show in Order; when none are active the strip falls back to the dictionary text names.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Client name — also the logo's alt text." },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "Logo file — ideally SVG or PNG with a transparent background. It is recolored to white on the dark hero, so any logo color works.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
  ],
};
