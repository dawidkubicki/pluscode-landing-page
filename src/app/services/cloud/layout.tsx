import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloud Services & Infrastructure",
  description:
    "Cloud migration, infrastructure management, Kubernetes, DevOps, and cloud security services. Modernize your infrastructure with AWS, Azure, and GCP solutions.",
  keywords: [
    "cloud services",
    "cloud migration",
    "AWS",
    "Azure",
    "GCP",
    "Kubernetes",
    "DevOps",
    "cloud infrastructure",
    "cloud security",
  ],
  openGraph: {
    title: "Cloud Services & Infrastructure | Pluscode",
    description:
      "Cloud migration, infrastructure management, Kubernetes, DevOps, and cloud security services.",
  },
};

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
