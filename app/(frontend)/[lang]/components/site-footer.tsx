import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* PLACEHOLDER: the home-and-chrome agent replaces this body. The props are
   the contract and stay as they are. */
export default function SiteFooter({
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="pc-container py-10 text-fine text-grey">
      Pluscode © {new Date().getFullYear()}. {dict.footer.rights}
    </footer>
  );
}
