import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PackageSearch, Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-xl shadow-cyan-500/20">
            <PackageSearch size={28} className="text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Store Staff Portal
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to manage inventory, update quantities, and view live store metrics.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 space-y-6 bg-slate-900/90 shadow-2xl">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stockcheck.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">Authorized personnel only</span>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-cyan-500/25 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
              Quick Test Roles
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@stockcheck.com', 'admin123')}
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-cyan-300 border border-white/5 hover:border-cyan-500/30 text-[11px] font-medium transition-all"
              >
                Store Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('manager@stockcheck.com', 'manager123')}
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 text-emerald-300 border border-white/5 hover:border-emerald-500/30 text-[11px] font-medium transition-all"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('staff@stockcheck.com', 'staff123')}
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-sky-500/10 text-sky-300 border border-white/5 hover:border-sky-500/30 text-[11px] font-medium transition-all"
              >
                Floor Staff
              </button>
            </div>
          </div>

        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            &larr; Return to customer search
          </Link>
        </div>

      </div>
    </div>
  );
}
