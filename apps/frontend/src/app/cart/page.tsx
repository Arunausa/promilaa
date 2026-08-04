"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <Link href="/collections/kurti">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4 border-b pb-6">
                <div className="w-24 aspect-[3/4] bg-slate-100 rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Color: {item.color} | Size: {item.size}
                    </p>
                    <p className="font-medium mt-2">৳{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded">
                      <button 
                        className="px-3 py-1 hover:bg-slate-100"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-medium">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 hover:bg-slate-100"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-600 font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 p-6 rounded-lg h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Estimated Total</span>
                <span>৳{getTotalPrice()}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full py-6 text-base">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
