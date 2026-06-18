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
  HelpCircle,
  LogOut,
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/consumer' },
  { name: 'Browse Products', icon: ShoppingBag, href: '/dashboard/consumer/browse-products' },
  { name: 'Orders', icon: ShoppingCart, href: '/dashboard/consumer/orders' },
  { name: 'Chat', icon: MessageSquare, href: '/dashboard/consumer/chat' },
  { name: 'AI Recommendations', icon: Sparkles, href: '/dashboard/consumer/recommendations' },
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
        <aside className="w-[220px] bg-[#edf4e2] flex flex-col justify-between pt-8 pb-4 shrink-0 min-h-screen">
          <div className="space-y-8">

            {/* Logo / Brand */}
            <div className="px-6 flex justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-10 object-contain object-center" />
            </div>

            {/* Navigation Items */}
            <nav className="pl-4 space-y-1 pr-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const activeBgColorClass = 'bg-[#f9f9f6]';
                const shadowColorHex = '#f9f9f6';

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block"
                  >
                    <div
                      className={`relative flex items-center justify-between px-4 py-3 transition-colors duration-200 cursor-pointer group ${
                        active
                          ? `${activeBgColorClass} text-[#1e4d1e] font-bold rounded-l-3xl`
                          : 'text-[#1e4d1e]/80 hover:text-[#1e4d1e] hover:bg-white/30 mr-4 rounded-3xl'
                      }`}
                    >
                      {active && (
                        <>
                          <div 
                            className="absolute right-0 -top-5 w-5 h-5 bg-transparent rounded-br-[20px] pointer-events-none" 
                            style={{ boxShadow: `10px 10px 0 10px ${shadowColorHex}` }}
                          />
                          <div 
                            className="absolute right-0 -bottom-5 w-5 h-5 bg-transparent rounded-tr-[20px] pointer-events-none" 
                            style={{ boxShadow: `10px -10px 0 10px ${shadowColorHex}` }}
                          />
                        </>
                      )}
                      <div className="flex items-center gap-3">
                        <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${active ? 'text-[#1e4d1e]' : 'text-[#1e4d1e]/70 group-hover:text-[#1e4d1e]'}`} />
                        <span className="text-[13px] tracking-wide">{item.name}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom stack */}
          <div className="space-y-3 mt-8 px-4">
            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 font-bold rounded-xl transition-colors text-[12px] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ── Right Dashboard Layout ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Top Navbar */}
          <DashboardHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
