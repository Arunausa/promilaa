"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { Menu, ShoppingBag, Truck, User, Search, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const categories = [
    { name: "Kurti Collection", slug: "kurti", count: "10+ Styles" },
    { name: "One Piece Dress", slug: "one-piece", count: "7+ Styles" },
    { name: "Two Piece Suit", slug: "two-piece", count: "8+ Styles" },
    { name: "Three Piece Suit", slug: "three-piece", count: "16+ Styles" },
    { name: "Festive Collection", slug: "festive", count: "Eid & Wedding Special" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "mr-2 md:hidden" })}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 flex flex-col bg-white">
        
        {/* Header */}
        <div className="p-5 border-b bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold">Women&apos;s Fashion</span>
            <span className="text-xl font-bold tracking-tighter">PROMILAA</span>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">
              Explore Collections
            </p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/collections/${cat.slug}`}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-100 transition-colors text-slate-900 font-medium text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    {cat.slug === 'festive' ? (
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    ) : (
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{cat.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">
              Quick Shortcuts
            </p>
            <div className="space-y-1">
              <Link
                href="/orders/track"
                prefetch={true}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-sm font-medium"
              >
                <Truck className="w-4 h-4 text-slate-500" />
                <span>Track My Order (অর্ডার ট্র্যাক করুন)</span>
              </Link>

              <Link
                href="/search"
                prefetch={true}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-sm font-medium"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Search Products (পণ্য খুঁজুন)</span>
              </Link>

              <Link
                href={user ? (user.role === 'ADMIN' || user.role === 'STAFF' ? "/admin" : "/account") : "/login"}
                prefetch={true}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-sm font-medium"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>{user ? (user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Account') : 'Login / Register'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 text-center text-xs text-slate-500">
          <p>© 2026 Promilaa Fashion BD. All rights reserved.</p>
        </div>

      </SheetContent>
    </Sheet>
  );
}
