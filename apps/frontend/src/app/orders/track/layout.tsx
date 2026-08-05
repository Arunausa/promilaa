import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | Promilaa Realtime Order Status BD",
  description: "Track your Promilaa order status in real time using your Order ID and phone number.",
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
