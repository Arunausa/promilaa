"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, Users, AlertTriangle, Package, BarChart3 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  highRiskOrders: number;
}

interface TopProduct {
  id: string;
  name: string;
  slug: string;
  totalSold: number;
  revenue: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

export default function AdminReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch<{ stats: Stats }>("/api/admin/stats");
        setStats(data.stats || data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const orderStatuses = [
    { label: "Pending",    value: stats?.pendingOrders || 0,  color: "bg-amber-500" },
    { label: "High Risk",  value: stats?.highRiskOrders || 0, color: "bg-red-500"   },
    { label: "Total",      value: stats?.totalOrders || 0,    color: "bg-slate-900" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border rounded-lg px-3 py-2">
          <BarChart3 className="w-4 h-4" />
          Live data
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)
        ) : (
          <>
            <StatCard icon={TrendingUp} label="Total Revenue" value={`৳${(stats?.totalRevenue || 0).toLocaleString()}`} sub="All confirmed orders" color="bg-green-100 text-green-700" />
            <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} sub="All time" color="bg-blue-100 text-blue-700" />
            <StatCard icon={Package} label="Total Products" value={stats?.totalProducts || 0} sub="Active listings" color="bg-purple-100 text-purple-700" />
            <StatCard icon={Users} label="Customers" value={stats?.totalUsers || 0} sub="Registered accounts" color="bg-indigo-100 text-indigo-700" />
            <StatCard icon={AlertTriangle} label="Pending Orders" value={stats?.pendingOrders || 0} sub="Awaiting confirmation" color="bg-amber-100 text-amber-700" />
            <StatCard icon={AlertTriangle} label="High Risk Orders" value={stats?.highRiskOrders || 0} sub="Fraud flagged" color="bg-red-100 text-red-700" />
          </>
        )}
      </div>

      {/* Order Status Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-slate-800 mb-6">Order Status Summary</h2>
        <div className="space-y-4">
          {orderStatuses.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <p className="text-sm text-slate-600 w-28">{item.label}</p>
              <div className="flex-1 bg-slate-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${item.color}`}
                  style={{
                    width: stats?.totalOrders
                      ? `${Math.min(100, (item.value / (stats.totalOrders || 1)) * 100)}%`
                      : "0%"
                  }}
                />
              </div>
              <span className="text-sm font-semibold w-8 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-500">
        <p className="font-medium text-slate-700 mb-1">Advanced Analytics — Coming in v1.1</p>
        <p>Detailed sales charts, product performance metrics, customer retention analysis, and revenue forecasting will be available in the next release.</p>
      </div>
    </div>
  );
}
