import type { CollectionConfig } from "payload";

/**
 * Form submissions from the "Book a workshop / sprint / PoC / team" pages, the
 * /book-a-call page and the contact section — every lead form on the site posts
 * the same shape here. Not localized (a submission is a single record). Public
 * create (so the site can submit), admin-only read so PII stays private.
 *
 * `consentTerms` / `consentMarketing` are the record of what the visitor agreed
 * to at submission time, so keep them alongside the contact details.
 */
export const Bookings: CollectionConfig = {
  slug: "bookings",
  labels: { singular: "Booking", plural: "Bookings" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["firstName", "lastName", "email", "offering", "createdAt"],
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
    { name: "firstName", type: "text", required: true },
    { name: "lastName", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
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
      name: "hearAbout",
      type: "select",
      required: true,
      options: [
        { label: "Search engine", value: "search" },
        { label: "Recommendation or referral", value: "recommendation" },
        { label: "Social media", value: "social" },
        { label: "Event or conference", value: "event" },
        { label: "Blog, article, or newsletter", value: "content" },
        { label: "Other", value: "other" },
      ],
      admin: { description: "How they found us." },
    },
    { name: "message", type: "textarea", required: true },
    {
      name: "consentTerms",
      type: "checkbox",
      required: true,
      label: "Accepted terms of use and privacy policy",
      admin: { position: "sidebar" },
    },
    {
      name: "consentMarketing",
      type: "checkbox",
      label: "Opted in to email marketing",
      admin: { position: "sidebar" },
    },
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
