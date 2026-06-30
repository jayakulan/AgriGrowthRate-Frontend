'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  LogOut,
  Search,
  Bell,
  Settings,
  HelpCircle,
  CloudSun
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardHeader from '@/components/DashboardHeader';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

function FarmerLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const langCtx = useLanguage();
  const t = langCtx ? langCtx.t : (k: string) => k;

  const menuItems = [
    { name: t('menu.dashboard'), icon: LayoutDashboard, href: '/dashboard/farmer' },
    { name: t('menu.myProducts'), icon: Package, href: '/dashboard/farmer/products' },
    { name: t('menu.addProduct'), icon: PlusCircle, href: '/dashboard/farmer/add-product' },
    { name: t('menu.orders'), icon: ShoppingBag, href: '/dashboard/farmer/orders' },
    { name: t('menu.chat'), icon: MessageSquare, href: '/dashboard/farmer/chat' },
    { name: t('menu.diseaseDetect'), icon: Activity, href: '/dashboard/farmer/disease-detect' },
    { name: t('menu.aiAssistant'), icon: Cpu, href: '/dashboard/farmer/ai' },
    { name: t('menu.profile'), icon: UserIcon, href: '/dashboard/farmer/profile' },
    { name: t('menu.weather') || 'Weather', icon: CloudSun, href: '/dashboard/farmer/weather' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      toast.error('Failed to log out');
    }
  };

  const farmerName = user?.name || 'Silas Thorne';
  const farmerAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256';

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      <div className="flex flex-1">

        {/* ── Left Sidebar ───────────────────────────────────── */}
        <aside className="w-[220px] bg-[#edf4e2] flex flex-col justify-between pt-8 pb-4 shrink-0 min-h-screen">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center px-6">
              <Link href="/dashboard/farmer" className="block select-none w-full">
                <img src="/logo.png" alt="Logo" className="w-full h-10 object-contain object-center" />
              </Link>
            </div>

            {/* Menu Items */}
            <nav className="pl-4 space-y-1 pr-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const activeBgColorClass = 'bg-[#f9f9f6]';
                const shadowColorHex = '#f9f9f6';

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block"
                  >
                    <div
                      className={`relative flex items-center justify-between px-4 py-3 transition-colors duration-200 cursor-pointer group ${isActive
                          ? `${activeBgColorClass} text-[#1e4d1e] font-bold rounded-l-3xl`
                          : 'text-[#1e4d1e]/80 hover:text-[#1e4d1e] hover:bg-white/30 mr-4 rounded-3xl'
                        }`}
                    >
                      {isActive && (
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
                        <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? 'text-[#1e4d1e]' : 'text-[#1e4d1e]/70 group-hover:text-[#1e4d1e]'}`} />
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
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 font-bold rounded-xl transition-colors text-[12px] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('menu.logout')}</span>
            </button>
          </div>
        </aside>

        {/* ── Right Dashboard Layout ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Top Navbar */}
          <DashboardHeader />

          {/* Scrollable View Area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <FarmerLayoutContent>{children}</FarmerLayoutContent>
    </LanguageProvider>
  );
}
