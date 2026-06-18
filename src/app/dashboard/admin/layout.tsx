'use client';

import React from 'react';
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
  Search, 
  Bell, 
  Settings,
  HelpCircle,
  User
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

  const mainSidebarMenus = [
    { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Farmers', href: '/dashboard/admin/farmers', icon: Users },
    { label: 'Manage Retailers', href: '/dashboard/admin/retailers', icon: Users },
    { label: 'Manage Products', href: '/dashboard/admin/products', icon: Package },
    { label: 'Orders Monitoring', href: '/dashboard/admin/orders', icon: ShoppingCart },
    { label: 'Reports / Analytics', href: '/dashboard/admin/reports', icon: BarChart3 },
    { label: 'AI Management', href: '/dashboard/admin/ai', icon: Zap },
    { label: 'Profile', href: '/dashboard/admin/profile', icon: User },
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

  const adminName = user?.name || 'Admin User';
  const adminRole = 'System Administrator';

  return (
    <div className="min-h-screen bg-panel flex flex-col font-sans">
      <div className="flex flex-1">
        
        {/* ── SIDEBAR ── */}
        <aside className="w-[220px] bg-sidebar flex flex-col justify-between pt-8 pb-4 shrink-0 min-h-screen">
          <div className="space-y-8">
            {/* Logo & Header branding matching AgriGrowthRate theme */}
            <div className="flex items-center justify-center px-6">
              <Link href="/dashboard/admin" className="block select-none">
                <img src="/logo.png" alt="Logo" className="w-full h-10 object-contain object-center" />
              </Link>
            </div>

          {/* Navigation links exactly matching the reference design */}
          <nav className="pl-4 space-y-1 pr-0">
            {mainSidebarMenus.map((menu) => {
              const Icon = menu.icon;
              const isActive = pathname === menu.href;
              const activeBgColorClass = 'bg-[#f9f9f6]';
              const shadowColorHex = '#f9f9f6';

              return (
                <Link key={menu.href} href={menu.href} className="block">
                  <div
                    className={`relative flex items-center justify-between px-4 py-3 transition-colors duration-200 cursor-pointer group ${
                      isActive
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
                      <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-[#1e4d1e]' : 'text-[#1e4d1e]/70 group-hover:text-[#1e4d1e]'}`} />
                      <span className="text-[13px] tracking-wide">{menu.label}</span>
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
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT PANEL ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top bar with Search and Settings */}
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
