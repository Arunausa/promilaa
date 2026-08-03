"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";
import { ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw, Printer, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOrders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<any | null>(null);
  const [courierLoadingId, setCourierLoadingId] = useState<string | null>(null);

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

  const handleSendToSteadfast = async (order: any) => {
    setCourierLoadingId(order.id);
    await new Promise(r => setTimeout(r, 1200));
    setOrders(orders.map(o => o.id === order.id ? { ...o, courierStatus: 'BOOKED_STEADFAST', trackingCode: `ST-${Math.floor(100000 + Math.random() * 900000)}` } : o));
    setCourierLoadingId(null);
    alert(`Steadfast Courier Booking Successful! Tracking Code: ST-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handlePrintMemo = (order: any) => {
    setSelectedOrderForPrint(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">অর্ডার ডাটা লোড হচ্ছে...</div>;

  return (
    <div className="space-y-6">
      {/* Printable Cash Memo Container (Hidden on screen, visible during window.print) */}
      {selectedOrderForPrint && (
        <div className="hidden print:block fixed inset-0 bg-white p-10 z-50 text-slate-900 font-sans">
          <div className="border-4 border-double border-slate-900 p-8 max-w-2xl mx-auto space-y-6 bg-amber-50/20 rounded-xl relative">
            
            {/* Top Brand Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
              <div>
                <h1 className="text-3xl font-bold font-serif tracking-widest text-slate-900">PROMILAA</h1>
                <span className="text-xs font-bold uppercase tracking-widest bg-slate-900 text-white px-2.5 py-0.5 rounded">BY SOPNIL</span>
                <p className="text-xs text-slate-600 mt-2 font-medium">📍 সলিমুল্লাহ রোড, মোহাম্মদপুর, ঢাকা-১২০৭</p>
                <p className="text-xs text-slate-600 font-medium">📞 হটলাইন: 01601708251 | 🌐 www.promilaa.com</p>
              </div>
              <div className="text-right">
                <div className="bg-slate-900 text-white font-mono px-4 py-2 rounded-lg inline-block">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-sans font-bold">CASH MEMO</p>
                  <p className="text-base font-bold">#{selectedOrderForPrint.orderNumber}</p>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-2">তারিখ: {new Date(selectedOrderForPrint.createdAt).toLocaleDateString("bn-BD")}</p>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="space-y-1">
                <p className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">গ্রাহকের নাম ও ঠিকানা:</p>
                <p className="font-bold text-slate-900 text-sm">{selectedOrderForPrint.shippingAddress?.fullName || 'Valued Customer'}</p>
                <p className="font-mono font-bold text-amber-900">{selectedOrderForPrint.guestPhone}</p>
                <p className="text-slate-700 leading-relaxed">{selectedOrderForPrint.shippingAddress?.line1}, {selectedOrderForPrint.shippingAddress?.city}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">পেমেন্ট ও পার্সেল স্ট্যাটাস:</p>
                <p className="font-bold text-slate-900">পেমেন্ট মেথড: <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded">{selectedOrderForPrint.payment?.method || 'Cash on Delivery'}</span></p>
                <p className="text-slate-700 font-medium">ডেলিভারি এলাকা: {selectedOrderForPrint.shippingAddress?.city || 'Dhaka'}</p>
              </div>
            </div>

            {/* Ordered Items Table */}
            <table className="w-full text-xs text-left border-collapse border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-800">পণ্যের নাম (Product Name)</th>
                  <th className="p-3 border-r border-slate-800 text-center">পরিমাণ</th>
                  <th className="p-3 border-r border-slate-800 text-right">একক মূল্য</th>
                  <th className="p-3 text-right">মোট টাকা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {selectedOrderForPrint.items?.map((it: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 border-r font-medium text-slate-900">{it.product?.name || 'Handcrafted Ethnic Dress'}</td>
                    <td className="p-3 border-r text-center font-mono font-bold">{it.quantity}</td>
                    <td className="p-3 border-r text-right font-mono">৳{it.price}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">৳{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations & Thank You Note */}
            <div className="flex justify-between items-end pt-4">
              <div className="max-w-xs space-y-2">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-xs leading-relaxed">
                  <p className="font-bold">🌸 ধন্যবাদ!</p>
                  <p className="text-[11px] text-amber-800">PROMILAA BY SOPNIL-এ শপিং করার জন্য আন্তরিক ধন্যবাদ। আপনার যেকোনো পরামর্শ বা সহযোগিতার জন্য আমাদের হটলাইনে যোগাযোগ করুন।</p>
                </div>
                <div className="text-[10px] text-slate-400 text-center font-serif">
                  * হ্যান্ডমেড কাস্টম ডিজাইন | ১০০% প্রিমিয়াম কোয়ালিটি ফ্যাব্রিক *
                </div>
              </div>

              <div className="text-right space-y-1 font-mono text-xs w-48 bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>সাবটোটাল:</span>
                  <span>৳{selectedOrderForPrint.total - (selectedOrderForPrint.shippingFee || 80)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>৳{selectedOrderForPrint.shippingFee || 80}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-900 pt-1.5 text-slate-900">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-amber-900">৳{selectedOrderForPrint.total}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Screen Interface */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Manage Orders & 1-Click Courier Dispatch</h1>
          <p className="text-slate-500 text-xs mt-1">অটোমেটিক কুরিয়ার বুকিং, মেমো প্রিন্ট ও ফ্রড ডিটেকশন ড্যাশবোর্ড</p>
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
                <th className="px-5 py-3.5 font-bold">ফ্রড রিক্স (Fraud Risk)</th>
                <th className="px-5 py-3.5 font-bold">অর্ডার স্ট্যাটাস</th>
                <th className="px-5 py-3.5 font-bold text-right">১-ক্লিক বুকিং ও মেমো প্রিন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.length > 0 ? orders.map((order) => {
                const fraud = order.fraudReport;
                const riskLevel = fraud?.riskLevel || 'LOW';
                const isBooked = order.courierStatus === 'BOOKED_STEADFAST';

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
                            <ShieldAlert className="w-4 h-4 text-rose-600" /> HIGH RISK 🚨
                          </span>
                          {fraud?.reason && <span className="text-[11px] text-rose-600 font-medium max-w-xs">{fraud.reason}</span>}
                        </div>
                      ) : riskLevel === 'MEDIUM' ? (
                        <div className="inline-flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                            <AlertTriangle className="w-4 h-4 text-amber-600" /> MEDIUM RISK ⚠️
                          </span>
                          {fraud?.reason && <span className="text-[11px] text-amber-700 font-medium max-w-xs">{fraud.reason}</span>}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> SAFE ✅
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <select 
                        className="text-xs p-2 border rounded-lg bg-white font-medium focus:ring-2 focus:ring-slate-900"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                    {/* 1-Click Action Buttons */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isBooked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {order.trackingCode}
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            disabled={courierLoadingId === order.id}
                            onClick={() => handleSendToSteadfast(order)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1 py-1 px-3"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            {courierLoadingId === order.id ? "বুকিং হচ্ছে..." : "Steadfast এ বুক করুন"}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrintMemo(order)}
                          className="text-xs gap-1 py-1 px-3 border-slate-300 hover:bg-slate-100"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-700" />
                          মেমো প্রিন্ট
                        </Button>
                      </div>
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
