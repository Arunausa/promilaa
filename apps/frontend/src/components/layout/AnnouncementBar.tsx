import React from "react";
import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-slate-900 text-amber-300 text-xs sm:text-xs font-semibold py-2 px-3 text-center tracking-wide flex items-center justify-center gap-1.5 border-b border-amber-500/20 shadow-inner overflow-hidden leading-tight select-none">
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="truncate max-w-full">🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸</span>
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse hidden sm:inline" />
    </div>
  );
}
