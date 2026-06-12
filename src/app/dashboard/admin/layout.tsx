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
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      <div className="flex flex-1">
        
        {/* ── SIDEBAR ── */}
        <aside className="w-[220px] bg-[#edf4e2] flex flex-col justify-between pt-8 pb-4 shrink-0 min-h-screen">
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
        <header className="h-16 bg-white border-b border-[#e4e6df] flex items-center justify-between px-8 select-none shrink-0">
          
          {/* Admin Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={
                pathname === '/dashboard/admin/ai'
                  ? 'Search datasets, logs or settings...'
                  : pathname === '/dashboard/admin/orders'
                  ? 'Search orders, customers, or farmers...'
                  : pathname === '/dashboard/admin/users'
                  ? 'Search for users by name or email...'
                  : pathname === '/dashboard/admin/products'
                  ? 'Search products'
                  : 'Search farm analytics, orders, or users...'
              }
              className="w-full bg-[#f4f5f0]/60 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-full py-2 pl-10 pr-4 text-xs text-gray-800 placeholder-gray-400 outline-none transition-all"
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

            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h4 className="text-sm font-bold text-gray-900 leading-tight">{adminName}</h4>
                <span className="text-[10px] font-extrabold text-[#4A6D2F] tracking-wide uppercase">{adminRole}</span>
              </div>
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256"}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-[#e4e6df]"
              />
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  </div>
  );
}
