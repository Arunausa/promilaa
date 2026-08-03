import ProductDetails from "@/components/product/ProductDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

async function getProduct(slug: string) {
  try {
    const res = await fetch(`http://localhost:3001/api/products/${slug}`, {
      next: { revalidate: 60 }, 
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch product');
    }
    const data = await res.json();
    return data.product || data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);
  
  if (!product) {
    return { title: 'Product Not Found | Promilaa' };
  }

  const title = `${product.name} | Promilaa Ethnic Wear`;
  const description = product.description?.slice(0, 160) || 'Shop Bangladeshi women ethnic wear at Promilaa.';
  const image = product.images?.[0]?.url || 'https://promilaa.com/og-image.jpg';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://promilaa.com/products/${product.slug}`,
      images: [{ url: image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    }
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const displayPrice = Number(product.price ?? product.basePrice ?? 0);
  const images = product.images?.map((i: any) => i.url) || [];

  // Google Rich Snippets JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description,
    "sku": product.slug,
    "brand": {
      "@type": "Brand",
      "name": "Promilaa"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://promilaa.com/products/${product.slug}`,
      "priceCurrency": "BDT",
      "price": displayPrice,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Embedded Google Search Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} />
    </div>
  );
}
