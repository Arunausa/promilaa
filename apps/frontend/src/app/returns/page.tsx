import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { RefreshCw, CheckCircle, AlertCircle, Phone } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Exchange Policy | Promilaa",
  description: "Promilaa 7-day hassle-free return and size exchange policy guidelines.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-widest mb-4">
            <RefreshCw className="w-3.5 h-3.5" />
            Easy Exchange
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-wider uppercase mb-3">
            Return & Exchange Policy
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            সহজ ও ঝামেলাহীন সাইজ পরিবর্তন ও রিটার্ন নীতিমালা (৭ দিনের মধ্যে)।
          </p>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-4" />
        </AnimatedSection>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <AnimatedSection delay={0.1} className="bg-white p-8 rounded-xl border shadow-sm space-y-3">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">সাইজ এক্সচেঞ্জ সুবিধা</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ড্রেস পাওয়ার পর সাইজ ছোট বা বড় হলে ৭ দিনের মধ্যে ফ্রিতে সাইজ চেঞ্জ করে নেওয়ার সুবিধা রয়েছে।
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="bg-white p-8 rounded-xl border shadow-sm space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-600" />
            <h3 className="text-lg font-bold text-slate-900">ত্রুটিযুক্ত পণ্য রিটার্ন</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              কোনো প্রোডাক্টের কাপড়ে ছেঁড়া বা সেলাইয়ের ভুল থাকলে ডেলিভারিম্যানের কাছে সাথে সাথে ক্যাফে রিটার্ন করতে পারবেন।
            </p>
          </AnimatedSection>

        </div>

        {/* Steps */}
        <AnimatedSection className="bg-white p-8 rounded-xl border shadow-sm space-y-6 mb-12">
          <h2 className="text-2xl font-serif font-bold text-slate-900 border-b pb-4">রিটার্ন বা এক্সচেঞ্জ করার উপায়</h2>
          
          <ol className="space-y-4 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="font-bold text-amber-600 text-base">১.</span>
              <p>পণ্য গ্রহণের <strong>৭ দিনের মধ্যে</strong> আমাদের হটলাইন নাম্বারে <strong>(+880 1601-708251)</strong> অথবা ফেইসবুক পেজে যোগাযোগ করুন।</p>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-amber-600 text-base">২.</span>
              <p>পোশাকের ট্যাগ ও মেমো অবিকৃত থাকতে হবে। ব্যবহার করা বা ধোয়া ড্রেস রিটার্ন গ্রহণযোগ্য নয়।</p>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-amber-600 text-base">৩.</span>
              <p>সাইজ পরিবর্তনের ক্ষেত্রে শুধুমাত্র কুরিয়ার চার্জ কাস্টমারকে বহন করতে হবে।</p>
            </li>
          </ol>
        </AnimatedSection>

        {/* Action Button */}
        <AnimatedSection className="text-center bg-amber-50 p-8 rounded-xl border border-amber-200">
          <h3 className="font-bold text-slate-900 mb-2">Need an exchange right now?</h3>
          <p className="text-xs text-slate-600 mb-4">Our support team will dispatch your replacement parcel within 24 hours.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded">
            <Phone className="w-4 h-4" /> Call Hotline for Exchange
          </Link>
        </AnimatedSection>

      </div>
    </div>
  );
}
