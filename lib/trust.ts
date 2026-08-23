import { findDocs } from "./cms";
import { img, type Img } from "./team";

type TrustLogoDoc = {
  id: string | number;
  name: string;
  logo?: Parameters<typeof img>[0];
  order?: number | null;
  isActive?: boolean | null;
};

export type TrustLogo = { id: string; name: string; logo: NonNullable<Img> };

/**
 * Active client logos for the hero trust strip, ordered. Empty array when the
 * CMS is unreachable or nothing is configured — the hero then falls back to
 * the dictionary's text names.
 */
export async function getTrustLogos(): Promise<TrustLogo[]> {
  const docs = await findDocs<TrustLogoDoc>("trust-logos", {
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 20,
    depth: 1,
  });
  if (!docs) return [];
  return docs.flatMap((d) => {
    const logo = img(d.logo, d.name);
    return logo ? [{ id: String(d.id), name: d.name, logo }] : [];
  });
}
