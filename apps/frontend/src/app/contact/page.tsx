"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-wider uppercase mb-3">
            Contact Us
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            যোগাযোগ বা যেকোনো জিজ্ঞাসায় আমাদের কাস্টমার কেয়ার টিম সবসময় আপনার সেবায় নিয়োজিত।
          </p>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-4" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Info Column */}
          <div className="space-y-6">
            
            <AnimatedSection delay={0.1} className="bg-white p-6 rounded-xl border shadow-sm flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg text-amber-700">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Customer Hotline</h3>
                <p className="text-slate-600 text-sm font-medium">+880 1601-708251</p>
                <p className="text-xs text-slate-400 mt-1">Everyday 10:00 AM - 10:00 PM</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="bg-white p-6 rounded-xl border shadow-sm flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg text-amber-700">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Email Support</h3>
                <p className="text-slate-600 text-sm">support@promilaa.com</p>
                <p className="text-slate-600 text-sm">info@promilaa.com</p>
                <p className="text-xs text-slate-400 mt-1">24/7 Order Inquiry Response</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3} className="bg-white p-6 rounded-xl border shadow-sm flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg text-amber-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Head Office</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Promilaa Fashion, Salimullah Road, Mohammadpur, Dhaka-1207, Bangladesh
                </p>
              </div>
            </AnimatedSection>

          </div>

          {/* Right Form Column */}
          <div className="md:col-span-2">
            <AnimatedSection delay={0.2} className="bg-white p-8 rounded-xl border shadow-sm">
              <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-lg text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold">ধন্যবাদ! বার্তাটি সফলভাবে পাঠানো হয়েছে।</h3>
                  <p className="text-sm text-emerald-700">
                    আমাদের সাপোর্ট প্রতিনিধি আগামী ২-৪ ঘণ্টার মধ্যে আপনার দেওয়া মোবাইল নাম্বারে যোগাযোগ করবে।
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", email: "", message: "" }); }}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Your Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="আপনার নাম লিখুন"
                        className="w-full px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="017XXXXXXXX"
                        className="w-full px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@gmail.com"
                      className="w-full px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Message *</label>
                    <textarea 
                      required 
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="আপনার প্রশ্ন বা মেসেজটি সংক্ষেপে লিখুন..."
                      className="w-full px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                    />
                  </div>

                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 w-full sm:w-auto">
                    <Send className="w-4 h-4 mr-2" /> Send Message
                  </Button>
                </form>
              )}
            </AnimatedSection>
          </div>

        </div>
      </div>
    </div>
  );
}
