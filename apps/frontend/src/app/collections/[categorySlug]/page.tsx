import ProductCard from "@/components/product/ProductCard";
import CollectionFilters from "./CollectionFilters";
import { PackageX } from "lucide-react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";

async function getCategoryProducts(categorySlug: string, searchParams: any) {
  try {
    const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
    const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
    const inStockOnly = searchParams.inStock === 'true';

    const where: any = {
      isPublished: true,
    };

    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        slug: { equals: categorySlug, mode: 'insensitive' },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      };
    }

    let products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: searchParams.sort === 'price-asc' 
        ? { basePrice: 'asc' } 
        : searchParams.sort === 'price-desc' 
        ? { basePrice: 'desc' } 
        : { createdAt: 'desc' },
    });

    if (inStockOnly) {
      products = products.filter((p: any) => p.variants.some((v: any) => v.stock > 0));
    }

    const totalCount = products.length;

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / 50) || 1
    };
  } catch (error) {
    console.error("Failed to fetch collection products from database:", error);
    return { products: [], totalCount: 0, totalPages: 1 };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.categorySlug;
  const categoryTitle = categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const title = `${categoryTitle} Collection | Promilaa Ethnic Wear BD`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promilaa.vercel.app';
  
  const categoryImages: Record<string, string> = {
    'kurti': '/media/kurti/1.jpeg',
    'one-piece': '/media/one_piece/1.jpeg',
    'two-piece': '/media/two_piece/1.jpeg',
    'three-piece': '/media/three_piece/1.jpeg',
    'festive': '/media/festive/1.jpeg',
  };
  const ogImage = `${siteUrl}${categoryImages[categorySlug] || '/media/three_piece/1.jpeg'}`;

  return {
    title,
    description: `Shop premium ${categoryTitle} designs at Promilaa Bangladesh. High quality fabrics, authentic Bangladeshi ethnic wear at affordable prices.`,
    openGraph: {
      title,
      description: `Shop the latest ${categoryTitle} fashion at Promilaa Bangladesh.`,
      url: `${siteUrl}/collections/${categorySlug}`,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: categoryTitle,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `Shop the latest ${categoryTitle} fashion at Promilaa Bangladesh.`,
      images: [ogImage]
    }
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedParams.categorySlug;
  const categoryTitle = categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const { products, totalCount, totalPages } = await getCategoryProducts(categorySlug, resolvedSearchParams);
  const currentPage = Number(resolvedSearchParams.page) || 1;

  // Breadcrumb Schema for Google SERP
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://promilaa.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collections",
        "item": "https://promilaa.com/collections/kurti"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryTitle,
        "item": `https://promilaa.com/collections/${categorySlug}`
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Inject Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <div className="mb-12 border-b pb-6 text-center">
        <h1 className="text-4xl font-serif font-bold tracking-wider mb-2">{categoryTitle} Collection</h1>
        <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest">
          {totalCount} {totalCount === 1 ? 'item' : 'items'} available
        </p>
      </div>

      {/* Filters Component */}
      <CollectionFilters totalCount={totalCount} />

      {/* Grid */}
      {products.length > 0 ? (
        <div className="space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
          </div>
          
          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8 border-t">
              {Array.from({ length: totalPages }).map((_, i) => (
                <a 
                  key={i} 
                  href={`?page=${i + 1}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-md border ${currentPage === i + 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50'}`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-lg border border-dashed shadow-sm max-w-2xl mx-auto">
          <PackageX className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold tracking-tight mb-2">No items found</h3>
          <p className="text-muted-foreground mb-8">We couldn&apos;t find any products matching your filters.</p>
        </div>
      )}
    </div>
  );
}
