import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Promilaa Saved Designer Ethnic Wear",
  description: "View and manage your saved designer Kurtis, One-Piece, Two-Piece, and Three-Piece suits on Promilaa.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
