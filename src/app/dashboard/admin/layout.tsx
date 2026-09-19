'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Zap, 
  LogOut, 
  User,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardHeader from '@/components/DashboardHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainSidebarMenus = [
    { label: 'Dashboard', href: '/dashboard/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Farmers', href: '/dashboard/admin/farmers', icon: Users },
    { label: 'Manage Retailers', href: '/dashboard/admin/retailers', icon: Users },
    { label: 'Manage Products', href: '/dashboard/admin/products', icon: Package },
    { label: 'Orders Monitoring', href: '/dashboard/admin/orders', icon: ShoppingCart },
    { label: 'Reports / Analytics', href: '/dashboard/admin/reports', icon: BarChart3 },
    { label: 'AI Management', href: '/dashboard/admin/ai', icon: Zap },
    { label: 'Profile', href: '/dashboard/admin/profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/admin/dashboard') {
      return pathname === '/dashboard/admin/dashboard' || pathname === '/dashboard/admin';
    }
    return pathname.startsWith(href);
  };

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

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      <div className="flex flex-1">

        {/* ── Left Desktop Sidebar ── */}
        <aside className="hidden md:flex w-[220px] bg-[#edf4e2] flex-col justify-between pt-8 pb-4 shrink-0 min-h-screen">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center px-6">
              <Link href="/dashboard/admin/dashboard" className="block select-none w-full">
                <img src="/logo.png" alt="Logo" className="w-full h-10 object-contain object-center" />
              </Link>
            </div>

            {/* Navigation links */}
            <nav className="pl-4 space-y-1 pr-0">
              {mainSidebarMenus.map((menu) => {
                const Icon = menu.icon;
                const active = isActive(menu.href);
                const activeBgColorClass = 'bg-[#f9f9f6]';
                const shadowColorHex = '#f9f9f6';

                return (
                  <Link key={menu.href} href={menu.href} className="block">
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
                        <span className="text-[13px] tracking-wide">{menu.label}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom: Logout */}
          <div className="space-y-3 mt-8 px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 font-bold rounded-xl transition-colors text-[12px] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ── Mobile Slide-over Drawer ── */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer Content */}
            <aside className="relative w-[260px] bg-[#edf4e2] flex flex-col justify-between pt-6 pb-4 z-10 shadow-2xl h-full">
              <div className="space-y-6 overflow-y-auto">
                {/* Header with Logo */}
                <div className="flex items-center justify-between px-6">
                  <Link href="/dashboard/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block select-none">
                    <img src="/logo.png" alt="Logo" className="w-auto h-8 object-contain" />
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#1e4d1e] hover:bg-white/40 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Items */}
                <nav className="px-4 space-y-1">
                  {mainSidebarMenus.map((menu) => {
                    const Icon = menu.icon;
                    const active = isActive(menu.href);
                    return (
                      <Link
                        key={menu.href}
                        href={menu.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-colors ${
                          active ? 'bg-[#1e4d1e] text-white shadow-sm' : 'text-[#1e4d1e]/80 hover:bg-white/40'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{menu.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Logout */}
              <div className="px-4 pt-4 border-t border-[#d2dfc2]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl font-bold text-xs hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* ── Right Dashboard Layout ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeader onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
