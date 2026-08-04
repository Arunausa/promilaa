"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const videos = [
  {
    src: "/media/video/1.mp4",
    poster: "/media/three_piece/1.jpeg",
    title: "Promilaa",
    tag: "Eid & Festive Collection '26",
    subtitle: "Elevating Bangladeshi Women's Fashion with Handcrafted Kurtis, 1-Piece, 2-Piece & 3-Piece Ethnic Masterpieces.",
  },
  {
    src: "/media/video/2.mp4",
    poster: "/media/festive/1.jpeg",
    title: "Boutique Elegance",
    tag: "Exquisite Craftsmanship",
    subtitle: "Experience authentic Bangladeshi weaving, delicate embroidery, and royal silk fabrics.",
  },
  {
    src: "/media/video/3.mp4",
    poster: "/media/kurti/3.jpeg",
    title: "South Asian Royal Wear",
    tag: "New Season Arrivals",
    subtitle: "Designed for the modern Bangladeshi woman who values heritage, comfort, and luxury.",
  },
];

export default function HeroVideoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVideoEnded = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  useEffect(() => {
    if (!mounted) return;
    videoRefs.current.forEach((vid, i) => {
      if (vid) {
        if (i === currentIndex) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    });
  }, [currentIndex, mounted]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <section className="relative h-[92vh] min-h-[680px] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
      {/* Background Videos Layer - 100% Solid Opacity to Eliminate Double-Exposure / Ghost Overlay */}
      {videos.map((item, idx) => (
        <video
          key={item.src}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          muted
          playsInline
          preload={idx === 0 ? "auto" : "metadata"}
          onEnded={handleVideoEnded}
          poster={item.poster}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100 pointer-events-none"
          }`}
        >
          <source src={item.src} type="video/mp4" />
        </video>
      ))}

      {/* Dark Gradient Overlay for Crisp Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40 z-10 pointer-events-none" />

      {/* Content */}
      <AnimatedSection key={currentIndex} className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto mt-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-6 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          {videos[currentIndex].tag}
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.12em] uppercase mb-6 drop-shadow-2xl font-serif text-amber-50">
          {videos[currentIndex].title}
        </h1>

        <p className="text-base md:text-xl mb-10 font-light tracking-wide text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
          {videos[currentIndex].subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/collections/kurti"
            className="bg-amber-600 hover:bg-amber-700 text-white px-9 py-4 text-sm font-semibold tracking-widest uppercase transition-all shadow-lg hover:shadow-amber-600/30 rounded-sm w-full sm:w-auto"
          >
            Explore Collection
          </Link>
          <Link
            href="/collections/festive"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white px-9 py-4 text-sm font-semibold tracking-widest uppercase transition-all rounded-sm w-full sm:w-auto"
          >
            Festive Collection
          </Link>
        </div>
      </AnimatedSection>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        aria-label="Previous Video"
        className="absolute left-4 md:left-8 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        aria-label="Next Video"
        className="absolute right-4 md:right-8 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-8 z-30 flex items-center gap-3">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i === currentIndex ? "w-10 bg-amber-500" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
