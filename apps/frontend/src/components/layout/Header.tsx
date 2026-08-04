"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MobileNav from '@/components/layout/MobileNav';
import AnnouncementBar from '@/components/layout/AnnouncementBar';

export default function Header() {
  const [mounted, setMounted] = useState(() => typeof window !== 'undefined');
  const cartStore = useCartStore();
  const authStore = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? cartStore.getTotalItems() : 0;
  const user = mounted ? authStore.user : null;

  return (
    <React.Fragment>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        
        {/* ========================================================================= */}
        {/* MOBILE HEADER (Show only on screens < md) -> MANTO STYLE                    */}
        {/* Left: ☰ + 🔍 | Center: Logo | Right: 👤 + ❤️ + 🛍️                       */}
        {/* ========================================================================= */}
        <div className="md:hidden container mx-auto px-3 h-16 flex items-center justify-between relative">
          {/* Left: Mobile Menu + Search */}
          <div className="flex items-center gap-0.5">
            <MobileNav />
            <Link
              href="/search"
              prefetch={true}
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-1.5 text-slate-800"}
              aria-label="Search"
            >
              <Search className="h-5 w-5 stroke-[1.75]" />
            </Link>
          </div>

          {/* Center: Centered Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" prefetch={true} className="flex items-center py-1">
              <img 
                src="/logo.png" 
                alt="PROMILAA BY SOPNIL" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right: Account + Wishlist + Cart */}
          <div className="flex items-center gap-0.5">
            <Link 
              href={user ? (user.role === 'ADMIN' || user.role === 'STAFF' ? "/admin" : "/account") : "/login"}
              prefetch={true}
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-1.5 text-slate-800"}
              aria-label="Account"
            >
              <User className="h-5 w-5 stroke-[1.75]" />
            </Link>

            <Link
              href="/account/wishlist"
              prefetch={true}
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-1.5 text-slate-800"}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 stroke-[1.75]" />
            </Link>

            <button 
              onClick={() => useCartStore.getState().openDrawer()}
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-1.5 relative cursor-pointer text-slate-800"}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
              {mounted && totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold bg-slate-900 text-white rounded-full"
                >
                  {totalItems}
                </Badge>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP HEADER (Show only on screens >= md) -> MANTO-STYLE MINIMAL         */}
        {/* Left: Logo | Center: Nav Links | Right: Icons                               */}
        {/* ========================================================================= */}
        <div className="hidden md:block">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-[72px]">
              {/* Left: Logo — large & prominent */}
              <div className="flex-shrink-0" style={{ minWidth: '200px' }}>
                <Link href="/" prefetch={true} className="inline-flex items-center py-1 group">
                  <img 
                    src="/logo.png" 
                    alt="PROMILAA BY SOPNIL" 
                    className="h-14 w-auto object-contain transition-all duration-300 group-hover:opacity-80"
                  />
                </Link>
              </div>

              {/* Center: Navigation — clean & spaced */}
              <nav className="flex items-center justify-center gap-10">
                {[
                  { href: '/collections/kurti', label: 'Kurti' },
                  { href: '/collections/one-piece', label: 'One Piece' },
                  { href: '/collections/two-piece', label: 'Two Piece' },
                  { href: '/collections/three-piece', label: 'Three Piece' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className="relative text-[13px] font-medium tracking-[0.08em] uppercase text-slate-600 hover:text-slate-950 transition-colors duration-200 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-slate-900 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Right: Action Icons — minimal */}
              <div className="flex items-center gap-1" style={{ minWidth: '200px', justifyContent: 'flex-end' }}>
                <Link
                  href="/search"
                  prefetch={true}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-all duration-200"
                  aria-label="Search"
                >
                  <Search className="h-[18px] w-[18px] stroke-[1.5]" />
                </Link>

                <Link 
                  href={user ? (user.role === 'ADMIN' || user.role === 'STAFF' ? "/admin" : "/account") : "/login"}
                  prefetch={true}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-all duration-200"
                  aria-label="Account"
                >
                  <User className="h-[18px] w-[18px] stroke-[1.5]" />
                </Link>

                <Link
                  href="/account/wishlist"
                  prefetch={true}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-all duration-200"
                  aria-label="Wishlist"
                >
                  <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
                </Link>

                <button 
                  onClick={() => useCartStore.getState().openDrawer()}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-all duration-200 relative cursor-pointer"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
                  {mounted && totalItems > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[9px] font-bold bg-slate-900 text-white rounded-full border border-white"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

      </header>
    </React.Fragment>
  );
}
