import React from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, MapPin, Clock, Shield, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070C15] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
                <PackageSearch size={20} className="text-slate-950" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Stock<span className="text-cyan-400">Check</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find products before you visit the store. Real-time physical store inventory, live shelf locations, and accurate availability status.
            </p>
            <div className="pt-2 text-xs flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>In-Store Live Inventory Connected</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search" className="hover:text-cyan-400 transition-colors">Search All Products</Link></li>
              <li><Link to="/search?availability=IN_STOCK" className="hover:text-cyan-400 transition-colors">Currently In Stock</Link></li>
              <li><Link to="/search?availability=LOW_STOCK" className="hover:text-cyan-400 transition-colors">Low Stock Alerts</Link></li>
              <li><Link to="/search?filter=favorites" className="hover:text-cyan-400 transition-colors">Saved Quick-Check</Link></li>
            </ul>
          </div>

          {/* Store Information */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider text-xs">Store Hours &amp; Location</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Central Retail Plaza, 42nd Ave, Bengaluru / New York</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Mon – Sun: 7:00 AM – 11:00 PM</span>
              </p>
            </div>
          </div>

          {/* Platform Notice */}
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <AlertCircle size={15} />
              <span>Availability Only Notice</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              StockCheck displays physical shelf availability to save your travel time. We do not process online transactions, home delivery, or cart checkouts.
            </p>
            <div className="pt-2">
              <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300">
                <Shield size={12} />
                <span>Staff Inventory Login &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} StockCheck Platform. All rights reserved.</p>
          <p className="text-[11px]">Designed for modern retail availability visibility.</p>
        </div>
      </div>
    </footer>
  );
}
