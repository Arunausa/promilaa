import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Truck, MapPin, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Promilaa",
  description: "Promilaa shipping rates, delivery timelines, and courier partners across Bangladesh.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-widest mb-4">
            <Truck className="w-3.5 h-3.5" />
            Delivery Information
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-wider uppercase mb-3">
            Shipping & Delivery Policy
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            সারাদেশে দ্রুত ও নিরাপদে হোম ডেলিভারির বিস্তারিত নির্দেশিকা।
          </p>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-4" />
        </AnimatedSection>

        {/* Pricing & Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <AnimatedSection delay={0.1} className="bg-white p-8 rounded-xl border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Inside Dhaka (ঢাকার ভেতরে)</h3>
                <span className="text-2xl font-bold text-amber-600">৳80</span>
              </div>
            </div>
            <hr />
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Delivery Time: <strong>24 to 48 Hours</strong>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> Cash on Delivery Available
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="bg-white p-8 rounded-xl border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Outside Dhaka (ঢাকার বাইরে)</h3>
                <span className="text-2xl font-bold text-blue-600">৳150</span>
              </div>
            </div>
            <hr />
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Delivery Time: <strong>2 to 4 Working Days</strong>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> Home Delivery via Steadfast / Pathao
              </p>
            </div>
          </AnimatedSection>

        </div>

        {/* Detailed Guidelines */}
        <AnimatedSection className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
          <h2 className="text-2xl font-serif font-bold text-slate-900 border-b pb-4">ডেলিভারি সংক্রান্ত নিয়মাবলী</h2>
          
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">1</span>
              <p>
                <strong>পার্সেল ডেলিভারি চেক:</strong> ডেলিভারিম্যান সামনে থাকা অবস্থায় কাস্টমার পার্সেল খুলে ড্রেসের সাইজ এবং কালার চেক করে নিতে পারবেন।
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">2</span>
              <p>
                <strong>কুরিয়ার পার্টনার:</strong> ঢাকার বাইরে আমরা সাধারণত Steadfast, Pathao, RedX এবং Paperfly এর মাধ্যমে হোম ডেলিভারি দিয়ে থাকি।
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">3</span>
              <p>
                <strong>অগ্রিম কুরিয়ার চার্জ:</strong> ঢাকার বাইরের অর্ডারের ক্ষেত্রে কুরিয়ার চার্জ (৳১৫০) বিকাশ বা নগদের মাধ্যমে অগ্রিম প্রদান করতে হতে পারে।
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">4</span>
              <p>
                <strong>অর্ডার ট্র্যাকিং:</strong> আপনার অর্ডার কনফার্ম হওয়ার পর আপনি ওয়েবসাইটের <strong><a href="/orders/track" className="underline text-amber-600">Order Tracking</a></strong> পেজ থেকে রিয়েল-টাইম কুরিয়ার স্টেটাস দেখতে পারবেন।
              </p>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
