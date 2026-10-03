import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, MapPin, Clock, ShieldCheck, RefreshCw, AlertCircle, ArrowRight, Store, Package } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import NotifyModal from '../components/NotifyModal';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { CATEGORIES_DATA, getCategoryImage } from '../assets/categoriesData';

export default function Home() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifyProduct, setNotifyProduct] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ]);
        setPopularProducts(prods.slice(0, 6));
        setCategories(cats.length > 0 ? cats : CATEGORIES_DATA);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-mesh-glow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold tracking-wide">
            <Store size={14} className="text-cyan-400" />
            <span>Find products before you visit the physical store</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Check Real-Time Shelf Stock{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Before You Walk In.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Eliminate wasted store visits and endless phone calls. Instantly verify live shelf quantities, exact aisle locations, and accurate availability status.
          </p>

          {/* Hero Search Box */}
          <div className="pt-4">
            <SearchBar placeholder="Try searching 'Organic Whole Milk', 'Basmati Rice', 'Paracetamol'..." />
            
            {/* Quick Keyword Shortcuts */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-slate-400">
              <span className="font-medium text-slate-400">Popular in store:</span>
              {['Milk', 'Rice', 'Paracetamol', 'Bread', 'Olive Oil', 'Coffee'].map((term) => (
                <Link
                  key={term}
                  to={`/search?query=${encodeURIComponent(term)}`}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 border border-white/10 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* Three Live Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 text-left">
            <div className="p-4 rounded-xl glass-panel space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 size={16} />
                <span>Live Shelf Quantity</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Directly synchronized with floor staff inventory logs.
              </p>
            </div>

            <div className="p-4 rounded-xl glass-panel space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <MapPin size={16} />
                <span>Exact Aisle Location</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Know the specific rack, chiller bay, or counter instantly.
              </p>
            </div>

            <div className="p-4 rounded-xl glass-panel space-y-1.5">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <Clock size={16} />
                <span>Fresh Timestamps</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                View when the shelf was last verified or replenished.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          POPULAR CATEGORIES
          ======================================================== */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Department Aisles</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Browse by Category
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Find what you're looking for faster by checking specific retail sections.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View all inventory</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat, idx) => (
            <CategoryCard
              key={cat.id || idx}
              category={cat}
              image={getCategoryImage(cat.name)}
              count={cat.productCount ? `${cat.productCount} in-stock items` : 'Browse aisle'}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          POPULAR PRODUCTS (IN-STOCK HIGHLIGHTS)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Inventory</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Popular In-Store Products
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Frequently searched items and their current availability on the shop floor.
            </p>
          </div>
          <Link
            to="/search"
            className="btn-secondary text-xs sm:text-sm font-medium"
          >
            <span>Explore All 13+ Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onNotifyClick={(p) => setNotifyProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          HOW IT WORKS (STOCKCHECK AVAILABILITY WORKFLOW)
          ======================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Save Time &amp; Trips</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How StockCheck Works
          </h2>
          <p className="text-sm text-slate-400">
            A simple 3-step routine before leaving your home or office.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl glass-panel relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Search What You Need</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type the exact product, medicine, or grocery item into the search bar. Filter by aisle or department.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Verify Shelf Quantity &amp; Location</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Check if it's In Stock (&gt;5), Low Stock (1-5), or Unavailable. Note down the exact aisle and bay location.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Walk In &amp; Pick It Up</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Walk straight into the store with 100% confidence. No wandering aisles or asking staff whether it's in stock.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          ABOUT & WHY STOCKCHECK
          ======================================================== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0E1726] to-[#0B1220] border border-white/10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Real Retail Technology</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Why StockCheck Is Different
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Most platforms push quick commerce delivery fees, surge pricing, or cart lock-ins. StockCheck focuses purely on transparency between customers and the local store shelves you actually visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-1">
              <span className="text-cyan-400 font-bold text-base block font-mono">Zero Fees</span>
              <p className="text-slate-400">100% free availability lookups for shoppers.</p>
            </div>
            <div className="space-y-1">
              <span className="text-emerald-400 font-bold text-base block font-mono">Audit Trails</span>
              <p className="text-slate-400">Every restock is tracked with reasons and timestamps.</p>
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-bold text-base block font-mono">Restock Alerts</span>
              <p className="text-slate-400">Notify me subscriptions when zero-stock items return.</p>
            </div>
            <div className="space-y-1">
              <span className="text-sky-400 font-bold text-base block font-mono">Staff Controlled</span>
              <p className="text-slate-400">Protected admin and floor manager controls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notify Modal if opened */}
      <NotifyModal
        isOpen={!!notifyProduct}
        product={notifyProduct}
        onClose={() => setNotifyProduct(null)}
      />

    </div>
  );
}
