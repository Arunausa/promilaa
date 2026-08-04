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
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between relative">
          
          {/* LEFT: Mobile Menu (☰) + Search (🔍) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="md:hidden">
              <MobileNav />
            </div>

            <Link
              href="/search"
              prefetch={true}
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-2 text-slate-800 hover:text-slate-900"}
              aria-label="Search"
            >
              <Search className="h-5 w-5 stroke-[1.75]" />
            </Link>
          </div>

          {/* CENTER: Signature Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" prefetch={true} className="flex items-center py-1">
              <img 
                src="/logo.png" 
                alt="PROMILAA BY SOPNIL" 
                className="h-14 sm:h-16 md:h-20 max-h-16 sm:max-h-20 w-auto object-contain transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* RIGHT: User (👤), Wishlist (❤️), Cart (🛍️) */}
          <div className="flex items-center gap-0.5 sm:gap-2">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 mr-4 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <Link href="/collections/kurti" prefetch={true} className="transition-colors hover:text-slate-950">
                Kurti
              </Link>
              <Link href="/collections/one-piece" prefetch={true} className="transition-colors hover:text-slate-950">
                One Piece
              </Link>
              <Link href="/collections/two-piece" prefetch={true} className="transition-colors hover:text-slate-950">
                Two Piece
              </Link>
              <Link href="/collections/three-piece" prefetch={true} className="transition-colors hover:text-slate-950">
                Three Piece
              </Link>
            </nav>

            <Link 
              href={user ? (user.role === 'ADMIN' || user.role === 'STAFF' ? "/admin" : "/account") : "/login"}
              prefetch={true}
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-2 text-slate-800 hover:text-slate-900"}
              aria-label="Account"
            >
              <User className="h-5 w-5 stroke-[1.75]" />
            </Link>

            <Link
              href="/account/wishlist"
              prefetch={true}
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-2 text-slate-800 hover:text-slate-900"}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 stroke-[1.75]" />
            </Link>
            
            <button 
              onClick={() => useCartStore.getState().openDrawer()}
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " p-2 relative cursor-pointer text-slate-800 hover:text-slate-900"}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
              {mounted && totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-slate-900 text-white rounded-full"
                >
                  {totalItems}
                </Badge>
              )}
            </button>
          </div>

        </div>
      </header>
    </React.Fragment>
  );
}
