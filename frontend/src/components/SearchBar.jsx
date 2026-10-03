import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight } from 'lucide-react';

export default function SearchBar({ initialQuery = '', onSearch, placeholder = 'Search by product name, brand, or SKU...' }) {
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('stockcheck_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        const defaults = ['Milk', 'Rice', 'Paracetamol', 'Bread'];
        setRecentSearches(defaults);
        localStorage.setItem('stockcheck_recent_searches', JSON.stringify(defaults));
      }
    } catch {
      // Fallback
    }
  }, []);

  // Close recent searches dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowRecent(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('stockcheck_recent_searches', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('stockcheck_recent_searches');
  };

  const triggerSearch = (searchTerm) => {
    saveRecentSearch(searchTerm);
    setShowRecent(false);
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerSearch(query);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-cyan-400 pointer-events-none">
          <Search size={20} />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setShowRecent(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#111827]/90 text-white placeholder-slate-400 text-sm sm:text-base rounded-2xl pl-12 pr-28 py-4 border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 shadow-2xl backdrop-blur-md transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              if (onSearch) onSearch('');
            }}
            className="absolute right-24 p-1.5 text-slate-400 hover:text-white"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 btn-primary text-xs sm:text-sm py-2.5 px-5 rounded-xl font-semibold shadow-md"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-white/5">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={13} className="text-cyan-400" />
              <span>Recent Searches</span>
            </span>
            <button
              onClick={handleClearHistory}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  triggerSearch(term);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 text-xs border border-white/5 hover:border-cyan-500/30 transition-all flex items-center gap-1.5"
              >
                <span>{term}</span>
                <ArrowRight size={10} className="opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
