"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Reset Password</h1>
        
        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded mb-6 text-sm font-medium border border-green-200">
              Check your email for a password reset link.
            </div>
            <Link href="/login">
              <Button variant="outline" className="w-full">Return to login</Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full p-2 border rounded-md" 
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full py-6 mt-4">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-slate-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
