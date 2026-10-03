import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import notificationService from '../services/notificationService';

export default function NotifyModal({ isOpen, onClose, product }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      await notificationService.subscribe(product.id, email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl space-y-4">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">You're on the list!</h3>
            <p className="text-sm text-slate-300">
              We'll send an alert to <span className="text-cyan-400 font-medium">{email}</span> as soon as{' '}
              <strong className="text-white">{product.name}</strong> is restocked on our shelves.
            </p>
            <button onClick={handleClose} className="btn-secondary w-full mt-4">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Notify Me When In Stock</h3>
                <p className="text-xs text-slate-400">{product.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This product is currently out of stock. Leave your email and get an instant alert the moment staff restocks the shelf.
            </p>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary text-xs px-4 py-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs px-4 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Notify Me</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
