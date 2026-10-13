import type { CollectionConfig } from "payload";
import { slugFrom } from "./formatSlug";

/**
 * The portfolio: software Pluscode builds and runs. lib/products.ts reads it
 * in Order and fills any empty field from `products` in the dictionaries, so
 * a row can be as thin as a name and a slug.
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product", plural: "Portfolio" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "url", "order", "updatedAt"],
    description: "The products shown in the Portfolio section of the home page.",
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
      admin: { description: "Product name, shown on its portfolio card." },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: 'Short id, e.g. "quanty". Filled from the name when left blank.',
      },
      hooks: { beforeValidate: [slugFrom("name")] },
    },
    {
      name: "tagline",
      type: "text",
      localized: true,
      admin: { description: "One line that says what the product is." },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: { description: "A short paragraph about the product." },
    },
    {
      name: "url",
      type: "text",
      admin: { description: "Full address of the product, e.g. https://quanty.ai." },
    },
    {
      name: "badge",
      type: "text",
      localized: true,
      admin: { description: 'Short label on the card, e.g. "Our product".' },
    },
    {
      name: "tags",
      type: "text",
      localized: true,
      admin: { description: "Comma separated, e.g. Documents, Spreadsheets, Reporting." },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Logo on the portfolio card, SVG preferred. A new product is not shown until it has one.",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional screenshot of the product." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers show first." },
    },
  ],
};
