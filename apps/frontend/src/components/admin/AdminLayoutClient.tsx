"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  LayoutDashboard, ShoppingCart, Package, CreditCard, Tags,
  ShoppingBag, ImageIcon, Tag, Users, AlertTriangle, Warehouse,
  BarChart3, Settings, ChevronRight
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
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      router.push('/login');
    }
  }, [user, router]);

  if (!isMounted || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 md:min-h-screen">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="block">
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

      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
