import type { Where } from "payload";
import { getPayloadClient } from "./getPayload";
import type { Locale } from "./i18n/config";

type FindOptions = {
  where?: Where;
  sort?: string;
  limit?: number;
  depth?: number;
  /** Locale for returned content; missing values fall back to the default. */
  locale?: Locale;
};

/**
 * Reads documents from a Payload collection, degrading gracefully.
 *
 * Returns `null` (rather than throwing) when Payload/the database is
 * unreachable, so pages can fall back to static content and the site keeps
 * building and rendering even before the CMS is provisioned.
 */
export async function findDocs<T = unknown>(
  collection: string,
  options: FindOptions = {},
): Promise<T[] | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: collection as any,
      depth: options.depth ?? 1,
      limit: options.limit ?? 100,
      where: options.where,
      sort: options.sort,
      locale: options.locale,
    });
    return result.docs as T[];
  } catch (err) {
    console.warn(
      `[cms] could not load "${collection}":`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

/** Convenience wrapper for fetching a single doc by an exact field match. */
export async function findOne<T = unknown>(
  collection: string,
  field: string,
  value: string,
  locale?: Locale,
): Promise<T | null> {
  const docs = await findDocs<T>(collection, {
    where: { [field]: { equals: value } } as Where,
    limit: 1,
    locale,
  });
  return docs && docs.length > 0 ? docs[0] : null;
}
