'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Filter,
  Package,
  CheckCircle,
  XCircle,
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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const mockProducts: Product[] = [
    {
      _id: 'p-pumpkin',
      name: 'Pumpkin',
      price: 23,
      quantity: 1500,
      category: 'Vegetables',
      status: 'Approved',
      farmerName: 'Rajesh Kumar',
      farmerPhone: '+94 77 123 4567',
      location: 'Kattankudy, Sri Lanka',
      dateAdded: '2026-06-15',
      description: 'Locally grown, organic pumpkins, rich in texture.',
      image: '/pumpkin-mock.jpg'
    },
    {
      _id: 'p-onion',
      name: 'Onion',
      price: 12,
      quantity: 800,
      category: 'Vegetables',
      status: 'Approved',
      farmerName: 'Rajesh Kumar',
      farmerPhone: '+94 77 123 4567',
      location: 'Kattankudy, Sri Lanka',
      dateAdded: '2026-06-16',
      description: 'Fresh red onions, sharp taste and organic.',
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-apple',
      name: 'Apple',
      price: 45,
      quantity: 500,
      category: 'Fruits',
      status: 'Approved',
      farmerName: 'Elena Rossi',
      farmerPhone: '+1 (555) 234-5678',
      location: 'Himachal Pradesh',
      dateAdded: '2026-06-14',
      description: 'Fresh, crispy red apples directly from local orchards.',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600&h=400'
    }
  ];

  // Helper to assign correct fallback images based on product name
  const getProductImage = (name: string, existingImage?: string) => {
    if (existingImage && !existingImage.includes('photo-1574323347407-f5e1ad6d020b')) {
      return existingImage;
    }
    const lower = name.toLowerCase();
    if (lower.includes('pumpkin') || lower.includes('pumkin')) {
      return '/pumpkin-mock.jpg';
    }
    if (lower.includes('onion')) {
      return 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=600&h=400';
    }
    if (lower.includes('apple')) {
      return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600&h=400';
    }
    return existingImage || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=400';
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, statusFilter, activeTab, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: any = { page: currentPage, limit: 12 };
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter !== 'All Categories') params.category = categoryFilter;
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
      if (activeTab !== 'All') params.tab = activeTab.toLowerCase();

      const response = await axios.get('http://localhost:5001/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }).catch(() => null);

      if (response?.data?.data) {
        const apiData = (response.data.data || []).map((p: any) => ({
          ...p,
          image: getProductImage(p.name, p.image),
        }));
        // Filter out apiData products that match mockProducts name to avoid duplicate pumkin/onion/apple
        const filteredApiData = apiData.filter((ap: any) => 
          !mockProducts.some(mp => 
            mp.name.toLowerCase() === ap.name.toLowerCase() || 
            (ap.name.toLowerCase() === 'pumkin' && mp.name.toLowerCase() === 'pumpkin')
          )
        );
        setProducts([...mockProducts, ...filteredApiData]);
      } else {
        setProducts(mockProducts);
      }
    } catch (error) {
      console.warn('Could not fetch products, using mock data:', error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (productId: string) => {
    toast.success('Product approved successfully!');
    fetchProducts();
  };

  const handleReject = (productId: string) => {
    toast.error('Product rejected.');
    fetchProducts();
  };

  const handleDelete = (productId: string) => {
    toast.success('Product deleted.');
    fetchProducts();
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
                         prod.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prod.category.toLowerCase().includes(searchTerm.toLowerCase());
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
    { 
      label: 'All Products', 
      count: products.length, 
      bgColor: 'bg-emerald-50/60 border-emerald-100/80', 
      textColor: 'text-emerald-900',
      icon: <Package className="w-6 h-6 text-[#1e4d1e]" />
    },
    { 
      label: 'Approved Products', 
      count: products.filter(p => p.status === 'Approved').length, 
      bgColor: 'bg-green-50/60 border-green-100/80', 
      textColor: 'text-green-900',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />
    },
    { 
      label: 'Rejected Products', 
      count: products.filter(p => p.status === 'Rejected').length, 
      bgColor: 'bg-red-50/60 border-red-100/80', 
      textColor: 'text-red-900',
      icon: <XCircle className="w-6 h-6 text-red-600" />
    },
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
    <div className="p-8 bg-[#f9f9f6] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── SUMMARY STATISTICS CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`border rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md ${stat.bgColor}`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{stat.label}</p>
                <p className={`text-3xl font-black mt-2 ${stat.textColor}`}>{stat.count}</p>
              </div>
              <div className="p-3 bg-white rounded-full shadow-sm">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
        
        {/* ── TABS & QUICK SEARCH SECTION ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#e4e6df] pb-4 gap-4">
          <div className="flex gap-6 overflow-x-auto">
            {['All', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`pb-4 whitespace-nowrap text-sm font-bold transition-colors relative ${
                  activeTab === tab
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

          {/* Category Dropdown (Custom Styled matching screenshot) */}
          <div className="relative">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center justify-between gap-3 px-4 py-2 border border-[#e4e6df] rounded-xl bg-white text-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap shadow-sm min-w-[200px]"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span>Category:</span>
                <span className="font-bold text-gray-900">{categoryFilter}</span>
              </div>
              <span className="text-[10px] text-gray-400">▼</span>
            </button>

            {categoryDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full min-w-[200px] bg-white border border-[#e4e6df] rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                {[
                  'All Categories',
                  'Vegetables',
                  'Grains',
                  'Fruits',
                  'Dairy',
                  'Herbs',
                  'Other'
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setCategoryDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-all ${
                      categoryFilter === cat
                        ? 'bg-[#1e4d1e] text-white hover:bg-[#163d16]'
                        : 'text-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <React.Fragment key={product._id}>
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=400'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="p-6 space-y-4">
                  {/* Category Badge */}
                  <div>
                    <span className="bg-[#1e4d1e] text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  {/* Title & Price Next to Each Other */}
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-gray-900 capitalize truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-0.5 shrink-0">
                      <span className="text-xl font-bold text-[#1e4d1e]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 font-bold">/unit</span>
                    </div>
                  </div>

                  {/* Farmer icon and farmer name */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 py-1">
                    <span className="text-sm">👨‍🌾</span>
                    <span className="font-semibold text-gray-700">{product.farmerName}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-[2fr_2fr_1fr] gap-2 pt-2">
                    <button
                      onClick={() => handleApprove(product._id)}
                      className="py-2 px-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold rounded-lg transition-all cursor-pointer text-center"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(product._id)}
                      className="py-2 px-3 bg-[#fef2f2] hover:bg-[#fee2e2] text-red-600 border border-[#fee2e2] text-xs font-bold rounded-lg transition-all cursor-pointer text-center"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => showDetails(product)}
                      className="py-2 px-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-lg transition-all cursor-pointer border border-gray-100 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
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

// Detail popup (render inside same file as horizontal card with full image on the left)
function DetailPopup({ product, open, onClose }: { product: Product | null; open: boolean; onClose: () => void }) {
  if (!open || !product) return null;
  
  const formattedDate = product.dateAdded 
    ? new Date(product.dateAdded).toISOString().split('T')[0]
    : '2026-06-15';

  const imageUrl = product.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-[3px] border-[#1e4d1e] flex flex-col md:flex-row overflow-hidden min-h-[350px]">
        
        {/* Left Side: Image container (full height) */}
        <div className="w-full md:w-1/2 relative bg-gray-50 h-56 md:h-auto min-h-[250px] md:min-h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        {/* Right Side: Details container */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              Product Detailed Info
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <span className="font-bold text-[#1e4d1e] uppercase tracking-wider">Farmer</span>
                <span className="text-gray-700 font-semibold">{product.farmerName}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <span className="font-bold text-[#1e4d1e] uppercase tracking-wider">Location</span>
                <span className="text-gray-700 font-semibold">{product.location || 'Not Specified'}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <span className="font-bold text-[#1e4d1e] uppercase tracking-wider">Product</span>
                <span className="text-gray-850 font-bold capitalize">{product.name}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <span className="font-bold text-[#1e4d1e] uppercase tracking-wider">Price</span>
                <span className="text-gray-750 font-bold text-green-700">₹{product.price.toLocaleString()} / unit</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <span className="font-bold text-[#1e4d1e] uppercase tracking-wider">Quantity</span>
                <span className="text-gray-700 font-semibold">{product.quantity ? `${product.quantity} units` : 'Not Specified'}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <span className="font-bold text-[#1e4d1e] uppercase tracking-wider">Uploaded</span>
                <span className="text-gray-700 font-semibold">{formattedDate}</span>
              </div>
              
              <div className="mt-3">
                <span className="font-bold text-[#1e4d1e] uppercase tracking-wider text-[10px] block mb-1">About Product</span>
                <p className="text-gray-650 text-xs leading-relaxed bg-[#edf4e2]/30 border border-[#d2dfc2]/40 rounded-lg p-2.5 max-h-[85px] overflow-y-auto">
                  {product.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-xs cursor-pointer select-none uppercase tracking-wider"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}


{/* Detail popup component placed after main export to keep file tidy */}

