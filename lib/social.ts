/**
 * The company profiles, in one place: the header and the footer both render
 * this list, and the handles are `pluscodeio` everywhere (`pluscode` on
 * LinkedIn and Instagram belongs to other companies).
 */
export const socialLinks = [
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/pluscodeio/" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/pluscodeio/" },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/pluscodeio/" },
] as const;

export type SocialKey = (typeof socialLinks)[number]["key"];

/** Our own product. Linked from the footer and named on the workshop page. */
export const QUANTY_URL = "https://quanty.ai";
