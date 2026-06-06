'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  MessageSquare,
  Sparkles,
  User as UserIcon,
  Search,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/consumer' },
  { name: 'Browse Products', icon: ShoppingBag, href: '/dashboard/consumer/browse-products' },
  { name: 'Orders', icon: ShoppingCart, href: '/dashboard/consumer/orders' },
  { name: 'Chat', icon: MessageSquare, href: '/dashboard/consumer/chat' },
  { name: 'Recommendations', icon: Sparkles, href: '/dashboard/consumer/recommendations' },
  { name: 'Profile', icon: UserIcon, href: '/dashboard/consumer/profile' },
];

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [cartCount] = useState(3);

  const isActive = (href: string) => {
    if (href === '/dashboard/consumer') return pathname === '/dashboard/consumer';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      <div className="flex flex-1">

        {/* ── Left Sidebar ───────────────────────────────────── */}
        <aside className="w-[220px] border-r border-[#e4e6df] bg-white flex flex-col justify-between py-8 px-5 shrink-0 min-h-screen">
          <div className="space-y-8">

            {/* Logo / Brand */}
            <div className="px-1">
              <img src="/logo.png" alt="Logo" className="w-full h-10 object-contain object-left" />
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                      active
                        ? 'text-[#1e4d1e] bg-transparent'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {/* Active left bar indicator */}
                    {active && (
                      <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#1e4d1e] rounded-r-full" />
                    )}
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom: User Profile Card & Logout Stack */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#1e4d1e] rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[12px] font-bold text-white leading-tight truncate">{user?.name || 'Consumer'}</h4>
                <p className="text-[10px] text-white/60 font-medium">Premium Buyer</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 font-bold rounded-xl transition-colors text-[12px] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ── Right Content Area ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top Navbar */}
          <header className="h-16 border-b border-[#e4e6df] bg-white flex items-center justify-between px-8 shrink-0">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for organic fertilizers, seeds, or equipment..."
                className="w-full pl-9 pr-4 py-2 bg-[#f4f5f0] border border-[#e4e6df] rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e] transition-colors"
              />
            </div>

            {/* Right utility actions */}
            <div className="flex items-center gap-4 ml-6">
              <button className="relative text-gray-500 hover:text-gray-900 transition-colors p-1.5">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1.5">
                <Settings className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-[#e4e6df]" />

              {/* Cart Button */}
              <Link
                href="/dashboard/consumer/orders"
                className="flex items-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart ({cartCount})</span>
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
