"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const DEFAULT_TEXT = "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸";

function readFromStorage() {
  try {
    const raw = localStorage.getItem("promilaa_admin_settings");
    if (!raw) return { text: DEFAULT_TEXT, enabled: true };
    const parsed = JSON.parse(raw);
    return {
      text: parsed.announcementText || DEFAULT_TEXT,
      enabled: parsed.announcementEnabled !== false,
    };
  } catch {
    return { text: DEFAULT_TEXT, enabled: true };
  }
}

export default function AnnouncementBar() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Initial read from localStorage
    const { text: t, enabled: e } = readFromStorage();
    setText(t);
    setEnabled(e);
    setReady(true);

    // Listen for instant updates when Admin saves Settings
    const handleSettingsChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setText(detail.announcementText || DEFAULT_TEXT);
        setEnabled(detail.announcementEnabled !== false);
      } else {
        // fallback: re-read localStorage
        const { text: t2, enabled: e2 } = readFromStorage();
        setText(t2);
        setEnabled(e2);
      }
    };

    window.addEventListener("promilaa:settings-changed", handleSettingsChanged);
    return () => {
      window.removeEventListener("promilaa:settings-changed", handleSettingsChanged);
    };
  }, []);

  // Don't render until localStorage has been read (avoid flash)
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
