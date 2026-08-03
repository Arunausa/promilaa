"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  variant: {
    color: string;
    size: string;
    product: { name: string };
  };
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    district: string;
  };
  items: OrderItem[];
  payment: {
    method: string;
    status: string;
  };
}

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PENDING:    { label: "Order Placed",   icon: Clock,        color: "text-amber-500" },
  CONFIRMED:  { label: "Confirmed",      icon: CheckCircle2, color: "text-blue-500"  },
  PROCESSING: { label: "Processing",     icon: Package,      color: "text-purple-500"},
  SHIPPED:    { label: "Shipped",        icon: Truck,        color: "text-indigo-500"},
  DELIVERED:  { label: "Delivered",      icon: CheckCircle2, color: "text-green-600" },
  CANCELLED:  { label: "Cancelled",      icon: XCircle,      color: "text-red-500"   },
  RETURNED:   { label: "Returned",       icon: XCircle,      color: "text-slate-500" },
};

export default function OrderTrackPage() {
  const [phone, setPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(
        `${apiBase}/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();

      if (!res.ok || !data.order) {
        throw new Error(data.error || "Order not found. Please check your details.");
      }

      setOrder(data.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Track Your Order</h1>
        <p className="text-slate-500 text-sm">Enter your phone number and order number to see the status</p>
      </div>

      {/* Track Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 017XXXXXXXX"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Order Number</label>
              <input
                required
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="e.g. PRM-ABC123"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full py-3 gap-2">
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Track Order"}
          </Button>
        </form>
      </div>

      {/* Order Result */}
      {order && (
        <div className="space-y-6">
          {/* Status Header */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Order Number</p>
                <p className="text-xl font-bold text-slate-900">{order.orderNumber}</p>
              </div>
              <div className={`flex items-center gap-2 font-semibold text-sm ${STATUS_META[order.status]?.color || "text-slate-600"}`}>
                {order.status in STATUS_META && (() => {
                  const IconComp = STATUS_META[order.status].icon;
                  return <IconComp className="w-5 h-5" />;
                })()}
                {STATUS_META[order.status]?.label || order.status}
              </div>
            </div>

            {/* Progress Steps */}
            {order.status !== "CANCELLED" && order.status !== "RETURNED" && (
              <div className="flex items-center gap-1">
                {STATUS_STEPS.map((step, i) => {
                  const isCompleted = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`h-2 flex-1 rounded-full transition-colors ${isCompleted ? "bg-slate-900" : "bg-slate-200"}`} />
                      {i < STATUS_STEPS.length - 1 && (
                        <ChevronRight className={`w-3 h-3 flex-shrink-0 ${isCompleted && !isCurrent ? "text-slate-900" : "text-slate-300"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-between mt-2">
              {STATUS_STEPS.map((step, i) => (
                <p key={step} className={`text-xs ${i <= currentStepIndex ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                  {STATUS_META[step]?.label}
                </p>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-slate-800">{item.variant?.product?.name}</p>
                    <p className="text-slate-500 text-xs">{item.variant?.color} / {item.variant?.size} × {item.quantity}</p>
                  </div>
                  <span className="font-semibold">৳{Number(item.unitPrice) * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 space-y-1 text-sm text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>৳{order.subtotal}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>৳{order.shippingFee}</span></div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-1 border-t mt-2">
                <span>Total</span><span>৳{order.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-3">Shipping Address</h2>
            <p className="text-sm text-slate-700 font-medium">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-slate-500">{order.shippingAddress?.phone}</p>
            <p className="text-sm text-slate-500">{order.shippingAddress?.line1}, {order.shippingAddress?.city}, {order.shippingAddress?.district}</p>
          </div>
        </div>
      )}
    </div>
  );
}
