"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, ShieldAlert, ArrowUpRight } from "lucide-react";

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
    return <div className="p-8 text-rose-600 font-bold bg-rose-50 border rounded-xl">Access Denied. Admin privileges required.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-xs text-slate-500 mt-1">প্রমিলা ই-কমার্স শপের সার্বিক পারফরম্যান্স ও লাইভ স্ট্যাটিস্টিক্স</p>
      </div>
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">মোট রেভিনিউ</span>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-28 bg-slate-100 rounded animate-pulse"></div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">৳{stats?.totalRevenue?.toLocaleString("bn-BD") || 0}</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
              </span>
            </div>
          )}
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">মোট অর্ডার</span>
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-20 bg-slate-100 rounded animate-pulse"></div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">{stats?.totalOrders || 0}</span>
              <span className="text-xs text-slate-400 font-medium">অর্ডার কমপ্লিট</span>
            </div>
          )}
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">মোট প্রোডাক্ট</span>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-20 bg-slate-100 rounded animate-pulse"></div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">{stats?.totalProducts || 0}</span>
              <span className="text-xs text-slate-400 font-medium">লাইভ আইটেম</span>
            </div>
          )}
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">মোট কাস্টমার</span>
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-20 bg-slate-100 rounded animate-pulse"></div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">{stats?.totalUsers || 0}</span>
              <span className="text-xs text-slate-400 font-medium">নিবন্ধিত ইউজার</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Guide Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl border shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full mb-3 inline-block border border-amber-500/30">
            High Performance Engine
          </span>
          <h2 className="text-2xl font-serif font-bold mb-3">Welcome to Promilaa Executive Command Center</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            বামপাশের সাইডবার ব্যবহার করে ক্যাটাগরি, প্রোডাক্ট, অর্ডার ও কুরিয়ার ফ্রড চেক এক্সেস করুন। সিস্টেমটিতে সংযোগ স্পিড সর্বোচ্চ বাড়িয়ে লাইভ ক্যাশিং যুক্ত করা হয়েছে।
          </p>
        </div>
      </div>
    </div>
  );
}
