"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";
import { ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminOrders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ orders: any[] }>("/api/admin/orders");
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      fetchOrders();
    }
  }, [user]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">অর্ডার ডাটা লোড হচ্ছে...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Manage Orders & Fraud Control</h1>
          <p className="text-slate-500 text-xs mt-1">অটোমেটিক কুরিয়ার ফ্রড ডিটেকশন ও রিয়েল-টাইম অর্ডার ম্যানেজমেন্ট</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm bg-white hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-slate-600" /> রিফ্রেশ করুন
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900 text-white border-b">
              <tr>
                <th className="px-5 py-3.5 font-bold">অর্ডার নম্বর</th>
                <th className="px-5 py-3.5 font-bold">কাস্টমার ও ঠিকানা</th>
                <th className="px-5 py-3.5 font-bold">ফোন নম্বর</th>
                <th className="px-5 py-3.5 font-bold">মোট টাকা</th>
                <th className="px-5 py-3.5 font-bold">ফ্রড রিক্স স্ট্যাটাস (Fraud Check)</th>
                <th className="px-5 py-3.5 font-bold">অর্ডার স্ট্যাটাস</th>
                <th className="px-5 py-3.5 font-bold">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.length > 0 ? orders.map((order) => {
                const fraud = order.fraudReport;
                const riskLevel = fraud?.riskLevel || 'LOW';

                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 font-mono">
                      {order.orderNumber}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{order.shippingAddress?.fullName || 'Guest'}</p>
                      <p className="text-xs text-slate-500 max-w-xs">{order.shippingAddress?.line1}, {order.shippingAddress?.city}</p>
                    </td>

                    <td className="px-5 py-4 font-mono font-medium text-slate-800">
                      {order.guestPhone}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900">
                      ৳{order.total}
                      <span className="block text-[10px] font-normal text-amber-700 font-sans">
                        {order.payment?.method || 'COD'}
                      </span>
                    </td>

                    {/* Fraud Risk Indicator Badge */}
                    <td className="px-5 py-4">
                      {riskLevel === 'HIGH' ? (
                        <div className="inline-flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 animate-pulse">
                            <ShieldAlert className="w-4 h-4 text-rose-600" /> HIGH RISK 🚨 (উচ্চ ঝুঁকি)
                          </span>
                          {fraud?.reason && <span className="text-[11px] text-rose-600 font-medium max-w-xs">{fraud.reason}</span>}
                        </div>
                      ) : riskLevel === 'MEDIUM' ? (
                        <div className="inline-flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                            <AlertTriangle className="w-4 h-4 text-amber-600" /> MEDIUM RISK ⚠️ (সন্দেহজনক)
                          </span>
                          {fraud?.reason && <span className="text-[11px] text-amber-700 font-medium max-w-xs">{fraud.reason}</span>}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> SAFE ✅ (নিরাপদ)
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase
                        ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : ''}
                        ${order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'PROCESSING' ? 'bg-indigo-100 text-indigo-800' : ''}
                        ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : ''}
                        ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : ''}
                        ${order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select 
                        className="text-xs p-2 border rounded-lg bg-white font-medium focus:ring-2 focus:ring-slate-900"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="PENDING">Pending (অপেক্ষমান)</option>
                        <option value="CONFIRMED">Confirmed (কনফার্মড)</option>
                        <option value="PROCESSING">Processing (প্রসেসিং)</option>
                        <option value="SHIPPED">Shipped (কুরিয়ারে পাঠানো)</option>
                        <option value="DELIVERED">Delivered (ডেলিভারড)</option>
                        <option value="CANCELLED">Cancelled (ক্যান্সেলড)</option>
                      </select>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                    এখনো পর্যন্ত কোনো অর্ডার পাওয়া যায়নি।
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
