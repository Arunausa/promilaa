"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-auto">
      {/* Top Newsletter Section */}
      <div className="border-b border-slate-900 py-10 bg-slate-900/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-1">
              Subscribe to Promilaa Club
            </h3>
            <p className="text-xs text-slate-400">
              নতুন কালেকশন ও ঈদের স্পেশাল ডিসকাউন্ট অফার সবার আগে পেতে ইমেইল সাবস্ক্রাইব করুন।
            </p>
          </div>

          {subscribed ? (
            <div className="text-amber-400 text-xs font-bold bg-amber-950/60 border border-amber-800 px-6 py-3 rounded-md">
              ✓ ধন্যবাদ! আপনি প্রমিলা ভিআইপি নিউজল্যাটারে সাবস্ক্রাইব করেছেন।
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল এড্রেস লিখুন"
                className="bg-slate-950 border border-slate-800 text-white text-xs px-4 py-3 rounded-md outline-none focus:border-amber-500 w-full sm:w-72"
              />
              <button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-md transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                Subscribe <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-2xl text-white tracking-widest uppercase">PROMILAA BY SOPNIL</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Bangladeshi women&apos;s ethnic &amp; fusion wear brand. Offering handcrafted Kurtis, 1-Piece, 2-Piece &amp; 3-Piece collections for modern elegance.
          </p>
          <div className="flex items-center gap-3 pt-2 text-slate-400">
            {/* Facebook SVG */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Promilaa on Facebook" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* Instagram SVG */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Promilaa on Instagram" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            {/* Youtube SVG */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to Promilaa on YouTube" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Col 2: Shop Categories */}
        <div>
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-5">Shop Categories</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="/collections/kurti" className="hover:text-amber-400 transition-colors">Kurti Collection</Link></li>
            <li><Link href="/collections/one-piece" className="hover:text-amber-400 transition-colors">One Piece Dresses</Link></li>
            <li><Link href="/collections/two-piece" className="hover:text-amber-400 transition-colors">Two Piece Sets</Link></li>
            <li><Link href="/collections/three-piece" className="hover:text-amber-400 transition-colors">Three Piece Suits</Link></li>
            <li><Link href="/collections/festive" className="hover:text-amber-400 transition-colors">Festive Collection &apos;26</Link></li>
          </ul>
        </div>

        {/* Col 3: Customer Care */}
        <div>
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-5">Customer Care</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-amber-400 transition-colors">Shipping & Delivery Policy</Link></li>
            <li><Link href="/returns" className="hover:text-amber-400 transition-colors">Return & Exchange Policy</Link></li>
            <li><Link href="/faq" className="hover:text-amber-400 transition-colors">Frequently Asked Questions (FAQ)</Link></li>
            <li><Link href="/orders/track" className="hover:text-amber-400 transition-colors font-semibold text-amber-500">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact & Payment Info */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-5">Promilaa Hotline</h4>
          <div className="text-xs text-slate-400 space-y-2">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-500" /> +880 1601-708251
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-500" /> support@promilaa.com
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" /> Salimullah Road, Mohammadpur, Dhaka-1207
            </p>
          </div>

          <div className="pt-4 border-t border-slate-900">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">We Accept Secure Payments</span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-950/80 border border-pink-700/60 text-pink-300 rounded shadow-sm">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span> bKash
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-950/80 border border-orange-700/60 text-orange-300 rounded shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Nagad
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/80 border border-purple-700/60 text-purple-300 rounded shadow-sm">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Rocket
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/80 border border-amber-700/60 text-amber-300 rounded shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Cash On Delivery
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 text-xs text-center text-slate-500 bg-slate-950">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Promilaa. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
