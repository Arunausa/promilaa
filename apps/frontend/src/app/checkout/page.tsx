"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "Dhaka",
    line1: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Debounced Abandoned Cart Tracking
  useEffect(() => {
    if (formData.phone && formData.phone.length >= 11 && items.length > 0) {
      const timer = setTimeout(() => {
        fetch("/api/checkout/abandoned-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formData.phone,
            fullName: formData.fullName,
            line1: formData.line1,
            city: formData.city,
            district: formData.district,
            items: items.map((it) => ({
              id: it.id,
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              size: it.size,
              color: it.color,
            })),
            subtotal: getTotalPrice(),
          }),
        }).catch(() => {});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.phone, formData.fullName, formData.line1, formData.city, formData.district, items, getTotalPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity
          })),
          guestPhone: formData.phone,
          shippingAddress: formData,
          paymentMethod: paymentMethod // Dynamic now
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      clearCart();
      
      if (paymentMethod === "COD") {
        router.push(`/checkout/success/${data.order.orderNumber}`);
      } else {
        router.push(`/checkout/payment/${data.order.id}`); // Route to proof upload
      }
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!mounted) return null;
  if (items.length === 0) return <div className="text-center py-24">Your cart is empty.</div>;

  const subtotal = getTotalPrice();
  const shipping = formData.district.toLowerCase() === 'dhaka' ? 80 : 150;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        
        {/* Checkout Form */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded mb-6 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="e.g. Abir Hasan" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="১১ ডিজিটের মোবাইল নম্বর" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">District *</label>
              <select required name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border rounded-md bg-white">
                <option value="Dhaka">Inside Dhaka</option>
                <option value="Outside">Outside Dhaka</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City / Thana *</label>
              <input required name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="e.g. Dhanmondi" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Street Address *</label>
              <input required name="line1" value={formData.line1} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="e.g. House 12, Road 5" />
            </div>

            <div className="pt-6">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="space-y-3">
                <label className="border rounded-md p-4 bg-slate-50 flex items-center gap-3 cursor-pointer hover:border-slate-400">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-slate-900" 
                  />
                  <span className="font-medium text-sm">Cash on Delivery (COD)</span>
                </label>

                <label className="border rounded-md p-4 bg-slate-50 flex items-center gap-3 cursor-pointer hover:border-slate-400">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="BKASH"
                    checked={paymentMethod === "BKASH"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-slate-900" 
                  />
                  <span className="font-medium text-sm">bKash (Send Money)</span>
                </label>

                <label className="border rounded-md p-4 bg-slate-50 flex items-center gap-3 cursor-pointer hover:border-slate-400">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="NAGAD"
                    checked={paymentMethod === "NAGAD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-slate-900" 
                  />
                  <span className="font-medium text-sm">Nagad (Send Money)</span>
                </label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-6 py-6 text-base">
              {loading ? "Processing..." : `Place Order (৳${total})`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 p-6 rounded-lg border h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded border overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-xs">{item.color} / {item.size} x {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Fee</span>
              <span>৳{shipping}</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>৳{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
