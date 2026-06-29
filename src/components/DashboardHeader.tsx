'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User as UserIcon, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/axios';

interface NotificationItem {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Language selector state
  const langCtx = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await api.get('/notifications');
      if (response.data && response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Poll for notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // poll every 15 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await api.patch('/notifications/read');
      if (response.data && response.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  // Mark a single notification as read
  const handleMarkSingleAsRead = async (id: string) => {
    try {
      const response = await api.patch('/notifications/read', { id });
      if (response.data && response.data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Timeago helper
  const formatTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 0) return 'just now';
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    return 'just now';
  };

  useEffect(() => {
    const handleClickOutsideLang = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideLang);
    return () => document.removeEventListener('mousedown', handleClickOutsideLang);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' }
  ];

  const currentLangObj = languages.find(l => l.code === (langCtx?.language || 'en'));

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
    const t = langCtx ? langCtx.t : (k: string) => k;

    // ── Admin-specific routes (must come before generic checks) ──
    if (pathname.includes('/dashboard/admin/farmers')) {
      return { title: 'Manage Farmers', description: 'View and manage registered farmers on the platform.' };
    }
    if (pathname.includes('/dashboard/admin/retailers')) {
      return { title: 'Manage Retailers', description: 'View and manage registered retailers and consumers.' };
    }
    if (pathname.includes('/dashboard/admin/products')) {
      return { title: 'Manage Products', description: 'Review, approve or reject products listed by farmers on the marketplace.' };
    }
    if (pathname.includes('/dashboard/admin/orders')) {
      return { title: 'Orders Monitoring', description: 'Monitor and manage all orders placed across the platform.' };
    }
    if (pathname.includes('/dashboard/admin/reports')) {
      return { title: 'Reports & Analytics', description: 'Monitor and review platform performance, transactions, and user activities.' };
    }
    if (pathname.includes('/dashboard/admin/ai')) {
      return { title: 'AI Management', description: 'Manage AI knowledge base, model settings, and monitor platform intelligence.' };
    }
    if (pathname.includes('/dashboard/admin/profile')) {
      return { title: 'Profile', description: 'Manage your personal information and account settings.' };
    }
    if (pathname.includes('/dashboard/admin')) {
      return { title: 'Dashboard', description: 'Welcome back! Here\'s an overview of the AgriGrowthRate platform.' };
    }

    // ── Generic routes ──
    if (pathname.includes('/add-product')) {
      return { title: t('menu.addProduct'), description: 'List a new agricultural product or equipment to the marketplace.' };
    }
    if (pathname.includes('/products') || pathname.includes('/browse-products')) {
      return { title: t('menu.myProducts'), description: 'Browse, manage, and discover agricultural products and equipment.' };
    }
    if (pathname.includes('/orders')) {
      return { title: t('menu.orders'), description: 'Track and manage your recent purchases and sales.' };
    }
    if (pathname.includes('/chat')) {
      return { title: t('menu.chat'), description: 'Connect and communicate with your community and customers.' };
    }
    if (pathname.includes('/ai') || pathname.includes('/recommendations')) {
      return { title: t('menu.aiAssistant'), description: 'Powered by Retrieval-Augmented Generation (RAG). Get smart recommendations and advice.' };
    }
    if (pathname.includes('/disease-detect')) {
      return { title: t('menu.diseaseDetect'), description: 'Upload crop images to identify diseases and receive treatment suggestions.' };
    }
    if (pathname.includes('/reports')) {
      return { title: 'Reports & Analytics', description: 'In-depth analysis of platform performance, user metrics, and agricultural marketplace yield.' };
    }
    if (pathname.includes('/profile')) {
      return { title: 'Profile', description: 'Manage your personal information and account settings.' };
    }

    return { title: 'Dashboard', description: 'Welcome back! Here\'s an overview of your AgriGrowthRate activity.' };
  };


  const { title, description } = getPageInfo();
  const userName = user?.name || 'Guest User';
  const role = user?.role || 'user';
  
  const isAdminHeader = pathname.includes('/dashboard/admin');
  const displayRole = isAdminHeader ? 'AGRI ADMIN' : role;
  const displayName = isAdminHeader ? 'Nuha Nazardeen' : userName;
  
  return (
    <header className="h-[84px] bg-[#edf4e2] flex items-center justify-between px-8 select-none shrink-0 relative z-50 border-b border-[#d2dfc2]">
      {/* Left side: Title, Greeting, and Subtitle */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1e4d1e] leading-tight mb-0.5">{title}</h1>
        <p className="text-xs text-gray-700 font-semibold">{description}</p>
      </div>

      {/* Right side: Notifications, Divider, Avatar, Name, Role */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-[#1e4d1e] hover:text-[#163d16] transition-colors p-2 rounded-full hover:bg-white/40 relative focus:outline-none cursor-pointer"
          >
            <Bell className="w-[22px] h-[22px]" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#edf4e2]"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">Notifications</span>
                {notifications.filter(n => !n.read).length > 0 ? (
                  <span className="text-[10px] bg-[#1e4d1e] text-white px-2 py-0.5 rounded-full font-bold">
                    {notifications.filter(n => !n.read).length} New
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full font-bold">0 New</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n._id} 
                      onClick={() => !n.read && handleMarkSingleAsRead(n._id)}
                      className={`p-4 border-b border-gray-50 hover:bg-[#f9f9f6] transition-colors cursor-pointer flex gap-3 items-start ${!n.read ? 'bg-green-50/20' : ''}`}
                    >
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#1e4d1e] mt-1.5 shrink-0" />}
                      <div className={n.read ? 'pl-5' : ''}>
                        <p className="text-[13px] text-gray-800 font-semibold leading-snug">{n.title}</p>
                        <p className="text-[12px] text-gray-600 mt-1 leading-snug">{n.message}</p>
                        <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{formatTimeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.some(n => !n.read) && (
                <div className="p-3 text-center border-t border-gray-100 bg-gray-50/50">
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#1e4d1e] font-bold hover:text-[#163d16] transition-colors cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>


        {/* Language Selector */}
        {langCtx && (
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 bg-white/60 hover:bg-white border border-[#d2dfc2] px-3 py-1.5 rounded-xl text-xs font-bold text-[#1e4d1e] shadow-xs transition-all cursor-pointer focus:outline-none"
            >
              <Globe className="w-3.5 h-3.5 text-[#1e4d1e]" />
              <span>{currentLangObj?.flag} {currentLangObj?.name}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-[#e4e6df] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        langCtx.setLanguage(lang.code as any);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold hover:bg-[#edf4e2] transition-colors cursor-pointer ${
                        langCtx.language === lang.code ? 'bg-[#edf4e2]/70 text-[#1e4d1e] font-bold' : 'text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {langCtx.language === lang.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1e4d1e]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* Profile Avatar and label */}
        <div className="flex items-center gap-3.5">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={`${userName} Avatar`}
              className="w-11 h-11 rounded-full object-cover border border-[#d2dfc2]"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#d2dfc2]">
              <UserIcon className="w-[22px] h-[22px] text-[#2c6e2c]" />
            </div>
          )}
          <div className="flex flex-col justify-center text-left">
            <h4 className="text-[14px] font-bold text-[#1e4d1e] leading-none mb-0.5 uppercase">
              {displayRole}
            </h4>
            <span className="text-[11px] font-extrabold text-[#2c6e2c] leading-none">
              {displayName}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
