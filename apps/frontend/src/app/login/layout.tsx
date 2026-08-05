import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Login & Account Access | Promilaa BD",
  description: "Sign in to your Promilaa customer account to view order history, manage wishlist, and track deliveries.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
