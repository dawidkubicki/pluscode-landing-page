import type { CollectionConfig } from "payload";

/**
 * Messages sent through the contact form. Slug and tables are the original
 * `bookings` ones, which also hold the leads from the earlier booking forms,
 * hence the offering and "how they found us" fields the current form leaves
 * alone. Not localized: a submission is a single record. Public create so the
 * site can submit, signed-in read so personal data stays private.
 *
 * `consentTerms` / `consentMarketing` are the record of what the visitor agreed
 * to at submission time, so keep them alongside the contact details.
 */
export const Bookings: CollectionConfig = {
  slug: "bookings",
  labels: { singular: "Message", plural: "Messages" },
  admin: {
    group: "Inbox",
    useAsTitle: "email",
    defaultColumns: ["firstName", "lastName", "email", "message", "createdAt"],
    description: "Messages sent through the contact form.",
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
      admin: {
        description: "The contact form always sends General enquiry. Older leads name a booking page.",
      },
    },
    {
      // Optional since the October 2026 form, which no longer asks. The column
      // lost its NOT NULL in 20261014_090000_portfolio_and_pages.
      name: "hearAbout",
      type: "select",
      options: [
        { label: "Search engine", value: "search" },
        { label: "Recommendation or referral", value: "recommendation" },
        { label: "Social media", value: "social" },
        { label: "Event or conference", value: "event" },
        { label: "Blog, article, or newsletter", value: "content" },
        { label: "Other", value: "other" },
      ],
      admin: { description: "How they found us. Asked by the earlier forms only." },
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
      // The default mirrors the column, which has had DEFAULT false since
      // 20260823_090000_lead_form_fields.
      name: "consentMarketing",
      type: "checkbox",
      defaultValue: false,
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
