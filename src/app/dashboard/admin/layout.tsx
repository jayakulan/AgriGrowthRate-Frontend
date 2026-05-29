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
  User, 
  LogOut, 
  Search, 
  Bell, 
  Settings 
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
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Manage Products', href: '/dashboard/admin/products', icon: Package },
    { label: 'Orders Monitoring', href: '/dashboard/admin/orders', icon: ShoppingCart },
    { label: 'Reports / Analytics', href: '/dashboard/admin/reports', icon: BarChart3 },
    { label: 'AI Management', href: '/dashboard/admin/ai', icon: Zap },
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
    <div className="flex h-screen bg-[#f9f9f6] text-gray-800 font-sans antialiased overflow-hidden">
      
      {/* ── SIDEBAR ── */}
      <div className="w-64 bg-[#f8f9f6] border-r border-[#e4e6df] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Header branding matching AgriGrowthRate theme */}
          <div className="p-6">
            <Link href="/dashboard/admin" className="block select-none text-left">
              <h1 className="text-xl font-extrabold text-[#1e4d1e] tracking-tight">
                AgriGrowthRate
              </h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-0.5">
                Modern Stewardship
              </p>
            </Link>
          </div>

          {/* Navigation links exactly matching the reference design */}
          <nav className="px-3 space-y-1 py-2">
            {mainSidebarMenus.map((menu) => {
              const Icon = menu.icon;
              const isActive = pathname === menu.href;

              return (
                <Link key={menu.href} href={menu.href}>
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? 'bg-[#edf4e2] text-[#1e4d1e] font-bold border-r-[3px] border-[#1e4d1e] rounded-r-none'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-[#edf4e2]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#1e4d1e]' : 'text-gray-400 group-hover:text-gray-700'}`} />
                      <span className="text-xs font-semibold tracking-wide">{menu.label}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Logout Actions exactly matching the reference image */}
        <div className="p-4 border-t border-[#e4e6df]/60 space-y-3">
          <nav className="space-y-1">
            {/* Profile Link */}
            <Link href="/dashboard/admin/profile">
              <div
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group ${
                  pathname === '/dashboard/admin/profile'
                    ? 'bg-[#edf4e2] text-[#1e4d1e] font-bold border-r-[3px] border-[#1e4d1e] rounded-r-none'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-[#edf4e2]/30'
                }`}
              >
                <User className={`w-4 h-4 ${pathname === '/dashboard/admin/profile' ? 'text-[#1e4d1e]' : 'text-gray-400'}`} />
                <span className="text-xs font-semibold tracking-wide">Profile</span>
              </div>
            </Link>

            {/* Logout Trigger */}
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
            >
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
              <span className="text-xs font-semibold tracking-wide">Logout</span>
            </div>
          </nav>

          {/* Bottom user badge box matching mockup exactly */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-[#e4e6df] rounded-2xl text-left select-none">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256"}
              alt="Admin Profile"
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-gray-800 truncate">{adminName}</p>
              <p className="text-[9px] font-semibold text-gray-400 truncate mt-0.5">{adminRole}</p>
            </div>
          </div>
        </div>
      </div>

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

          {/* System Control Widgets */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-all cursor-pointer">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {/* Settings Link */}
            <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-all cursor-pointer">
              <Settings className="w-4.5 h-4.5" />
            </button>

            {/* Separator line */}
            <div className="w-[1px] h-8 bg-[#e4e6df]" />

            {/* AI Advisor Badge matching the mockup exactly */}
            {pathname === '/dashboard/admin/ai' ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-700">AgriGrowth AI Advisor</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400">System Status:</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e3f7ed] border border-[#c8e6c9]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                  <span className="text-[9px] font-bold text-green-700 uppercase">Operational</span>
                </div>
              </div>
            )}

          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  );
}
