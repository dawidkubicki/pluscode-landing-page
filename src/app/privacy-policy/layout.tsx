import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Pluscode's privacy policy. Learn how we collect, use, and protect your personal information when you use our services.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | Pluscode",
    description:
      "Learn how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
