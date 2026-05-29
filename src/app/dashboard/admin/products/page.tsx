'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Search, Trash2, Edit2, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  status: string;
  farmer: { name: string; email: string };
  image?: string;
  createdAt: string;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, statusFilter, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: any = { page: currentPage, limit };
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await axios.get('http://localhost:5001/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (productId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5001/api/admin/products/${productId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Product status updated');
      fetchProducts();
      setShowStatusModal(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update product status');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'Pending Review':
        return <AlertCircle size={18} className="text-yellow-600" />;
      case 'Rejected':
        return <XCircle size={18} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getPriceUnit = (category: string) => {
    switch (category) {
      case 'Grains':
        return '/ton';
      case 'Fruits':
        return '/box';
      case 'Vegetables':
        return '/kg';
      case 'Equipment':
        return '/set';
      case 'Tech':
        return '/unit';
      default:
        return '';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1e4d1e]">Manage Products</h1>
            <p className="text-gray-600 mt-1 text-sm max-w-2xl">Review and approve new product listings to maintain the marketplace's premium quality and safety standards.</p>
          </div>
          <button className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#1e4d1e] text-white text-sm font-semibold hover:bg-[#163d16] transition">
            Export Report
          </button>
        </div>

        {/* Filters & Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 mb-6 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-4 top-4 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1e4d1e] text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1e4d1e] text-sm"
              >
                <option value="">Category</option>
                <option value="Grains">Grains</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Equipment">Equipment</option>
                <option value="Tech">Tech</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1e4d1e] text-sm"
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Rejected">Rejected</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
            <button className="rounded-full bg-[#1e4d1e] px-4 py-2 text-sm font-semibold text-white">All Items (48)</button>
            <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">Pending Review (12)</button>
            <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">Active Marketplace (32)</button>
            <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">Rejected/Flagged (4)</button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="relative h-52 bg-gradient-to-br from-gray-100 via-white to-green-50">
                  <div className="absolute inset-0 flex items-start justify-between p-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(product.status)}`}>
                      {getStatusIcon(product.status)} {product.status}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">{product.category}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 mx-4 mb-4 h-24 rounded-3xl bg-white/90 border border-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-5xl">📸</div>
                      <div className="text-xs mt-2">Image placeholder</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
                    </div>
                    <p className="text-lg font-bold text-[#1e4d1e]">${product.price.toLocaleString()}<span className="text-sm text-gray-500">{getPriceUnit(product.category)}</span></p>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Premium marketplace listing for trusted supply.</p>

                  <div className="mt-5 rounded-3xl bg-gray-50 p-4 border border-gray-100">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">Farmer</p>
                    <p className="text-sm font-semibold text-gray-900">{product.farmer.name}</p>
                    <p className="text-xs text-gray-500 truncate">{product.farmer.email}</p>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {product.status === 'Pending Review' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(product._id, 'Active')}
                          className="w-full rounded-full bg-[#1e4d1e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#163d16] transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(product._id, 'Rejected')}
                          className="w-full rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : product.status === 'Active' ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowStatusModal(true);
                          }}
                          className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(product._id, 'Inactive')}
                          className="w-full rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                        >
                          Disable
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowStatusModal(true);
                          }}
                          className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                        >
                          Contact Farmer
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowStatusModal(true);
                          }}
                          className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                        >
                          Edit Info
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col justify-center items-center gap-5 rounded-3xl border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 hover:border-[#1e4d1e] transition cursor-pointer">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f6ea] text-[#1e4d1e]">
                <Plus size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add New Listing</h3>
                <p className="text-sm text-gray-500 mt-2">Manually register a verified supplier product.</p>
              </div>
              <button className="inline-flex items-center justify-center rounded-full border border-[#1e4d1e] bg-white px-5 py-3 text-sm font-semibold text-[#1e4d1e] hover:bg-[#1e4d1e] hover:text-white transition">
                Add Listing
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between p-4 text-sm text-gray-600">
            <p>Showing 1 to {products.length} of 48 products</p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                ←
              </button>
              <span className="px-3 py-1 bg-[#1e4d1e] text-white rounded font-semibold">{currentPage}</span>
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Status Change Modal */}
        {showStatusModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-bold mb-4">Change Status for {selectedProduct.name}</h2>
              <p className="text-gray-600 mb-6">Current status: <span className="font-semibold">{selectedProduct.status}</span></p>
              <div className="space-y-2 mb-6">
                {['Active', 'Pending Review', 'Rejected', 'Inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedProduct._id, status)}
                    className={`w-full px-4 py-2 rounded-lg transition text-left ${
                      selectedProduct.status === status
                        ? 'bg-[#1e4d1e] text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageProducts;
