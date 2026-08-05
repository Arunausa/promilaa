import Link from "next/link";
import { Sparkles, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-slate-950 text-white flex flex-col items-center justify-center px-4 text-center py-20">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
        <Sparkles className="w-3.5 h-3.5" /> 404 Error — Page Not Found
      </div>

      <h1 className="text-6xl md:text-8xl font-serif font-bold text-amber-50 tracking-wider mb-4">
        404
      </h1>

      <h2 className="text-2xl md:text-4xl font-serif text-slate-200 mb-6">
        The Masterpiece You Are Looking For Does Not Exist
      </h2>

      <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
        The page you accessed might have been moved, renamed, or deleted. Explore our latest ethnic collections instead.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-sm text-sm font-semibold tracking-widest uppercase transition-all shadow-lg shadow-amber-900/30"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link
          href="/collections/kurti"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-sm text-sm font-semibold tracking-widest uppercase transition-all"
        >
          <ShoppingBag className="w-4 h-4" /> Shop Kurti
        </Link>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-wrap justify-center gap-6">
        <Link href="/collections/festive" className="hover:text-slate-300 transition-colors">Festive Collection</Link>
        <Link href="/collections/one-piece" className="hover:text-slate-300 transition-colors">One Piece</Link>
        <Link href="/collections/two-piece" className="hover:text-slate-300 transition-colors">Two Piece</Link>
        <Link href="/collections/three-piece" className="hover:text-slate-300 transition-colors">Three Piece</Link>
      </div>
    </div>
  );
}
