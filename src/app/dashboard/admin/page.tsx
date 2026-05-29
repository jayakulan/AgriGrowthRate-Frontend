'use client';

import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import axios from 'axios';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  UserPlus, 
  ShoppingBag, 
  AlertTriangle, 
  MessageSquare, 
  ChevronRight,
  TrendingDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(false);

  // Revenue chart mock data matching mock overview months
  const revenueData = [
    { name: 'JAN', value: 2400 },
    { name: 'FEB', value: 3100 },
    { name: 'MAR', value: 2800 },
    { name: 'APR', value: 4500 },
    { name: 'MAY', value: 4000 },
    { name: 'JUN', value: 5600 },
  ];

  // User distribution statistics for Doughnut
  const userDistribution = [
    { name: 'Farmers', value: 65, color: '#1e4d1e' },
    { name: 'Retailers', value: 25, color: '#4A6D2F' },
    { name: 'Logistics', value: 10, color: '#90b47a' },
  ];

  // Quick action alerts
  const handleViewAllActivities = () => {
    toast.success('Navigating to full audit log view...');
  };

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto">
        
        {/* ── METRICS CARD ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Active Farmers */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <Users className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Total Active Farmers
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">
                  14,282
                </h3>
              </div>

              {/* Trending growth status */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5%</span>
              </div>
            </div>

            {/* Simulated premium indicator bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>

          {/* Card 2: Cataloged Products */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <Package className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Cataloged Products
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">
                  3,891
                </h3>
              </div>

              {/* Trending growth status */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.2%</span>
              </div>
            </div>

            {/* Simulated premium indicator bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#4A6D2F] rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Card 3: Active Harvest Orders */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <ShoppingCart className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Active Harvest Orders
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">
                  842
                </h3>
              </div>

              {/* Trending growth status */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.9%</span>
              </div>
            </div>

            {/* Simulated premium indicator bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

        </div>

        {/* ── MIDDLE GRID (REVENUE & RECENT ACTIVITIES) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Revenue Growth Card (col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-4">
              <div className="text-left space-y-0.5">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Revenue Growth
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold">
                  Monthly yield financial distribution
                </p>
              </div>

              {/* Dropdown selector */}
              <select className="bg-[#f4f5f0] border border-[#e4e6df] rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>

            {/* Gorgeous responsive Area Chart in signature green theme */}
            <div className="w-full h-64 mt-4 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e4d1e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1e4d1e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ background: '#1e4d1e', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#bcfcbb' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1e4d1e" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities Panel (col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
            <div className="border-b border-[#f4f5f0] pb-4">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider text-left">
                Recent Activities
              </h3>
            </div>

            {/* List of activity elements */}
            <div className="space-y-4.5 my-4">
              
              {/* Activity 1: New Farmer */}
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-gray-800 leading-snug">
                    New Farmer Registered
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold truncate leading-none">
                    Elena Vance (Vineyard Sector)
                  </p>
                  <p className="text-[9px] text-[#4A6D2F] font-bold">
                    2 mins ago
                  </p>
                </div>
              </div>

              {/* Activity 2: Large Order Completed */}
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-[#4A6D2F]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-gray-800 leading-snug">
                    Large Order Completed
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold truncate leading-none">
                    500 units Organic Wheat #2094
                  </p>
                  <p className="text-[9px] text-[#4A6D2F] font-bold">
                    14 mins ago
                  </p>
                </div>
              </div>

              {/* Activity 3: Inventory Alert */}
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-gray-800 leading-snug">
                    Inventory Alert
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold truncate leading-none">
                    Fertilizer Grade A is below threshold
                  </p>
                  <p className="text-[9px] text-red-500 font-bold">
                    45 mins ago
                  </p>
                </div>
              </div>

              {/* Activity 4: AI Report Generated */}
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-gray-800 leading-snug">
                    AI Report Generated
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold truncate leading-none">
                    Yield prediction for Q3 is ready
                  </p>
                  <p className="text-[9px] text-[#4A6D2F] font-bold">
                    2 hours ago
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom View All Link */}
            <button
              onClick={handleViewAllActivities}
              className="w-full py-2.5 bg-[#f4f5f0] hover:bg-[#edf4e2] text-[#1e4d1e] font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 select-none"
            >
              <span>View All Activities</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* ── BOTTOM ROW (DISTRIBUTION, SUSTAINABILITY & HEATMAP) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* User Distribution Card (col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm space-y-5 h-64 flex flex-col justify-between">
            <div className="border-b border-[#f4f5f0] pb-3">
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider text-left">
                User Distribution
              </h3>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Clean Doughnut Chart with center text */}
              <div className="relative w-32 h-32 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={46}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center text hole */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-extrabold text-gray-800 leading-none">14.2k</span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Total</span>
                </div>
              </div>

              {/* Dynamic Labels Legend */}
              <div className="space-y-2.5 text-left shrink-0">
                {userDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-gray-500 min-w-14 truncate">{item.name}</span>
                    <span className="text-xs font-extrabold text-gray-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sustainability Index Panel (col-span-4) */}
          <div className="lg:col-span-4 bg-[#1e4d1e] rounded-[24px] p-6 text-white h-64 flex flex-col justify-between relative overflow-hidden shadow-md">
            
            {/* Watermark leaf logo overlay bottom right */}
            <div className="absolute -bottom-8 -right-8 w-28 h-28 opacity-10 pointer-events-none select-none">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full text-white">
                <path d="M17 8C8 10 9 19 9 19S6 12 7 8C8 4 14 3 17 3S18 3 17 8M12 17C12 17 14.5 13.5 16 11C17.5 8.5 18 5 18 5S15 6.5 13 9C11 11.5 12 17 12 17M6 14C8 14 9 12 9 12S7.5 10 5.5 10C3.5 10 4 14 6 14Z" />
              </svg>
            </div>

            <div className="border-b border-white/10 pb-3 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">
                Sustainability Index
              </h3>
            </div>

            <div className="text-left space-y-1 my-4">
              <h2 className="text-4xl font-extrabold tracking-tight">
                94/100
              </h2>
            </div>

            <div className="text-left text-xs font-bold text-[#bcfcbb]/90 flex items-center gap-1.5 select-none">
              <Sparkles className="w-4 h-4 text-[#bcfcbb]" />
              <span>Exceeding Q2 goals</span>
            </div>
          </div>

          {/* Market Heatmap Panel (col-span-4) */}
          <div className="lg:col-span-4 bg-[#eceee8] border border-[#d2dfc2] rounded-[24px] p-6 h-64 flex flex-col justify-between">
            <div className="border-b border-[#d2dfc2]/60 pb-3 text-left">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Market Heatmap
              </h3>
            </div>

            {/* Clean mock column volume bars */}
            <div className="flex items-end justify-between gap-2.5 px-2 my-auto h-24 select-none">
              {[40, 65, 50, 90, 75, 60].map((val, i) => (
                <div key={i} className="flex-1 bg-[#b5c7a9] rounded-t-md hover:bg-[#1e4d1e] transition-colors" style={{ height: `${val}%` }} />
              ))}
            </div>

            <div className="text-left text-[11px] font-extrabold text-[#1e4d1e] uppercase tracking-wider">
              High Demand in North Sector
            </div>
          </div>

        </div>

        {/* ── TOP MERCHANT OF THE MONTH BANNER (Full Width Footer Widget) ── */}
        <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="relative shrink-0 select-none">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=256&h=256"
                alt="Top Merchant"
                className="w-12 h-12 rounded-full object-cover border border-[#edf4e2] shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1e4d1e] border border-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Top Merchant of the Month
              </p>
              <h4 className="text-sm font-extrabold text-[#1e4d1e]">
                Green Valley Cooperatives
              </h4>
            </div>
          </div>

          {/* Right Volume stats */}
          <div className="text-center sm:text-right space-y-0.5 shrink-0">
            <h3 className="text-lg font-extrabold text-gray-900 leading-none">
              $42,900
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Total Volume
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
