"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    basePrice: "",
    sku: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          basePrice: Number(formData.basePrice),
          // We will mock empty arrays for images/variants for the MVP
          images: [],
          variants: [{
            color: "Default",
            size: "Free Size",
            sku: formData.sku + "-FS",
            stockQuantity: 10,
            priceAdjustment: 0
          }]
        })
      });
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug *</label>
            <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="e.g. red-panjabi" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (৳) *</label>
            <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU *</label>
            <input required name="sku" value={formData.sku} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
            <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded-md bg-white">
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-md" rows={4} />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
