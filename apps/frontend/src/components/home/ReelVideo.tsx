"use client";

import { Play } from "lucide-react";

interface ReelVideoProps {
  src: string;
  label: string;
  tag: string;
}

export default function ReelVideo({ src, label, tag }: ReelVideoProps) {
  return (
    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 group shadow-xl border">
      <video
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={(e) => e.currentTarget.play()}
        onMouseLeave={(e) => e.currentTarget.pause()}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-center">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
            {tag}
          </span>
          <Play className="w-6 h-6 text-white/80 group-hover:scale-125 transition-transform" />
        </div>
        <div>
          <h4 className="text-white font-serif font-bold text-lg">{label}</h4>
          <p className="text-slate-300 text-xs mt-1">Hover to preview reel</p>
        </div>
      </div>
    </div>
  );
}
