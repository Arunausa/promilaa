"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

export default function AdminBanners() {
  const { accessToken } = useAuthStore();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    placement: "homepage_hero",
    position: 0,
    isActive: true,
  });

  const fetchBanners = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/banners");
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners);
      }
    } catch (error) {
      console.error("Failed to fetch banners", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ title: "", imageUrl: "", linkUrl: "", placement: "homepage_hero", position: 0, isActive: true });
        fetchBanners();
      } else {
        alert("Failed to create banner");
      }
    } catch (error) {
      console.error("Failed to create banner", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) fetchBanners();
    } catch (error) {
      console.error("Failed to delete banner", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="bg-white p-6 border rounded shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="Summer Sale"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input 
                required 
                value={formData.imageUrl} 
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Link URL</label>
              <Input 
                value={formData.linkUrl} 
                onChange={(e) => setFormData({...formData, linkUrl: e.target.value})} 
                placeholder="/collections/sale"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Placement</label>
              <select 
                value={formData.placement}
                onChange={(e) => setFormData({...formData, placement: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="homepage_hero">Homepage Hero</option>
                <option value="collection_top">Collection Top</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Banner
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {banners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded bg-slate-50">
              No banners active.
            </div>
          ) : (
            banners.map((banner: any) => (
              <div key={banner.id} className="flex gap-4 p-4 border rounded bg-white items-center">
                <img src={banner.imageUrl} alt={banner.title} className="w-32 h-20 object-cover rounded bg-slate-100" />
                <div className="flex-1">
                  <h3 className="font-bold">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground">Placement: {banner.placement}</p>
                  <p className="text-xs text-muted-foreground">Status: {banner.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(banner.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
