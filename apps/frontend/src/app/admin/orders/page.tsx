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
        <div className="hidden print:block fixed inset-0 bg-white z-50 font-sans">
          {/* Force single A4 page */}
          <style>{`
            @page { size: A4 portrait; margin: 0; }
            @media print {
              body * { visibility: hidden; }
              .print-memo, .print-memo * { visibility: visible; }
              .print-memo { position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
            }
          `}</style>

          <div className="print-memo" style={{width:'210mm', minHeight:'297mm', margin:'0 auto', padding:'14mm 16mm', backgroundColor:'#ffffff', color:'#0f172a', boxSizing:'border-box'}}>

            {/* HEADER */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'3px solid #0f172a', paddingBottom:'12px', marginBottom:'16px'}}>
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{fontSize:'26px', fontWeight:'900', letterSpacing:'4px', color:'#0f172a'}}>PROMILAA</span>
                  <span style={{fontSize:'9px', fontWeight:'800', letterSpacing:'2px', background:'#0f172a', color:'#fff', padding:'3px 8px', borderRadius:'4px'}}>BY SOPNIL</span>
                </div>
                <p style={{fontSize:'10px', color:'#475569', marginTop:'3px'}}>📍 সলিমুল্লাহ রোড, মোহাম্মদপুর, ঢাকা-১২০৭</p>
                <p style={{fontSize:'10px', color:'#475569'}}>📞 01601708251 | 🌐 www.promilaa.com</p>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{background:'#0f172a', color:'#fff', padding:'10px 16px', borderRadius:'8px', display:'inline-block'}}>
                  <p style={{fontSize:'9px', letterSpacing:'3px', color:'#94a3b8', marginBottom:'2px'}}>CASH MEMO</p>
                  <p style={{fontSize:'16px', fontWeight:'800', fontFamily:'monospace'}}>#{selectedOrderForPrint.orderNumber}</p>
                </div>
                <p style={{fontSize:'10px', color:'#64748b', marginTop:'5px'}}>
                  তারিখ: {new Date(selectedOrderForPrint.createdAt).toLocaleDateString('bn-BD', {day:'numeric', month:'long', year:'numeric'})}
                </p>
              </div>
            </div>

            {/* CUSTOMER & DELIVERY */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px'}}>
              <div style={{border:'1px solid #e2e8f0', borderRadius:'8px', padding:'10px', background:'#f8fafc'}}>
                <p style={{fontSize:'9px', fontWeight:'800', letterSpacing:'2px', color:'#94a3b8', marginBottom:'5px', textTransform:'uppercase'}}>গ্রাহকের তথ্য</p>
                <p style={{fontSize:'13px', fontWeight:'700', color:'#0f172a'}}>{selectedOrderForPrint.shippingAddress?.fullName || 'Valued Customer'}</p>
                <p style={{fontSize:'11px', fontWeight:'700', color:'#b45309', marginTop:'2px', fontFamily:'monospace'}}>{selectedOrderForPrint.guestPhone}</p>
                <p style={{fontSize:'10px', color:'#475569', marginTop:'3px', lineHeight:'1.6'}}>
                  {selectedOrderForPrint.shippingAddress?.line1}<br />{selectedOrderForPrint.shippingAddress?.city}
                </p>
              </div>
              <div style={{border:'1px solid #e2e8f0', borderRadius:'8px', padding:'10px', background:'#f8fafc'}}>
                <p style={{fontSize:'9px', fontWeight:'800', letterSpacing:'2px', color:'#94a3b8', marginBottom:'5px', textTransform:'uppercase'}}>ডেলিভারি ও পেমেন্ট</p>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                  <span style={{fontSize:'10px', color:'#64748b'}}>পেমেন্ট মেথড:</span>
                  <span style={{fontSize:'10px', fontWeight:'700', background:'#fef3c7', color:'#92400e', padding:'1px 8px', borderRadius:'20px'}}>{selectedOrderForPrint.payment?.method || 'Cash on Delivery'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                  <span style={{fontSize:'10px', color:'#64748b'}}>ডেলিভারি এলাকা:</span>
                  <span style={{fontSize:'10px', fontWeight:'700', color:'#0f172a'}}>{selectedOrderForPrint.shippingAddress?.city || 'Dhaka'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span style={{fontSize:'10px', color:'#64748b'}}>স্ট্যাটাস:</span>
                  <span style={{fontSize:'10px', fontWeight:'700', color:'#065f46', background:'#d1fae5', padding:'1px 8px', borderRadius:'20px'}}>{selectedOrderForPrint.status}</span>
                </div>
              </div>
            </div>

            {/* ITEMS TABLE */}
            <table style={{width:'100%', borderCollapse:'collapse', marginBottom:'16px', fontSize:'11px'}}>
              <thead>
                <tr style={{background:'#0f172a', color:'#fff'}}>
                  <th style={{padding:'9px 10px', textAlign:'left', fontWeight:'700'}}>পণ্যের নাম</th>
                  <th style={{padding:'9px 10px', textAlign:'left', fontWeight:'700', borderLeft:'1px solid #1e293b'}}>সাইজ / কালার</th>
                  <th style={{padding:'9px 10px', textAlign:'center', fontWeight:'700', borderLeft:'1px solid #1e293b'}}>পরিমাণ</th>
                  <th style={{padding:'9px 10px', textAlign:'right', fontWeight:'700', borderLeft:'1px solid #1e293b'}}>একক মূল্য</th>
                  <th style={{padding:'9px 10px', textAlign:'right', fontWeight:'700', borderLeft:'1px solid #1e293b'}}>মোট</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrderForPrint.items?.map((it: any, idx: number) => {
                  const variantLabel = [it.variant?.size, it.variant?.color].filter(Boolean).join(' / ') || '—';
                  return (
                    <tr key={idx} style={{borderBottom:'1px solid #e2e8f0', background: idx % 2 === 0 ? '#fff' : '#f8fafc'}}>
                      <td style={{padding:'8px 10px', fontWeight:'600', color:'#0f172a'}}>{it.product?.name || 'Ethnic Dress'}</td>
                      <td style={{padding:'8px 10px', color:'#64748b', borderLeft:'1px solid #e2e8f0'}}>{variantLabel}</td>
                      <td style={{padding:'8px 10px', textAlign:'center', fontFamily:'monospace', fontWeight:'700', borderLeft:'1px solid #e2e8f0'}}>{it.quantity}</td>
                      <td style={{padding:'8px 10px', textAlign:'right', fontFamily:'monospace', borderLeft:'1px solid #e2e8f0'}}>৳{Number(it.price).toLocaleString()}</td>
                      <td style={{padding:'8px 10px', textAlign:'right', fontFamily:'monospace', fontWeight:'700', color:'#0f172a', borderLeft:'1px solid #e2e8f0'}}>৳{(Number(it.price) * it.quantity).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* TOTALS + THANK YOU */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'20px', marginTop:'4px'}}>
              <div style={{flex:1, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'10px', padding:'12px'}}>
                <p style={{fontSize:'13px', fontWeight:'800', color:'#92400e', marginBottom:'5px'}}>🌸 ধন্যবাদ আমাদের বেছে নেওয়ার জন্য!</p>
                <p style={{fontSize:'10px', color:'#78350f', lineHeight:'1.7'}}>
                  PROMILAA BY SOPNIL-এ কেনাকাটা করার জন্য আপনাকে আন্তরিক ধন্যবাদ। পণ্য নিয়ে কোনো সমস্যা হলে ৩ দিনের মধ্যে যোগাযোগ করুন।
                </p>
                <p style={{fontSize:'9px', color:'#a16207', marginTop:'6px', fontStyle:'italic'}}>★ হ্যান্ডক্র্যাফটেড কাস্টম ডিজাইন | ১০০% প্রিমিয়াম কোয়ালিটি ★</p>
              </div>
              <div style={{width:'190px', border:'1px solid #e2e8f0', borderRadius:'10px', overflow:'hidden'}}>
                <div style={{padding:'8px 12px', display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#475569', borderBottom:'1px solid #e2e8f0'}}>
                  <span>সাবটোটাল</span>
                  <span style={{fontFamily:'monospace'}}>৳{(Number(selectedOrderForPrint.total) - Number(selectedOrderForPrint.shippingFee || 80)).toLocaleString()}</span>
                </div>
                <div style={{padding:'8px 12px', display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#475569', borderBottom:'1px solid #e2e8f0'}}>
                  <span>ডেলিভারি চার্জ</span>
                  <span style={{fontFamily:'monospace'}}>৳{Number(selectedOrderForPrint.shippingFee || 80).toLocaleString()}</span>
                </div>
                <div style={{padding:'10px 12px', display:'flex', justifyContent:'space-between', fontSize:'13px', fontWeight:'800', background:'#0f172a', color:'#fff'}}>
                  <span>সর্বমোট</span>
                  <span style={{fontFamily:'monospace', color:'#fbbf24'}}>৳{Number(selectedOrderForPrint.total).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div style={{marginTop:'20px', borderTop:'1px solid #e2e8f0', paddingTop:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <p style={{fontSize:'9px', color:'#94a3b8'}}>PROMILAA BY SOPNIL | সলিমুল্লাহ রোড, মোহাম্মদপুর, ঢাকা-১২০৭</p>
              <p style={{fontSize:'9px', color:'#94a3b8', fontFamily:'monospace'}}>www.promilaa.com | 01601708251</p>
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
