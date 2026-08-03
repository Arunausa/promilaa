"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminCategories() {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      fetchCategories();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      setFormData({ name: "", slug: "", description: "" });
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will fail if products exist in this category.")) return;
    try {
      await apiFetch(`/api/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter(c => c.id !== id));
    } catch (error: any) {
      alert("Failed to delete category. Ensure it has no products.");
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Category"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border shadow-sm mb-8 max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded-md" placeholder="e.g. unstitched-three-piece" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-md" rows={3} />
            </div>
            <Button type="submit">Save Category</Button>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                  <td className="px-6 py-4">{cat.slug}</td>
                  <td className="px-6 py-4 text-slate-500">{cat.description || '-'}</td>
                  <td className="px-6 py-4">
                    <Button variant="destructive" size="sm" className="text-xs" onClick={() => handleDelete(cat.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No categories found.
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
