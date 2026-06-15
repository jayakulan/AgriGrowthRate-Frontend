'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  TrendingUp,
  CloudSun,
  Truck,
  Plus,
  Scan,
  Compass,
} from 'lucide-react';

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const userName = user?.name || 'Thomas';

  const activities = [
    {
      id: 1,
      type: 'harvest',
      image: 'https://images.unsplash.com/photo-1622206193988-72439c2794eb?w=80&h=80&fit=crop',
      title: 'Harvest Completed: Heirloom Lettuce',
      details: 'Batch #8821 was successfully recorded. Estimated yield: 450kg.',
      time: '2 hours ago',
      badge: 'SUCCESS',
      badgeClass: 'bg-[#edf4e2] text-[#4A6D2F]',
    },
    {
      id: 2,
      type: 'order',
      icon: Truck,
      title: 'New Order Received: Premium Wheat',
      details: 'Order #ORD-2044 from Miller Bakery Co. awaits confirmation.',
      time: '5 hours ago',
      badge: 'NEW',
      badgeClass: 'bg-[#edf4e2] text-[#4A6D2F]',
    },
    {
      id: 3,
      type: 'diagnostic',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=80&h=80&fit=crop',
      title: 'Soil Scan Diagnostic',
      details: 'Nitrogen levels in South Plot are slightly low. Recommended treatment available.',
      time: 'Yesterday',
      badge: 'ACTION',
      badgeClass: 'bg-red-50 text-red-600',
    },
  ];
  return (
    <div className="p-8">
            
            {/* Header Greeting */}
            <div className="flex items-start justify-between mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-[#1e4d1e] tracking-tight leading-tight">
                  Hi, {userName}.
                </h1>
                
              </div>

              {/* Weather Pill */}
              <div className="flex items-center gap-2 bg-[#edf4e2] text-[#4A6D2F] px-4 py-2 rounded-full text-sm font-semibold border border-[#d2dfc2] shrink-0">
                <CloudSun className="w-4 h-4 text-[#4A6D2F]" />
                <span>24°C Sunny</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Card 1: Total Products */}
              <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e]">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">+4% this week</span>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">24</span>
                  <p className="text-xs font-semibold text-gray-400 mt-1">Total Products</p>
                </div>
                {/* Subtle graphic background node */}
                <div className="absolute bottom-[-10px] right-[-10px] opacity-5 text-gray-300">
                  <Sprout className="w-24 h-24" />
                </div>
              </div>

              {/* Card 2: Active Orders */}
              <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">8 pending</span>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">12</span>
                  <p className="text-xs font-semibold text-gray-400 mt-1">Active Orders</p>
                </div>
                {/* Subtle graphic background node */}
                <div className="absolute bottom-[-10px] right-[-10px] opacity-5 text-gray-300">
                  <Truck className="w-24 h-24" />
                </div>
              </div>

              {/* Card 3: Total Earnings */}
              <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <Link href="#" className="text-xs font-bold text-[#1e4d1e] hover:underline">View report</Link>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">$4,250.00</span>
                  <p className="text-xs font-semibold text-gray-400 mt-1">Total Earnings</p>
                </div>
                {/* Subtle graphic background node */}
                <div className="absolute bottom-[-10px] right-[-10px] opacity-5 text-gray-300">
                  <TrendingUp className="w-24 h-24" />
                </div>
              </div>

            </div>

            {/* Split layout: Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Recent Activity */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  <Link href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">View All</Link>
                </div>

                <div className="space-y-3">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex items-center justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        {act.image ? (
                          <img
                            src={act.image}
                            alt={act.title}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#f4f5f0] border border-[#e4e6df] flex items-center justify-center text-[#1e4d1e]">
                            {act.icon && <act.icon className="w-5 h-5" />}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 leading-snug">{act.title}</h4>
                          <p className="text-xs text-gray-400 mt-0.5 max-w-md">{act.details}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[9px] font-extrabold px-2 py-1 rounded-md tracking-wider ${act.badgeClass}`}>
                          {act.badge}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Sidebar Panels */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  
                  {/* Buttons stack */}
                  <div className="space-y-3">
                    
                    {/* Add Product Banner */}
                    <Link href="/dashboard/farmer/add-product" className="w-full flex items-center justify-between p-4 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-2xl text-left transition-colors shadow-sm group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <Plus className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">Add Product</h4>
                          <p className="text-xs text-white/70 mt-0.5">List new harvest to marketplace</p>
                        </div>
                      </div>
                      <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {/* Scan Crop Banner */}
                    <Link href="/dashboard/farmer/disease-detect" className="w-full flex items-center justify-between p-4 bg-[#4e6a4e] hover:bg-[#435e43] text-white rounded-2xl text-left transition-colors shadow-sm group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <Scan className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">Scan Crop</h4>
                          <p className="text-xs text-white/70 mt-0.5">Analyze plant health with AI</p>
                        </div>
                      </div>
                      <Compass className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                  </div>
                </div>

                {/* Marketplace Status */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-gray-900">Marketplace Status</h4>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  
                  {/* Custom progress bar */}
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1.5">
                    <div className="w-2/3 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1e4d1e] h-full w-[85%] rounded-full" />
                    </div>
                    <span>85% Active</span>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-medium">
                    Your profile visibility is high. Average response time: <span className="text-gray-800 font-bold">14 mins</span>.
                  </p>
                </div>

                {/* Growth Forecast */}
                <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#e4e6df] flex items-center justify-center text-[#1e4d1e]">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-extrabold text-[#1e4d1e] tracking-tight">Growth Forecast</h4>
                    
                    <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Optimal Temp Range</span>
                        <span className="font-bold text-gray-800">18°C - 26°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Soil Moisture Target</span>
                        <span className="font-bold text-gray-800">45%</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

    </div>
  );
}
