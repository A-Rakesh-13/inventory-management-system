import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Heart, AlertCircle, RefreshCw, X } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import NotifyModal from '../components/NotifyModal';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { useFavorites } from '../context/FavoritesContext';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialCat = searchParams.get('categoryId') || '';
  const initialAvail = searchParams.get('availability') || 'ALL';
  const initialFilter = searchParams.get('filter') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedAvailability, setSelectedAvailability] = useState(initialAvail);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(initialFilter === 'favorites');
  const [notifyProduct, setNotifyProduct] = useState(null);

  const { favorites } = useFavorites();

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let prods = [];
        if (searchQuery || selectedCategory) {
          prods = await productService.searchProducts(searchQuery, selectedCategory);
        } else {
          prods = await productService.getAllProducts();
        }

        // Filter by availability client-side if selected
        if (selectedAvailability && selectedAvailability !== 'ALL') {
          prods = prods.filter((p) => p.availabilityStatus === selectedAvailability);
        }

        // Filter by favorites if toggled
        if (showOnlyFavorites) {
          const favIds = new Set(favorites.map((f) => f.id));
          prods = prods.filter((p) => favIds.has(p.id));
        }

        setProducts(prods);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, selectedCategory, selectedAvailability, showOnlyFavorites, favorites]);

  // Update query params in URL
  const handleSearch = (term) => {
    setSearchQuery(term);
    const newParams = new URLSearchParams(searchParams);
    if (term) newParams.set('query', term);
    else newParams.delete('query');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId) newParams.set('categoryId', catId);
    else newParams.delete('categoryId');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedAvailability('ALL');
    setSearchQuery('');
    setShowOnlyFavorites(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[75vh]">
      
      {/* Search Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Search Store Products
        </h1>
        <p className="text-sm text-slate-400">
          Find product quantities, exact shelf locations, and availability before you visit.
        </p>

        <SearchBar
          initialQuery={searchQuery}
          onSearch={handleSearch}
          placeholder="Search by name, brand, SKU, or department..."
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category & Availability Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/5">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'IN_STOCK', label: '🟢 In Stock' },
              { id: 'LOW_STOCK', label: '🟡 Low Stock' },
              { id: 'OUT_OF_STOCK', label: '🔴 Out of Stock' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedAvailability(option.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedAvailability === option.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Saved Favorites Filter */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              showOnlyFavorites
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Heart size={14} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
            <span>Saved ({favorites.length})</span>
          </button>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory || selectedAvailability !== 'ALL' || searchQuery || showOnlyFavorites) && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-end md:self-center"
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-mono">{products.length}</strong> matching products in store
        </span>
        <span className="text-[11px] text-slate-500">Live store inventory</span>
      </div>

      {/* Product Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onNotifyClick={(p) => setNotifyProduct(p)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-3xl glass-panel text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Search size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn't find any products matching your search criteria. Try another product name, category, or clear filters.
            </p>
          </div>
          <button
            onClick={clearAllFilters}
            className="btn-primary text-xs mx-auto px-5 py-2.5"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Out of stock notify modal */}
      <NotifyModal
        isOpen={!!notifyProduct}
        product={notifyProduct}
        onClose={() => setNotifyProduct(null)}
      />

    </div>
  );
}
