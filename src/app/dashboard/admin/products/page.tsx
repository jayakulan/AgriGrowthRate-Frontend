'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Phone,
  MapPin,
  Calendar,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity?: number;
  category: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  farmerName: string;
  farmerEmail?: string;
  farmerPhone?: string;
  location?: string;
  image?: string;
  description?: string;
  dateAdded?: string;
}


export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [counts, setCounts] = useState({ all: 0, approved: 0, rejected: 0 });

  const mockProducts: Product[] = [
    {
      _id: 'p-1',
      name: 'Organic Durum Wheat',
      price: 1240,
      quantity: 500,
      category: 'Grains',
      status: 'Pending',
      farmerName: 'Silas Vorn',
      farmerPhone: '+1 (555) 123-4567',
      location: 'Punjab District',
      dateAdded: '2024-12-10',
      description: 'Premium organic durum wheat suitable for pasta production.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-2',
      name: 'Honeycrisp Apples',
      price: 45,
      quantity: 200,
      category: 'Fruits',
      status: 'Approved',
      farmerName: 'Elena Rossi',
      farmerPhone: '+1 (555) 234-5678',
      location: 'Himachal Pradesh',
      dateAdded: '2024-12-08',
      description: 'Fresh, crispy honeycrisp apples directly from orchards.',
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-3',
      name: 'Fresh Tomatoes',
      price: 35,
      quantity: 1000,
      category: 'Vegetables',
      status: 'Approved',
      farmerName: 'Raj Kumar',
      farmerPhone: '+1 (555) 345-6789',
      location: 'Karnataka District',
      dateAdded: '2024-12-05',
      description: 'Locally grown, pesticide-free fresh tomatoes.',
      image: 'https://images.unsplash.com/photo-1592841622261-38c7f5f1bf1f?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-4',
      name: 'Black Turtle Beans',
      price: 890,
      quantity: 300,
      category: 'Grains',
      status: 'Rejected',
      farmerName: 'Silas Vorn',
      farmerPhone: '+1 (555) 456-7890',
      location: 'Punjab District',
      dateAdded: '2024-12-01',
      description: 'High-quality black turtle beans for wholesale.',
      image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-5',
      name: 'Organic Carrots',
      price: 28,
      quantity: 800,
      category: 'Vegetables',
      status: 'Approved',
      farmerName: 'Priya Singh',
      farmerPhone: '+1 (555) 567-8901',
      location: 'Rajasthan District',
      dateAdded: '2024-11-28',
      description: 'Sweet and crunchy organic carrots.',
      image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2b?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-6',
      name: 'Basmati Rice',
      price: 2100,
      quantity: 1200,
      category: 'Grains',
      status: 'Pending',
      farmerName: 'Vikram Patel',
      farmerPhone: '+1 (555) 678-9012',
      location: 'Uttar Pradesh',
      dateAdded: '2024-11-25',
      description: 'Premium basmati rice with long grains.',
      image: 'https://images.unsplash.com/photo-1586080872633-27518ce4b76b?auto=format&fit=crop&q=80&w=600&h=400'
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, statusFilter, activeTab, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: 12 };
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter !== 'All Categories') params.category = categoryFilter;
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
      if (activeTab !== 'All') params.tab = activeTab.toLowerCase();

      const response = await api.get('/admin/products', {
        params,
      }).catch(() => null);

      if (response?.data?.data) {
        setProducts(response.data.data);
        if (response.data.counts) {
          setCounts(response.data.counts);
        }
      } else {
        setProducts(mockProducts);
        setCounts({
          all: mockProducts.length,
          approved: mockProducts.filter(p => p.status === 'Approved').length,
          rejected: mockProducts.filter(p => p.status === 'Rejected').length
        });
      }
    } catch (error) {
      console.warn('Could not fetch products, using mock data:', error);
      setProducts(mockProducts);
      setCounts({
        all: mockProducts.length,
        approved: mockProducts.filter(p => p.status === 'Approved').length,
        rejected: mockProducts.filter(p => p.status === 'Rejected').length
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    try {
      await api.patch(`/admin/products/${productId}/status`, { status: 'Active' });
      toast.success('Product approved successfully! 🌱');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve product');
    }
  };

  const handleReject = async (productId: string) => {
    try {
      await api.patch(`/admin/products/${productId}/status`, { status: 'Rejected' });
      toast.error('Product rejected.');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted.');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleExportReport = () => {
    toast.success('Report exported successfully!');
  };

  // detail popup
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const showDetails = (p: Product) => { setDetailProduct(p); setDetailOpen(true); };
  const closeDetails = () => { setDetailProduct(null); setDetailOpen(false); };

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || prod.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || prod.status === statusFilter;
    const matchesTab = activeTab === 'All' || (
      (activeTab === 'Approved' && prod.status === 'Approved') ||
      (activeTab === 'Pending' && prod.status === 'Pending') ||
      (activeTab === 'Rejected' && prod.status === 'Rejected')
    );
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const stats = [
    { label: 'All Products', count: counts.all, color: '#1e4d1e' },
    { label: 'Approved', count: counts.approved, color: '#16a34a' },
    { label: 'Rejected', count: counts.rejected, color: '#dc2626' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };


  return (
    <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">


        {/* Compact statistic chips */}
        <div className="flex gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex-1 bg-white border border-[#e4e6df] rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-extrabold mt-1" style={{ color: stat.color }}>{stat.count}</p>
              </div>
              <div className="w-10 h-10 rounded-full opacity-10" style={{ backgroundColor: stat.color }} />
            </div>
          ))}
        </div>

        {/* ── FILTER & ACTIONS SECTION ── */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product name or farmer..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e4e6df] rounded-xl bg-white text-sm font-medium text-gray-700 outline-none focus:border-[#1e4d1e] focus:bg-[#f9f9f6] transition-all"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-48">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e4e6df] rounded-xl bg-white text-sm font-medium text-gray-700 outline-none focus:border-[#1e4d1e] cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Grains">Grains</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-40">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e4e6df] rounded-xl bg-white text-sm font-medium text-gray-700 outline-none focus:border-[#1e4d1e] cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>


          </div>
        </div>

        {/* ── TABS SECTION ── */}
        <div className="flex gap-6 border-b border-[#e4e6df] overflow-x-auto pb-4">
          {['All', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 whitespace-nowrap text-sm font-bold transition-colors relative ${activeTab === tab
                ? 'text-[#1e4d1e]'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e4d1e]" />
              )}
            </button>
          ))}
        </div>

        {/* ── PRODUCT CARDS GRID ── */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e4e6df]">
            <p className="text-gray-500 font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, idx) => (
              <React.Fragment key={product._id}>
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-[#e4e6df] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative h-36 overflow-hidden shrink-0 p-3 pb-0">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-sm border ${product.quantity === 0 ? 'bg-red-50 text-red-700 border-red-200' : getStatusColor(product.status)}`}>
                          {product.quantity === 0 ? 'Out of Stock' : product.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Title & Price */}
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[15px] font-bold text-[#0f172a] leading-snug line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-[14px] font-bold text-[#0f172a]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-[12px] font-bold text-[#0f172a]">/unit</span>
                      </div>
                    </div>

                    {/* Quantity / Stock */}
                    <div className="flex flex-col gap-1 mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Available Stock</span>
                        <span className="font-black text-[#1e4d1e] text-[20px] leading-none">
                          {product.quantity && product.quantity > 0 ? (
                            <>
                              {product.quantity} <span className="text-[13px] font-bold">units</span>
                            </>
                          ) : (
                            <span className="text-red-500 text-[15px] font-extrabold uppercase tracking-wide">Out of Stock</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Farmer Details */}
                    <div className="space-y-1.5 py-2.5 border-t border-b border-[#f4f5f0] mb-3">
                      <p className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
                        <span className="text-gray-900">{product.farmerName}</span>
                      </p>
                      {product.farmerPhone && (
                        <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-[#1e4d1e]" />
                          {product.farmerPhone}
                        </p>
                      )}
                      {product.location && (
                        <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-[#1e4d1e]" />
                          <span className="line-clamp-1">{product.location}</span>
                        </p>
                      )}
                      {product.dateAdded && (
                        <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-[#1e4d1e]" />
                          {new Date(product.dateAdded).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="text-[12px] text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Action Buttons at Bottom */}
                    <div className="mt-auto space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleApprove(product._id)}
                          disabled={product.status === 'Approved'}
                          className="py-2 px-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:blur-[0.5px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(product._id)}
                          disabled={product.status === 'Rejected'}
                          className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer border border-red-100 text-center disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:blur-[0.5px]"
                        >
                          Reject
                        </button>
                      </div>
                      <button
                        onClick={() => showDetails(product)}
                        className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-100 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer border border-red-100 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Product
                      </button>
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
            {/* Detail popup render */}
            <DetailPopup product={detailProduct} open={detailOpen} onClose={closeDetails} />
          </div>
        )}

        {/* ── PAGINATION ── */}
        {!loading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-lg cursor-pointer">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button className="w-8 h-8 bg-[#1e4d1e] text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-default">
              1
            </button>
            <button className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-lg cursor-pointer">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// Detail popup (render inside same file)
function DetailPopup({ product, open, onClose }: { product: Product | null; open: boolean; onClose: () => void }) {
  if (!open || !product) return null;

  const formattedDate = product.dateAdded
    ? new Date(product.dateAdded).toISOString().split('T')[0]
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-up border border-[#e4e6df] flex flex-col md:flex-row h-[90vh] md:h-[500px]">
        {/* Left Side: Large Product Image */}
        <div className="w-full md:w-1/2 h-[200px] md:h-full relative bg-gray-100 shrink-0">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=400'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-full bg-white">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">Product Detailed Info</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg font-bold">✕</button>
            </div>

            {/* Info Table */}
            <div className="space-y-4 text-sm mb-6">
              <div className="grid grid-cols-3 items-center">
                <span className="font-extrabold text-xs text-[#1e4d1e] tracking-wide uppercase">Farmer</span>
                <span className="col-span-2 text-gray-700 font-semibold">{product.farmerName}</span>
              </div>
              <div className="grid grid-cols-3 items-center">
                <span className="font-extrabold text-xs text-[#1e4d1e] tracking-wide uppercase">Location</span>
                <span className="col-span-2 text-gray-700 font-semibold">{product.location || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center">
                <span className="font-extrabold text-xs text-[#1e4d1e] tracking-wide uppercase">Product</span>
                <span className="col-span-2 text-gray-900 font-black">{product.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center">
                <span className="font-extrabold text-xs text-[#1e4d1e] tracking-wide uppercase">Price</span>
                <span className="col-span-2 text-[#1e4d1e] font-black">₹{product.price} / unit</span>
              </div>
              <div className="grid grid-cols-3 items-center">
                <span className="font-extrabold text-xs text-[#1e4d1e] tracking-wide uppercase">Quantity</span>
                <span className="col-span-2 text-gray-700 font-semibold">{product.quantity || 0} units</span>
              </div>
              <div className="grid grid-cols-3 items-center">
                <span className="font-extrabold text-xs text-[#1e4d1e] tracking-wide uppercase">Uploaded</span>
                <span className="col-span-2 text-gray-700 font-semibold">{formattedDate}</span>
              </div>
            </div>

            {/* About Product Box */}
            <div className="mb-6">
              <span className="block text-[10px] font-extrabold text-gray-400 tracking-wider uppercase mb-2">About Product</span>
              <div className="bg-[#f4f5f0]/60 border border-[#e4e6df]/80 rounded-xl p-3.5 text-xs text-gray-600 font-medium leading-relaxed">
                {product.description || 'No additional details provided.'}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-black rounded-xl uppercase tracking-widest transition-colors shadow-sm text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


{/* Detail popup component placed after main export to keep file tidy */ }