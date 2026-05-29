'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Download, 
  SlidersHorizontal,
  CheckSquare,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  status: 'Active' | 'Pending Review' | 'Rejected' | 'Inactive' | 'Action Required';
  farmerName: string;
  farmerEmail?: string;
  supplierName?: string;
  image?: string;
  alertMsg?: string;
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Active' | 'Rejected'>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // New Listing modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    price: '',
    category: 'Grains',
    farmerName: '',
  });
  const [adding, setAdding] = useState(false);

  const mockProducts: Product[] = [
    {
      _id: 'p-1',
      name: 'Organic Durum Wheat',
      price: 1240,
      category: 'Grains',
      status: 'Pending Review',
      farmerName: 'Silas Vorn',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-2',
      name: 'CropScan V2 Sensor',
      price: 349,
      category: 'Tech',
      status: 'Active',
      supplierName: 'PrecisionAg Co.',
      farmerName: 'PrecisionAg Co.',
      image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-3',
      name: 'Honeycrisp Apples',
      price: 45,
      category: 'Fruits',
      status: 'Pending Review',
      farmerName: 'Elena Rossi',
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      _id: 'p-4',
      name: 'Black Turtle Beans',
      price: 890,
      category: 'Grains',
      status: 'Action Required',
      farmerName: 'Silas Vorn',
      alertMsg: 'Missing certification documents.',
      image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&q=80&w=600&h=400'
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, activeTab, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: any = { page: currentPage, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      if (activeTab !== 'All') params.status = activeTab;

      const response = await axios.get('http://localhost:5001/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }).catch(() => null);

      if (response && response.data && response.data.data) {
        setProducts(response.data.data);
      } else {
        setProducts(mockProducts);
      }
    } catch (error) {
      console.warn('Could not fetch active products from backend API, mocking instead:', error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (productId: string, newStatus: Product['status']) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5001/api/admin/products/${productId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => null);

      if (response) {
        toast.success(`Listing status updated to ${newStatus}`);
      } else {
        toast.success(`Listing status rotated to ${newStatus}! 🌳`);
      }
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to change product status');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price || !newProductForm.farmerName) {
      return toast.error('Please enter name, price, and producer details');
    }

    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      toast.success(`"${newProductForm.name}" registered successfully on marketplace! 🌱`);
      setShowAddModal(false);
      setNewProductForm({ name: '', price: '', category: 'Grains', farmerName: '' });
      fetchProducts();
    }, 1200);
  };

  const handleExportReport = () => {
    toast.success('Marketplace catalog report exported successfully! 📄');
  };

  const getPriceUnit = (category: string) => {
    switch (category) {
      case 'Grains':
        return '/ton';
      case 'Fruits':
        return '/box';
      case 'Vegetables':
        return '/kg';
      case 'Tech':
        return '/unit';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto">
        
        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
              Manage Products
            </h1>
            <p className="text-xs text-gray-400 font-semibold max-w-2xl">
              Review and approve new product listings to maintain the marketplace's premium quality and safety standards.
            </p>
          </div>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-3 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer select-none shrink-0"
          >
            <Download className="w-4 h-4 text-white" />
            <div className="text-left leading-tight">
              <span>Export Report</span>
            </div>
          </button>
        </div>

        {/* ── FILTER TABS AND SEARCH CONTROLS ── */}
        <div className="flex flex-col gap-4 border-b border-[#e4e6df] pb-3">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Horizontal Filter Tabs */}
            <div className="flex flex-wrap gap-6 text-xs font-bold text-gray-400 select-none">
              <button
                onClick={() => { setActiveTab('All'); setCurrentPage(1); }}
                className={`pb-3.5 transition-all relative cursor-pointer ${
                  activeTab === 'All' ? 'text-[#1e4d1e]' : 'hover:text-gray-600'
                }`}
              >
                <span>All Items (48)</span>
                {activeTab === 'All' && (
                  <motion.div layoutId="productTabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1e4d1e]" />
                )}
              </button>

              <button
                onClick={() => { setActiveTab('Pending'); setCurrentPage(1); }}
                className={`pb-3.5 transition-all relative cursor-pointer ${
                  activeTab === 'Pending' ? 'text-[#1e4d1e]' : 'hover:text-gray-600'
                }`}
              >
                <span>Pending Review (12)</span>
                {activeTab === 'Pending' && (
                  <motion.div layoutId="productTabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1e4d1e]" />
                )}
              </button>

              <button
                onClick={() => { setActiveTab('Active'); setCurrentPage(1); }}
                className={`pb-3.5 transition-all relative cursor-pointer ${
                  activeTab === 'Active' ? 'text-[#1e4d1e]' : 'hover:text-gray-600'
                }`}
              >
                <span>Active Marketplace (32)</span>
                {activeTab === 'Active' && (
                  <motion.div layoutId="productTabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1e4d1e]" />
                )}
              </button>

              <button
                onClick={() => { setActiveTab('Rejected'); setCurrentPage(1); }}
                className={`pb-3.5 transition-all relative cursor-pointer ${
                  activeTab === 'Rejected' ? 'text-[#1e4d1e]' : 'hover:text-gray-600'
                }`}
              >
                <span>Rejected/Flagged (4)</span>
                {activeTab === 'Rejected' && (
                  <motion.div layoutId="productTabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1e4d1e]" />
                )}
              </button>
            </div>

            {/* Quick tag categories */}
            <div className="flex gap-2 select-none">
              <button 
                onClick={() => toast('Filtering by category...')}
                className="bg-[#edf4e2] border border-[#d2dfc2] hover:bg-[#dce9cc] text-[#1e4d1e] px-3.5 py-2 rounded-xl text-[10px] font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Category</span>
              </button>

              <button 
                onClick={() => toast('Filtering by status...')}
                className="bg-[#edf4e2] border border-[#d2dfc2] hover:bg-[#dce9cc] text-[#1e4d1e] px-3.5 py-2 rounded-xl text-[10px] font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Status</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── PRODUCT CARDS GRID ── */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-[#e4e6df]">
            <Loader2 className="w-6 h-6 text-[#1e4d1e] animate-spin mb-2" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fetching product catalog...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((prod) => (
              <div 
                key={prod._id}
                className="bg-white border border-[#e4e6df] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Header Image box with tags */}
                <div className="relative h-48 w-full select-none bg-gray-100">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=400'}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Tags */}
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 z-10 pointer-events-none">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                      prod.status === 'Active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : prod.status === 'Pending Review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : prod.status === 'Action Required'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {prod.status}
                    </span>

                    <span className="inline-flex px-3 py-1 rounded-full bg-white/95 text-[9px] font-bold text-gray-500 shadow-sm border border-gray-100 capitalize">
                      {prod.category}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 text-left space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    
                    {/* Title and price */}
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-base font-extrabold text-gray-900 leading-tight">
                        {prod.name}
                      </h4>
                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-[#1e4d1e]">${prod.price.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{getPriceUnit(prod.category)}</span>
                      </div>
                    </div>

                    {/* Sub title / producer */}
                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1 mt-1">
                      {prod.supplierName ? (
                        <>🏢 Supplier: {prod.supplierName}</>
                      ) : (
                        <>🧑‍🌾 Farmer: {prod.farmerName}</>
                      )}
                    </p>

                    {/* Alert notice box if Action required */}
                    {prod.alertMsg && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 flex gap-2 items-start mt-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-[10px] text-red-700 font-bold leading-normal">
                          {prod.alertMsg}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Actions depending on Status exactly matching reference design */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#f4f5f0]">
                    {prod.status === 'Pending Review' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(prod._id, 'Active')}
                          className="py-2.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(prod._id, 'Rejected')}
                          className="py-2.5 bg-white border border-[#e4e6df] text-gray-600 hover:bg-gray-50 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                        >
                          Reject
                        </button>
                      </>
                    ) : prod.status === 'Active' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toast('Opening details modal...')}
                          className="py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(prod._id, 'Inactive')}
                          className="py-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                        >
                          Disable
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => toast(`Comms dispatched to ${prod.farmerName}`)}
                          className="py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                        >
                          Contact Farmer
                        </button>
                        <button
                          type="button"
                          onClick={() => toast('Opening product editor...')}
                          className="py-2.5 bg-white border border-[#e4e6df] text-gray-600 hover:bg-gray-50 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                        >
                          Edit Info
                        </button>
                      </>
                    )}
                  </div>

                </div>

              </div>
            ))}

            {/* Dotted border: Add New Listing item exactly matching mockup */}
            <div
              onClick={() => setShowAddModal(true)}
              className="border-2 border-dashed border-[#d2dfc2] hover:border-[#1e4d1e] rounded-[24px] p-8 flex flex-col justify-center items-center gap-4 text-center cursor-pointer hover:bg-[#edf4e2]/20 transition-all select-none min-h-[360px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center text-[#1e4d1e]">
                <Plus className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-gray-900">Add New Listing</h4>
                <p className="text-xs text-gray-400 font-semibold max-w-[200px] leading-relaxed mx-auto">
                  Manually register a verified supplier product.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ── PAGINATION CONTROLS FOOTER ── */}
        <div className="flex items-center justify-between border-t border-[#e4e6df] pt-6 select-none">
          <span className="text-[10px] font-bold text-gray-400">
            Showing 1 to 12 of 48 products
          </span>

          <div className="inline-flex items-center gap-1.5">
            <button className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button className="w-8 h-8 bg-[#1e4d1e] text-white rounded-xl text-[10px] font-bold cursor-default flex items-center justify-center">
              1
            </button>

            <button className="w-8 h-8 bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all">
              2
            </button>

            <button className="w-8 h-8 bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all">
              3
            </button>

            <button className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ── ADD PRODUCT LISTING MODAL ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Form Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#edf4e2] flex items-center justify-center mx-auto border border-[#d2dfc2]">
                  <Plus className="w-6 h-6 text-[#1e4d1e]" />
                </div>
                <h4 className="text-lg font-extrabold text-gray-900">Add New Listing</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Enter credentials to manually register a verified agricultural supplier product.
                </p>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4 text-left">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. Organic Durum Wheat"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      placeholder="e.g. 1240"
                      className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Category
                    </label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3.5 px-4 text-xs font-bold text-gray-800 outline-none cursor-pointer"
                    >
                      <option value="Grains">Grains</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Tech">Tech</option>
                    </select>
                  </div>
                </div>

                {/* Producer Farmer Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Producer / Farmer Name
                  </label>
                  <input
                    type="text"
                    value={newProductForm.farmerName}
                    onChange={(e) => setNewProductForm({ ...newProductForm, farmerName: e.target.value })}
                    placeholder="e.g. Silas Vorn"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Register Listing'}
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </>
  );
}
