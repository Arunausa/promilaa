"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch<{ stats: any }>("/api/admin/stats");
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return <div className="text-red-500 font-medium">Access Denied. Admin privileges required.</div>;
  }

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900">৳{stats?.totalRevenue || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900">{stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-slate-900">{stats?.totalProducts || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Welcome to Promilaa Admin</h2>
        <p className="text-slate-600">
          Use the sidebar to navigate through orders and products. 
          The dashboard provides a high-level overview of your store's performance.
        </p>
      </div>
    </div>
  );
}
