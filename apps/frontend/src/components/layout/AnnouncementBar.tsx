"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AnnouncementBar() {
  const [text, setText] = useState("🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // 1. Try LocalStorage
    const local = localStorage.getItem("promilaa_admin_settings");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.announcementText) setText(parsed.announcementText);
        if (typeof parsed.announcementEnabled === 'boolean') setEnabled(parsed.announcementEnabled);
      } catch (e) {}
    }

    // 2. Fetch live settings from server
    apiFetch<{ settings: any }>("/api/admin/settings")
      .then((res) => {
        if (res.settings) {
          if (res.settings.announcementText) setText(res.settings.announcementText);
          if (typeof res.settings.announcementEnabled === 'boolean') setEnabled(res.settings.announcementEnabled);
        }
      })
      .catch(() => {});
  }, []);

  if (!enabled) return null;

  return (
    <div className="bg-slate-900 text-amber-300 text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-amber-500/20 shadow-inner overflow-hidden">
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="truncate max-w-4xl">{text}</span>
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse hidden sm:inline" />
    </div>
  );
}
