"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  isLocale,
  localeHrefLang,
  localeLabels,
  localeNames,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { useLocale } from "../locale-context";

/** `/en/news/x` in Polish is `/pl/news/x`: only the first segment changes. */
export function swapLocale(pathname: string, to: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) segments[0] = to;
  else segments.unshift(to);
  return `/${segments.join("/")}`;
}

/** The path after the locale: "" for the home page, "/about", "/news/x". */
export function pathAfterLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) segments.shift();
  return segments.length ? `/${segments.join("/")}` : "";
}

/**
 * "EN / PL". Each code links to the page the visitor is on, in that language.
 * `tone` names the ground it sits on.
 */
export default function LanguageSwitch({
  label,
  tone,
  className,
  onNavigate,
}: {
  /** Names the group for assistive technology ("Language"). */
  label: string;
  tone: "dark" | "light";
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const current = useLocale();
  const active = tone === "dark" ? "text-white" : "text-navy";
  const idle =
    tone === "dark" ? "text-grey-soft hover:text-white" : "text-grey hover:text-blue";

  return (
    <div
      role="group"
      aria-label={label}
      className={["flex items-center", className].filter(Boolean).join(" ")}
    >
      {locales.map((locale, i) => (
        <Fragment key={locale}>
          {i > 0 && (
            <span aria-hidden="true" className="pc-nav-link text-grey-soft">
              /
            </span>
          )}
          <Link
            href={swapLocale(pathname, locale)}
            hrefLang={localeHrefLang[locale]}
            lang={locale}
            aria-label={localeLabels[locale]}
            aria-current={locale === current ? "true" : undefined}
            onClick={onNavigate}
            className={`pc-nav-link inline-flex min-h-11 items-center px-2 ${
              locale === current ? active : idle
            }`}
          >
            {localeNames[locale]}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
