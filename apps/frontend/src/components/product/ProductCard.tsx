import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price?: number | string;
    basePrice?: number | string;
    compareAtPrice?: number | string | null;
    images?: { id?: string; url: string; altText?: string | null }[];
    variants?: { stock?: number; stockQuantity?: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0]?.url || "https://placehold.co/600x800/png?text=Promilaa+Ethnic+Wear";

  const displayPrice = Number(product.price ?? product.basePrice ?? 0);
  const displayComparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const isSale = displayComparePrice !== null && displayComparePrice > displayPrice;
  const discountPercent = isSale && displayComparePrice 
    ? Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100) 
    : 0;

  // Calculate total stock
  const totalStock = product.variants && product.variants.length > 0
    ? product.variants.reduce((acc, v) => acc + (v.stock ?? v.stockQuantity ?? 0), 0)
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-slate-100 shadow-sm border border-slate-100">
        <Image
          src={primaryImage}
          alt={product.images?.[0]?.altText || product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Discount Tag */}
        {isSale && (
          <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded shadow z-10">
            {discountPercent > 0 ? `${discountPercent}% OFF` : 'SALE'}
          </div>
        )}

        {/* Stock Status Badge */}
        {totalStock !== null && totalStock === 0 && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded shadow">
              Stock Out
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-slate-900">
            ৳{displayPrice}
          </span>
          {isSale && displayComparePrice && (
            <span className="text-xs text-slate-400 line-through">
              ৳{displayComparePrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
