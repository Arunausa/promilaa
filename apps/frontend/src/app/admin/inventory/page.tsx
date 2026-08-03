"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Package, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Variant {
  id: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  product: { name: string; slug: string };
}

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "low">("all");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const endpoint = viewMode === "low" ? "/api/inventory/low-stock" : "/api/inventory";
      const data = await apiFetch<{ data: Variant[] }>(endpoint);
      setVariants(data.data || []);
    } catch {
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, [viewMode]);

  const handleEdit = (variant: Variant) => {
    setEditingId(variant.id);
    setEditStock(variant.stock);
  };

  const handleSave = async (variantId: string) => {
    setSaving(true);
    try {
      await apiFetch(`/api/inventory/${variantId}`, {
        method: "PUT",
        body: JSON.stringify({ stock: editStock, reason: "Admin manual update" }),
      });
      setVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, stock: editStock } : v))
      );
      setEditingId(null);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button variant="outline" size="sm" onClick={fetchInventory} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            viewMode === "all" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
          }`}
        >
          <Package className="w-4 h-4 inline mr-1.5" />All Items
        </button>
        <button
          onClick={() => setViewMode("low")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            viewMode === "low" ? "bg-red-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
          }`}
        >
          <AlertTriangle className="w-4 h-4 inline mr-1.5" />Low Stock (≤5)
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Color</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                  ))}
                </tr>
              ))
            ) : variants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                  {viewMode === "low" ? "No low-stock items. Great!" : "No inventory found."}
                </td>
              </tr>
            ) : (
              variants.map((variant) => (
                <tr key={variant.id} className={`hover:bg-slate-50 ${variant.stock === 0 ? "bg-red-50/40" : variant.stock <= 5 ? "bg-amber-50/40" : ""}`}>
                  <td className="px-6 py-4 font-medium text-slate-800 max-w-[200px] truncate">{variant.product.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{variant.sku}</td>
                  <td className="px-6 py-4 text-slate-600">{variant.color || "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{variant.size || "—"}</td>
                  <td className="px-6 py-4">
                    {editingId === variant.id ? (
                      <input
                        type="number"
                        min={0}
                        value={editStock}
                        onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    ) : (
                      <span className={`font-semibold ${variant.stock === 0 ? "text-red-600" : variant.stock <= 5 ? "text-amber-600" : "text-slate-800"}`}>
                        {variant.stock === 0 ? "Out of stock" : variant.stock}
                        {variant.stock <= 5 && variant.stock > 0 && (
                          <span className="ml-1 text-xs font-normal text-amber-500">low</span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === variant.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(variant.id)} disabled={saving}>
                          {saving ? "..." : "Save"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(variant)}>Edit</Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
