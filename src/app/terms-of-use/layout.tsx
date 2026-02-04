import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Pluscode's terms of use. Read our terms and conditions for using our website and services.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Use | Pluscode",
    description: "Read our terms and conditions for using our website and services.",
  },
};

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
