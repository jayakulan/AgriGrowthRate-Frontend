'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, text: "Your recent crop analysis report is ready.", time: "10m ago" },
    { id: 2, text: "A new product matches your wishlist.", time: "1h ago" },
    { id: 3, text: "System maintenance scheduled for tonight.", time: "2h ago" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to get title and description from pathname
  const getPageInfo = () => {
    if (pathname.includes('/add-product')) {
      return { title: 'Add Product', description: 'List a new agricultural product or equipment to the marketplace.' };
    }
    if (pathname.includes('/products') || pathname.includes('/browse-products')) {
      return { title: 'Products', description: 'Browse, manage, and discover agricultural products and equipment.' };
    }
    if (pathname.includes('/orders')) {
      return { title: 'Ordered Monitoring', description: 'Track and manage your recent purchases and sales.' };
    }
    if (pathname.includes('/chat')) {
      return { title: 'Chat', description: 'Connect and communicate with your community and customers.' };
    }
    if (pathname.includes('/ai') || pathname.includes('/recommendations')) {
      return { title: 'AI Assistant', description: 'Powered by Retrieval-Augmented Generation (RAG). Get smart recommendations and advice.' };
    }
    if (pathname.includes('/disease-detect')) {
      return { title: 'Disease Detection', description: 'Upload crop images to identify diseases and receive treatment suggestions.' };
    }
    if (pathname.includes('/profile')) {
      return { title: 'Profile', description: 'Manage your personal information and account settings.' };
    }
    if (pathname.includes('/farmers')) {
      return { title: 'Manage Farmers', description: 'View and manage registered farmers on the platform.' };
    }
    if (pathname.includes('/retailers')) {
      return { title: 'Manage Retailers', description: 'View and manage registered retailers and consumers.' };
    }
    if (pathname.includes('/reports')) {
      return { title: 'Reports & Analytics', description: 'In-depth analysis of platform performance, user metrics, and agricultural marketplace yield.' };
    }
    return { title: 'Dashboard', description: 'Your central hub for overview and analytics.' };
  };

  const { title, description } = getPageInfo();
  const userName = user?.name || 'Tharshika Pathmanathan';
  const role = user?.role || 'USER'; 
  
  const isAdminHeader = pathname.includes('/dashboard/admin');
  const displayRole = isAdminHeader ? 'AGRI ADMIN' : role;
  const displayName = isAdminHeader ? 'Nuha Nazardeen' : userName;
  
  return (
    <header className="h-[84px] bg-white flex items-center justify-between px-8 select-none shrink-0 relative z-50 border-b border-gray-100">
      {/* Left side: Title, Greeting, and Subtitle */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1e4d1e] leading-tight mb-0.5">{title}</h1>
        <p className="text-xs text-gray-600 font-medium">{description}</p>
      </div>

      {/* Right side: Notifications, Divider, Avatar, Name, Role */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100 relative focus:outline-none"
          >
            <Bell className="w-[22px] h-[22px]" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">Notifications</span>
                <span className="text-[10px] bg-[#1e4d1e] text-white px-2 py-0.5 rounded-full font-bold">3 New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-[#f9f9f6] transition-colors cursor-pointer flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-[#1e4d1e] mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[13px] text-gray-800 font-medium leading-snug">{n.text}</p>
                      <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-100 bg-gray-50/50">
                <button className="text-xs text-[#1e4d1e] font-bold hover:text-[#163d16] transition-colors">Mark all as read</button>
              </div>
            </div>
          )}
        </div>


        {/* Profile Avatar and label */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[#edf4e2] flex items-center justify-center shrink-0 border border-[#d2dfc2]">
            <UserIcon className="w-[22px] h-[22px] text-[#2c6e2c]" />
          </div>
          <div className="flex flex-col justify-center text-left">
            <h4 className="text-[14px] font-bold text-brand-dark leading-none mb-0.5 uppercase">{displayRole}</h4>
            <span className="text-[11px] font-extrabold text-[#2c6e2c] leading-none">{displayName}</span>
          </div>
        </div>

      </div>
    </header>
  );
}
