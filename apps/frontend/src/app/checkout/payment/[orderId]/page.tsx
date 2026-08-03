"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAYMENT_INFO: Record<string, { method: string; number: string; instruction: string }> = {
  BKASH:  { method: "bKash",  number: "01XXXXXXXXX", instruction: "Send money using bKash → Send Money" },
  NAGAD:  { method: "Nagad",  number: "01XXXXXXXXX", instruction: "Send money using Nagad → Send Money" },
  ROCKET: { method: "Rocket", number: "01XXXXXXXXX", instruction: "Send money using Rocket → Send Money" },
};

export default function PaymentProofPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();

  const [transactionId, setTransactionId] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Determine payment method from query param (set by checkout page)
  const paymentMethod = (typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("method")
    : "BKASH") || "BKASH";

  const info = PAYMENT_INFO[paymentMethod] || PAYMENT_INFO.BKASH;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let screenshotUrl = "";

      // Upload screenshot if provided
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/upload/payment-proof`,
          { method: "POST", body: formData }
        );
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed");
        screenshotUrl = uploadData.url;
      }

      // Submit payment proof
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/payments/${orderId}/proof`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId, senderPhone, screenshotUrl, method: paymentMethod }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSuccess(true);
      setTimeout(() => router.push("/"), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Proof Submitted!</h2>
          <p className="text-slate-500 text-sm">Your payment proof has been received. We&apos;ll verify it within 24 hours and confirm your order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen max-w-md">
      <h1 className="text-2xl font-bold text-center mb-2">Submit Payment Proof</h1>
      <p className="text-slate-500 text-center text-sm mb-8">
        Complete your {info.method} payment and upload proof to confirm your order.
      </p>

      {/* Payment Instructions */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 mb-1">Send to {info.method}: <span className="text-pink-700 font-mono">{info.number}</span></p>
            <p className="text-sm text-slate-600">{info.instruction}</p>
            <p className="text-xs text-slate-400 mt-2">After sending, note the Transaction ID from your {info.method} confirmation message.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Transaction ID *</label>
          <input
            required
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="e.g. 8G6A7BNK9M"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Sender Phone Number *</label>
          <input
            required
            type="tel"
            value={senderPhone}
            onChange={(e) => setSenderPhone(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="e.g. 017XXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Screenshot *</label>
          <label
            htmlFor="screenshot-upload"
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              preview ? "border-slate-300 bg-slate-50" : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
            }`}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload className="w-8 h-8" />
                <span className="text-sm">Click to upload screenshot</span>
                <span className="text-xs">JPEG, PNG, WebP — max 10MB</span>
              </div>
            )}
          </label>
          <input
            id="screenshot-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full py-6 text-base mt-2">
          {loading ? "Submitting..." : "Confirm Payment"}
        </Button>
      </form>
    </div>
  );
}
