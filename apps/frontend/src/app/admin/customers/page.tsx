"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { User, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AdminCustomers() {
  const { accessToken } = useAuthStore();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleBlock = async (id: string, currentlyBlocked: boolean) => {
    if (!confirm(`Are you sure you want to ${currentlyBlocked ? 'unblock' : 'block'} this user?`)) return;
    
    try {
      const res = await fetch(`/api/admin/customers/${id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ isBlocked: !currentlyBlocked }),
      });

      if (res.ok) {
        fetchCustomers();
      } else {
        alert("Failed to update user status");
      }
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>

      <div className="bg-white border rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-muted-foreground">Name</th>
              <th className="p-4 font-semibold text-muted-foreground">Email / Phone</th>
              <th className="p-4 font-semibold text-muted-foreground text-center">Orders Placed</th>
              <th className="p-4 font-semibold text-muted-foreground text-center">Joined</th>
              <th className="p-4 font-semibold text-muted-foreground text-center">Status</th>
              <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((customer: any) => {
              const isBlocked = customer.isBlocked;
              return (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div>{customer.email}</div>
                    <div className="text-xs">{customer.phone || 'No phone'}</div>
                  </td>
                  <td className="p-4 text-center font-medium">
                    {customer._count?.orders || 0}
                  </td>
                  <td className="p-4 text-center text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${isBlocked ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                      {isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant={isBlocked ? "outline" : "destructive"} 
                      size="sm"
                      onClick={() => handleToggleBlock(customer.id, isBlocked)}
                    >
                      {isBlocked ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Unblock</>
                      ) : (
                        <><ShieldAlert className="w-4 h-4 mr-2" /> Block</>
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
            
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
