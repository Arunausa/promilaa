import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import HeroVideoSlider from "@/components/home/HeroVideoSlider";
import { Star, ShieldCheck, Truck, RefreshCw, ArrowRight, Play, Sparkles } from "lucide-react";

async function getFeaturedProducts() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const res = await fetch(`${apiBase}/api/products?limit=12`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export default async function Home() {
  const allProducts = await getFeaturedProducts();
  
  // Separate products for Festive Edit section vs New Arrivals
  const festiveProducts = allProducts.filter((p: any) => p.category?.slug === 'festive' || p.isFeatured).slice(0, 4);
  const newArrivals = allProducts.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* 1. Main Hero Section with Auto-Rotating 3 Videos */}
      <HeroVideoSlider />

      {/* 2. Brand Trust Features Banner */}
      <section className="bg-white border-b border-slate-200 py-6 shadow-sm">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">100% Authentic</h4>
              <p className="text-[11px] text-slate-500">Premium Bangladeshi Fabrics</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-2">
            <Truck className="w-6 h-6 text-amber-600" />
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Nationwide Delivery</h4>
              <p className="text-[11px] text-slate-500">Fast Shipping across BD</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-2">
            <RefreshCw className="w-6 h-6 text-amber-600" />
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Easy Exchange</h4>
              <p className="text-[11px] text-slate-500">Hassle-free size replacement</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-2">
            <Star className="w-6 h-6 text-amber-600" />
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Trusted Brand</h4>
              <p className="text-[11px] text-slate-500">10,000+ Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Product Categories Grid */}
      <section className="py-20 container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Curated Lineup</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wider uppercase mt-1 mb-3">
              Shop By Category
            </h2>
            <div className="w-16 h-0.5 bg-amber-600 mx-auto" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Kurti Collection", 
              subtitle: "Designer Single Kurtis",
              img: "/media/kurti/1.jpeg", 
              link: "/collections/kurti" 
            },
            { 
              title: "One Piece", 
              subtitle: "Floral & Fusion Dresses",
              img: "/media/one_piece/1.jpeg", 
              link: "/collections/one-piece" 
            },
            { 
              title: "Two Piece Set", 
              subtitle: "Kurti & Trouser Sets",
              img: "/media/two_piece/1.jpeg", 
              link: "/collections/two-piece" 
            },
            { 
              title: "Three Piece Suit", 
              subtitle: "Dupatta & Suit Sets",
              img: "/media/three_piece/1.jpeg", 
              link: "/collections/three-piece" 
            }
          ].map((cat, idx) => (
            <AnimatedSection key={cat.title} delay={idx * 0.1}>
              <Link href={cat.link} className="group relative block aspect-[3/4] overflow-hidden rounded-md shadow-md bg-slate-100">
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent group-hover:from-slate-950/90 transition-colors duration-300" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-amber-300 text-[11px] font-semibold tracking-widest uppercase mb-1 block">
                    {cat.subtitle}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider mb-2">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white text-xs font-semibold tracking-widest uppercase opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    Explore Now <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* 4. DEDICATED FESTIVE EDIT SPOTLIGHT SECTION */}
      <section className="py-20 bg-gradient-to-br from-amber-950 via-slate-950 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Special Occasion Spotlight
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-widest uppercase mb-4 text-amber-100">
              The Festive Collection '26
            </h2>
            <p className="text-slate-300 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
              Exquisite velvet borders, handcrafted zari embroidery, and pure silk ensembles created for Eid, weddings, and grand celebrations.
            </p>
          </AnimatedSection>

          {/* Festive Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { title: "Zari Silk Suits", img: "/media/festive/1.jpeg", price: "৳780", link: "/collections/festive" },
              { title: "Velvet Celebration Suits", img: "/media/festive/2.jpeg", price: "৳850", link: "/collections/festive" },
              { title: "Royal Dupatta Sets", img: "/media/festive/4.jpeg", price: "৳820", link: "/collections/festive" },
            ].map((item, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1}>
                <Link href={item.link} className="group relative block aspect-[3/4] overflow-hidden rounded-lg border border-amber-500/20 shadow-2xl">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
                      Starting From {item.price}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white uppercase mb-3">
                      {item.title}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-300 group-hover:translate-x-1 transition-transform">
                      Shop Festive Collection <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/collections/festive"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 text-xs font-semibold tracking-widest uppercase transition-all rounded-sm shadow-xl hover:shadow-amber-600/30"
            >
              Explore Full Festive Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Interactive Video Reels Showcase */}
      <section className="py-16 bg-slate-900 text-white border-y border-slate-800">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Behind The Scenes</span>
            <h2 className="text-3xl font-serif font-bold tracking-wider uppercase text-white mt-1">
              Boutique Walkthrough & Live Fits
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2 font-light">
              Experience the fabric movement, fit, and craftsmanship of Promilaa in action.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Boutique Experience", video: "/media/video/1.mp4", poster: "/media/three_piece/2.jpeg" },
              { title: "Boutique Walkthrough", video: "/media/video/2.mp4", poster: "/media/festive/1.jpeg" },
              { title: "South Asian Elegance", video: "/media/video/3.mp4", poster: "/media/kurti/3.jpeg" },
            ].map((v, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="relative group rounded-lg overflow-hidden bg-slate-950 border border-slate-800 aspect-[9/14]">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  poster={v.poster}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                >
                  <source src={v.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase mb-2">
                    <Play className="w-3 h-3 fill-amber-300" /> Promilaa Live
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white uppercase">{v.title}</h4>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Luxury Lookbook Feature Section */}
      <section className="py-20 bg-white text-slate-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <AnimatedSection className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Handcrafted Perfection</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-wide leading-tight">
                Authentic Craftsmanship & Traditional Aesthetics
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
                Every Promilaa creation celebrates the rich heritage of Bangladeshi textiles. From delicate hand embroidery to rich silk weaves, our collection is curated for women who value quality and effortless style.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-amber-600">100%</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Breathable Fabrics</p>
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-amber-600">Custom</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Bangladeshi Tailoring</p>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/collections/festive"
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all rounded-sm shadow-md"
                >
                  View Festive Catalogue <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="/media/festive/2.jpeg" 
                  alt="Festive Suit" 
                  className="w-full aspect-[4/5] object-cover rounded-md shadow-lg"
                />
                <img 
                  src="/media/two_piece/2.jpeg" 
                  alt="Two piece detail" 
                  className="w-full aspect-[4/5] object-cover rounded-md shadow-lg"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="/media/three_piece/3.jpeg" 
                  alt="Three piece Model" 
                  className="w-full aspect-[4/5] object-cover rounded-md shadow-lg"
                />
                <img 
                  src="/media/one_piece/2.jpeg" 
                  alt="One piece detail" 
                  className="w-full aspect-[4/5] object-cover rounded-md shadow-lg"
                />
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* 7. Featured Catalog Grid (New Arrivals) */}
      <section className="py-24 bg-slate-50 border-t">
        <div className="container mx-auto px-4">
          <AnimatedSection className="flex flex-col md:flex-row items-center justify-between mb-14 border-b pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Fresh Drops</span>
              <h2 className="text-3xl font-serif font-bold tracking-wider uppercase text-slate-900">New Arrivals</h2>
            </div>
            <Link 
              href="/collections/kurti" 
              className="hidden md:inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:text-amber-600 transition-colors border-b border-black pb-1"
            >
              View All Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </AnimatedSection>
          
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((product: any, idx: number) => (
                <AnimatedSection key={product.id} delay={idx * 0.05}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <p className="text-muted-foreground text-center py-12">Loading products catalog...</p>
            </AnimatedSection>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link 
              href="/collections/kurti" 
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-b border-black pb-1"
            >
              View All Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Customer Testimonials */}
      <section className="py-20 bg-amber-50/50 border-t border-b border-amber-100">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center gap-1 mb-6">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />)}
            </div>
            <h2 className="text-2xl md:text-3xl font-serif leading-relaxed mb-6 text-slate-900 font-medium">
              "প্রমিলা এর থ্রি-পিস ও কুর্তির কাপড় আর সেলাই এর মান সত্যিই অসাধারণ! ছবির সাথে বাস্তবের কাপড়ের কোয়ালিটি ১০০% মিল।"
            </h2>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-800">
              — নুশরাত জাহান, ঢাকা
            </p>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
