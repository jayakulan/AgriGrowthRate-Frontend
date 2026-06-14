'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ClipboardList,
  TrendingUp,
  Headphones,
  Coins,
  Truck,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';

export default function ConsumerDashboardPage() {
  const { user } = useAuth();
  const userName = user?.name || 'Alex';

  const recommendedProducts = [
    {
      id: 1,
      category: 'FERTILIZERS',
      name: 'Prime Bio-Growth Pellets',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      category: 'EQUIPMENT',
      name: 'Precision Steel Trowel',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80',
    },
    {
      id: 3,
      category: 'SEEDS',
      name: 'Heritage Carrot Mix',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      category: 'TECH',
      name: 'Soil Moisture Sensor Pro',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop',
      sale: true,
    },
  ];

  return (
    <div className="p-8 max-w-[1200px]">

      {/* ── Greeting Header ───────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1e4d1e] tracking-tight leading-tight">
            Hi, {userName}.
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here&apos;s your agricultural ecosystem at a glance.
          </p>
        </div>
        <Link
          href="/dashboard/consumer/browse-products"
          className="flex items-center gap-2 bg-[#edf4e2] hover:bg-[#ddebd0] text-[#1e4d1e] px-5 py-2.5 rounded-full text-sm font-bold transition-colors border border-[#d2dfc2]"
        >
          <ShoppingCart className="w-4 h-4" />
          Browse Products
        </Link>
      </div>

      {/* ── Hero Section: Orders + Recent Purchase ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">

        {/* Total Orders Card (spans 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#e4e6df] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[220px]">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e] mb-4">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
            <h2 className="text-5xl font-extrabold text-[#1e4d1e] mt-1">124</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mt-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% from last month</span>
          </div>
          {/* Background image overlay */}
          <div className="absolute top-0 right-0 w-[55%] h-full">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=400&fit=crop"
              alt="Farm field"
              className="w-full h-full object-cover rounded-r-2xl opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
          </div>
        </div>

        {/* Recent Purchase Card (spans 3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[9px] font-extrabold bg-[#edf4e2] text-[#1e4d1e] px-2.5 py-1 rounded-md uppercase tracking-wider">
              Recent Purchase
            </span>
            <span className="text-2xl font-extrabold text-[#1e4d1e]">$249.00</span>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 leading-tight">Eco-Soil Nutrients</h3>
          <p className="text-xs text-gray-400 mt-2 max-w-sm leading-relaxed">
            Batch #GR-2045 was successfully delivered to your primary storage...
          </p>
          <div className="flex items-center gap-3 mt-5">
            <button className="px-5 py-2 border border-[#e4e6df] rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              View Invoice
            </button>
            <button className="px-5 py-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-lg text-xs font-bold transition-colors">
              Track Order
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

        {/* Support Status */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#f4f5f0] flex items-center justify-center text-gray-600">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Support Status</h4>
            </div>
          </div>
          <p className="text-lg font-extrabold text-gray-900">2 Active Tickets</p>
          <p className="text-[11px] text-gray-400 font-medium mt-1">Average response: 24m</p>
        </div>

        {/* Credits */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#f4f5f0] flex items-center justify-center text-gray-600">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Credits</h4>
            </div>
          </div>
          <p className="text-lg font-extrabold text-gray-900">$1,280.50</p>
          <p className="text-[11px] text-gray-400 font-medium mt-1">Earned 46 pts today</p>
        </div>

        {/* Delivery Update */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f4f5f0] flex items-center justify-center text-gray-600">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Delivery Update</h4>
                <p className="text-sm font-extrabold text-gray-900 mt-1">In Transit: Batch #3942</p>
              </div>
            </div>
            <button className="text-xs font-bold text-[#1e4d1e] hover:underline">Track</button>
          </div>
        </div>
      </div>

      {/* ── Recommended for You ───────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">Recommended for You</h2>
          <Link
            href="/dashboard/consumer/browse-products"
            className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            View Marketplace
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative"
            >
              {product.sale && (
                <span className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                  Sale
                </span>
              )}
              <div className="h-40 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-[9px] font-extrabold text-[#1e4d1e] tracking-wider uppercase">
                  {product.category}
                </span>
                <h4 className="text-sm font-bold text-gray-900 mt-1 leading-snug">{product.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-[#e4e6df] pt-6 pb-4 flex items-center justify-between text-xs text-gray-400">
        <p>© 2024 AgriGrowthRate Marketplace Hub. All rights reserved.</p>
        <div className="flex gap-6 font-semibold">
          <Link href="#" className="hover:text-gray-800 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-800 transition-colors">Help Center</Link>
        </div>
      </footer>

      {/* ── Floating Cart FAB ─────────────────────────────── */}
      <Link
        href="/dashboard/consumer/orders"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50"
      >
        <ShoppingCart className="w-6 h-6" />
      </Link>
    </div>
  );
}
