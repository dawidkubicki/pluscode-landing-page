"use client";

import { useEffect, useState } from "react";

/**
 * Pre-hydration `data-announcement` script (see layout.tsx for the attribute
 * contract). It must be part of the server-rendered HTML so the browser
 * executes it before first paint, but React never executes scripts it renders
 * on the client and warns about them — and this layout remounts whenever the
 * `[lang]` param changes. So the script is emitted only on the server render
 * and the matching hydration pass; every later mount renders nothing and
 * AnnouncementBar's layout effect keeps the attribute in sync instead.
 */
let hydrated = false;

export default function AnnouncementScript({ code }: { code: string }) {
  const [render] = useState(() => !hydrated);

  useEffect(() => {
    hydrated = true;
  }, []);

  if (!render) return null;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
