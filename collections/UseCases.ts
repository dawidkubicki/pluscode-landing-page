import type { CollectionConfig } from "payload";

/** Tech & AI use cases shown in the "Ambition in action" mosaic on the home page. */
export const UseCases: CollectionConfig = {
  slug: "use-cases",
  labels: { singular: "Use case", plural: "Use cases" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "order"],
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
    },
    {
      name: "category",
      type: "text",
      localized: true,
      admin: { description: 'Small label above the title, e.g. "Document AI".' },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Card background image." },
    },
    {
      name: "href",
      type: "text",
      admin: {
        description:
          'Where the card leads: an internal path (e.g. "/insights/some-article") or a full URL.',
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Featured card renders as the large tile in the mosaic.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers appear first." },
    },
  ],
};
