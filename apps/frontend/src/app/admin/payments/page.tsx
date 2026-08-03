"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminPayments() {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const data = await apiFetch<{ payments: any[] }>("/api/payments/pending");
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Failed to fetch pending payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      fetchPayments();
    }
  }, [user]);

  const handleVerify = async (orderId: string, status: 'VERIFIED' | 'REJECTED') => {
    let rejectionReason = "";
    if (status === 'REJECTED') {
      rejectionReason = prompt("Please provide a reason for rejection (e.g., Amount mismatch):") || "Rejected by Admin";
    }

    try {
      await apiFetch(`/api/payments/orders/${orderId}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ status, rejectionReason })
      });
      // Refresh list
      fetchPayments();
    } catch (error) {
      alert("Failed to update payment status");
    }
  };

  if (loading) return <div>Loading payments queue...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Payment Verification Queue</h1>
      
      {payments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center text-muted-foreground">
          No pending payments to verify!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-lg border shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{payment.method} Payment</h3>
                  <p className="text-sm text-slate-500">Order: {payment.order.orderNumber}</p>
                  <p className="text-sm text-slate-500">Amount to verify: <span className="font-bold text-slate-900">৳{payment.order.total}</span></p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                  PENDING
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-md mb-6 border">
                <p className="text-sm font-medium mb-1">Transaction ID:</p>
                <code className="text-lg bg-white px-2 py-1 border rounded">{payment.transactionId}</code>
              </div>

              {payment.screenshotUrl && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Screenshot Proof:</p>
                  <a href={payment.screenshotUrl} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={payment.screenshotUrl} 
                      alt="Payment Proof" 
                      className="w-full h-48 object-cover rounded border hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </a>
                </div>
              )}

              <div className="mt-auto flex gap-3">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleVerify(payment.orderId, 'VERIFIED')}
                >
                  Verify Payment
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => handleVerify(payment.orderId, 'REJECTED')}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
