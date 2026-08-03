"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, ShieldCheck, CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  stock?: number;
  stockQuantity?: number;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: number;
  basePrice?: number;
  compareAtPrice?: number | null;
  category: { name: string; slug: string };
  images: { id: string; url: string; altText: string | null }[];
  variants: Variant[];
}

export default function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const displayPrice = Number(product.price ?? product.basePrice ?? 0);
  const displayComparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;

  const [selectedColor, setSelectedColor] = useState<string | null>(product.variants?.[0]?.color || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.variants?.[0]?.size || null);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.url || "/media/three_piece/1.jpeg");

  // Quick Order State (Express COD Checkout for Facebook Ads)
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const availableColors = Array.from(new Set(product.variants?.map((v) => v.color).filter(Boolean))) as string[];
  const availableSizes = Array.from(new Set(product.variants?.map((v) => v.size).filter(Boolean))) as string[];

  const currentVariant = product.variants?.find(
    (v) => (v.color === selectedColor || (!v.color && !selectedColor)) && 
           (v.size === selectedSize || (!v.size && !selectedSize))
  ) || product.variants?.[0];

  const currentStock = currentVariant ? (currentVariant.stock ?? currentVariant.stockQuantity ?? 0) : 0;
  const isOutOfStock = currentStock <= 0;

  const shippingFee = district === "Dhaka" ? 80 : 150;
  const grandTotal = displayPrice + shippingFee;

  const handleAddToCart = () => {
    if (!currentVariant) return;

    addItem({
      id: currentVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      image: selectedImage,
      color: selectedColor || "Default",
      size: selectedSize || "Default",
      quantity: 1,
    });

    openDrawer();
  };

  const handleQuickOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVariant) return;
    setIsSubmitting(true);
    setOrderError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: currentVariant.id, quantity: 1 }],
          guestPhone: phone,
          shippingAddress: {
            fullName,
            phone,
            district,
            city: district === "Dhaka" ? "Dhaka" : "Outside Dhaka",
            line1: address,
          },
          paymentMethod: "COD",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "অর্ডার প্রসেস করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।");
      }

      setShowQuickOrderModal(false);
      router.push(`/checkout/success/${data.order.orderNumber}`);
    } catch (err: any) {
      setOrderError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4">
        <div className="aspect-[3/4] w-full bg-slate-100 overflow-hidden relative rounded-xl shadow-sm border">
          <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
          {displayComparePrice && displayComparePrice > displayPrice && (
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
              {Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)}% ছাড়
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img) => (
              <button 
                key={img.id} 
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.url ? 'border-slate-900 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img.url} alt={img.altText || 'Thumbnail'} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col py-2">
        <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mb-2">
          {product.category?.name}
        </p>
        <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-3 text-slate-900">{product.name}</h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-3xl font-bold text-slate-900">৳{displayPrice}</span>
          {displayComparePrice && displayComparePrice > displayPrice && (
            <>
              <span className="text-lg text-slate-400 line-through">৳{displayComparePrice}</span>
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full">
                সেভ ৳{displayComparePrice - displayPrice}
              </span>
            </>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="mb-6">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
              <AlertCircle className="w-4 h-4" /> স্টক নেই (Out of Stock)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ইন স্টক (পণ্যটি স্টকে আছে)
            </span>
          )}
        </div>

        {/* Colors */}
        {availableColors.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">কালার নির্বাচন করুন: <span className="font-normal text-slate-600">{selectedColor}</span></h3>
            <div className="flex flex-wrap gap-2.5">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                    selectedColor === color ? "border-slate-900 bg-slate-900 text-white shadow-sm" : "border-slate-200 hover:border-slate-400 text-slate-800"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {availableSizes.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-slate-800">সাইজ নির্বাচন করুন: <span className="font-normal text-slate-600">{selectedSize}</span></h3>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border rounded-lg text-sm font-bold transition-all ${
                    selectedSize === size ? "border-slate-900 bg-slate-900 text-white shadow-sm" : "border-slate-200 hover:border-slate-400 text-slate-800 bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* High Conversion Action Buttons for Facebook Ads */}
        <div className="flex flex-col gap-3 mt-2 mb-8">
          <Button 
            size="lg" 
            disabled={isOutOfStock}
            onClick={() => setShowQuickOrderModal(true)}
            className="w-full py-7 text-lg font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20 rounded-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-slate-950" /> সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)
          </Button>

          <Button 
            size="lg" 
            variant="outline"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="w-full py-6 text-base font-semibold border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" /> কার্টে যোগ করুন (Add to Cart)
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="p-4 bg-slate-50 border rounded-xl space-y-2 mb-8 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-slate-900 flex-shrink-0" />
            <span>ডেলিভারি চার্জ: ঢাকায় ৳৮০ | ঢাকার বাইরে ৳১৫০</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-900 flex-shrink-0" />
            <span>পণ্য হাতে পেয়ে দেখে টাকা পরিশোধ করার সুবিধা (ক্যাশ অন ডেলিভারি)</span>
          </div>
        </div>

        {/* Description */}
        <div className="pt-6 border-t border-slate-200">
          <h3 className="font-serif font-bold text-lg mb-3 text-slate-900">পণ্য বিবরণী (Product Details)</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {product.description || "প্রমিলা ব্র্যান্ডের প্রিমিয়াম কোয়ালিটি উইমেন এথনিক ওয়্যার। উন্নতমানের ফেব্রিক ও চমৎকার কাটিং এবং ফিনিশিং।"}
          </p>
        </div>
      </div>

      {/* QUICK COD ORDER MODAL FOR FACEBOOK ADS BUYERS */}
      {showQuickOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowQuickOrderModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-2">
                সহজ ও দ্রুত অর্ডার
              </span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">ক্যাশ অন ডেলিভারিতে অর্ডার করুন</h2>
              <p className="text-xs text-slate-500 mt-1">ঠিকানা দিন এবং পণ্য হাতে পেয়ে টাকা দিন</p>
            </div>

            {/* Selected Product Summary */}
            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl mb-6 border">
              <img src={selectedImage} alt={product.name} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="font-medium text-sm text-slate-900 line-clamp-1">{product.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">সাইজ: {selectedSize || 'Standard'} | কালার: {selectedColor || 'Default'}</p>
                <p className="text-sm font-bold text-amber-700 mt-1">৳{displayPrice}</p>
              </div>
            </div>

            {orderError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-lg mb-4">
                {orderError}
              </div>
            )}

            <form onSubmit={handleQuickOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম *</label>
                <input 
                  type="text" 
                  required 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="যেমন: মোছাঃ শরিফা বেগম" 
                  className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                <input 
                  type="tel" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="যেমন: 017XXXXXXXX" 
                  className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ডেলিভারি এলাকা *</label>
                <select 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)} 
                  className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium text-slate-800"
                >
                  <option value="Dhaka">ঢাকার ভেতরে (ডেলিভারি চার্জ ৳৮০)</option>
                  <option value="Outside">ঢাকার বাইরে (ডেলিভারি চার্জ ৳১৫০)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সম্পূর্ণ ঠিকানা (বাসা নম্বর, রোড নম্বর, এলাকা) *</label>
                <textarea 
                  required 
                  rows={2}
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="যেমন: বাসা #৪, রোড #১২, ধানমণ্ডি, ঢাকা" 
                  className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Price Calculation Box */}
              <div className="pt-2 pb-1 border-t space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>পণ্যের দাম:</span>
                  <span className="font-semibold text-slate-900">৳{displayPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-semibold text-slate-900">৳{shippingFee}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t">
                  <span>সর্বমোট প্রদেয় টাকা:</span>
                  <span className="text-amber-700 text-base">৳{grandTotal}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-6 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md mt-4"
              >
                {isSubmitting ? "অর্ডার প্রসেসিং হচ্ছে..." : `অর্ডার নিশ্চিত করুন (৳${grandTotal})`}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE STICKY ACTION BAR FOR 1-TAP INSTANT CONVERSION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center gap-2">
        <Button
          onClick={handleAddToCart}
          variant="outline"
          disabled={isOutOfStock}
          className="flex-1 py-3 text-xs font-semibold border-slate-900 text-slate-900 rounded-xl"
        >
          <ShoppingBag className="w-4 h-4 mr-1" /> কার্টে যোগ করুন
        </Button>
        <Button
          onClick={() => setShowQuickOrderModal(true)}
          disabled={isOutOfStock}
          className="flex-1 py-3 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl shadow-lg"
        >
          <Zap className="w-4 h-4 mr-1 fill-current" /> অর্ডার করুন
        </Button>
      </div>
    </div>
  );
}
