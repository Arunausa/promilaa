import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Sparkles, ShieldCheck, Heart, Award } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | PROMILAA BY SOPNIL",
  description: "Learn about PROMILAA BY SOPNIL - Bangladesh's premium women's ethnic fashion brand specializing in Kurtis, 1-Piece, 2-Piece, and 3-Piece collections.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Our Brand Story
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-wider uppercase mb-4">
            About PROMILAA BY SOPNIL
          </h1>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mb-6" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Crafting timeless Bangladeshi ethnic and fusion wear designed for elegance, daily comfort, and festive luxury.
          </p>
        </AnimatedSection>

        {/* Hero Image Showcase */}
        <AnimatedSection className="mb-16">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl shadow-lg bg-slate-900">
            <img 
              src="/media/three_piece/1.jpeg" 
              alt="Promilaa Fashion Heritage" 
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Elegance in Every Thread</h2>
              <p className="text-slate-300 text-sm max-w-lg">Designed in Bangladesh for women who celebrate tradition with modern grace.</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <AnimatedSection delay={0.1} className="bg-white p-8 rounded-xl border shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3 text-slate-900">100% Authentic Quality</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We source breathable cottons, silk weaves, and premium lawn fabrics to ensure unmatched comfort in Bangladesh's climate.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="bg-white p-8 rounded-xl border shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-700">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3 text-slate-900">Affordable Luxury</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our core promise is offering designer ethnic wear at accessible price points starting from ৳৫৯০ to ৳৮৫০.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3} className="bg-white p-8 rounded-xl border shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-700">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3 text-slate-900">Local Craftsmanship</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Supporting Bangladeshi artisans and hand embroidery craftsmen to bring royal zari and sequins work to life.
            </p>
          </AnimatedSection>
        </div>

        {/* Brand Promise Section */}
        <AnimatedSection className="bg-white p-10 rounded-xl border shadow-sm mb-16">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">আমাদের প্রতিশ্রুতি (Our Commitment)</h2>
          <div className="prose text-slate-600 text-sm leading-relaxed space-y-4">
            <p>
              প্রমিলা (Promilaa) শুধুমাত্র একটি ফ্যাশন ব্র্যান্ড নয় — এটি বাংলাদেশি নারীদের ঐতিহ্যবাহী সাজ ও আধুনিক ফ্যাশনের এক অনন্য মেলবন্ধন। আমাদের মূল মনোযোগ হলো সেরা মানের কুর্তি, ১-পিস, ২-পিস এবং ৩-পিস কালেকশন উপহার দেওয়া যা প্রতিটি উৎসবে আপনাকে এনে দেবে রাজকীয় সৌন্দর্য।
            </p>
            <p>
              প্রতিটি পোশাকের কাপড় বাছাই থেকে শুরু করে নিখুঁত সেলাই ও প্যাকেজিং — আমরা প্রতিটি পদক্ষেপে সর্বোচ্চ ফিনিশিং নিশ্চিত করি।
            </p>
          </div>
          <div className="mt-8 pt-6 border-t flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Need help or inquiries?</h4>
              <p className="text-xs text-slate-500">Our customer team is available 10 AM - 10 PM</p>
            </div>
            <Link href="/contact" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded">
              Contact Our Team
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
