"use client";

import { useState } from "react";
import { Save, Store, CreditCard, Truck, Megaphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "Promilaa",
    storePhone: "",
    storeEmail: "",
    bkashNumber: "",
    nagadNumber: "",
    rocketNumber: "",
    shippingDhaka: "60",
    shippingOutsideDhaka: "100",
    announcementEnabled: false,
    announcementText: "",
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
    // In a real implementation, this would call PUT /api/settings
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <h2 className="font-semibold text-slate-800">{title}</h2>
    </div>
  );

  const Field = ({
    label,
    name,
    placeholder,
    type = "text",
  }: {
    label: string;
    name: keyof typeof settings;
    placeholder?: string;
    type?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={settings[name] as string}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Store Settings</h1>
        {saved && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Settings saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionTitle icon={Store} title="Store Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store Name" name="storeName" placeholder="Promilaa" />
            <Field label="Support Phone" name="storePhone" placeholder="017XXXXXXXX" type="tel" />
            <Field label="Support Email" name="storeEmail" placeholder="support@promilaa.com" type="email" />
          </div>
        </div>

        {/* Payment Numbers */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionTitle icon={CreditCard} title="Payment Numbers" />
          <p className="text-xs text-slate-400 mb-4">These numbers will be shown to customers during checkout for bKash/Nagad/Rocket payments.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="bKash Number" name="bkashNumber" placeholder="017XXXXXXXX" type="tel" />
            <Field label="Nagad Number" name="nagadNumber" placeholder="017XXXXXXXX" type="tel" />
            <Field label="Rocket Number" name="rocketNumber" placeholder="017XXXXXXXX" type="tel" />
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionTitle icon={Truck} title="Shipping Fees" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Inside Dhaka (৳)" name="shippingDhaka" placeholder="60" type="number" />
            <Field label="Outside Dhaka (৳)" name="shippingOutsideDhaka" placeholder="100" type="number" />
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionTitle icon={Megaphone} title="Announcement Banner" />
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="announcementEnabled"
              name="announcementEnabled"
              checked={settings.announcementEnabled}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="announcementEnabled" className="text-sm font-medium text-slate-700">
              Show announcement banner on website
            </label>
          </div>
          {settings.announcementEnabled && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Announcement Text</label>
              <input
                type="text"
                name="announcementText"
                value={settings.announcementText}
                onChange={handleChange}
                placeholder="e.g. Free delivery on orders over ৳1000 this Eid!"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg" className="gap-2 px-8">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
