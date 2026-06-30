'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
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
  Search,
  Bell,
  Settings,
  HelpCircle,
  TrendingUp,
  CloudSun,
  Truck,
  Plus,
  Scan,
  Compass,
  Loader2,
} from 'lucide-react';

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const langCtx = useLanguage();
  const t = langCtx ? langCtx.t : (k: string) => k;
  const userName = user?.name || 'Thomas';

  // Real statistics states
  const [productsCount, setProductsCount] = useState(0);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Dynamic tip generator
  const getDynamicTip = (current: any) => {
    if (!current) return 'Optimizing field conditions...';

    const humidity = current.humidity;
    const wind = current.wind_kph;
    const textLower = current.condition.text.toLowerCase();
    const isRaining = textLower.includes('rain') || textLower.includes('drizzle') || textLower.includes('shower');
    const temp = current.temp_c;

    if (isRaining) {
      return '🌧️ Rain Alert: Avoid irrigation, check drainage paths, and delay any chemical sprays to prevent runoff.';
    }
    if (humidity > 85) {
      return '💧 High Humidity Alert: Increased risk of fungal diseases. Inspect leaves for powdery mildew and improve airflow.';
    }
    if (wind > 20) {
      return '💨 High Wind Alert: Postpone pesticide spraying to avoid drift, and secure delicate nursery plants.';
    }
    if (temp > 32) {
      return '☀️ Heat Alert: High temp. Irrigate crops in early morning or evening hours to reduce water evaporation loss.';
    }
    return '🌱 Weather conditions are optimal. Ideal time for planting, weeding, and compost application.';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const combinedActivities: any[] = [];

        const prodRes = await productService.getMyProducts();
        if (prodRes && prodRes.data) {
          setProductsCount(prodRes.data.length);
          // Add products to activities list
          prodRes.data.forEach((p: any) => {
            combinedActivities.push({
              id: `prod-${p._id}`,
              type: 'product',
              title: `Product Listed: ${p.name}`,
              details: `Stock: ${p.stock} ${p.unit || 'units'} | Price: SLR ${p.price.toFixed(2)}`,
              createdAt: new Date(p.createdAt),
              badge: p.isAvailable ? 'ACTIVE' : 'DRAFT',
              badgeClass: p.isAvailable ? 'bg-[#edf4e2] text-[#4A6D2F]' : 'bg-gray-100 text-gray-500',
              icon: Package,
            });
          });
        }

        const ordRes = await orderService.getFarmerOrders();
        if (ordRes && ordRes.success && ordRes.data) {
          const orders = ordRes.data;

          const pending = orders.filter((o: any) => o.status === 'pending').length;
          setPendingOrdersCount(pending);

          const active = orders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled').length;
          setActiveOrdersCount(active);

          const earnings = orders
            .filter((o: any) => o.status === 'delivered')
            .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
          setTotalEarnings(earnings);

          // Add orders to activities list
          orders.forEach((o: any) => {
            const firstItem = o.items?.[0];
            const pName = firstItem?.product?.name || 'Produce';
            const customerName = o.consumer?.name || 'Guest';

            let statusClass = 'bg-blue-50 text-blue-600';
            if (o.status === 'pending') statusClass = 'bg-amber-50 text-amber-600';
            else if (o.status === 'delivered') statusClass = 'bg-[#edf4e2] text-[#4A6D2F]';
            else if (o.status === 'cancelled') statusClass = 'bg-red-50 text-red-600';

            combinedActivities.push({
              id: `order-${o._id}`,
              type: 'order',
              title: `New Order: ${pName}`,
              details: `Ordered by ${customerName}. Amount: SLR ${o.totalAmount.toFixed(2)}`,
              createdAt: new Date(o.createdAt),
              badge: o.status.toUpperCase(),
              badgeClass: statusClass,
              icon: Truck,
            });
          });
        }

        // Sort by date (newest first) and limit to top 5
        combinedActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setActivities(combinedActivities.slice(0, 5));

        // Fetch Weather
        const query = user?.address || user?.location || 'Colombo';
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '47ad32d93de6480e64413263006';
        const weatherRes = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=1&aqi=no`
        );
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          setWeather(wData);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setWeatherLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="p-8">
            
      {/* Header Greeting */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1e4d1e] tracking-tight leading-tight">
            {t('dashboard.hi').replace('{name}', userName)}
          </h1>
        </div>

        {/* Weather Pill */}
        <div className="flex items-center gap-2 bg-[#edf4e2] text-[#4A6D2F] px-4 py-2 rounded-full text-sm font-semibold border border-[#d2dfc2] shrink-0">
          <CloudSun className="w-4 h-4 text-[#4A6D2F]" />
          <span>{t('dashboard.weather')}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Total Products */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e]">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">+4% this week</span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-gray-900">{productsCount}</span>
            <p className="text-xs font-semibold text-gray-400 mt-1">{t('dashboard.totalProducts')}</p>
          </div>
          {/* Subtle graphic background node */}
          <div className="absolute bottom-[-10px] right-[-10px] opacity-5 text-gray-300">
            <Sprout className="w-24 h-24" />
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">{pendingOrdersCount} pending</span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-gray-900">{activeOrdersCount}</span>
            <p className="text-xs font-semibold text-gray-400 mt-1">{t('dashboard.activeOrders')}</p>
          </div>
          {/* Subtle graphic background node */}
          <div className="absolute bottom-[-10px] right-[-10px] opacity-5 text-gray-300">
            <Truck className="w-24 h-24" />
          </div>
        </div>

        {/* Card 3: Total Earnings */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <Link href="#" className="text-xs font-bold text-[#1e4d1e] hover:underline">{t('dashboard.table.complete')} report</Link>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-gray-900">
              Rs {totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-xs font-semibold text-gray-400 mt-1">{t('dashboard.totalEarnings')}</p>
          </div>
          {/* Subtle graphic background node */}
          <div className="absolute bottom-[-10px] right-[-10px] opacity-5 text-gray-300">
            <TrendingUp className="w-24 h-24" />
          </div>
        </div>

      </div>

      {/* Split layout: Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{t('dashboard.recentActivity')}</h3>
            <Link href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">{t('dashboard.viewAll')}</Link>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex items-center justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {act.image ? (
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#f4f5f0] border border-[#e4e6df] flex items-center justify-center text-[#1e4d1e]">
                      {act.icon && <act.icon className="w-5 h-5" />}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">{act.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 max-w-md">{act.details}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[9px] font-extrabold px-2 py-1 rounded-md tracking-wider ${act.badgeClass}`}>
                    {act.badge}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {act.createdAt.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar Panels */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.quickActions')}</h3>
            
            {/* Buttons stack */}
            <div className="space-y-3">
              
              {/* Add Product Banner */}
              <Link href="/dashboard/farmer/add-product" className="w-full flex items-center justify-between p-4 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-2xl text-left transition-colors shadow-sm group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{t('menu.addProduct')}</h4>
                    <p className="text-xs text-white/70 mt-0.5">{t('dashboard.addProductDesc')}</p>
                  </div>
                </div>
                <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Scan Crop Banner */}
              <Link href="/dashboard/farmer/disease-detect" className="w-full flex items-center justify-between p-4 bg-[#4e6a4e] hover:bg-[#435e43] text-white rounded-2xl text-left transition-colors shadow-sm group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Scan className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{t('dashboard.scanCrop')}</h4>
                    <p className="text-xs text-white/70 mt-0.5">{t('dashboard.scanCropDesc')}</p>
                  </div>
                </div>
                <Compass className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

            </div>
          </div>

          {/* Weather Advisory Card */}
          <Link href="/dashboard/farmer/weather" className="block bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900">{t('dashboard.weatherAdvisory') || 'Weather Advisory'}</h4>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">Live</span>
            </div>

            {weatherLoading ? (
              <div className="flex items-center justify-center py-4 gap-2 text-xs font-semibold text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#1e4d1e]" />
                <span>Loading advisory...</span>
              </div>
            ) : weather ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                    <img
                      src={`https:${weather.current.condition.icon}`}
                      alt={weather.current.condition.text}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 leading-none">
                      {weather.current.temp_c}°C
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 mt-1">
                      {weather.current.condition.text} • {weather.location.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#f4f5f0] pt-3 text-[11px] text-gray-500">
                  <div>
                    <span className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Humidity</span>
                    <span className="font-extrabold text-gray-800">{weather.current.humidity}%</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Wind Speed</span>
                    <span className="font-extrabold text-gray-800">{weather.current.wind_kph} km/h</span>
                  </div>
                </div>

                <div className="bg-[#edf4e2] text-[#4A6D2F] border border-[#d2dfc2] rounded-xl p-3 text-xs leading-relaxed font-medium">
                  💡 <span className="font-bold">Agri Tip:</span> {getDynamicTip(weather.current)}
                </div>
              </>
            ) : (
              <div className="text-xs font-semibold text-red-500">
                Weather forecast unavailable
              </div>
            )}
          </Link>

          {/* Marketplace Status */}
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-900">{t('dashboard.marketplaceStatus')}</h4>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            {/* Custom progress bar */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1.5">
              <div className="w-2/3 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#1e4d1e] h-full w-[85%] rounded-full" />
              </div>
              <span>85% Active</span>
            </div>

            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-medium">
              Your profile visibility is high. Average response time: <span className="text-gray-800 font-bold">14 mins</span>.
            </p>
          </div>

          {/* Growth Forecast */}
          <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#e4e6df] flex items-center justify-center text-[#1e4d1e]">
              <CloudSun className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-extrabold text-[#1e4d1e] tracking-tight">{t('dashboard.growthForecast')}</h4>
              
              <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>{t('dashboard.optTemp')}</span>
                  <span className="font-bold text-gray-800">18°C - 26°C</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('dashboard.soilMoist')}</span>
                  <span className="font-bold text-gray-800">45%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
