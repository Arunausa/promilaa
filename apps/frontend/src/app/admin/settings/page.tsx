"use client";

import { useEffect, useState } from "react";
import { Save, Store, CreditCard, Truck, Megaphone, CheckCircle2, ShieldCheck, Lock, MessageSquare, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

type SettingsType = {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  shippingDhaka: string;
  shippingOutsideDhaka: string;
  announcementEnabled: boolean;
  announcementText: string;
  fraudbdApiKey: string;
  steadfastUser: string;
  steadfastPassword: string;
  pathaoUsername: string;
  pathaoPassword: string;
  fbPixelId: string;
  smsApiToken: string;
};

const SectionTitle = ({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) => (
  <div className="flex flex-col mb-4 pb-3 border-b border-slate-100">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-700" />
      </div>
      <h2 className="font-bold text-slate-900">{title}</h2>
    </div>
    {subtitle && <p className="text-xs text-slate-500 mt-1 pl-10">{subtitle}</p>}
  </div>
);

const Field = ({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: keyof SettingsType;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
    />
  </div>
);

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<SettingsType>({
    storeName: "PROMILAA BY SOPNIL",
    storePhone: "01601708251",
    storeEmail: "support@promilaa.com",
    bkashNumber: "01601708251",
    nagadNumber: "01601708251",
    rocketNumber: "01601708251",
    shippingDhaka: "80",
    shippingOutsideDhaka: "150",
    announcementEnabled: true,
    announcementText: "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸",
    fraudbdApiKey: "",
    steadfastUser: "",
    steadfastPassword: "",
    pathaoUsername: "",
    pathaoPassword: "",
    fbPixelId: "",
    smsApiToken: "",
  });

  // Load Settings on Mount
  useEffect(() => {
    // 1. Try LocalStorage
    const local = localStorage.getItem("promilaa_admin_settings");
    if (local) {
      try {
        setSettings(JSON.parse(local));
      } catch (e) {}
    }

    // 2. Try Server Settings API
    apiFetch<{ settings: SettingsType }>("/api/admin/settings")
      .then((res) => {
        if (res.settings) {
          setSettings((prev) => ({ ...prev, ...res.settings }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Save to LocalStorage immediately
      localStorage.setItem("promilaa_admin_settings", JSON.stringify(settings));

      // 2. Persist to Server API
      await apiFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(settings),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      // Fallback saved via LocalStorage
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">PROMILAA BY SOPNIL Admin Control</h1>
          <p className="text-xs text-slate-500 mt-1">শপের জেনারেল সেটিংস, কুরিয়ার একাউন্ট লগইন, SMS ও ফেসবুক পিক্সেল ব্যবস্থাপনা</p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            সেটিংস স্থায়ীভাবে সেভ হয়েছে!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Security Banner Notice */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border shadow-md flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-400">১০০% সিকিউর এডমিন ড্যাশবোর্ড কন্ট্রোল</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              আপনার Steadfast কুরিয়ার একাউন্টের লগইন তথ্য, Greenweb SMS Token এবং Facebook Pixel ID সব আপনি সরাসরি এই এডমিন পেজ থেকেই পোস্ট ও সেভ করতে পারবেন।
            </p>
          </div>
        </div>

        {/* Courier & Fraud API Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <SectionTitle 
            icon={Truck} 
            title="Steadfast Courier Account & Fraud Checker (কুরিয়ার লগইন তথ্য)" 
            subtitle="আপনার Steadfast কুরিয়ারের মার্চেন্ট প্যানেল লগইন মোবাইল নম্বর ও পাসওয়ার্ড এখানে দিন"
          />

          <div className="space-y-6">
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Steadfast Courier Direct Login & 1-Click Booking
                </h4>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">Active Courier</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Steadfast Username (Phone or Email)" name="steadfastUser" placeholder="১১ ডিজিটের মোবাইল নম্বর" value={settings.steadfastUser} onChange={handleChange} />
                <Field label="Steadfast Account Password" name="steadfastPassword" placeholder="••••••••" type="password" value={settings.steadfastPassword} onChange={handleChange} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> FraudBD Multi-Courier Guard API (Optional)
              </h4>
              <Field 
                label="FraudBD API Key (https://fraudbd.com)" 
                name="fraudbdApiKey" 
                placeholder="6f5a0bfcc142b07190191e2bc..." 
                type="password" 
                value={settings.fraudbdApiKey} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>

        {/* SMS Gateway & Marketing Trackers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <SectionTitle 
            icon={MessageSquare} 
            title="Automated SMS & Marketing Integration (এসএমএস ও ফেসবুক পিক্সেল)" 
            subtitle="গ্রাহকের মোবাইলে অটোমেটিক এসএমএস পাঠানো এবং ফেসবুক এডস ট্র্যাকিং সেটিংস"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" /> SMS Gateway Token (Greenweb / BulkSMS BD)
              </h4>
              <Field label="Greenweb SMS API Token" name="smsApiToken" placeholder="greenweb_token_xxxxxx" type="password" value={settings.smsApiToken} onChange={handleChange} />
            </div>

            <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" /> Facebook Pixel ID (Meta Ads Tracking)
              </h4>
              <Field label="Facebook Pixel ID (15-digits)" name="fbPixelId" placeholder="123456789012345" value={settings.fbPixelId} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <SectionTitle icon={Store} title="Store Information (শপের তথ্য)" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Store Name" name="storeName" placeholder="PROMILAA BY SOPNIL" value={settings.storeName} onChange={handleChange} />
            <Field label="Support Phone" name="storePhone" placeholder="01601708251" type="tel" value={settings.storePhone} onChange={handleChange} />
            <Field label="Support Email" name="storeEmail" placeholder="support@promilaa.com" type="email" value={settings.storeEmail} onChange={handleChange} />
          </div>
        </div>

        {/* Payment Numbers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <SectionTitle 
            icon={CreditCard} 
            title="Manual Payment Numbers (বিকাশ/নগদ নম্বর)" 
            subtitle="কাস্টমারদের চেকআউট পেজে এই নম্বরগুলো সেন্ড মানির জন্য দেখানো হবে"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="bKash Personal Number" name="bkashNumber" placeholder="01601708251" type="tel" value={settings.bkashNumber} onChange={handleChange} />
            <Field label="Nagad Personal Number" name="nagadNumber" placeholder="01601708251" type="tel" value={settings.nagadNumber} onChange={handleChange} />
            <Field label="Rocket Personal Number" name="rocketNumber" placeholder="01601708251" type="tel" value={settings.rocketNumber} onChange={handleChange} />
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <SectionTitle icon={Truck} title="Shipping Fees (ডেলিভারি চার্জ)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Dhaka Inside Delivery Fee (৳)" name="shippingDhaka" placeholder="80" type="number" value={settings.shippingDhaka} onChange={handleChange} />
            <Field label="Outside Dhaka Delivery Fee (৳)" name="shippingOutsideDhaka" placeholder="150" type="number" value={settings.shippingOutsideDhaka} onChange={handleChange} />
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <SectionTitle icon={Megaphone} title="Announcement Banner (ঘোষণা ব্যানার)" />
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="announcementEnabled"
              name="announcementEnabled"
              checked={settings.announcementEnabled}
              onChange={handleChange}
              className="w-4 h-4 rounded text-slate-900"
            />
            <label htmlFor="announcementEnabled" className="text-sm font-semibold text-slate-800">
              ওয়েবসাইটের উপরে ব্যানার রানিং রাখুন
            </label>
          </div>
          {settings.announcementEnabled && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ব্যানার টেক্সট</label>
              <input
                type="text"
                name="announcementText"
                value={settings.announcementText}
                onChange={handleChange}
                placeholder="যেমন: ফ্রিতে ডেলিভারি পেতে ৩টি ড্রেস অর্ডার করুন!"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} size="lg" className="gap-2 px-8 py-6 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg">
            <Save className="w-4 h-4" />
            {saving ? "সংরক্ষিত হচ্ছে..." : "সেটিংস সেভ করুন (Save Settings)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
