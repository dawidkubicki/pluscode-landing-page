import type { FieldHook } from "payload";

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/** Auto-fills the slug from the title when left blank. */
export const formatSlug: FieldHook = ({ value, data, originalDoc }) => {
  if (typeof value === "string" && value.length > 0) return slugify(value);
  const fallback = data?.title ?? originalDoc?.title;
  return typeof fallback === "string" ? slugify(fallback) : value;
};
