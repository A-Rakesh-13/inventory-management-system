import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, Clock, ShieldCheck, Heart, Bell, Share2, Tag, Check, AlertTriangle } from 'lucide-react';
import AvailabilityBadge from '../components/AvailabilityBadge';
import NotifyModal from '../components/NotifyModal';
import productService from '../services/productService';
import { formatTimeAgo, formatDateTime } from '../utils/dateUtils';
import { useFavorites } from '../context/FavoritesContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found or unavailable.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading shelf availability...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-8 rounded-3xl glass-panel space-y-3">
          <AlertTriangle size={36} className="text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Product Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'This product does not exist in store records.'}</p>
          <Link to="/search" className="btn-primary text-xs inline-flex mt-4">
            <ArrowLeft size={14} />
            <span>Back to Search</span>
          </Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(product.id);
  const isOutOfStock = product.quantity === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Product Search</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 text-xs flex items-center gap-1.5 transition-all"
            title="Copy Product Link"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleFavorite(product)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
              favorited
                ? 'bg-rose-500 text-white'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-rose-400'
            }`}
          >
            <Heart size={14} fill={favorited ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-panel border border-white/10 bg-slate-950/60 p-4 flex items-center justify-center">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center space-y-2">
                <span className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-bold">
                  Currently Out of Stock in Store
                </span>
                <p className="text-xs text-slate-300 max-w-xs">
                  This item has zero units currently on shelves.
                </p>
              </div>
            )}
          </div>

          {/* Availability Alert Box */}
          {isOutOfStock ? (
            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <Bell size={18} />
                <span>Want to know when this is restocked?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Staff regularly updates quantities when shipments arrive. Leave your email to receive an instant stock alert.
              </p>
              <button
                onClick={() => setNotifyModalOpen(true)}
                className="btn-primary w-full text-xs font-semibold"
              >
                <Bell size={14} />
                <span>Notify Me When Available</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-3">
              <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Verified On-Shelf Availability</strong>
                <span>Stock counts are directly linked to store staff updates. Visit the store during operating hours to collect.</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Specifications & In-Store Availability */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Category & Status */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300">
              {product.categoryName || 'General Retail'}
            </span>
            <AvailabilityBadge status={product.availabilityStatus} quantity={product.quantity} size="lg" />
          </div>

          {/* Product Name & Brand */}
          <div className="space-y-1">
            {product.brand && (
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                {product.brand}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Price & Unit Quantity Callout */}
          <div className="p-5 rounded-2xl glass-panel grid grid-cols-2 gap-4 divide-x divide-white/10">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Store Price</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                ₹{Number(product.price).toFixed(2)}
              </span>
            </div>
            <div className="pl-4">
              <span className="text-xs text-slate-400 block mb-1">Current Stock Level</span>
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                product.quantity > 5 ? 'text-emerald-400' : product.quantity > 0 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {product.quantity} <span className="text-sm font-sans font-normal text-slate-400">units</span>
              </span>
            </div>
          </div>

          {/* In-Store Location Badge Card */}
          <div className="p-5 rounded-2xl glass-panel space-y-2 border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-[#0e1d32]">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <MapPin size={16} />
              <span>Exact Store Location</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white">
              {product.location}
            </p>
            <p className="text-xs text-slate-400">
              Head directly to this aisle when visiting our store to locate this product quickly.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Description</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {product.description || 'Verified physical store inventory item.'}
            </p>
          </div>

          {/* Technical Metadata (SKU, Timestamp) */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Product SKU</span>
              <span className="font-mono text-slate-200 font-medium">{product.sku}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Last Inventory Check</span>
              <span className="text-slate-200 font-medium">
                {formatTimeAgo(product.updatedAt)} ({formatDateTime(product.updatedAt)})
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Notify Modal */}
      <NotifyModal
        isOpen={notifyModalOpen}
        product={product}
        onClose={() => setNotifyModalOpen(false)}
      />

    </div>
  );
}
