import type { ReactNode } from "react";
import {
  LinkJSXConverter,
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/href";

type LexicalNode = { type?: string; tag?: string; children?: LexicalNode[] };
type EditorState = { root: LexicalNode };

const isEditorState = (data: unknown): data is EditorState =>
  typeof data === "object" &&
  data !== null &&
  !Array.isArray(data) &&
  typeof (data as { root?: unknown }).root === "object" &&
  (data as { root?: unknown }).root !== null;

const HEADING_LEVEL = /^h([1-6])$/;

/** The shallowest heading level used in the article, or null when it has none. */
function shallowestHeading(node: LexicalNode): number | null {
  let min: number | null = null;
  const visit = (n: LexicalNode) => {
    const level = n.type === "heading" ? HEADING_LEVEL.exec(n.tag ?? "")?.[1] : undefined;
    if (level) min = min === null ? Number(level) : Math.min(min, Number(level));
    n.children?.forEach(visit);
  };
  visit(node);
  return min;
}

/** Where a link to another document in the CMS goes on the public site. */
function internalHref(
  linkNode: { fields: { doc?: { relationTo?: string; value?: unknown } | null } },
  locale: Locale,
): string {
  const doc = linkNode.fields.doc;
  const value = doc?.value;
  const slug =
    typeof value === "object" && value !== null
      ? (value as { slug?: unknown }).slug
      : undefined;
  if (doc?.relationTo === "insights" && typeof slug === "string" && slug) {
    return localizeHref(`/news/${slug}`, locale);
  }
  return localizeHref("/", locale);
}

/**
 * An article body: Payload's Lexical editor state as HTML inside `pc-prose`.
 *
 * The page title is the only `h1`, so headings are shifted until the article's
 * shallowest one is an `h2`. An editor who starts at "Heading 1" and one who
 * starts at "Heading 3" both get an outline that begins directly under the
 * title, with the steps between their headings kept.
 *
 * Link targets are rendered as stored. Older articles point at pages of the
 * previous site; those addresses are redirected, not rewritten here.
 */
export default function RichText({
  data,
  locale,
  className,
}: {
  data: unknown;
  locale: Locale;
  className?: string;
}): ReactNode {
  if (!isEditorState(data)) return null;

  const shallowest = shallowestHeading(data.root);
  const shift = shallowest === null ? 0 : 2 - shallowest;

  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => internalHref(linkNode, locale),
    }),
    heading: ({ node, nodesToJSX }) => {
      const level = Number(HEADING_LEVEL.exec(node.tag)?.[1] ?? 2);
      const Tag = `h${Math.min(6, Math.max(2, level + shift))}` as
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";
      return <Tag>{nodesToJSX({ nodes: node.children })}</Tag>;
    },
    // A node the site has no rendering for (an embedded relationship, a block
    // added later) is left out. The library's default prints "unknown node".
    unknown: () => null,
  });

  return (
    <LexicalRichText
      // The library's state type is stricter than "something with a root".
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data={data as any}
      converters={converters}
      className={["pc-prose", className].filter(Boolean).join(" ")}
    />
  );
}
