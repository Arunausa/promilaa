import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Promilaa",
  description: "Promilaa e-commerce terms of service, user guidelines, and order policies.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-wider uppercase mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            প্রমিলা ওয়েবসাইট ব্যবহারের শর্তাবলী ও নীতিসমূহ।
          </p>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-4" />
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection className="bg-white p-10 rounded-xl border shadow-sm prose max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">১. সাধারণ শর্তাবলী (General Provisions)</h2>
            <p>
              promilaa.com ওয়েবসাইট ব্যবহার বা কোনো পণ্য অর্ডার করার মাধ্যমে কাস্টমার এই শর্তাবলীতে সম্মত হচ্ছেন বলে গণ্য হবে। প্রমিলা কর্তৃপক্ষ যেকোনো সময় পূর্ব ঘোষণা ছাড়া এই নীতিমালায় পরিবর্তন আনার অধিকার সংরক্ষণ করে।
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">২. অর্ডার ও পেমেন্ট নীতি (Orders & Payment Policy)</h2>
            <p>
              সব প্রোডাক্টের মূল্য টাকায় (৳) প্রদর্শিত। কোনো অর্ডারের ট্রানজ্যাকশন আইডি (TrxID) ভুয়া প্রমাণিত হলে বা ফ্রড চেকার অ্যালগরিদমে হাই-রিস্ক দেখাল প্রমিলা কর্তৃপক্ষ উক্ত অর্ডার বাতিল করার ক্ষমতা রাখে।
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">৩. বুদ্ধিবৃত্তিক সম্পত্তি (Intellectual Property)</h2>
            <p>
              এই ওয়েবসাইটে ব্যবহৃত সব ছবি, ভিডিও, লোগো এবং টেক্সট প্রমিলা ফ্যাশনের স্বত্বাধিকারভুক্ত। অনুমতি ছাড়া বাণিজ্যিকভাবে এগুলো ব্যবহার করা আইনত দণ্ডনীয়।
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">৪. আইনগত অধিক্ষেত্র (Governing Law)</h2>
            <p>
              এই ওয়েবসাইট ব্যবহারের যাবতীয় লেনদেন ও নীতিসমূহ গণপ্রজাতন্ত্রী বাংলাদেশের আইন অনুযায়ী পরিচালিত হবে।
            </p>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
