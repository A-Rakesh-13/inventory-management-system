import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Tags,
  Sliders,
  History,
  FileBarChart,
  LogOut,
  Menu,
  X,
  PackageSearch,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Boxes },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Inventory Updates', path: '/admin/inventory', icon: Sliders },
    { name: 'Stock History', path: '/admin/stock-history', icon: History },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#070C15] text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B1220] border-r border-white/10 shrink-0">
        
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
              <PackageSearch size={20} className="text-slate-950" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">Stock<span className="text-cyan-400">Check</span></span>
              <span className="block text-[10px] text-cyan-400 font-mono tracking-wider">STAFF PORTAL</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={17} className={active ? 'text-cyan-400' : 'text-slate-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              <UserCheck size={16} />
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Staff Member'}</p>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                {user?.role || 'STAFF'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
              title="Open Customer View"
            >
              <ExternalLink size={12} />
              <span>Customer View</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Log Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0B1220] border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
            <PackageSearch size={18} />
          </div>
          <span className="text-sm font-bold text-white">StockCheck Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {sidebarOpen && (
        <div className="md:hidden bg-[#0B1220] border-b border-white/10 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">{user?.name} ({user?.role})</span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 font-semibold flex items-center gap-1"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
