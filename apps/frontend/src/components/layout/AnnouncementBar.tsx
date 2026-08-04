"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const DEFAULT_TEXT = "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸";

export default function AnnouncementBar() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setText(data.announcementText || DEFAULT_TEXT);
            setEnabled(data.announcementEnabled === true);
            setLoaded(true);
          }
        }
      } catch (e) {
        if (isMounted) setLoaded(true);
      }
    }

    fetchSettings();

    // Listen for instant admin settings update event
    const handleSettingsChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && isMounted) {
        setText(detail.announcementText || DEFAULT_TEXT);
        setEnabled(detail.announcementEnabled === true);
      } else {
        fetchSettings();
      }
    };

    window.addEventListener("promilaa:settings-changed", handleSettingsChanged);
    return () => {
      isMounted = false;
      window.removeEventListener("promilaa:settings-changed", handleSettingsChanged);
    };
  }, []);

  if (!loaded || !enabled) return null;

  return (
    <div className="bg-slate-900 text-amber-300 text-xs sm:text-xs font-semibold py-2 px-3 text-center tracking-wide flex items-center justify-center gap-1.5 border-b border-amber-500/20 shadow-inner overflow-hidden leading-tight select-none">
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="truncate max-w-full">{text}</span>
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse hidden sm:inline" />
    </div>
  );
}
