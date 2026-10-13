import type { CollectionConfig } from "payload";

/**
 * The people shown on the home and About pages. Slug and tables are the
 * original `team` ones. lib/people.ts reads it in Order and fills an empty
 * role or bio from `people` in the dictionaries.
 */
export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Person", plural: "People" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
    description: "The people shown on the home and About pages.",
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
      admin: { description: "Full name, shown under the portrait." },
    },
    {
      name: "role",
      type: "text",
      localized: true,
      admin: { description: 'Shown under the name, e.g. "Founder and CEO".' },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Portrait, 4:5, shown in greyscale. A new person is not shown until they have one.",
      },
    },
    {
      name: "bio",
      type: "textarea",
      localized: true,
      admin: { description: "Opens from the Bio button on the portrait card." },
    },
    {
      name: "email",
      type: "email",
      admin: { description: "For reference. Not shown on the site." },
    },
    {
      name: "phone",
      type: "text",
      admin: { description: "For reference. Not shown on the site." },
    },
    {
      name: "linkedin",
      type: "text",
      admin: { description: "Full LinkedIn profile address, behind the LinkedIn icon." },
    },
    {
      // Fed the booking card of the old home hero. Kept so the column and its
      // data stay, hidden because nothing reads it.
      name: "featuredOnHome",
      type: "checkbox",
      defaultValue: false,
      admin: { hidden: true, position: "sidebar" },
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
