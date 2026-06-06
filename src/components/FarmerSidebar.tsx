'use client';

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
} from 'lucide-react';

interface FarmerSidebarProps {
  activeMenu?: string;
}

export default function FarmerSidebar({ activeMenu }: FarmerSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/farmer' },
    { name: 'My Products', icon: Package, href: '/dashboard/farmer/products' },
    { name: 'Add Product', icon: PlusCircle, href: '/dashboard/farmer/add-product' },
    { name: 'Orders', icon: ShoppingBag, href: '/dashboard/farmer/orders' },
    { name: 'Chat', icon: MessageSquare, href: '/dashboard/farmer/chat' },
    { name: 'Crop Disease Detection', icon: Activity, href: '/dashboard/farmer/disease-detect' },
    { name: 'AI Assistant', icon: Cpu, href: '/dashboard/farmer/ai' },
    { name: 'Profile', icon: UserIcon, href: '/dashboard/farmer/profile' },
  ];

  return (
    <aside className="w-[220px] bg-[#edf4e2] flex flex-col justify-between pt-8 pb-4 shrink-0 min-h-screen">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center px-6">
          <img src="/logo.png" alt="Logo" className="w-full h-10 object-contain object-center" />
        </div>

        {/* Menu Items */}
        <nav className="pl-4 space-y-1 pr-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Determine active based on pathname or activeMenu prop fallback
            const isActive = activeMenu 
              ? activeMenu === item.name 
              : pathname === item.href;
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
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 font-bold rounded-xl transition-colors text-[12px] cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
