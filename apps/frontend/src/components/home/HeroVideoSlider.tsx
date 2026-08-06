"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/media/video/1.mp4",
    title: "EID & FESTIVE COLLECTION '26",
    subtitle: "Elevating Bangladeshi Women's Fashion with Handcrafted Kurtis, 1-Piece, 2-Piece & 3-Piece Masterpieces.",
    tag: "Festive Edition Vol. 4",
  },
  {
    src: "/media/video/2.mp4",
    title: "LUXURY BOUTIQUE KURTIS",
    subtitle: "Hand-Picked Cotton, Silk & Jacquard Designer Wear Craftsmanship for Daily Office & Formal Elegance.",
    tag: "Boutique Signature",
  },
  {
    src: "/media/video/3.mp4",
    title: "TRADITIONAL 3-PIECE SUITS",
    subtitle: "Zari Embroidered Dupatta & Lawn Kameez Ensembles Crafted for Weddings & Special Occasions.",
    tag: "Royalty Collection",
  },
];

export default function HeroVideoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Force Immediate Video Stream Playback on Slide Change and Initial Render
  useEffect(() => {
    slides.forEach((_, idx) => {
      const vid = videoRefs.current[idx];
      if (vid) {
        vid.muted = true;
        vid.setAttribute("playsinline", "true");
        vid.setAttribute("webkit-playsinline", "true");
        if (idx === currentIndex) {
          vid.currentTime = 0;
          const playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }
      }
    });
  }, [currentIndex]);

  // Fallback interaction listener for instant autoplay unlock on mobile
  useEffect(() => {
    const handleUnlock = () => {
      const currentVid = videoRefs.current[currentIndex];
      if (currentVid && currentVid.paused) {
        currentVid.play().catch(() => {});
      }
    };
    window.addEventListener("touchstart", handleUnlock, { once: true });
    window.addEventListener("scroll", handleUnlock, { once: true });
    return () => {
      window.removeEventListener("touchstart", handleUnlock);
      window.removeEventListener("scroll", handleUnlock);
    };
  }, [currentIndex]);

  const handleVideoEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[92vh] min-h-[680px] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
      {/* 100% Pure Video Background Engine (Zero Latency & Hardware GPU Accelerated) */}
      {slides.map((item, idx) => (
        <div
          key={item.src}
          className={`absolute inset-0 w-full h-full transform-gpu will-change-transform transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <video
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            src={item.src}
            muted
            playsInline
            autoPlay
            preload="auto"
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover scale-105 transform-gpu"
          >
            <track kind="captions" srcLang="en" label="Captions off" />
          </video>
        </div>
      ))}

      {/* Dark Overlay for High Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40 z-20 pointer-events-none" />

      {/* Content */}
      <div key={currentIndex} className="relative z-30 text-center text-white px-4 max-w-4xl mx-auto mt-12 transition-all duration-500">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-6 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          {slides[currentIndex].tag}
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.12em] uppercase mb-6 drop-shadow-2xl font-serif text-amber-50">
          {slides[currentIndex].title}
        </h1>

        <p className="text-base md:text-xl mb-10 font-light tracking-wide text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
          {slides[currentIndex].subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/collections/kurti"
            className="bg-amber-600 hover:bg-amber-700 text-white px-9 py-4 text-sm font-semibold tracking-widest uppercase transition-all shadow-lg hover:shadow-amber-600/30 rounded-sm w-full sm:w-auto min-h-[48px] flex items-center justify-center"
          >
            Explore Collection
          </Link>
          <Link
            href="/collections/festive"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white px-9 py-4 text-sm font-semibold tracking-widest uppercase transition-all rounded-sm w-full sm:w-auto font-medium min-h-[48px] flex items-center justify-center"
          >
            Festive Collection
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        aria-label="Previous Video"
        className="absolute left-4 md:left-8 z-40 p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/30 backdrop-blur-md transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        aria-label="Next Video"
        className="absolute right-4 md:right-8 z-40 p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/30 backdrop-blur-md transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-8 z-40 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? "w-10 bg-amber-500" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
