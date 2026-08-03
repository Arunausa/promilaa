"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Package, User as UserIcon, Heart, MapPin, LogOut } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, accessToken, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!useAuthStore.getState().user) {
      router.push("/login");
    }
  }, [router]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && accessToken && activeTab === "orders") {
      fetchMyOrders();
    }
  }, [user, accessToken, activeTab]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted || !user) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight uppercase mb-2">My Account</h1>
              <p className="text-muted-foreground text-sm tracking-wide">Welcome back, {user.name}</p>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0 text-muted-foreground hover:text-black" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </Button>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <AnimatedSection className="md:col-span-1 space-y-2">
            {[
              { id: "orders", label: "My Orders", icon: <Package className="w-4 h-4" /> },
              { id: "profile", label: "Profile details", icon: <UserIcon className="w-4 h-4" /> },
              { id: "addresses", label: "Addresses", icon: <MapPin className="w-4 h-4" /> },
              { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white shadow-sm border text-black' : 'text-muted-foreground hover:bg-slate-100 hover:text-black'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </AnimatedSection>

          {/* Main Content Area */}
          <AnimatedSection className="md:col-span-3 bg-white border p-6 md:p-8 min-h-[500px]">
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Order History</h2>
                {loadingOrders ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-24 bg-slate-100 w-full rounded"></div>
                    <div className="h-24 bg-slate-100 w-full rounded"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 border border-dashed rounded-lg">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground text-sm mb-6">Looks like you haven't made a purchase yet.</p>
                    <Button onClick={() => router.push('/collections/kurti')}>Start Shopping</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border rounded p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b">
                          <div>
                            <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Order Number</p>
                            <p className="font-medium text-sm">{order.orderNumber || order.id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Date</p>
                            <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Total</p>
                            <p className="font-medium text-sm">৳{order.total}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-bold uppercase tracking-wider ${order.status === 'PENDING' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex gap-4 items-center">
                              <div className="w-16 h-20 bg-slate-100 flex-shrink-0">
                                {item.product?.images?.[0] && (
                                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.product?.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity} × ৳{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Profile Details</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Full Name</label>
                    <p className="font-medium border-b py-2">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Email Address</label>
                    <p className="font-medium border-b py-2">{user.email}</p>
                  </div>
                  <Button variant="outline" className="mt-4">Edit Profile</Button>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Saved Addresses</h2>
                <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">No addresses saved.</p>
                  <Button variant="outline" className="mt-4">Add New Address</Button>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider mb-6">My Wishlist</h2>
                <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground">
                  <Heart className="w-8 h-8 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Your wishlist is empty.</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push('/collections/kurti')}>Discover Fashion</Button>
                </div>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
