/**
 * Line glyphs for the "follow the data" flow diagram.
 *
 * The diagram carries very little copy on purpose, so each record, step, system
 * and outcome leans on a glyph to say what it is at a glance. Names are picked
 * in the dictionaries (`icon` fields) and stay identical across locales.
 */

const paths: Record<string, React.ReactNode> = {
  doc: (
    <>
      <path d="M14 3v4.5a1 1 0 0 0 1 1h4.5" />
      <path d="M19.5 8.5V19a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2H14l5.5 5.5Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 8 6 8-6" />
    </>
  ),
  db: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 20 7.2v9.6L12 21l-8-4.2V7.2Z" />
      <path d="m4 7.2 8 4.3 8-4.3" />
      <path d="M12 11.5V21" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8.5V6a2 2 0 0 1 2-2h2.5" />
      <path d="M15.5 4H18a2 2 0 0 1 2 2v2.5" />
      <path d="M20 15.5V18a2 2 0 0 1-2 2h-2.5" />
      <path d="M8.5 20H6a2 2 0 0 1-2-2v-2.5" />
      <path d="M4 12h16" />
    </>
  ),
  match: (
    <>
      <path d="M3.5 8.5h13m0 0L13 5m3.5 3.5L13 12" />
      <path d="M20.5 15.5h-13m0 0L11 12m-3.5 3.5L11 19" />
    </>
  ),
  ledger: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8.5 3v18" />
      <path d="m11.5 12.5 2 2 4-4" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11.5A7.5 7.5 0 0 1 13.5 19H9l-5 3 1.5-4.3A7.5 7.5 0 0 1 13.5 4 7.5 7.5 0 0 1 21 11.5Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  pen: (
    <>
      <path d="m4 20 1-4.2L16.4 4.4a2.1 2.1 0 0 1 3 3L8 18.8 4 20Z" />
      <path d="m14.5 6.5 3 3" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6" />
      <path d="M12 20V9" />
      <path d="M17 20V5" />
    </>
  ),
  cart: (
    <>
      <circle cx="9.5" cy="19.5" r="1.4" />
      <circle cx="17" cy="19.5" r="1.4" />
      <path d="M3 4h2.3l2.5 11.5h10.4L21 7.5H6.3" />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 17.5a8.5 8.5 0 1 1 17 0" />
      <path d="m12 17.5 4.8-5.4" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.6-2.2h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m4 17.5 5-4.5 3.5 3L16 13l5 4.5" />
    </>
  ),
  cpu: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2.2 2.6H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  link: (
    <>
      <path d="M10.5 13.5a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 1 0-6-6l-1.6 1.6" />
      <path d="M13.5 10.5a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 1 0 6 6l1.6-1.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.3l3.4 2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.2 21 19.5H3Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.2 2.5 2.5 4.9-5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6.5h10.5v10H3z" />
      <path d="M13.5 10h3.8l2.7 3.2v3.3h-6.5z" />
      <circle cx="7" cy="18.4" r="1.6" />
      <circle cx="16.8" cy="18.4" r="1.6" />
    </>
  ),
  tag: (
    <>
      <path d="M4 11.6V5a1 1 0 0 1 1-1h6.6L20 12.4 12.4 20Z" />
      <path d="M8 8h.01" />
    </>
  ),
  book: (
    <>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5Z" />
      <path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19" />
    </>
  ),
  list: (
    <>
      <path d="M8.5 6H20M8.5 12H20M8.5 18H20" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6 8h12v2.8a6 6 0 0 1-12 0Z" />
      <path d="M12 16.8V21" />
    </>
  ),
  sparkle: (
    <>
      <path d="m11 3 1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9Z" />
      <path d="m18 15.5.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
    </>
  ),
  factory: (
    <>
      <path d="M4 20.5v-8.2l5 2.8v-2.8l5 2.8V6.5h4.5v14" />
      <path d="M2.5 20.5h19" />
    </>
  ),
  diamond: (
    <>
      <path d="m12 3 9 9-9 9-9-9Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.5 3.6 5.4 3.6 8.5S14.4 18 12 20.5C9.6 18 8.4 15.1 8.4 12S9.6 6 12 3.5Z" />
    </>
  ),
};

export type FlowIconName = keyof typeof paths;

export default function FlowIcon({
  name,
  className = "size-5",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? paths.doc}
    </svg>
  );
}
