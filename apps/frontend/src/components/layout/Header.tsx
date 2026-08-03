"use client";

import Link from 'next/link';
import { ShoppingBag, User, Search } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MobileNav from '@/components/layout/MobileNav';
import { useEffect, useState } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);

  // Avoid hydration mismatch for Zustand persistent store
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <MobileNav />
        </div>

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="font-bold text-2xl tracking-tighter">
            PROMILAA
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/collections/kurti" className="transition-colors hover:text-foreground/80">
            Kurti
          </Link>
          <Link href="/collections/one-piece" className="transition-colors hover:text-foreground/80">
            One Piece
          </Link>
          <Link href="/collections/two-piece" className="transition-colors hover:text-foreground/80">
            Two Piece
          </Link>
          <Link href="/collections/three-piece" className="transition-colors hover:text-foreground/80">
            Three Piece
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link 
            href={user ? "/account" : "/login"}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>

          <Link
            href="/search"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Link>
          
          <button 
            onClick={() => useCartStore.getState().openDrawer()}
            className={buttonVariants({ variant: "ghost", size: "icon" }) + " relative cursor-pointer"}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
            <span className="sr-only">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
