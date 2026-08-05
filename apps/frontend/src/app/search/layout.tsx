import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Products | Promilaa Ethnic Wear Catalog BD",
  description: "Search for handcrafted Kurtis, 1-Piece dresses, 2-Piece sets, 3-Piece suits, and Festive collections at Promilaa.",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
