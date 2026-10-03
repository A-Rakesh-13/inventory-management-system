import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PackageSearch, Search, Heart, Shield, Menu, X, ArrowRight, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { favorites } = useFavorites();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search Products', path: '/search' },
    { name: 'Categories', path: '/#categories' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/#about' },
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1220]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <PackageSearch size={24} className="text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Stock<span className="text-cyan-400">Check</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Live Store
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 tracking-wide hidden sm:block">
                Product Availability Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'text-cyan-400 bg-white/5'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Favorites Icon */}
            <Link
              to="/search?filter=favorites"
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 border border-white/5 transition-all"
              title="Saved Products"
            >
              <Heart size={18} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Admin Portal Link */}
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-sm font-medium transition-all"
              >
                <Shield size={16} className="text-cyan-400" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-xs uppercase tracking-wider font-semibold text-slate-400 hover:text-white px-3 py-2 transition-colors"
              >
                Admin Login
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              to="/search"
              className="btn-primary text-sm font-semibold shadow-lg shadow-cyan-500/20"
            >
              <Search size={16} />
              <span>Check Availability</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/search?filter=favorites"
              className="p-2 text-slate-300 hover:text-cyan-400 relative"
            >
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute 0 right-0 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0B1220]/95 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5 hover:text-cyan-400"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full text-center justify-center"
            >
              <Search size={16} />
              <span>Check Availability</span>
            </Link>
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary w-full text-center justify-center text-cyan-400"
              >
                <Shield size={16} />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm text-slate-400 hover:text-white"
              >
                Store Staff / Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
