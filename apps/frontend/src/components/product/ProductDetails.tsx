"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";

interface Variant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  stock?: number;
  stockQuantity?: number;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: number;
  basePrice?: number;
  compareAtPrice?: number | null;
  category: { name: string; slug: string };
  images: { id: string; url: string; altText: string | null }[];
  variants: Variant[];
}

export default function ProductDetails({ product }: { product: Product }) {
  const displayPrice = Number(product.price ?? product.basePrice ?? 0);
  const displayComparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;

  const [selectedColor, setSelectedColor] = useState<string | null>(product.variants?.[0]?.color || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.variants?.[0]?.size || null);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.url || "https://placehold.co/600x800/png?text=Promilaa+Ethnic+Wear");

  const addItem = useCartStore((state) => state.addItem);

  // Extract unique colors and sizes
  const availableColors = Array.from(new Set(product.variants?.map((v) => v.color).filter(Boolean))) as string[];
  const availableSizes = Array.from(new Set(product.variants?.map((v) => v.size).filter(Boolean))) as string[];

  // Find the currently selected variant
  const currentVariant = product.variants?.find(
    (v) => (v.color === selectedColor || (!v.color && !selectedColor)) && 
           (v.size === selectedSize || (!v.size && !selectedSize))
  ) || product.variants?.[0];

  const currentStock = currentVariant ? (currentVariant.stock ?? currentVariant.stockQuantity ?? 0) : 0;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (!currentVariant) return;

    addItem({
      id: currentVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      image: selectedImage,
      color: selectedColor || "Default",
      size: selectedSize || "Default",
      quantity: 1,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4">
        <div className="aspect-[3/4] w-full bg-slate-100 overflow-hidden relative rounded-lg">
          <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
          {displayComparePrice && displayComparePrice > displayPrice && (
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded shadow">
              SALE
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img) => (
              <button 
                key={img.id} 
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 aspect-[3/4] bg-slate-100 rounded overflow-hidden border-2 ${selectedImage === img.url ? 'border-slate-900' : 'border-transparent'}`}
              >
                <img src={img.url} alt={img.altText || 'Thumbnail'} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col py-6">
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-2">
          {product.category?.name}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-3xl font-bold text-slate-900">৳{displayPrice}</span>
          {displayComparePrice && displayComparePrice > displayPrice && (
            <>
              <span className="text-xl text-slate-400 line-through">৳{displayComparePrice}</span>
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded">
                সেভ ৳{displayComparePrice - displayPrice} ({Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)}% ছাড়)
              </span>
            </>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="mb-6">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" /> Stock Out (স্টক নেই)
            </span>
          ) : currentStock <= 5 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600" /> স্টক সীমিত — মাত্র {currentStock} টি পিস বাকি!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> ইন স্টক ({currentStock} টি পিস এভেইলএবল)
            </span>
          )}
        </div>

        {/* Colors */}
        {availableColors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Color: <span className="text-muted-foreground">{selectedColor}</span></h3>
            <div className="flex gap-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    selectedColor === color ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {availableSizes.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Size: <span className="text-muted-foreground">{selectedSize}</span></h3>
              <button className="text-xs text-muted-foreground underline underline-offset-4">Size Guide</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border rounded-md text-sm font-medium transition-colors ${
                    selectedSize === size ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <Button 
          size="lg" 
          className="w-full py-6 text-base" 
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        {/* Description */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h3 className="font-semibold text-lg mb-4">Product Details</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description || "No description available for this product."}
          </p>
        </div>
      </div>
    </div>
  );
}
