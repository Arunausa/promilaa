import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer)
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promilaa.com';

// OPTIMIZED FOR PERFECT SEO (TITLE 30-60 CHARS, META DESC 120-160 CHARS) & HREFLANG
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PROMILAA | Women's Ethnic Fashion & Kurtis Dhaka",
    template: "%s | PROMILAA Ethnic Fashion Dhaka",
  },
  description: "Shop designer Kurtis, 1-Piece, 2-Piece, 3-Piece & Festive ethnic wear for women at Promilaa in Dhaka, Bangladesh. Fast Cash on Delivery nationwide.",
  keywords: [
    "Promilaa", "Promilaa Mohammadpur", "Women Ethnic Wear Dhaka",
    "Kurti Shop Dhaka", "Three Piece Collection Mohammadpur", "One Piece Dress Dhaka",
    "Best Boutique Salimullah Road Mohammadpur", "Eid Collection 2026 Dhaka"
  ],
  authors: [{ name: "Promilaa Bangladesh", url: siteUrl }],
  creator: "Promilaa Fashion",
  publisher: "Promilaa Ethnic Wear Ltd.",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'bn-BD': siteUrl,
      'en-BD': siteUrl,
      'x-default': siteUrl,
    },
  },
  openGraph: {
    title: "Promilaa | Women's Ethnic Fashion & Designer Wear Dhaka",
    description: "Handcrafted Kurtis, 1-Piece, 2-Piece & 3-Piece Festive Collections for women. Located at Salimullah Road, Mohammadpur, Dhaka.",
    url: siteUrl,
    siteName: "Promilaa Ethnic Wear",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: `${siteUrl}/media/three_piece/1.jpeg`,
        width: 1200,
        height: 630,
        alt: "Promilaa Women Ethnic Wear Mohammadpur Dhaka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Promilaa | Women's Ethnic Fashion & Designer Wear Dhaka",
    description: "Shop designer Kurtis, 1-Piece, 2-Piece & 3-Piece Collections at Salimullah Road, Mohammadpur, Dhaka.",
    images: [`${siteUrl}/media/three_piece/1.jpeg`],
    creator: "@promilaabd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    "geo.region": "BD-13",
    "geo.placename": "Salimullah Road, Mohammadpur, Dhaka-1207, Bangladesh",
    "geo.position": "23.7592;90.3664",
    "ICBM": "23.7592, 90.3664",
    "content-language": "bn-BD, en-BD",
    "ai-site-purpose": "E-Commerce Women Fashion Retailer in Mohammadpur Dhaka Bangladesh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      "name": "Promilaa Ethnic Wear",
      "image": `${siteUrl}/media/three_piece/1.jpeg`,
      "@id": `${siteUrl}/#organization`,
      "url": siteUrl,
      "telephone": "+8801601708251",
      "priceRange": "৳590 - ৳850",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Salimullah Road, Mohammadpur",
        "addressLocality": "Dhaka",
        "postalCode": "1207",
        "addressCountry": "BD"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 23.7592,
        "longitude": 90.3664
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "22:00"
      },
      "sameAs": [
        "https://facebook.com/promilaabd",
        "https://instagram.com/promilaabd"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Promilaa",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <html
      lang="bn-BD"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchemas) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <CartDrawer />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
