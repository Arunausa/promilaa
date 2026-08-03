import ProductCard from "@/components/product/ProductCard";
import CollectionFilters from "./CollectionFilters";
import { PackageX } from "lucide-react";
import type { Metadata } from "next";

async function getCategoryProducts(categorySlug: string, searchParams: any) {
  try {
    const query = new URLSearchParams({
      categorySlug,
      limit: '50',
      ...(searchParams.sort && { sort: searchParams.sort }),
      ...(searchParams.minPrice && { minPrice: searchParams.minPrice }),
      ...(searchParams.maxPrice && { maxPrice: searchParams.maxPrice }),
      ...(searchParams.inStock && { inStock: searchParams.inStock }),
      ...(searchParams.page && { page: searchParams.page }),
    }).toString();

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const res = await fetch(`${apiBase}/api/products?${query}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { products: [], totalCount: 0, totalPages: 1 };
    
    const data = await res.json();
    return {
      products: data.data || [],
      totalCount: data.pagination?.total || 0,
      totalPages: data.pagination?.totalPages || 1
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
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
  
  return {
    title,
    description: `Shop premium ${categoryTitle} designs at Promilaa Bangladesh. High quality fabrics, authentic Bangladeshi ethnic wear at affordable prices.`,
    openGraph: {
      title,
      description: `Shop the latest ${categoryTitle} fashion at Promilaa Bangladesh.`,
      url: `https://promilaa.com/collections/${categorySlug}`,
      type: "website",
    },
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
          <p className="text-muted-foreground mb-8">We couldn't find any products matching your filters.</p>
        </div>
      )}
    </div>
  );
}
