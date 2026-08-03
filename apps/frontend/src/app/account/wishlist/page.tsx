"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const data = await apiFetch<{ items: any[] }>("/api/wishlist");
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await apiFetch("/api/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId })
      });
      setItems(items.filter(item => item.productId !== productId));
    } catch (error) {
      alert("Failed to remove item");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg">
          <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
          <Link href="/collections/women">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-slate-100 mb-4 overflow-hidden rounded">
                {item.product.images?.[0] && (
                  <img 
                    src={item.product.images[0].url} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                )}
                <button 
                  onClick={(e) => { e.preventDefault(); handleRemove(item.productId); }}
                  className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-white"
                >
                  ✕
                </button>
              </div>
              <Link href={`/products/${item.product.slug}`}>
                <h3 className="font-semibold text-sm hover:underline">{item.product.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">৳{item.product.basePrice}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
