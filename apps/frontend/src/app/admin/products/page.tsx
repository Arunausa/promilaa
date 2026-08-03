"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Package, Plus, Trash2, Edit3, ArrowUpRight, AlertTriangle } from "lucide-react";

export default function AdminProducts() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await apiFetch<{ data: any[] }>("/api/products?limit=100");
      setProducts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      fetchProducts();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await apiFetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading product catalog...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Products & Stock</h1>
          <p className="text-slate-500 text-sm mt-1">Total {products.length} products in catalog</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/inventory">
            <Button variant="outline" className="gap-2">
              <Package className="w-4 h-4" /> Quick Inventory Manager
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4" /> + Add New Product
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-slate-600 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price & Discount</th>
                <th className="px-6 py-4">Total Stock</th>
                <th className="px-6 py-4">Status</th>
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
                        className="w-12 h-12 rounded-lg object-cover border" 
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                        {product.category?.name || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">৳{product.basePrice}</span>
                        {isSale && (
                          <span className="text-xs text-slate-400 line-through">৳{product.compareAtPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {totalStock > 0 ? (
                        <span className="text-slate-900 font-mono text-base">{totalStock} <span className="text-xs font-normal text-slate-500">pcs</span></span>
                      ) : (
                        <span className="text-red-600 font-bold text-xs">0 pcs</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {totalStock === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          Stock Out
                        </span>
                      ) : totalStock <= 5 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/products/${product.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View live page">
                            <ArrowUpRight className="w-4 h-4 text-slate-500" />
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-8 px-3 text-xs" 
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No products found in catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
