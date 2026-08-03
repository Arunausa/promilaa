"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const DEFAULT_TEXT = "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸";

export default function AnnouncementBar() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only read from LocalStorage — the settings page saves here on Save
    const local = localStorage.getItem("promilaa_admin_settings");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.announcementText) setText(parsed.announcementText);
        // Explicitly check for false — if user turned it off, respect that
        if (parsed.announcementEnabled === false) {
          setEnabled(false);
        } else {
          setEnabled(true);
        }
      } catch (e) {}
    }
    setReady(true);
  }, []);

  // Don't render until we've read localStorage (avoids flash)
  if (!ready) return null;
  if (!enabled) return null;

  return (
    <div className="bg-slate-900 text-amber-300 text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-amber-500/20 shadow-inner overflow-hidden">
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="truncate max-w-4xl">{text}</span>
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse hidden sm:inline" />
    </div>
  );
}
