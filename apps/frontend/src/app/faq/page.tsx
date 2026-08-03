"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "কিভাবে অর্ডার সম্পন্ন করব?",
    a: "আপনার পছন্দের পোশাকের সাইজ নির্বাচন করে 'Add to Cart' এ চাপুন। এরপর Checkout পেজে আপনার নাম, মোবাইল নাম্বার এবং ডেলিভারি ঠিকানা দিয়ে ক্যাশ অন ডেলিভারি বা বিকাশ/নগদ পেমেন্ট নির্বাচন করে 'Place Order' বাটনে চাপলেই আপনার অর্ডার কনফার্ম হয়ে যাবে।"
  },
  {
    q: "ডেলিভারি চার্জ কত এবং কতদিন সময় লাগে?",
    a: "ঢাকার ভেতরে ডেলিভারি চার্জ ৳৮০ (২৪-৪৮ ঘণ্টা সময় লাগে)। ঢাকার বাইরে ডেলিভারি চার্জ ৳১৫০ (২-৪ কার্যদিবস সময় লাগে)।"
  },
  {
    q: "বিকাশ বা নগদ দিয়ে পেমেন্ট করার নিয়ম কি?",
    a: "অর্ডার করার সময় বিকাশ/নগদ নম্বর নির্বাচন করলে আমাদের সেণ্ড মানি / মার্চেন্ট নাম্বার দেখতে পাবেন। সেই নাম্বারে টাকা পাঠিয়ে ট্রানজ্যাকশন আইডি (TrxID) দিয়ে অর্ডার জমা দিতে পারবেন। এডমিন প্যানেল থেকে ভেরিফাই হলে আপনার অর্ডার কনফার্ম হয়ে যাবে।"
  },
  {
    q: "ড্রেস পাওয়ার পর সাইজ পছন্দ না হলে কি করা যাবে?",
    a: "পণ্য পাওয়ার ৭ দিনের মধ্যে আমাদের কাস্টমার কেয়ার হটলাইনে ফোন দিয়ে খুব সহজেই সাইজ পরিবর্তন বা এক্সচেঞ্জ করে নিতে পারবেন।"
  },
  {
    q: "আমি কিভাবে আমার অর্ডারের বর্তমান অবস্থা ট্র্যাক করব?",
    a: "ওয়েবসাইটের উপরে থাকা 'Order Tracking' অপশনে আপনার অর্ডার আইডি এবং মোবাইল নম্বর দিলেই আপনার কুরিয়ার পার্সেলের রিয়েল-টাইম স্টেটাস দেখতে পাবেন।"
  },
  {
    q: "প্রমিলা এর কাপড়ের কোয়ালিটি কেমন?",
    a: "প্রমিলা সম্পূর্ণ বাংলাদেশি ট্র্যাডিশনাল এবং এথনিক ফ্যাশন নিয়ে কাজ করে। আমরা ১০০% অরজিনাল কটন, সিল্ক, শিফন এবং জর্জেট মেটেরিয়াল ব্যবহার করি যা দেশের আবহাওয়ার সাথে সম্পূর্ণ আরামদায়ক।"
  }
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Got Questions?
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-wider uppercase mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            প্রমিলা শপিং, ডেলিভারি ও পেমেন্ট সম্পর্কিত সাধারণ জিজ্ঞাসার উত্তর।
          </p>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-4" />
        </AnimatedSection>

        {/* Accordion List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <AnimatedSection key={idx} delay={idx * 0.05}>
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-6 text-left font-bold text-slate-900 text-base md:text-lg flex justify-between items-center gap-4 hover:text-amber-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-600" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Still Have Questions */}
        <AnimatedSection className="bg-white p-8 rounded-xl border text-center space-y-4">
          <h3 className="text-xl font-serif font-bold text-slate-900">অন্য কোনো প্রশ্ন আছে?</h3>
          <p className="text-sm text-slate-600">আমাদের সাপোর্ট রিপ্রেজেন্টেটিভ আপনার যেকোনো সমস্যার সমাধানে তৈরি।</p>
          <Link href="/contact" className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded">
            Contact Support Team
          </Link>
        </AnimatedSection>

      </div>
    </div>
  );
}
