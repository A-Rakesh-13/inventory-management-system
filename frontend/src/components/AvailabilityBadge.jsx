import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function AvailabilityBadge({ status, quantity, showIcon = true, size = 'md' }) {
  const isLarge = size === 'lg';
  const sizeClasses = isLarge ? 'px-3.5 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs font-medium';
  const iconSize = isLarge ? 16 : 14;

  if (status === 'IN_STOCK' || (!status && quantity > 5)) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full badge-instock ${sizeClasses}`}>
        {showIcon && <CheckCircle2 size={iconSize} className="text-emerald-400 shrink-0" />}
        <span>In Stock</span>
      </span>
    );
  }

  if (status === 'LOW_STOCK' || (!status && quantity > 0 && quantity <= 5)) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full badge-lowstock ${sizeClasses}`}>
        {showIcon && <AlertTriangle size={iconSize} className="text-amber-400 shrink-0" />}
        <span>Low Stock</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full badge-outofstock ${sizeClasses}`}>
      {showIcon && <XCircle size={iconSize} className="text-red-400 shrink-0" />}
      <span>Currently Unavailable</span>
    </span>
  );
}
