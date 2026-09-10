import type { CollectionConfig } from "payload";

/**
 * The "Selected clients" band on the home page: a mark, a name and one line
 * about the work, three across at desktop width.
 *
 * The logo is optional per client but all or nothing per band: the band shows
 * marks only when every active client has one, so adding a client without a
 * logo takes the marks off the whole row rather than leaving a gap in it.
 *
 * lib/home-bands.ts reads the active documents in Order and hands them to
 * the band. When nothing is active, or the database is unreachable, the
 * reader returns null and the band renders the three names built into
 * dictionaries/{en,pl,de}.json instead, so the page never comes up empty.
 */
export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Client", plural: "Clients" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "isActive", "order", "updatedAt"],
    description:
      'The "Selected clients" band on the home page. Active clients show in Order; when none are active the band falls back to the three names built into the site copy.',
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
      admin: {
        description:
          "Company name, set in the large type of the home page band. Not translated: a company is called the same thing in every language.",
      },
    },
    {
      name: "what",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description:
          'The single grey line under the name on the home page, e.g. "Autonomous store architecture". One short phrase, no full stop.',
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Optional wordmark, ideally an SVG or a PNG with a transparent background. It is set above the company name and recoloured to flat ink, so any logo colour works, but it must still read at 56px tall. Pad the file to roughly a quarter of its height in clearspace so it lands at the same size as the marks beside it. Leave this empty and the whole band drops back to names in type, this client's neighbours included.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers show first. The band sets three across a row.",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description:
          "Uncheck to drop this client from the home page band without deleting the record.",
      },
    },
  ],
};
