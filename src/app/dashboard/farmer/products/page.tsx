'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import FarmerSidebar from '@/components/FarmerSidebar';
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
  const [products, setProducts]           = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter]   = useState('All');
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
    const matchesSearch   = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter.toLowerCase();
    const matchesStatus   = statusFilter === 'All' || status === statusFilter;
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
    if (status === 'Active')       return 'bg-green-500 text-white';
    if (status === 'Out of Stock') return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      <div className="flex flex-1">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <FarmerSidebar activeMenu="My Products" />

        {/* ── Main layout ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top Navbar */}
          <header className="h-16 border-b border-[#e4e6df] bg-white flex items-center justify-between px-8 shrink-0">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search farm analytics, orders, or crops..."
                className="w-full pl-9 pr-4 py-2 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
              />
            </div>
            <div className="flex items-center gap-6">
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1"><Bell className="w-5 h-5" /></button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1"><Settings className="w-5 h-5" /></button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1"><HelpCircle className="w-5 h-5" /></button>
              <div className="w-px h-6 bg-[#e4e6df]" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Thomas Miller</h4>
                  <span className="text-[10px] font-extrabold text-[#4A6D2F] tracking-wide uppercase">Premium Plan</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                  alt="Thomas Miller Profile"
                  className="w-9 h-9 rounded-full object-cover border border-[#e4e6df]"
                />
              </div>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 p-8 overflow-y-auto">

            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                  <Link href="/dashboard/farmer" className="hover:text-gray-700">Dashboard</Link>
                  <span>/</span>
                  <span className="text-[#1e4d1e]">My Products</span>
                </div>
                <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">My Products</h1>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Manage and track your listed agricultural products, inventory status, and marketplace visibility.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Refresh */}
                <button
                  onClick={fetchProducts}
                  disabled={loading}
                  className="flex items-center gap-2 border border-[#e4e6df] bg-white hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <Link
                  href="/dashboard/farmer/add-product"
                  className="flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </Link>
              </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white border border-[#e4e6df] rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
                />
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
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
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => {
                  const status = deriveStatus(p);
                  const isDoingAction = actionId === p._id;
                  const imageUrl = p.images?.[0] || FALLBACK_IMAGE;

                  return (
                    <div
                      key={p._id}
                      className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col"
                    >
                      {/* Overlay when action in progress */}
                      {isDoingAction && (
                        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-2xl">
                          <Loader2 className="w-7 h-7 text-[#1e4d1e] animate-spin" />
                        </div>
                      )}

                      {/* Image + badges */}
                      <div className="relative h-48 w-full bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider shadow-sm uppercase ${statusBadgeClass(status)}`}>
                            {status}
                          </span>
                          {p.isOrganic && (
                            <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-md bg-[#edf4e2] text-[#4A6D2F] tracking-wider shadow-sm flex items-center gap-1">
                              <Leaf className="w-2.5 h-2.5" /> ORGANIC
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">{p.category}</span>
                          <h3 className="font-bold text-gray-900 mt-1 text-base">{p.name}</h3>
                          {p.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                          )}
                          <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-y border-[#f4f5f0] text-sm">
                            <div>
                              <p className="text-xs text-gray-400 font-semibold">Price</p>
                              <p className="font-extrabold text-gray-900 mt-0.5">${p.price.toFixed(2)} / {p.unit}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold">Stock</p>
                              <p className="font-extrabold text-gray-900 mt-0.5">
                                {p.stock > 0
                                  ? `${p.stock} ${p.unit}s`
                                  : <span className="text-red-500">None</span>}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 pt-1">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            disabled={isDoingAction}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{p.isAvailable ? 'Unlist' : 'List'}</span>
                          </button>
                          <button
                            onClick={() => handleEditClick(p)}
                            disabled={isDoingAction}
                            className="w-10 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            disabled={isDoingAction}
                            className="w-10 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50"
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

            {/* Product count footer note */}
            {!loading && !error && products.length > 0 && (
              <p className="text-center text-xs text-gray-400 font-semibold mt-8">
                Showing {filtered.length} of {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
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

          </main>

          {/* Footer */}
          <footer className="h-16 border-t border-[#e4e6df] bg-[#f4f5f0]/50 shrink-0 flex items-center justify-between px-8 text-xs text-gray-400">
            <p>© 2024 AgriGrowthRate. All rights reserved.</p>
            <div className="flex gap-6 font-semibold">
              <Link href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-800 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-gray-800 transition-colors">Support</Link>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
