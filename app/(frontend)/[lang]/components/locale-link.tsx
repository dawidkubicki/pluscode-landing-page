"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./locale-context";
import { localizeHref } from "@/lib/i18n/href";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * Drop-in for `next/link` that prefixes internal paths with the active locale,
 * so navigating within `/pl` stays on `/pl` (instead of the proxy re-detecting
 * the language from the browser). External, mailto/tel and hash links pass
 * through unchanged.
 */
export default function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = useLocale();
  return <Link href={localizeHref(href, locale)} {...props} />;
}
