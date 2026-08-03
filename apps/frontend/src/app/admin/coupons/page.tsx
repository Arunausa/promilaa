"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Tag } from "lucide-react";

export default function AdminCoupons() {
  const { accessToken } = useAuthStore();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 0,
    maxUses: 100,
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      // Assuming a GET /api/coupons endpoint exists for admin
      const res = await fetch("/api/coupons", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount),
          maxUses: Number(formData.maxUses),
        }),
      });

      if (res.ok) {
        setFormData({ ...formData, code: "" });
        fetchCoupons();
      } else {
        alert("Failed to create coupon");
      }
    } catch (error) {
      console.error("Failed to create coupon", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="bg-white p-6 border rounded shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Code</label>
              <Input 
                required 
                className="uppercase"
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                placeholder="E.g. SUMMER20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select 
                  value={formData.discountType}
                  onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed (৳)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Value</label>
                <Input 
                  required 
                  type="number"
                  value={formData.discountValue} 
                  onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})} 
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Min Order Amount (৳)</label>
              <Input 
                required 
                type="number"
                value={formData.minOrderAmount} 
                onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Uses</label>
              <Input 
                required 
                type="number"
                value={formData.maxUses} 
                onChange={(e) => setFormData({...formData, maxUses: Number(e.target.value)})} 
              />
            </div>
            
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Create Coupon
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded bg-slate-50">
              No coupons active.
            </div>
          ) : (
            coupons.map((coupon: any) => (
              <div key={coupon.id} className="flex justify-between p-4 border rounded bg-white items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{coupon.code}</h3>
                    <p className="text-sm text-muted-foreground">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% off` : `৳${coupon.discountValue} off`} 
                      {' • '} Min ৳{coupon.minOrderAmount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uses: {coupon.usedCount || 0} / {coupon.maxUses || '∞'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${coupon.isActive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
