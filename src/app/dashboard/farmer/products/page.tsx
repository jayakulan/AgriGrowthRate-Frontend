'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  Plus,
  AlertCircle,
  Loader2,
  RefreshCw,
  Leaf,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '@/services/productService';

// ── Type ─────────────────────────────────────────────────────────────────────
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  isOrganic: boolean;
  isAvailable: boolean;
  images: string[];
  description: string;
}

function deriveStatus(p: Product): string {
  if (p.stock === 0) return 'Out of Stock';
  if (!p.isAvailable) return 'Draft';
  return 'Active';
}

// ── Fallback crop placeholder ─────────────────────────────────────────────────
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=300&fit=crop';

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [actionId, setActionId] = useState<string | null>(null); // tracks which product is doing an action
  const [formData, setFormData] = useState<Partial<Product>>({});

  // ── Fetch from API ───────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getMyProducts();
      setProducts(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Client-side filter (fast, no re-fetch) ───────────────────────────────────
  const filtered = products.filter((p) => {
    const status = deriveStatus(p);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // ── Toggle listing status ────────────────────────────────────────────────────
  const handleToggleStatus = async (p: Product) => {
    setActionId(p._id);
    const newAvailability = !p.isAvailable;
    try {
      await productService.update(p._id, { isAvailable: newAvailability });
      setProducts((prev) =>
        prev.map((item) => item._id === p._id ? { ...item, isAvailable: newAvailability } : item)
      );
      toast.success(`${p.name} ${newAvailability ? 'listed' : 'unlisted'} successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update product status');
    } finally {
      setActionId(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleEditClick = (p: Product) => {
    setEditProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      isOrganic: p.isOrganic,
      isAvailable: p.isAvailable,
      description: p.description,
      images: p.images,
    });
  };
  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = (p: Product) => {
    setDeleteProduct(p);
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    setActionId(editProduct._id);
    try {
      await productService.update(editProduct._id, formData);
      setProducts((prev) =>
        prev.map((item) => (item._id === editProduct._id ? { ...item, ...formData } as Product : item))
      );
      toast.success(`${editProduct.name} updated successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setActionId(null);
      setEditProduct(null);
    }
  };




  const handleDeleteConfirmed = async (product: Product) => {
    setActionId(product._id);
    try {
      await productService.delete(product._id);
      setProducts((prev) => prev.filter((item) => item._id !== product._id));
      toast.success(`${product.name} deleted successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setActionId(null);
      setDeleteProduct(null);
    }
  };


  // ── Status badge helper ───────────────────────────────────────────────────────
  const statusBadgeClass = (status: string) => {
    if (status === 'Active') return 'bg-green-500 text-white';
    if (status === 'Out of Stock') return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
  };
  return (
    <div className="p-8">

      {/* Controls & Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8 xl:items-center">
        
        {/* Left Side: Search & Filters Container */}
        <div className="flex-1 bg-white border border-[#e4e6df] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          
          {/* Search */}
          <div className="relative w-full md:w-auto xl:max-w-md xl:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
            />
          </div>

          {/* Filters & Refresh */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0 items-center">
            
            <div className="flex items-center gap-2 bg-[#f4f5f0] border border-[#e4e6df] px-3 py-2 rounded-lg text-xs font-semibold text-gray-600">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent border-none text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Herbs">Herbs</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-[#f4f5f0] border border-[#e4e6df] px-3 py-2 rounded-lg text-xs font-semibold text-gray-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            {/* Refresh Icon Button */}
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="flex items-center justify-center w-[38px] h-[38px] bg-[#f4f5f0] hover:bg-[#e4e6df] border border-[#e4e6df] text-gray-600 rounded-lg transition-colors shadow-sm"
              title="Refresh Products"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Side: Add New Product Button */}
        <Link
          href="/dashboard/farmer/add-product"
          className="flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors shrink-0 self-stretch xl:self-auto h-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* ── States ─────────────────────────────────────────────────────── */}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-9 bg-gray-100 rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-white border border-red-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Failed to load products</h3>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {products.length === 0 ? 'No products yet' : 'No products found'}
          </h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
            {products.length === 0
              ? 'You haven\'t listed any products yet. Click "Add New Product" to get started.'
              : 'No products match your current filters. Try adjusting your search or filters.'}
          </p>
          {products.length > 0 ? (
            <button
              onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setStatusFilter('All'); }}
              className="bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              href="/dashboard/farmer/add-product"
              className="inline-block bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
            >
              Add Your First Product
            </Link>
          )}
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {filtered.map((p) => {
            const status = deriveStatus(p);
            const isDoingAction = actionId === p._id;
            const imageUrl = p.images?.[0] || FALLBACK_IMAGE;

            return (
              <div
                key={p._id}
                className="bg-white border border-[#e4e6df] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full relative"
              >
                {/* Overlay when action in progress */}
                {isDoingAction && (
                  <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-3xl">
                    <Loader2 className="w-7 h-7 text-[#1e4d1e] animate-spin" />
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 overflow-hidden shrink-0 p-3 pb-0">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 bg-white/95 text-gray-800 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
                      {p.category}
                    </span>
                    {/* Status & Organic badges */}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      <span className={`text-[9px] font-extrabold px-2.5 py-1.5 rounded-full tracking-wider shadow-sm uppercase backdrop-blur-sm ${statusBadgeClass(status)}`}>
                        {status}
                      </span>
                      {p.isOrganic && (
                        <span className="text-[9px] font-extrabold px-2.5 py-1.5 rounded-full bg-[#edf4e2]/95 text-[#4A6D2F] tracking-wider shadow-sm flex items-center gap-1 backdrop-blur-sm">
                          <Leaf className="w-2.5 h-2.5" /> ORGANIC
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[15px] font-bold text-[#0f172a] leading-snug line-clamp-1">{p.name}</h3>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[14px] font-bold text-[#0f172a]">${p.price.toFixed(2)}</span>
                      <span className="text-[12px] font-bold text-[#0f172a]">/{p.unit || 'kg'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Available Stock</span>
                      <span className="font-black text-[#1e4d1e] text-[20px] leading-none">
                        {p.stock > 0 ? (
                          <>
                            {p.stock} <span className="text-[13px] font-bold">{p.unit || 'kg'}</span>
                          </>
                        ) : (
                          <span className="text-red-500 text-[15px]">Out of Stock</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 w-full pt-2">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      disabled={isDoingAction}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${
                        p.isAvailable
                          ? 'bg-[#f4f5f0] hover:bg-[#e4e6df] text-gray-700'
                          : 'bg-[#17451e] hover:bg-[#113316] text-white'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{p.isAvailable ? 'Unlist' : 'List'}</span>
                    </button>
                    <button
                      onClick={() => handleEditClick(p)}
                      disabled={isDoingAction}
                      className="w-[46px] h-[46px] flex items-center justify-center bg-[#f4f5f0] hover:bg-[#e4e6df] text-gray-600 rounded-xl transition-colors shrink-0"
                      title="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={isDoingAction}
                      className="w-[46px] h-[46px] flex items-center justify-center bg-[#fef2f2] hover:bg-[#fee2e2] text-red-600 rounded-xl transition-colors disabled:opacity-50 shrink-0"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {editProduct && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 transform transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Edit Product</h3>
            <form className="grid gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Name</span>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Category</span>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Price</span>
                <input
                  type="number"
                  value={formData.price ?? ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Unit</span>
                <input
                  type="text"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Stock</span>
                <input
                  type="number"
                  value={formData.stock ?? ''}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]"
                />
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isOrganic ?? false}
                  onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                  className="h-4 w-4 text-[#1e4d1e] border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Organic</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isAvailable ?? false}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 text-[#1e4d1e] border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Listed (Available)</span>
              </div>
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Description</span>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]"
                />
              </label>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-[#1e4d1e] text-white rounded hover:bg-[#163d16] transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {deleteProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete &quot;{deleteProduct.name}&quot;? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteProduct(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirmed(deleteProduct)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
