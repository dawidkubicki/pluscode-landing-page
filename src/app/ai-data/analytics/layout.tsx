import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Analytics Services",
  description:
    "Transform data into actionable insights with business intelligence, data visualization, warehousing, and predictive analytics solutions.",
  keywords: [
    "data analytics",
    "business intelligence",
    "data visualization",
    "data warehousing",
    "predictive analytics",
    "real-time analytics",
    "data governance",
  ],
  openGraph: {
    title: "Data Analytics Services | Pluscode",
    description:
      "Transform data into actionable insights with business intelligence, data visualization, and predictive analytics.",
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
