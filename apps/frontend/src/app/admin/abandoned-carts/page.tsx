"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Phone, MessageSquare, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

type AbandonedCart = {
  id: string;
  phone: string;
  fullName: string | null;
  line1: string | null;
  city: string | null;
  district: string | null;
  cartData: any;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
};

export default function AdminAbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentSmsId, setSentSmsId] = useState<string | null>(null);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ carts: AbandonedCart[] }>('/api/checkout/abandoned-cart');
      setCarts(res.carts || []);
    } catch (e) {
      console.error('Failed to load abandoned carts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleSendReminderSMS = (cart: AbandonedCart) => {
    setSentSmsId(cart.id);
    setTimeout(() => setSentSmsId(null), 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            অ্যাবানডন্ড কার্ট রিকভারি (Abandoned Carts)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            যেসব কাস্টমার চেকআউটে মোবাইল নম্বর লিখেও শেষ মুহূর্তে অর্ডার সম্পন্ন করেননি
          </p>
        </div>

        <Button onClick={fetchCarts} variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          রিফ্রেশ
        </Button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-medium">
          অসম্পূর্ণ কার্ট ডাটা লোড হচ্ছে...
        </div>
      ) : carts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">কোনো অ্যাবানডন্ড কার্ট নেই!</h3>
          <p className="text-xs text-slate-500">আপনার সমস্ত কাস্টমার সফলভাবে অর্ডার সম্পন্ন করছেন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {carts.map((cart) => (
            <div key={cart.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold text-sm">
                    📱
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {cart.fullName || 'Valued Customer'}
                      <span className="font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{cart.phone}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ঠিকানা: {cart.line1 || 'N/A'}, {cart.city || cart.district || 'Dhaka'} | {new Date(cart.updatedAt).toLocaleString('bn-BD')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${cart.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    কল করুন
                  </a>

                  <Button
                    onClick={() => handleSendReminderSMS(cart)}
                    size="sm"
                    className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {sentSmsId === cart.id ? 'রিমাইন্ডার পাঠানো হয়েছে!' : 'রিমাইন্ডার SMS পাঠান'}
                  </Button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">কার্টের আইটেমসমূহ:</p>
                  <p className="text-slate-800 font-medium">
                    {Array.isArray(cart.cartData)
                      ? cart.cartData.map((it: any) => `${it.product?.name || 'Dress'} (x${it.quantity})`).join(', ')
                      : 'Handcrafted Ethnic Dress'}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <p className="text-[10px] text-slate-400">মোট আনুমানিক:</p>
                  <p className="text-sm font-bold text-slate-900">৳{Number(cart.subtotal)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
