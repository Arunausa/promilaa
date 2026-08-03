"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Package, Plus, Trash2, Edit3, RefreshCw } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ data: any[] }>("/api/products?limit=100");
      setProducts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch immediately on mount for zero delay
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ডিলেট করতে চান?")) return;
    
    try {
      await apiFetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Products & Stock</h1>
          <p className="text-slate-500 text-xs mt-1">মোট {products.length} টি প্রোডাক্ট ক্যাটালগে যুক্ত রয়েছে</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={fetchProducts} variant="outline" size="sm" className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> রিফ্রেশ
          </Button>
          <Link href="/admin/inventory">
            <Button variant="outline" size="sm" className="gap-2">
              <Package className="w-4 h-4" /> Quick Inventory Manager
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800 text-white">
              <Plus className="w-4 h-4" /> + Add New Product
            </Button>
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-medium">
          প্রোডাক্ট ক্যাটালগ দ্রুত লোড হচ্ছে...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price & Discount</th>
                  <th className="px-6 py-4">Total Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length > 0 ? products.map((product) => {
                  const totalStock = product.variants?.reduce((acc: number, v: any) => acc + (v.stock ?? v.stockQuantity ?? 0), 0) ?? 0;
                  const isSale = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.basePrice);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <img 
                          src={product.images?.[0]?.url || "https://placehold.co/100x100"} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200" 
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{product.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                          {product.category?.name || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-bold">৳{product.basePrice}</span>
                          {isSale && (
                            <span className="text-xs text-slate-400 line-through">৳{product.compareAtPrice}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          totalStock > 5 ? 'bg-emerald-100 text-emerald-800' : totalStock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {totalStock > 0 ? `${totalStock} in stock` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            onClick={() => handleDelete(product.id)}
                            variant="ghost" 
                            size="sm" 
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                      কোনো প্রোডাক্ট পাওয়া যায়নি। নতুন প্রোডাক্ট যোগ করতে উপরের "+ Add New Product" বাটনে ক্লিক করুন।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
