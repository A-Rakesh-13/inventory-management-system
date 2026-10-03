import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tags,
  Plus,
  Sliders,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  RefreshCw,
  Package
} from 'lucide-react';
import dashboardService from '../services/dashboardService';
import productService from '../services/productService';
import AvailabilityBadge from '../components/AvailabilityBadge';
import { formatTimeAgo } from '../utils/dateUtils';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProductForUpdate, setSelectedProductForUpdate] = useState(null);

  const fetchStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading store inventory analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Store Inventory Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time shop floor availability, low-stock warnings, and recent inventory audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 border border-white/10 text-xs flex items-center gap-1.5 transition-all"
            title="Refresh Metrics"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-cyan-400' : ''} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <Link
            to="/admin/products/add"
            className="btn-primary text-xs font-semibold py-2.5 px-4 shadow-lg shadow-cyan-500/20"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Products */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Products</span>
            <Boxes size={18} className="text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats?.totalProducts || 0}
          </p>
          <span className="text-[11px] text-slate-400">Tracked items</span>
        </div>

        {/* In Stock */}
        <div className="p-5 rounded-2xl glass-panel space-y-2 border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
            <span>In Stock</span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
            {stats?.inStockCount || 0}
          </p>
          <span className="text-[11px] text-emerald-500/80 font-medium">&gt; 5 units available</span>
        </div>

        {/* Low Stock */}
        <div className="p-5 rounded-2xl glass-panel space-y-2 border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium">
            <span>Low Stock</span>
            <AlertTriangle size={18} className="text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            {stats?.lowStockCount || 0}
          </p>
          <span className="text-[11px] text-amber-400/80 font-medium">1 - 5 units (Urgent)</span>
        </div>

        {/* Out of Stock */}
        <div className="p-5 rounded-2xl glass-panel space-y-2 border-red-500/20 bg-red-950/10">
          <div className="flex items-center justify-between text-red-400 text-xs font-medium">
            <span>Out of Stock</span>
            <XCircle size={18} className="text-red-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-red-300 font-mono">
            {stats?.outOfStockCount || 0}
          </p>
          <span className="text-[11px] text-red-400/80 font-medium">0 units on shelf</span>
        </div>

        {/* Total Categories */}
        <div className="p-5 rounded-2xl glass-panel space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Categories</span>
            <Tags size={18} className="text-sky-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats?.totalCategories || 0}
          </p>
          <span className="text-[11px] text-slate-400">Aisles &amp; Departments</span>
        </div>

      </div>

      {/* Main Grid: Attention Items & Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Products Needing Attention (Low Stock & Out of Stock) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              <h2 className="text-base font-bold text-white">Products Need Attention</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                {stats?.lowStockProducts?.length || 0} Alert{stats?.lowStockProducts?.length === 1 ? '' : 's'}
              </span>
            </div>
            <Link to="/admin/inventory" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
              Open Quick Stock &rarr;
            </Link>
          </div>

          <div className="rounded-2xl glass-panel overflow-hidden border border-white/10">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <div className="divide-y divide-white/5">
                {stats.lowStockProducts.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="truncate">{p.categoryName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-cyan-400">
                            <MapPin size={11} />
                            <span className="truncate">{p.location}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                        {p.quantity} units left
                      </span>
                      <Link
                        to={`/admin/inventory`}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors"
                        title="Update Stock"
                      >
                        <Sliders size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                <span>All active products are currently well-stocked above 5 units.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Recent Stock Updates (Live Audit Trail) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={18} className="text-cyan-400" />
              <h2 className="text-base font-bold text-white">Recent Stock Updates</h2>
            </div>
            <Link to="/admin/stock-history" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
              View All Audits &rarr;
            </Link>
          </div>

          <div className="rounded-2xl glass-panel p-4 space-y-3 border border-white/10">
            {stats?.recentStockUpdates && stats.recentStockUpdates.length > 0 ? (
              <div className="space-y-3">
                {stats.recentStockUpdates.slice(0, 7).map((log) => {
                  const isPositive = log.changeAmount > 0;
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{log.productName}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-mono text-slate-300">
                            {log.previousQuantity} &rarr; {log.newQuantity}
                          </span>
                          <span>•</span>
                          <span className="text-slate-400 truncate">{log.reason?.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center gap-0.5 font-mono font-bold text-xs px-2 py-0.5 rounded ${
                            isPositive
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {isPositive ? '+' : ''}{log.changeAmount}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {formatTimeAgo(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No recent stock movements recorded.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
