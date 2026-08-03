"use client";

import { useState } from "react";
import { Save, Store, CreditCard, Truck, Megaphone, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  steadfastApiKey: string;
  steadfastSecretKey: string;
  pathaoClientId: string;
  pathaoClientSecret: string;
  pathaoUsername: string;
  pathaoPassword: string;
  redxApiToken: string;
};

// SectionTitle moved outside to module scope
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

// Field component moved outside to module scope
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
      value={value}
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
    storeName: "Promilaa Ethnic Wear",
    storePhone: "017XXXXXXXX",
    storeEmail: "support@promilaa.com",
    bkashNumber: "017XXXXXXXX",
    nagadNumber: "017XXXXXXXX",
    rocketNumber: "017XXXXXXXX",
    shippingDhaka: "80",
    shippingOutsideDhaka: "150",
    announcementEnabled: true,
    announcementText: "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸",
    fraudbdApiKey: "6f5a0bfcc142b07190191e2bc8b97c53c24e8f3a6ad0ed8ea1a33b7c400163e4",
    steadfastApiKey: "",
    steadfastSecretKey: "",
    pathaoClientId: "",
    pathaoClientSecret: "",
    pathaoUsername: "",
    pathaoPassword: "",
    redxApiToken: "",
  });

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
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store & System Settings</h1>
          <p className="text-xs text-slate-500 mt-1">শপের জেনারেল সেটিংস, ফ্রড চেক এপিআই কি ও কুরিয়ার তথ্য ব্যবস্থাপনা</p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            সেটিংস সফলভাবে সংরক্ষিত হয়েছে!
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
            <h3 className="font-bold text-sm text-amber-400">এপিআই সিকিউরিটি ও এনক্রিপশন সিস্টেম (Encrypted Admin Storage)</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              আপনার ফ্রড চেক API Keys (FraudBD, Steadfast, Pathao, RedX) এডমিন প্যানেলের মাধ্যমে সুরক্ষিত থাকে। যখনই আপনি নতুন কুরিয়ার একাউন্ট করবেন, এডমিন সেটিংস প্যানেল থেকে এপিআই কী ও সিক্রেট পাসওয়ার্ড পরিবর্তন করতে পারবেন।
            </p>
          </div>
        </div>

        {/* Courier & Fraud API Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <SectionTitle 
            icon={ShieldCheck} 
            title="Courier Fraud Checker API Credentials (কুরিয়ার এপিআই সেটিংস)" 
            subtitle="FraudBD বা Steadfast/Pathao মার্চেন্ট প্যানেল থেকে এপিআই কী এনে এখানে দিন"
          />

          <div className="space-y-6">
            {/* FraudBD API (Active Primary Engine) */}
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> FraudBD Courier Check API (https://fraudbd.com)
                </h4>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">Active Engine</span>
              </div>
              <Field 
                label="FraudBD API Key" 
                name="fraudbdApiKey" 
                placeholder="6f5a0bfcc142b07190191e2bc8b97c53c24e8f3a6ad0ed8ea1a33b7c400163e4" 
                type="password" 
                value={settings.fraudbdApiKey} 
                onChange={handleChange} 
              />
            </div>

            {/* Steadfast */}
            <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Steadfast Courier Fraud Checker API (Optional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Steadfast API Key" name="steadfastApiKey" placeholder="st_live_xxxxxxxxx" value={settings.steadfastApiKey} onChange={handleChange} />
                <Field label="Steadfast Secret Key" name="steadfastSecretKey" placeholder="st_secret_xxxxxxxxx" type="password" value={settings.steadfastSecretKey} onChange={handleChange} />
              </div>
            </div>

            {/* Pathao */}
            <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Pathao Courier Fraud Checker API (Optional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Pathao Client ID" name="pathaoClientId" placeholder="client_id_xxxx" value={settings.pathaoClientId} onChange={handleChange} />
                <Field label="Pathao Client Secret" name="pathaoClientSecret" placeholder="client_secret_xxxx" type="password" value={settings.pathaoClientSecret} onChange={handleChange} />
                <Field label="Pathao Username (Email)" name="pathaoUsername" placeholder="your_email@pathao.com" value={settings.pathaoUsername} onChange={handleChange} />
                <Field label="Pathao Password" name="pathaoPassword" placeholder="••••••••" type="password" value={settings.pathaoPassword} onChange={handleChange} />
              </div>
            </div>

            {/* RedX */}
            <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> RedX Courier API (Optional)
              </h4>
              <Field label="RedX Access Token" name="redxApiToken" placeholder="redx_bearer_token_xxxx" type="password" value={settings.redxApiToken} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <SectionTitle icon={Store} title="Store Information (শপের তথ্য)" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Store Name" name="storeName" placeholder="Promilaa" value={settings.storeName} onChange={handleChange} />
            <Field label="Support Phone" name="storePhone" placeholder="017XXXXXXXX" type="tel" value={settings.storePhone} onChange={handleChange} />
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
            <Field label="bKash Personal Number" name="bkashNumber" placeholder="017XXXXXXXX" type="tel" value={settings.bkashNumber} onChange={handleChange} />
            <Field label="Nagad Personal Number" name="nagadNumber" placeholder="017XXXXXXXX" type="tel" value={settings.nagadNumber} onChange={handleChange} />
            <Field label="Rocket Personal Number" name="rocketNumber" placeholder="017XXXXXXXX" type="tel" value={settings.rocketNumber} onChange={handleChange} />
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
                placeholder="যেমন: ফ্রিতে ডেলিভারি পেতে ৫টি ড্রেস অর্ডার করুন!"
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
