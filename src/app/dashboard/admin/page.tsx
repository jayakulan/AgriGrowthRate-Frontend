'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  UserPlus, 
  ShoppingBag, 
  AlertTriangle, 
  MessageSquare, 
  ChevronRight
} from 'lucide-react';
import DailyLogisticsCard from '@/components/DailyLogisticsCard';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const userName = user?.name || 'Thomas';
  const [range, setRange] = useState<'1M'|'6M'|'1Y'>('6M');
  // Revenue chart mock data matching mock overview months
  const revenueData = [
    { name: 'JAN', value: 2400 },
    { name: 'FEB', value: 3100 },
    { name: 'MAR', value: 2800 },
    { name: 'APR', value: 4500 },
    { name: 'MAY', value: 4000 },
    { name: 'JUN', value: 5600 },
  ];

  // add index to data for custom shapes
  const displayedDataWithIndex = revenueData.map((d, i) => ({ ...d, __i: i }));

  // compute displayed data based on selected range
  const displayedData = (() => {
    if (range === '1M') return [revenueData[revenueData.length - 1]];
    // '1Y' and '6M' currently show the same mock 6 months data
    return revenueData;
  })();

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Custom bar shape that draws the main rect and a shining top line
  const CustomBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    const idx = payload?.__i ?? 0;
    const isHovered = hoveredBar === idx;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={8}
          fill={isHovered ? 'var(--brand-dark)' : '#d9e0ce'}
          onMouseEnter={() => setHoveredBar(idx)}
          onMouseLeave={() => setHoveredBar(null)}
        />
        {/* top shining line */}
        <rect x={x} y={y} width={width} height={6} rx={3} className={`bar-shine-top ${isHovered ? 'hovered' : ''}`} />
      </g>
    );
  };

  // Quick action alerts
  const handleViewAllActivities = () => {
    toast.success('Navigating to full audit log view...');
  };

  return (
    <>
      <div className="p-8 bg-panel min-h-screen space-y-8 max-w-7xl mx-auto">
        
        {/* ── METRICS CARD ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: Active Farmers */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <Users className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Active Farmers
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

          {/* Card 2: Active Retailers */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <Package className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Active Retailers
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

          {/* Card 3: Cataloged Products */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <ShoppingCart className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Cataloged Products
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

          {/* Card 4: Active Orders */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <ShoppingBag className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">Active Orders</p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">1,204</h3>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+7.3%</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

        </div>

        

        {/* ── REVENUE SECTION (full width) ── */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white-acc border border-global rounded-[24px] p-6 shadow-sm space-y-6 flex flex-col justify-between">
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
              <select value={range} onChange={(e) => setRange(e.target.value as any)} className="bg-[#f4f5f0] border border-[#e4e6df] rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="1M">Last Month</option>
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
              </select>
            </div>

            {/* Bar chart (large) */}
            <div className="w-full h-72 mt-4 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayedDataWithIndex} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#1e4d1e', strokeWidth: 1.5, className: 'chart-axis-shine' }} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#1e4d1e', strokeWidth: 1.5, className: 'chart-axis-shine' }} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--brand-dark)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff', fontWeight: 700 }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="value" radius={[6,6,0,0]} shape={<CustomBar />}>
                    { /* CustomBar handles hover and visuals */ }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ── BOTTOM SPLIT: Recent Activity (left) + Operations Overview (right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Activities (left) */}
          <div className="bg-white-acc border border-global rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
            <div className="border-b border-[#f4f5f0] pb-4">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider text-left">
                Recent Activity
              </h3>
            </div>

            <div className="space-y-4.5 my-4">
              {/* Reuse the activity items from previous layout */}
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-sidebar border border-[#d2dfc2] flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4 text-brand-dark" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-primary leading-snug">New Farmer Registered</p>
                  <p className="text-[10px] text-muted font-semibold truncate leading-none">Elena Vance (Vineyard Sector)</p>
                  <p className="text-[9px] text-brand-dark font-bold">2 mins ago</p>
                </div>
              </div>

              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-sidebar border border-[#d2dfc2] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-[var(--brand-dark)]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-primary leading-snug">Large Order Completed</p>
                  <p className="text-[10px] text-muted font-semibold truncate leading-none">500 units Organic Wheat #2094</p>
                  <p className="text-[9px] text-brand-dark font-bold">14 mins ago</p>
                </div>
              </div>

              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-primary leading-snug">Inventory Alert</p>
                  <p className="text-[10px] text-muted font-semibold truncate leading-none">Fertilizer Grade A is below threshold</p>
                  <p className="text-[9px] text-red-500 font-bold">45 mins ago</p>
                </div>
              </div>

              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-sidebar border border-[#d2dfc2] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-brand-dark" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-primary leading-snug">AI Report Generated</p>
                  <p className="text-[10px] text-muted font-semibold truncate leading-none">Yield prediction for Q3 is ready</p>
                  <p className="text-[9px] text-brand-dark font-bold">2 hours ago</p>
                </div>
              </div>

            </div>

            <button onClick={handleViewAllActivities} className="w-full py-2.5 bg-[#f4f5f0] hover:bg-sidebar text-brand-dark font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 select-none">
              <span>View All Activities</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right side: Logistics summary card */}
          <div className="h-full">
            <DailyLogisticsCard />
          </div>

        </div>

      </div>
    </>
  );
}
