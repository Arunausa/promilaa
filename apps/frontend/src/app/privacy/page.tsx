import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Promilaa",
  description: "Promilaa privacy policy regarding customer data protection, phone verification, and payment proofs.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-wider uppercase mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            কাস্টমারের ব্যক্তিগত তথ্যের নিরাপত্তা ও গোপনীয়তা রক্ষা নীতি।
          </p>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-4" />
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection className="bg-white p-10 rounded-xl border shadow-sm prose max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">১. কি কি তথ্য আমরা সংগ্রহ করি (Data Collection)</h2>
            <p>
              অর্ডার প্রক্রিয়াকরণের জন্য আমরা কাস্টমারের নাম, ফোন নম্বর, ডেলিভারি ঠিকানা এবং ইমেইল সংগ্রহ করি। পেমেন্ট প্রুফ হিসেবে জমা দেওয়া বিকাশ/নগদ স্ক্রিনশট বা ট্রানজ্যাকশন আইডি শুধুমাত্র ভেরিফিকেশনের জন্য ব্যবহৃত হয়।
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">২. তথ্যের ব্যবহার (Use of Information)</h2>
            <p>
              সংগৃহীত তথ্য শুধুমাত্র পার্সেল ডেলিভারি, কুরিয়ার ট্র্যাকিং এবং ফ্রড প্রতিরোধ অ্যালগরিদম (Steadfast/Pathao API) দিয়ে কুরিয়ার ডেলিভারি সাকসেস রেট যাচাই করার কাজে ব্যবহৃত হয়।
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">৩. তথ্যের গোপনীয়তা ও সুরক্ষা (Data Security)</h2>
            <p>
              আমরা কোনো কাস্টমারের ব্যক্তিগত তথ্য কোনো থার্ড-পার্টি বাণিজ্যিক প্রতিষ্ঠানের কাছে বিক্রি বা শেয়ার করি না। আপনার ডাটা আমাদের এনক্রিপ্টেড ডাটাবেজে সুরক্ষিত থাকে।
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">৪. যোগাযোগ (Contact Us)</h2>
            <p>
              গোপনীয়তা সংক্রান্ত যেকোনো প্রশ্ন বা তথ্য মুছে ফেলার অনুরোধের জন্য <strong>support@promilaa.com</strong> এ ইমেইল করুন।
            </p>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
