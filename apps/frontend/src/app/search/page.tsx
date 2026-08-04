"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  compareAtPrice: number | null;
  images: { id: string; url: string; altText: string | null }[];
  category: { name: string; slug: string };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [inputValue, setInputValue] = useState(initialQ);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/search?q=${encodeURIComponent(q)}&limit=40`
      );
      const data = await res.json();
      setProducts(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(initialQ), 0);
    return () => clearTimeout(timer);
  }, [initialQ, fetchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    setQuery(inputValue.trim());
    fetchResults(inputValue.trim());
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">Search</h1>
        <form onSubmit={handleSearch} className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for Kurti, One Piece, Three Piece..."
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              autoFocus
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => { setInputValue(""); setProducts([]); setTotal(0); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button type="submit" size="lg" className="px-8">Search</Button>
        </form>
      </div>

      {/* Results */}
      {query && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {loading ? "Searching..." : `${total} result${total !== 1 ? "s" : ""} for "${query}"`}
          </p>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: product.basePrice,
              }}
            />
          ))}
        </div>
      )}

      {!loading && query && products.length === 0 && (
        <div className="text-center py-32">
          <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold tracking-tight mb-2">No results found</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            We couldn&apos;t find anything for &quot;{query}&quot;. Try different keywords.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Kurti", "One Piece", "Two Piece", "Three Piece"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setInputValue(term);
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                  fetchResults(term);
                  setQuery(term);
                }}
                className="px-4 py-2 border border-slate-200 rounded-full text-sm hover:border-slate-400 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !query && (
        <div className="text-center py-20 text-slate-400">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Enter a search term to find products</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-slate-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
