"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  LayoutDashboard, Package, CreditCard, Tags,
  ShoppingBag, ImageIcon, Tag, Users, AlertTriangle, Warehouse,
  BarChart3, Settings, ChevronRight, Menu, X
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin",          name: "Dashboard",   icon: LayoutDashboard },
      { href: "/admin/reports",  name: "Reports",     icon: BarChart3       },
    ]
  },
  {
    label: "Commerce",
    items: [
      { href: "/admin/orders",    name: "Orders",    icon: ShoppingBag },
      { href: "/admin/payments",  name: "Payments",  icon: CreditCard  },
      { href: "/admin/coupons",   name: "Coupons",   icon: Tag         },
    ]
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products",   name: "Products",   icon: Package },
      { href: "/admin/categories", name: "Categories", icon: Tags    },
      { href: "/admin/inventory",  name: "Inventory",  icon: Warehouse},
      { href: "/admin/banners",    name: "Banners",    icon: ImageIcon},
    ]
  },
  {
    label: "Security",
    items: [
      { href: "/admin/fraud",     name: "Fraud",     icon: AlertTriangle },
      { href: "/admin/customers", name: "Customers", icon: Users         },
    ]
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", name: "Settings", icon: Settings },
    ]
  },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [hasHydrated, setHasHydrated] = useState(() => typeof window !== 'undefined' && useAuthStore.persist.hasHydrated());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
        router.push('/login');
      }
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* MOBILE TOP BAR FOR ADMIN ON SMARTPHONES */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <Link href="/admin" prefetch={true} className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Admin</span>
          <span className="text-lg font-extrabold tracking-tighter text-white">PROMILAA</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          aria-label="Toggle Admin Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION (Desktop Sidebar + Mobile Collapsible Drawer) */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-slate-900 text-white flex-shrink-0 md:min-h-screen z-40`}
      >
        <div className="hidden md:block p-6 border-b border-slate-800">
          <Link href="/" prefetch={true} className="block">
            <span className="text-xs uppercase tracking-widest text-slate-500 block mb-0.5">Admin Panel</span>
            <span className="text-lg font-bold tracking-tighter text-white">PROMILAA</span>
          </Link>
        </div>

        <nav className="px-3 py-4 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
                        isActive
                          ? "bg-white/10 text-white font-medium"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
