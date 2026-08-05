import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Promilaa Ethnic Wear BD",
  description: "Find answers to questions about ordering, cash on delivery, size exchange policy, and shipping across Bangladesh at Promilaa.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
