"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, X } from "lucide-react";

export default function CollectionFilters({ totalCount }: { totalCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  
  const sort = searchParams.get("sort") || "newest";
  const inStock = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilter = (name: string, value: string) => {
    router.push(`?${createQueryString(name, value)}`);
  };

  const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = formData.get("min") as string;
    const max = formData.get("max") as string;
    
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");
    
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`?`);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-white p-4 border rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(minPrice || maxPrice || inStock) && (
              <span className="bg-slate-900 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center ml-1">
                !
              </span>
            )}
          </Button>
          <span className="text-sm text-muted-foreground hidden sm:block">
            Showing {totalCount} {totalCount === 1 ? 'result' : 'results'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 hidden sm:block">Sort by:</label>
          <select 
            value={sort}
            onChange={(e) => handleFilter("sort", e.target.value)}
            className="text-sm border-none bg-slate-50 py-1.5 px-3 rounded-md cursor-pointer outline-none ring-1 ring-slate-200 focus:ring-slate-400"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {isOpen && (
        <div className="bg-white border rounded-lg p-5 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter Options
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Availability */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-slate-700">Availability</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={inStock}
                  onChange={(e) => handleFilter("inStock", e.target.checked ? "true" : "")}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-sm">In stock only</span>
              </label>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-slate-700">Price Range (৳)</h4>
              <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
                <input 
                  type="number" 
                  name="min"
                  placeholder="Min" 
                  defaultValue={minPrice}
                  className="w-24 text-sm px-3 py-1.5 border rounded-md"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="number" 
                  name="max"
                  placeholder="Max" 
                  defaultValue={maxPrice}
                  className="w-24 text-sm px-3 py-1.5 border rounded-md"
                />
                <Button type="submit" size="sm" variant="secondary" className="ml-2">Apply</Button>
              </form>
            </div>
          </div>

          {(minPrice || maxPrice || inStock) && (
            <div className="mt-6 pt-4 border-t flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
