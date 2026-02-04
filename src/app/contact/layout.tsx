import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Pluscode. Let's discuss your project and how we can help transform your business with custom software, AI solutions, and cloud services.",
  openGraph: {
    title: "Contact Us | Pluscode",
    description:
      "Get in touch with Pluscode. Let's discuss your project and how we can help transform your business.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
