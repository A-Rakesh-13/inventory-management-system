import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Boxes, AlertCircle, Loader2 } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    categoryId: '',
    price: '',
    quantity: '0',
    sku: '',
    location: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats);

        if (isEdit) {
          const prod = await productService.getProductById(id);
          setFormData({
            name: prod.name || '',
            brand: prod.brand || '',
            description: prod.description || '',
            categoryId: prod.categoryId || (cats[0]?.id ?? ''),
            price: prod.price != null ? String(prod.price) : '',
            quantity: prod.quantity != null ? String(prod.quantity) : '0',
            sku: prod.sku || '',
            location: prod.location || '',
            imageUrl: prod.imageUrl || '',
          });
        } else if (cats.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setFetching(false);
      }
    }

    init();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Product name cannot be empty.');
      return;
    }
    if (Number(formData.price) < 0) {
      setError('Price cannot be negative.');
      return;
    }
    if (Number(formData.quantity) < 0) {
      setError('Quantity cannot be negative.');
      return;
    }
    if (!formData.sku.trim()) {
      setError('SKU is required.');
      return;
    }
    if (!formData.location.trim()) {
      setError('In-store location is required.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.trim() || null,
        description: formData.description.trim() || null,
        categoryId: Number(formData.categoryId),
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity, 10) || 0,
        sku: formData.sku.trim().toUpperCase(),
        location: formData.location.trim(),
        imageUrl: formData.imageUrl.trim() || null,
      };

      if (isEdit) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product. Check for duplicate SKU or validation errors.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 size={32} className="animate-spin text-cyan-400 mx-auto" />
        <p className="text-xs text-slate-400">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
        <span className="text-xs font-mono text-cyan-400">
          {isEdit ? `Editing ID: #${id}` : 'New Product Registration'}
        </span>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
        
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isEdit ? 'Edit Product Information' : 'Register New Store Product'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill in accurate product details and shop floor location to ensure customer visibility.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Product Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol 500mg Tablets"
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Calpol Health"
                className="input-field text-xs"
              />
            </div>
          </div>

          {/* Category & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Department Category *
              </label>
              <select
                required
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="input-field text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Store SKU / Barcode Identifier *
              </label>
              <input
                type="text"
                required
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. PHARM-PARA-500"
                className="input-field text-xs font-mono"
              />
            </div>
          </div>

          {/* Price & Initial Stock Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Store Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="input-field text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Floor Stock Quantity (Units) *
              </label>
              <input
                type="number"
                min="0"
                required
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                className="input-field text-xs font-mono"
              />
            </div>
          </div>

          {/* In-Store Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Exact In-Store Location (Aisle / Shelf / Bay) *
            </label>
            <input
              type="text"
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Aisle 1 - Pharmacy Counter Bay A"
              className="input-field text-xs"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Displayed prominently to customers on product search cards.
            </span>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Product Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="input-field text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe package size, strength, or key features..."
              className="input-field text-xs"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="btn-secondary text-xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
