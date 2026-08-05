import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Promilaa Ethnic Wear Bangladesh",
  description: "Dhaka ৳80 delivery in 24-48 hours. Outside Dhaka ৳150 delivery across 64 districts in Bangladesh via Steadfast and Pathao courier.",
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
