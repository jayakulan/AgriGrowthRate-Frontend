'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User as UserIcon, Globe, ChevronDown, Menu, ShoppingBag, CheckCircle2, AlertCircle, MessageSquare, Sparkles, Check, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/axios';

interface NotificationItem {
  id?: string;
  _id?: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function DashboardHeader({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void } = {}) {
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
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
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
      const interval = setInterval(fetchNotifications, 10000); // poll every 10 seconds
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
    if (!id) return;
    try {
      const response = await api.patch('/notifications/read', { id });
      if (response.data && response.data.success) {
        setNotifications(prev => prev.map(n => ((n.id === id || n._id === id) ? { ...n, read: true } : n)));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Timeago helper
  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return 'just now';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'recently';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 45) return 'just now';
    let interval = seconds / 31536000;
    if (interval >= 1) return Math.floor(interval) + 'y ago';
    interval = seconds / 2592000;
    if (interval >= 1) return Math.floor(interval) + 'mo ago';
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + 'm ago';
    return 'just now';
  };

  // Helper for notification type icon
  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'order':
      case 'order_status':
        return <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'product_approval':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'product_submission':
      case 'product':
        return <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'order_cancelled':
      case 'product_rejection':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'feedback':
      case 'contact':
        return <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[#1e4d1e] shrink-0" />;
    }
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
    if (pathname.includes('/weather')) {
      return { title: t('menu.weather') || 'Weather Forecast', description: 'Real-time weather insights & 7-day planning for your fields.' };
    }

    return { title: 'Dashboard', description: 'Welcome back! Here\'s an overview of your AgriGrowthRate activity.' };
  };


  const { title, description } = getPageInfo();
  const userName = user?.name || 'Guest User';
  const role = user?.role || 'user';
  
  const isAdminHeader = pathname.includes('/dashboard/admin');
  const roleLabel = role === 'consumer' ? 'retailer' : role;
  const displayRole = isAdminHeader ? 'AGRI ADMIN' : roleLabel;
  const displayName = user?.name?.trim() || (isAdminHeader ? 'Admin' : userName);
  
  return (
    <header className="min-h-[70px] md:h-[84px] bg-[#edf4e2] flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 select-none shrink-0 relative z-40 border-b border-[#d2dfc2]">
      {/* Left side: Hamburger Toggle (mobile) + Title & Subtitle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-[#1e4d1e] hover:bg-white/40 rounded-xl transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
        <div>
          <h1 className="text-base sm:text-xl md:text-2xl font-extrabold text-[#1e4d1e] leading-tight mb-0.5">{title}</h1>
          <p className="text-[10px] sm:text-xs text-gray-700 font-semibold hidden sm:block">{description}</p>
        </div>
      </div>

      {/* Right side: Notifications, Divider, Avatar, Name, Role */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-[#1e4d1e] hover:text-[#163d16] transition-colors p-2 rounded-full hover:bg-white/50 relative focus:outline-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-[22px] h-[22px]" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#edf4e2] animate-pulse">
                {notifications.filter(n => !n.read).length > 9 ? '9+' : notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-84 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 sm:p-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-gray-900">Notifications</span>
                  {notifications.filter(n => !n.read).length > 0 ? (
                    <span className="text-[10px] bg-[#1e4d1e] text-white px-2 py-0.5 rounded-full font-bold">
                      {notifications.filter(n => !n.read).length} New
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-semibold">0 New</span>
                  )}
                </div>
                {notifications.some(n => !n.read) && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] text-[#1e4d1e] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#1e4d1e] flex items-center justify-center mb-2">
                      <Bell className="w-5 h-5 opacity-60" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">All caught up!</p>
                    <p className="text-xs text-gray-400 mt-0.5">No notifications right now.</p>
                  </div>
                ) : (
                  notifications.map((n, index) => {
                    const notifId = n.id || n._id || String(index);
                    return (
                      <div 
                        key={notifId} 
                        onClick={() => !n.read && handleMarkSingleAsRead(notifId)}
                        className={`p-3.5 sm:p-4 hover:bg-[#f9fbf7] transition-all cursor-pointer flex gap-3 items-start relative ${
                          !n.read ? 'bg-[#f4f8ee]/60' : 'bg-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          !n.read ? 'bg-white shadow-xs border border-emerald-100' : 'bg-gray-50'
                        }`}>
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-[13px] leading-snug truncate ${!n.read ? 'text-gray-900 font-bold' : 'text-gray-700 font-medium'}`}>
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-[#1e4d1e] shrink-0" />
                            )}
                          </div>
                          <p className="text-[12px] text-gray-600 mt-1 leading-relaxed break-words">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                            {formatTimeAgo(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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
              alt={`${displayName} Avatar`}
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
