'use client';

import { useState } from 'react';
import Link from 'next/link';
import FarmerSidebar from '@/components/FarmerSidebar';
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
  Calendar,
  Download,
  MoreVertical,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Dummy orders data matching screenshot exactly
  const initialOrders = [
    {
      id: '#AGR-29384',
      customer: 'Elena Mitchell',
      initials: 'EM',
      bgColor: 'bg-emerald-100 text-emerald-700',
      product: 'Premium Organic Wheat',
      quantity: '500 kg',
      price: '$1,250.00',
      status: 'COMPLETED',
      statusClass: 'bg-[#edf4e2] text-[#4A6D2F]',
      date: 'Oct 24, 2023',
    },
    {
      id: '#AGR-29385',
      customer: 'Julian Sterling',
      initials: 'JS',
      bgColor: 'bg-blue-100 text-blue-700',
      product: 'Heirloom Tomato Seeds',
      quantity: '15 Units',
      price: '$450.00',
      status: 'PENDING',
      statusClass: 'bg-amber-50 text-amber-600',
      date: 'Oct 25, 2023',
    },
    {
      id: '#AGR-29386',
      customer: 'Aria Halloway',
      initials: 'AH',
      bgColor: 'bg-purple-100 text-purple-700',
      product: 'Sustainable Fertilizer Mix',
      quantity: '20 Bags',
      price: '$3,200.00',
      status: 'COMPLETED',
      statusClass: 'bg-[#edf4e2] text-[#4A6D2F]',
      date: 'Oct 25, 2023',
    },
    {
      id: '#AGR-29387',
      customer: 'Marcus Thorne',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
      product: 'Winter Barley Seedlings',
      quantity: '1,200 Units',
      price: '$8,450.00',
      status: 'PENDING',
      statusClass: 'bg-amber-50 text-amber-600',
      date: 'Oct 26, 2023',
    },
    {
      id: '#AGR-29388',
      customer: 'Lydia West',
      initials: 'LW',
      bgColor: 'bg-pink-100 text-pink-700',
      product: 'Drip Irrigation Kit',
      quantity: '2 Sets',
      price: '$590.00',
      status: 'COMPLETED',
      statusClass: 'bg-[#edf4e2] text-[#4A6D2F]',
      date: 'Oct 26, 2023',
    },
  ];

  const handleExport = () => {
    toast.success('Orders data exported successfully! 📊');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      
      <div className="flex flex-1">
        
        {/* ── Left Sidebar (Consistent Dashboard Theme) ───────── */}
        <FarmerSidebar activeMenu="Orders" />

        {/* ── Right Dashboard Layout ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <header className="h-16 border-b border-[#e4e6df] bg-white flex items-center justify-between px-8 shrink-0">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

              {/* Silas Thorne Avatar matching mock exactly */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Silas Thorne</h4>
                  <span className="text-[10px] font-extrabold text-[#4A6D2F] tracking-wide uppercase">Chief Steward</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                  alt="Silas Thorne Profile"
                  className="w-9 h-9 rounded-full object-cover border border-[#e4e6df]"
                />
              </div>
            </div>
          </header>

          {/* Main Dashboard Panel */}
          <main className="flex-1 p-8 overflow-y-auto">
            
            {/* Header Title with floating mini statistics widgets */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
                  Orders Management
                </h1>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Oversee your agricultural trade and fulfillment logistics.
                </p>
              </div>

              {/* Small header metric panels */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Pending */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex items-center gap-4 shadow-sm w-36">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400">Pending</span>
                    <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">24</h4>
                  </div>
                </div>

                {/* Completed */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex items-center gap-4 shadow-sm w-36">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#1e4d1e]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400">Completed</span>
                    <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">1,482</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter control bar */}
            <div className="bg-white border border-[#e4e6df] rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button className="flex items-center gap-2 bg-[#f4f5f0] border border-[#e4e6df] px-4 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span>Filter</span>
                </button>

                <button className="flex items-center gap-2 bg-[#f4f5f0] border border-[#e4e6df] px-4 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Last 30 Days</span>
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Orders Details Table */}
            <div className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f4f5f0]/50 border-b border-[#e4e6df] text-xs font-bold text-gray-500">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer Name</th>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Quantity</th>
                      <th className="py-4 px-6">Total Price</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f5f0]">
                    {initialOrders.map((ord) => (
                      <tr key={ord.id} className="text-xs text-gray-700 hover:bg-[#f9f9f6]/40 transition-colors">
                        {/* Order ID */}
                        <td className="py-4 px-6 font-bold font-mono text-[#1e4d1e]">{ord.id}</td>
                        
                        {/* Customer */}
                        <td className="py-4 px-6 font-bold text-gray-900">
                          <div className="flex items-center gap-2.5">
                            {ord.image ? (
                              <img
                                src={ord.image}
                                alt={ord.customer}
                                className="w-7 h-7 rounded-full object-cover border border-[#e4e6df]"
                              />
                            ) : (
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold ${ord.bgColor}`}>
                                {ord.initials}
                              </div>
                            )}
                            <span>{ord.customer}</span>
                          </div>
                        </td>

                        {/* Product */}
                        <td className="py-4 px-6 font-medium text-gray-900">{ord.product}</td>
                        
                        {/* Quantity */}
                        <td className="py-4 px-6 font-bold text-gray-500">{ord.quantity}</td>
                        
                        {/* Total Price */}
                        <td className="py-4 px-6 font-extrabold text-gray-900">{ord.price}</td>
                        
                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md tracking-wider ${ord.statusClass}`}>
                            {ord.status}
                          </span>
                        </td>
                        
                        {/* Date */}
                        <td className="py-4 px-6 font-medium text-gray-400">{ord.date}</td>
                        
                        {/* Action Dots */}
                        <td className="py-4 px-6">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table pagination stats footer */}
              <div className="bg-[#f4f5f0]/30 border-t border-[#e4e6df] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] font-semibold text-gray-400">Showing 1 to 5 of 1,506 orders</span>
                
                {/* Pages selection stack */}
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg border border-[#e4e6df] bg-white text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-[#1e4d1e] text-white flex items-center justify-center font-bold">
                    1
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-[#e4e6df] bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold">
                    2
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-[#e4e6df] bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold">
                    3
                  </button>
                  <span className="text-gray-400 px-1 font-semibold">...</span>
                  <button className="w-8 h-8 rounded-lg border border-[#e4e6df] bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold">
                    302
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-[#e4e6df] bg-white text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Row Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1: Top Selling Crop */}
              <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-40">
                <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">Top Selling This Week</span>
                
                <div className="flex items-center gap-4 my-2">
                  <div className="w-11 h-11 rounded-xl bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center text-[#1e4d1e]">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900 leading-snug">Organic Alfalfa</h4>
                    <span className="text-[11px] text-gray-400 font-semibold mt-0.5 block">124 Orders</span>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1e4d1e] h-full w-[78%] rounded-full" />
                </div>
              </div>

              {/* Box 2: Revenue Growth */}
              <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-start justify-between h-40">
                <div className="flex flex-col justify-between h-full">
                  <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">Revenue Growth</span>
                  
                  <div className="mt-2">
                    <h3 className="text-xl font-extrabold text-gray-900">$12,840.00</h3>
                    <span className="text-[9px] font-extrabold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md mt-1.5 inline-block">
                      +12.4% vs last week
                    </span>
                  </div>
                </div>

                {/* Small bar graphics matching mockup */}
                <div className="flex items-end gap-1 h-20 self-end">
                  <div className="w-2.5 bg-gray-200 rounded-t h-[30%]" />
                  <div className="w-2.5 bg-gray-300 rounded-t h-[45%]" />
                  <div className="w-2.5 bg-[#d2dfc2] rounded-t h-[60%]" />
                  <div className="w-2.5 bg-[#4A6D2F] rounded-t h-[75%]" />
                  <div className="w-2.5 bg-[#1e4d1e] rounded-t h-[95%]" />
                </div>
              </div>

              {/* Box 3: Fulfillment Rate */}
              <div className="bg-[#1e4d1e] text-white rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
                <span className="text-[10px] font-extrabold text-white/50 tracking-wider uppercase">Fulfillment Rate</span>
                
                <div className="mt-2 z-10">
                  <h3 className="text-4xl font-extrabold text-white">98.2%</h3>
                  <span className="text-[10px] text-white/70 mt-1 block">Average processing time: 4.2h</span>
                </div>

                {/* Stars Sparkles Watermark Icon matches mock */}
                <div className="absolute bottom-4 right-4 text-white/10 select-none">
                  <Sparkles className="w-20 h-20" />
                </div>
              </div>

            </div>

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
