"use client";

import { useRef, useEffect, useState } from "react";
import { Play } from "lucide-react";

interface ReelVideoProps {
  src: string;
  label: string;
  tag: string;
}

export default function ReelVideo({ src, label, tag }: ReelVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleTogglePlay}
      className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 group shadow-xl border cursor-pointer select-none"
    >
      {isVisible && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          onMouseEnter={(e) => {
            e.currentTarget.play().then(() => setIsPlaying(true)).catch(() => {});
          }}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            setIsPlaying(false);
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
          <track kind="captions" srcLang="en" label="Captions off" />
        </video>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-center">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
            {tag}
          </span>
          {!isPlaying && (
            <Play className="w-6 h-6 text-white/80 group-hover:scale-125 transition-transform" />
          )}
        </div>
        <div>
          <h3 className="text-white font-serif font-bold text-lg">{label}</h3>
          <p className="text-slate-300 text-xs mt-1">Tap or hover to play live preview</p>
        </div>
      </div>
    </div>
  );
}
