import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Package, Clock, Heart, Eye, Bell } from 'lucide-react';
import AvailabilityBadge from './AvailabilityBadge';
import { formatTimeAgo } from '../utils/dateUtils';
import { useFavorites } from '../context/FavoritesContext';

export default function ProductCard({ product, onNotifyClick }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);
  const isOutOfStock = product.quantity === 0;

  return (
    <div className="glass-panel glass-panel-hover flex flex-col justify-between overflow-hidden relative group">
      
      {/* Top Badges Bar */}
      <div className="p-4 pb-0 flex items-center justify-between z-10">
        <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-white/5 text-slate-300 border border-white/10">
          {product.categoryName || 'General'}
        </span>
        <AvailabilityBadge status={product.availabilityStatus} quantity={product.quantity} />
      </div>

      {/* Image Container with Favorite Button */}
      <div className="relative p-4 pt-3 overflow-hidden">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950/50 flex items-center justify-center border border-white/5">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
              <span className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
                Out of Stock in Store
              </span>
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product);
          }}
          className={`absolute top-6 right-6 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            favorited
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-slate-900/80 text-slate-300 hover:text-rose-400 hover:bg-slate-900'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Details Container */}
      <div className="px-4 pb-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {product.brand && (
            <p className="text-[11px] font-medium text-cyan-400 uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {product.description || 'Physical store inventory item.'}
          </p>
        </div>

        {/* Key Retail Details: Quantity & Location */}
        <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs">
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Package size={13} className="text-slate-400" />
              <span>Available Units:</span>
            </span>
            <span className={`font-mono font-semibold ${
              product.quantity > 5 ? 'text-emerald-400' : product.quantity > 0 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {product.quantity > 0 ? `${product.quantity} units` : '0 units'}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
              <MapPin size={13} className="text-cyan-400" />
              <span>Location:</span>
            </span>
            <span className="text-slate-200 text-right truncate text-[11px] font-medium">
              {product.location}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              <span>Updated {formatTimeAgo(product.updatedAt)}</span>
            </span>
            <span className="font-mono text-xs font-bold text-white">
              ₹{Number(product.price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isOutOfStock ? (
            <div className="flex items-center gap-2">
              <Link
                to={`/product/${product.id}`}
                className="btn-secondary w-full text-xs py-2 text-center justify-center"
              >
                <Eye size={14} />
                <span>View Details</span>
              </Link>
              <button
                onClick={() => onNotifyClick && onNotifyClick(product)}
                className="btn-primary text-xs py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 shadow-none shrink-0"
                title="Notify Me When Available"
              >
                <Bell size={14} />
              </button>
            </div>
          ) : (
            <Link
              to={`/product/${product.id}`}
              className="btn-secondary hover:btn-primary w-full text-xs py-2 text-center justify-center font-medium transition-all"
            >
              <Eye size={14} />
              <span>Check Store Availability</span>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
