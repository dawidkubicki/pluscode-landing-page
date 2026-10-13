import type { FieldHook } from "payload";

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/** Normalizes a typed slug, and fills it from `source` when left blank. */
export const slugFrom =
  (source: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === "string" && value.length > 0) return slugify(value);
    const fallback = data?.[source] ?? originalDoc?.[source];
    return typeof fallback === "string" ? slugify(fallback) : value;
  };

/** Auto-fills the slug from the title when left blank. */
export const formatSlug: FieldHook = slugFrom("title");
