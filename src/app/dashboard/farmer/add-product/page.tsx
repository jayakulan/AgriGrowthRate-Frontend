'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sprout,
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  MessageSquare,
  Activity,
  Cpu,
  User as UserIcon,
  Search,
  Bell,
  Settings,
  HelpCircle,
  ArrowLeft,
  Upload,
  DollarSign,
  Layers,
  FileText,
  BadgeAlert,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '@/services/productService';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [isOrganic, setIsOrganic] = useState(true);
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Pre-defined sample photos so user can easily mock images
  const sampleImages = [
    { name: 'Tomato', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop' },
    { name: 'Wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
    { name: 'Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
    { name: 'Potatoes', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
  ];

  const handleImageMock = (url: string) => {
    setImagePreview(url);
    toast.success('Sample crop photo selected!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Product image uploaded!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !description) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    try {
      const productData = {
        name,
        category: category.toLowerCase(),
        isOrganic,
        price: Number(price),
        unit,
        stock: Number(stock),
        description,
        images: imagePreview ? [imagePreview] : [],
      };

      await productService.create(productData);
      toast.success('Product listed successfully in the marketplace! 🌱');
      router.push('/dashboard/farmer/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
            
            {/* Breadcrumbs and back button */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">
                <Link href="/dashboard/farmer" className="hover:text-gray-700">Dashboard</Link>
                <span>/</span>
                <Link href="/dashboard/farmer/products" className="hover:text-gray-700">My Products</Link>
                <span>/</span>
                <span className="text-[#1e4d1e]">Add Product</span>
              </div>
              
              <Link
                href="/dashboard/farmer/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1e4d1e] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to inventory</span>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
                Add New Product
              </h1>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                Create a new listing for your fresh harvest to showcase and sell directly in the AgriGrowthRate Marketplace.
              </p>
            </div>

            {/* Form layout split */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Input Details (General & Inventory) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* General Info Card */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f4f5f0]">
                    <Layers className="w-4 h-4 text-[#1e4d1e]" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">General Information</h3>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Organic Heirloom Tomatoes"
                      className="w-full px-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
                      required
                    />
                  </div>

                  {/* Category & Organic Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#1e4d1e]"
                      >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Grains">Grains</option>
                        <option value="Fruits">Fruits</option>
                      </select>
                    </div>

                    {/* Organic switch */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Cultivation Method</label>
                      <div className="flex bg-[#f4f5f0] border border-[#e4e6df] p-1 rounded-lg h-[42px]">
                        <button
                          type="button"
                          onClick={() => setIsOrganic(true)}
                          className={`flex-1 text-xs font-bold rounded-md transition-all ${
                            isOrganic
                              ? 'bg-[#1e4d1e] text-white shadow-sm'
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Organic
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOrganic(false)}
                          className={`flex-1 text-xs font-bold rounded-md transition-all ${
                            !isOrganic
                              ? 'bg-[#1e4d1e] text-white shadow-sm'
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Conventional
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Detailed Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Share details about the farming methods, freshness, optimal storage, or harvest batch details..."
                      className="w-full px-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e] resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Inventory Card */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f4f5f0]">
                    <DollarSign className="w-4 h-4 text-[#1e4d1e]" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Pricing & Inventory</h3>
                  </div>

                  {/* Price & Unit Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Unit Price ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-9 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Selling Unit</label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#1e4d1e]"
                      >
                        <option value="kg">Per Kilogram (kg)</option>
                        <option value="bundle">Per Bundle</option>
                        <option value="bag">Per Bag</option>
                        <option value="ear">Per Ear</option>
                        <option value="box">Per Box</option>
                      </select>
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Initial Stock Quantity</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full px-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
                      required
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4">
                  <Link
                    href="/dashboard/farmer/products"
                    className="flex-1 text-center py-3 bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                    ) : (
                      'Publish Product'
                    )}
                  </button>
                </div>

              </div>

              {/* Right Column: Image Upload & Visual Mock Preview */}
              <div className="space-y-6">
                
                {/* Upload Image Card */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f4f5f0] mb-5">
                    <Upload className="w-4 h-4 text-[#1e4d1e]" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Listing Image</h3>
                  </div>

                  {/* Visual Drag Zone */}
                  <div className="border-2 border-dashed border-[#e4e6df] rounded-xl p-6 text-center hover:border-[#1e4d1e] transition-colors relative group min-h-[220px] flex flex-col justify-center items-center">
                    {imagePreview ? (
                      <div className="absolute inset-2 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-[#1e4d1e] transition-colors mb-3" />
                        <h4 className="text-xs font-bold text-gray-800">Drag & drop your crop image</h4>
                        <p className="text-[10px] text-gray-400 mt-1 max-w-[160px]">Supports PNG, JPG, JPEG up to 5MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>

                  {/* Sample Mock Select Photos */}
                  <div className="mt-6">
                    <p className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase mb-3">Or choose a mock crop photo</p>
                    <div className="grid grid-cols-4 gap-2">
                      {sampleImages.map((img) => (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => handleImageMock(img.url)}
                          className="h-12 rounded-lg border border-[#e4e6df] overflow-hidden relative hover:border-[#1e4d1e] transition-colors shrink-0"
                          title={`Select sample ${img.name}`}
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Important notice card */}
                <div className="bg-[#edf4e2] border border-[#d2dfc2] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#d2dfc2] flex items-center justify-center text-[#1e4d1e] shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1e4d1e]">Modern Market Standard</h4>
                    <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed font-medium">
                      All products listed undergo a quick automated check. Organic labels require authentic farmer verification. Ensure descriptions accurately represent pesticide and soil quality standards.
                    </p>
                  </div>
                </div>

              </div>

            </form>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-white border border-[#e4e6df] p-4 rounded-xl shadow-lg flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-[#1e4d1e] animate-spin" />
            <span className="text-xs font-bold text-gray-700">Listing product...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick fallback loader definition
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
