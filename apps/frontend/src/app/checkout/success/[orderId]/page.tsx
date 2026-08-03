import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, MapPin, Search, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Promilaa",
  description: "Your order has been placed successfully.",
};

async function getOrderByNumber(orderNumber: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/orders/track?orderNumber=${orderNumber}&phone=`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.order || null;
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;
  // orderId here is actually the orderNumber (set by checkout redirect)
  const orderNumber = resolvedParams.orderId;

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen max-w-2xl">
      {/* Success Hero */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-14 w-14 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Order Confirmed!</h1>
        <p className="text-slate-500 text-lg">
          Thank you for shopping at Promilaa. Your order has been received.
        </p>
      </div>

      {/* Order Number Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 text-center">
        <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Your Order Number</p>
        <p className="text-3xl font-bold font-mono tracking-wider">{orderNumber}</p>
        <p className="text-slate-400 text-xs mt-3">Save this number to track your order</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Order Processing</p>
            <p className="text-xs text-slate-500 mt-1">We&apos;re preparing your items. You&apos;ll receive an update when it ships.</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Estimated Delivery</p>
            <p className="text-xs text-slate-500 mt-1">Dhaka: 2-3 days · Outside Dhaka: 4-6 days</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/orders/track?orderNumber=${orderNumber}`} className="flex-1">
          <Button variant="outline" className="w-full py-6 gap-2">
            <Search className="w-4 h-4" />
            Track Your Order
          </Button>
        </Link>
        <Link href="/collections/kurti" className="flex-1">
          <Button className="w-full py-6 gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        Questions? Contact us on Facebook or call our support line.
      </p>
    </div>
  );
}
