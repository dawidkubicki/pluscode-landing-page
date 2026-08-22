import type { CollectionConfig } from "payload";

/**
 * Form submissions from the "Book a workshop / sprint / PoC / team" pages and
 * the general contact form. Not localized (a submission is a single record).
 * Public create (so the site can submit), admin-only read so PII stays private.
 * The admin list makes it easy to see how many people signed up per offering.
 */
export const Bookings: CollectionConfig = {
  slug: "bookings",
  labels: { singular: "Booking", plural: "Bookings" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "offering", "company", "createdAt"],
    group: "Submissions",
    description:
      "Workshop / engagement booking requests and contact submissions.",
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "company", type: "text" },
    {
      name: "offering",
      type: "select",
      required: true,
      defaultValue: "general",
      options: [
        { label: "AI Opportunity Workshop", value: "ai-opportunity-workshop" },
        { label: "AI Discovery Sprint", value: "ai-discovery-sprint" },
        { label: "GenAI Proof-of-Concept", value: "genai-proof-of-concept" },
        { label: "Fractional AI Team", value: "fractional-ai-team" },
        { label: "General enquiry", value: "general" },
      ],
      admin: { description: "Which page the request came from." },
    },
    {
      name: "format",
      type: "text",
      admin: { description: "Preferred format, e.g. Remote / On-site / Either." },
    },
    { name: "teamSize", type: "text", admin: { description: "Team / company size." } },
    {
      name: "useCase",
      type: "textarea",
      admin: { description: "The use case or problem they want to explore." },
    },
    { name: "timeline", type: "text", admin: { description: "Desired timeline." } },
    { name: "message", type: "textarea" },
    {
      name: "locale",
      type: "text",
      admin: { position: "sidebar", description: "Site language at submission." },
    },
    {
      name: "source",
      type: "text",
      admin: { position: "sidebar", description: "Page path the form was on." },
    },
  ],
};
