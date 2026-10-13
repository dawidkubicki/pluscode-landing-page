import type { ReactNode } from "react";
import { COMPANY } from "@/lib/company";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * The register entries, as a ruled definition list. The values come from
 * lib/company.ts and are the same in every language; only the labels and the
 * country name are translated.
 */
export default function CompanyFacts({
  labels,
  className,
}: {
  labels: Dictionary["company"];
  className?: string;
}) {
  const rows: [string, ReactNode][] = [
    [labels.legalName, COMPANY.legalName],
    [
      labels.office,
      `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, ${labels.country}`,
    ],
    [labels.krs, COMPANY.krs],
    [labels.nip, COMPANY.nip],
    [labels.regon, COMPANY.regon],
    [
      labels.email,
      <a key="email" href={`mailto:${COMPANY.email}`} className="pc-link">
        {COMPANY.email}
      </a>,
    ],
  ];

  return (
    <dl className={["border-t border-grey-mid", className].filter(Boolean).join(" ")}>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid gap-x-8 gap-y-1 border-b border-grey-mid py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
        >
          <dt className="text-small text-grey sm:pt-0.5">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
