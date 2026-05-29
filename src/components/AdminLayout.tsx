'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Users, Package, ShoppingCart, Zap, User, BarChart3 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const sidebarMenus = [
    { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Reports & Analytics', href: '/dashboard/admin/reports', icon: BarChart3 },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Manage Products', href: '/dashboard/admin/products', icon: Package },
    { label: 'Orders Monitoring', href: '/dashboard/admin/orders', icon: ShoppingCart },
    { label: 'AI Management', href: '/dashboard/admin/ai', icon: Zap },
    { label: 'Profile & Security', href: '/dashboard/admin/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold text-green-400">AgriGrowth</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 space-y-2 px-2">
          {sidebarMenus.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.href;
            return (
              <Link key={menu.href} href={menu.href}>
                <div
                  className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span className="text-sm">{menu.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
