import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Plus,
  Search,
  Sliders,
  Edit,
  Trash2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Loader2
} from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import AvailabilityBadge from '../components/AvailabilityBadge';
import { formatTimeAgo } from '../utils/dateUtils';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Quick Stock Modal State
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [stockDelta, setStockDelta] = useState(0);
  const [stockReason, setStockReason] = useState('STOCK_REPLENISHMENT');
  const [stockNote, setStockNote] = useState('');
  const [stockSubmitting, setStockSubmitting] = useState(false);
  const [stockError, setStockError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error('Failed to load products table', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert('Failed to delete product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenStockModal = (product) => {
    setStockModalProduct(product);
    setStockDelta(0);
    setStockReason('STOCK_REPLENISHMENT');
    setStockNote('');
    setStockError('');
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    if (stockDelta === 0) {
      setStockError('Please select a positive or negative quantity adjustment.');
      return;
    }

    const currentQty = stockModalProduct.quantity;
    if (currentQty + stockDelta < 0) {
      setStockError(`Cannot reduce below 0. Current stock is ${currentQty}.`);
      return;
    }

    setStockSubmitting(true);
    setStockError('');

    try {
      const updated = await productService.updateStock(stockModalProduct.id, {
        changeAmount: stockDelta,
        reason: stockReason,
        note: stockNote,
      });

      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      setStockModalProduct(null);
    } catch (err) {
      setStockError(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setStockSubmitting(false);
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = !selectedCategory || String(p.categoryId) === String(selectedCategory);

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update, monitor, and adjust in-store product quantities and aisle locations.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="btn-primary text-xs font-semibold py-2.5 px-4 shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, brand, SKU..."
            className="input-field pl-10 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-cyan-400 w-full sm:w-auto"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 border border-white/10 transition-colors shrink-0"
            title="Reload Products"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4">Aisle / Shelf</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Loader2 size={24} className="animate-spin text-cyan-400 mx-auto mb-2" />
                    <span>Loading products inventory...</span>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Product & SKU */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-white/10 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link to={`/product/${p.id}`} className="font-bold text-white hover:text-cyan-300 truncate block">
                            {p.name}
                          </Link>
                          <span className="font-mono text-[10px] text-slate-400 block">{p.sku}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      {p.categoryName || 'General'}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ₹{Number(p.price).toFixed(2)}
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-bold ${
                        p.quantity > 5 ? 'text-emerald-400' : p.quantity > 0 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {p.quantity} units
                      </span>
                    </td>

                    {/* Availability */}
                    <td className="py-3.5 px-4">
                      <AvailabilityBadge status={p.availabilityStatus} quantity={p.quantity} size="sm" />
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-400 max-w-[160px] truncate" title={p.location}>
                      <span className="flex items-center gap-1 text-cyan-300">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {formatTimeAgo(p.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Quick Stock Modal Button */}
                        <button
                          onClick={() => handleOpenStockModal(p)}
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-all"
                          title="Quick Stock Adjust"
                        >
                          <Sliders size={13} />
                        </button>

                        {/* Edit Button */}
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all"
                          title="Edit Product"
                        >
                          <Edit size={13} />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 max-w-sm w-full space-y-4 text-center">
            <AlertTriangle size={36} className="text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Delete this product?</h3>
            <p className="text-xs text-slate-400">
              This will remove the product and all associated history records permanently.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="btn-primary text-xs px-4 py-2 bg-red-600 hover:bg-red-500 text-white border-none shadow-red-500/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stock Modal */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 max-w-md w-full space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white">Quick Stock Update</h3>
              </div>
              <button onClick={() => setStockModalProduct(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{stockModalProduct.name}</h4>
              <p className="text-xs text-slate-400">SKU: {stockModalProduct.sku} • Current Stock: <strong className="text-cyan-400 font-mono">{stockModalProduct.quantity} units</strong></p>
            </div>

            {stockError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {stockError}
              </div>
            )}

            <form onSubmit={handleStockSubmit} className="space-y-4">
              
              {/* Stepper Adjustment */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Stock Adjustment (Delta)
                </label>
                <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setStockDelta((prev) => prev - 5)}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-bold text-red-400"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockDelta((prev) => prev - 1)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold text-white"
                  >
                    -
                  </button>

                  <span className={`font-mono text-xl font-extrabold w-16 text-center ${
                    stockDelta > 0 ? 'text-emerald-400' : stockDelta < 0 ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {stockDelta > 0 ? `+${stockDelta}` : stockDelta}
                  </span>

                  <button
                    type="button"
                    onClick={() => setStockDelta((prev) => prev + 1)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold text-white"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockDelta((prev) => prev + 5)}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-bold text-emerald-400"
                  >
                    +5
                  </button>
                </div>
                <div className="text-center text-[11px] text-slate-400 mt-1">
                  Resulting Stock: <strong className="text-white font-mono">{stockModalProduct.quantity + stockDelta} units</strong>
                </div>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reason for Adjustment
                </label>
                <select
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="STOCK_REPLENISHMENT">Stock Replenishment (Shipment Delivery)</option>
                  <option value="SALE">Sale (Customer Purchase)</option>
                  <option value="RETURN">Return (Customer Return)</option>
                  <option value="DAMAGED">Damaged / Expired Write-off</option>
                  <option value="MANUAL_CORRECTION">Manual Inventory Correction</option>
                  <option value="OTHER">Other Reason</option>
                </select>
              </div>

              {/* Audit Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Audit Note (Optional)
                </label>
                <input
                  type="text"
                  value={stockNote}
                  onChange={(e) => setStockNote(e.target.value)}
                  placeholder="e.g. Supplier box batch #402"
                  className="input-field text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  className="btn-secondary text-xs"
                  disabled={stockSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stockSubmitting || stockDelta === 0}
                  className="btn-primary text-xs"
                >
                  {stockSubmitting ? 'Recording change...' : 'Save Stock Update'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
