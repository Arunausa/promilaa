import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import HeroVideoSlider from "@/components/home/HeroVideoSlider";
import ReelVideo from "@/components/home/ReelVideo";
import { Star, ShieldCheck, Truck, RefreshCw, ArrowRight, Play, Sparkles } from "lucide-react";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const getFeaturedProducts = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        where: { isPublished: true },
        take: 12,
        include: {
          images: { orderBy: 'asc' ? { position: 'asc' } : { position: 'asc' } },
          variants: true,
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return products;
    } catch (error) {
      console.error("Failed to fetch featured products from Prisma:", error);
      return [];
    }
  },
  ["home-featured-products"],
  { revalidate: 60, tags: ["products"] }
);

export default async function Home() {
  const allProducts = await getFeaturedProducts();
  
  // Separate products for Festive Edit section vs New Arrivals
  const festiveProducts = allProducts.filter((p: any) => p.category?.slug === 'festive' || p.isFeatured).slice(0, 4);
  const newArrivals = allProducts.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* HERO SECTION — Smooth Auto-Cycling Background Videos */}
      <HeroVideoSlider />

      {/* CATEGORY SHOWCASE GRID */}
      <section className="py-16 md:py-24 px-4 container mx-auto">
        <AnimatedSection className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-2 block">
            Exclusive Selection
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Shop By Category
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Explore our thoughtfully curated traditional ethnic wear crafted for modern elegance.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: "Kurti Collection", slug: "kurti", count: "10+ Styles", img: "/media/kurti/1.jpeg" },
            { title: "One Piece Dress", slug: "one-piece", count: "7+ Styles", img: "/media/one_piece/1.jpeg" },
            { title: "Two Piece Suit", slug: "two-piece", count: "8+ Styles", img: "/media/two_piece/1.jpeg" },
            { title: "Three Piece Suit", slug: "three-piece", count: "16+ Styles", img: "/media/three_piece/1.jpeg" },
          ].map((cat, idx) => (
            <AnimatedSection key={cat.slug} delay={idx * 0.1}>
              <Link href={`/collections/${cat.slug}`} className="group relative aspect-[3/4] block rounded-xl overflow-hidden shadow-md">
                <img
                  src={cat.img}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white transition-opacity duration-300">
                  <span className="text-xs font-medium text-amber-300 uppercase tracking-widest mb-1">{cat.count}</span>
                  <h3 className="text-xl font-serif font-bold group-hover:translate-x-1 transition-transform">{cat.title}</h3>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* FESTIVE COLLECTION SPOTLIGHT */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
            <AnimatedSection className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Eid & Wedding Special
              </span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4 text-white">
                The Festive Collection &apos;26
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Opulent fabrics, hand-detailed embroidery, and rich festive colors designed for grand celebrations.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Link
                href="/collections/festive"
                className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-amber-900/40 hover:scale-105"
              >
                Explore Festive Range <ArrowRight className="w-5 h-5" />
              </Link>
            </AnimatedSection>
          </div>

          {/* Festive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {festiveProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* REELS / BEHIND THE SCENES SHOWCASE */}
      <section className="py-20 bg-white border-y">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-2 block">
              Live Boutique Showcase
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">
              Promilaa In Motion
            </h2>
            <p className="text-slate-600 text-sm">
              Watch our handcrafted ethnic wear modeled live inside our studio.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: "/media/video/1.mp4", label: "Festive Suit Walk", tag: "Vol. 4" },
              { src: "/media/video/2.mp4", label: "Boutique Collection", tag: "Kurti Edition" },
              { src: "/media/video/3.mp4", label: "Traditional 3-Piece", tag: "Eid Range" },
            ].map((reel, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <ReelVideo src={reel.src} label={reel.label} tag={reel.tag} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS CATALOG GRID */}
      <section className="py-20 px-4 container mx-auto">
        <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-2 block">
              Just Arrived
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/collections/kurti"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-amber-700 transition-colors"
          >
            View All Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {newArrivals.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* BRAND VALUES / TRUST BADGES */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Truck, title: "All Bangladesh Delivery", desc: "Dhaka ৳80 | Outside Dhaka ৳150" },
              { icon: ShieldCheck, title: "Cash On Delivery", desc: "Pay safely after receiving products" },
              { icon: RefreshCw, title: "7 Days Size Exchange", desc: "Hassle-free size replacement policy" },
              { icon: Star, title: "Authentic Quality", desc: "100% premium fabric & embroidery" },
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <AnimatedSection key={idx} delay={idx * 0.1} className="flex flex-col items-center p-4">
                  <div className="p-4 rounded-full bg-white/5 mb-4 text-amber-400 border border-white/10">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-base mb-1">{badge.title}</h4>
                  <p className="text-slate-400 text-xs">{badge.desc}</p>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
