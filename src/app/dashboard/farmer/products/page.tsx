'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyProductsPage() {
  const [activeMenu, setActiveMenu] = useState('My Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sidebar Menu Items (consistent layout)
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/farmer' },
    { name: 'My Products', icon: Package, href: '/dashboard/farmer/products' },
    { name: 'Add Product', icon: PlusCircle, href: '/dashboard/farmer/add-product' },
    { name: 'Orders', icon: ShoppingBag, href: '/dashboard/farmer/orders' },
    { name: 'Chat', icon: MessageSquare, href: '/dashboard/farmer/chat' },
    { name: 'Crop Disease Detection', icon: Activity, href: '/dashboard/farmer/disease-detect' },
    { name: 'AI Assistant', icon: Cpu, href: '/dashboard/farmer/ai' },
    { name: 'Profile', icon: UserIcon, href: '/dashboard/farmer/profile' },
  ];

  // Dummy products list matching farmer's inventory
  const [products, setProducts] = useState([
    {
      id: 'prod-1',
      name: 'Organic Heirloom Tomatoes',
      category: 'Vegetables',
      price: 3.50,
      unit: 'kg',
      stock: 250,
      status: 'Active',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
    },
    {
      id: 'prod-2',
      name: 'Premium Golden Wheat',
      category: 'Grains',
      price: 1.80,
      unit: 'kg',
      stock: 1200,
      status: 'Active',
      isOrganic: false,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    },
    {
      id: 'prod-3',
      name: 'Fresh Organic Spinach',
      category: 'Vegetables',
      price: 2.20,
      unit: 'bundle',
      stock: 0,
      status: 'Out of Stock',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    },
    {
      id: 'prod-4',
      name: 'Sweet Honeycrisp Apples',
      category: 'Fruits',
      price: 4.00,
      unit: 'kg',
      stock: 85,
      status: 'Draft',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
    },
    {
      id: 'prod-5',
      name: 'Organic Russet Potatoes',
      category: 'Vegetables',
      price: 2.50,
      unit: 'bag',
      stock: 140,
      status: 'Active',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
    },
    {
      id: 'prod-6',
      name: 'Fresh Sweet Corn',
      category: 'Vegetables',
      price: 1.20,
      unit: 'ear',
      stock: 450,
      status: 'Active',
      isOrganic: false,
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d20f6?w=400&h=300&fit=crop',
    },
  ]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success(`${name} deleted successfully`);
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Draft' : 'Active';
    setProducts(
      products.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );
    toast.success(`Product status updated to ${nextStatus}`);
  };

  // Filter products based on inputs
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      
      <div className="flex flex-1">
        
        {/* ── Left Sidebar (Consistent Dashboard Theme) ───────── */}
        <aside className="w-64 border-r border-[#e4e6df] bg-[#f4f5f0] flex flex-col justify-between p-6 shrink-0 min-h-screen">
          <div className="space-y-8">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1e4d1e] flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-[#1e4d1e] text-base leading-tight">AgriGrowthRate</h2>
                <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Modern Stewardship</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setActiveMenu(item.name)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#cde8c8]/70 text-[#1e4d1e] shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* New Harvest Button */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl transition-colors shadow-md text-sm mt-8">
            <Sprout className="w-4 h-4" />
            <span>New Harvest</span>
          </button>
        </aside>

        {/* ── Right Dashboard Layout ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <header className="h-16 border-b border-[#e4e6df] bg-white flex items-center justify-between px-8 shrink-0">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search farm analytics, orders, or crops..."
                className="w-full pl-9 pr-4 py-2 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
              />
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-6">
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-[#e4e6df]" />

              {/* Farmer Profile Avatar */}
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

          {/* Main Panel Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            
            {/* Header / Page Title with Add button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                  <Link href="/dashboard/farmer" className="hover:text-gray-700">Dashboard</Link>
                  <span>/</span>
                  <span className="text-[#1e4d1e]">My Products</span>
                </div>
                <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
                  My Products
                </h1>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Manage and track your listed agricultural products, inventory status, and marketplace visibility.
                </p>
              </div>

              {/* Add Product Button */}
              <Link
                href="/dashboard/farmer/add-product"
                className="flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </Link>
            </div>

            {/* Filter and search bar */}
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
                {/* Category Filter */}
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
                  </select>
                </div>

                {/* Status Filter */}
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

            {/* Products grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                  >
                    
                    {/* Header Image + Badges */}
                    <div className="relative h-48 w-full">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        
                        {/* Status Badge */}
                        <span
                          className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider shadow-sm uppercase ${
                            p.status === 'Active'
                              ? 'bg-green-500 text-white'
                              : p.status === 'Out of Stock'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-500 text-white'
                          }`}
                        >
                          {p.status}
                        </span>

                        {/* Organic Badge */}
                        {p.isOrganic && (
                          <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-md bg-[#edf4e2] text-[#4A6D2F] tracking-wider shadow-sm">
                            ORGANIC
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">{p.category}</span>
                        <h3 className="font-bold text-gray-900 mt-1 text-base">{p.name}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-y border-[#f4f5f0] text-sm">
                          <div>
                            <p className="text-xs text-gray-400 font-semibold">Price</p>
                            <p className="font-extrabold text-gray-900 mt-0.5">${p.price.toFixed(2)} / {p.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-semibold">Stock</p>
                            <p className="font-extrabold text-gray-900 mt-0.5">
                              {p.stock > 0 ? `${p.stock} ${p.unit}s` : <span className="text-red-500">None</span>}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex gap-2 mt-4 pt-1">
                        <button
                          onClick={() => toggleStatus(p.id, p.status)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{p.status === 'Active' ? 'Unlist' : 'List'}</span>
                        </button>
                        
                        <button
                          onClick={() => toast.success(`Editing ${p.name}`)}
                          className="w-10 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="w-10 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="bg-white border border-[#e4e6df] rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                  We couldn&apos;t find any products matching your search or filters. Try adjusting your query or list a new product.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('All');
                    setStatusFilter('All');
                  }}
                  className="bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
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
