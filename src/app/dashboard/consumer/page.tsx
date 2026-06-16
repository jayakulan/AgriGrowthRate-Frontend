'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/productService';
import api from '@/lib/axios';
import {
  ShoppingBag,
  Truck,
  Heart,
  ShoppingCart,
  Clock,
  Package,
  MoreVertical,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Loader2,
  MapPin,
} from 'lucide-react';

export default function ConsumerDashboardPage() {
  const { user } = useAuth();
  const userName = user?.name || 'Alex';

  const [freshProducts, setFreshProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [favCount, setFavCount] = useState(0);
  const [favFarmers, setFavFarmers] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/auth/favorite-farmers');
        if (res && res.data && res.data.success) {
          setFavCount(res.data.count);
          setFavFarmers(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch favorites', err);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAll({ limit: '4' });
        if (res && res.success) {
          setFreshProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard products', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const recentActivity = [
    {
      id: 'AG-9842',
      date: 'Oct 24, 2023 • 14:30',
      status: 'DELIVERED',
      amount: '$142.50',
      icon: Package,
    },
    {
      id: 'AG-9910',
      date: 'Oct 26, 2023 • 09:15',
      status: 'PROCESSING',
      amount: '$86.20',
      icon: Clock,
    },
    {
      id: 'AG-9915',
      date: 'Today • 11:45',
      status: 'OUT FOR DELIVERY',
      amount: '$54.00',
      icon: Truck,
    },
  ];

  return (
    <div className="p-8 max-w-[1200px] bg-[#f9faf7] min-h-screen">

      {/* ── Top Stats Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Total Orders */}
        <div className="bg-white border border-[#e4e6df] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
              <p className="text-3xl font-bold text-gray-900">42</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e2fbe9] flex items-center justify-center text-[#1e4d1e]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1e4d1e] rounded-full w-[75%]"></div>
            </div>
            <span className="text-xs font-bold text-[#1e4d1e]">+12%</span>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white border border-[#e4e6df] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Active Deliveries</h3>
              <p className="text-3xl font-bold text-gray-900">03</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f4f5f0] flex items-center justify-center text-gray-600">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1e4d1e]"></div>
            <span className="text-xs font-medium text-gray-500">In transit from Green Valley Farm</span>
          </div>
        </div>

        {/* Favorite Farmers */}
        <div className="bg-white border border-[#e4e6df] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Favorite Farmers</h3>
              <p className="text-3xl font-bold text-gray-900">{favCount < 10 ? `0${favCount}` : favCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#c0f0cc] flex items-center justify-center text-[#1e4d1e]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="flex items-center">
            {favCount > 0 ? (
              <>
                <div className="flex -space-x-2">
                  {favFarmers.slice(0, 3).map((f, i) => (
                    <img 
                      key={i} 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-100" 
                      src={f.farmerId?.avatar ? (f.farmerId.avatar.startsWith('http') || f.farmerId.avatar.startsWith('data:') ? f.farmerId.avatar : `http://localhost:5001${f.farmerId.avatar}`) : "https://images.unsplash.com/photo-1595858688461-8f5bc289569e?w=100&h=100&fit=crop"} 
                      alt="Farmer" 
                    />
                  ))}
                </div>
                {favCount > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 -ml-2 z-10">
                    +{favCount - 3}
                  </div>
                )}
              </>
            ) : (
              <p className="text-[11px] text-gray-400 font-medium">No favorites yet</p>
            )}
          </div>
        </div>

      </div>

      {/* ── Fresh from the farm today ──────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#0a2318]">Fresh from the farm today</h2>
          <Link
            href="/dashboard/consumer/browse-products"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            View Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
          </div>
        ) : freshProducts.length === 0 ? (
          <div className="text-center py-10 bg-white border border-[#e4e6df] rounded-3xl">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freshProducts.map((product) => {
              const productImg = product.images && product.images[0]
                ? (product.images[0].startsWith('http') || product.images[0].startsWith('data:') ? product.images[0] : `http://localhost:5001${product.images[0]}`)
                : 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=300&fit=crop';

              return (
                <div key={product._id} className="bg-white border border-[#e4e6df] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden shrink-0 p-3 pb-0">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <img
                        src={productImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Category badge */}
                      <span className="absolute top-3 left-3 bg-white/95 text-gray-800 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
                        {product.category || 'Product'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[15px] font-bold text-[#0f172a] leading-snug line-clamp-1">{product.name}</h3>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-[14px] font-bold text-[#0f172a]">${product.price.toFixed(2)}</span>
                        <span className="text-[12px] font-bold text-[#0f172a]">/{product.unit || 'kg'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Available Stock</span>
                        <span className="font-black text-[#1e4d1e] text-[20px] leading-none">{product.stock} <span className="text-[13px] font-bold">{product.unit || 'kg'}</span></span>
                      </div>
                    </div>

                    <p className="text-[12px] text-gray-600 mb-4 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1e4d1e] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{product.farmer?.address || product.location || 'Address not available'}</span>
                    </p>

                    <Link
                      href="/dashboard/consumer/browse-products"
                      className="mt-auto w-full bg-[#17451e] hover:bg-[#113316] text-white text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom Section ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-[#e4e6df] rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#1e4d1e] mb-8">Recent Activity</h2>

          <div className="flex flex-col gap-6">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activity.status === 'DELIVERED' ? 'bg-[#e2fbe9] text-[#1e4d1e]' :
                        activity.status === 'PROCESSING' ? 'bg-[#f4f5f0] text-gray-500' :
                          'bg-[#dcfce7] text-[#166534]'
                      }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-900 mb-0.5">Order #{activity.id}</h4>
                      <p className="text-[11px] font-medium text-gray-500">{activity.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${activity.status === 'DELIVERED' ? 'bg-[#1e4d1e] text-white' :
                        activity.status === 'PROCESSING' ? 'bg-[#e5e7eb] text-gray-600' :
                          'bg-[#bbf7d0] text-[#166534]'
                      }`}>
                      {activity.status}
                    </span>
                    <span className="text-[15px] font-bold text-gray-900 w-16 text-right">{activity.amount}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="flex flex-col gap-6">

          {/* Farm Proximity */}
          <div className="bg-white border border-[#e4e6df] rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-[15px] font-medium text-gray-600 mb-4">Farm Proximity</h3>
            <div className="bg-gray-400 w-full h-36 rounded-2xl mb-4 overflow-hidden relative">
              {/* Fake map image */}
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop" alt="Map" className="w-full h-full object-cover opacity-60 grayscale" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#1e4d1e]/20 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-[#1e4d1e] rounded-full shadow-lg border-2 border-white"></div>
                </div>
              </div>
            </div>
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
              There are <span className="font-bold text-[#1e4d1e]">12 active farms</span> within 20 miles of your location currently harvesting.
            </p>
          </div>

          {/* Sustainable Choice */}
          <div className="bg-[#0a2318] rounded-[2rem] p-8 relative overflow-hidden text-white flex-1 flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="text-[15px] font-bold mb-3">Sustainable Choice</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Learn how your recent purchases reduced carbon emissions by 4.2kg this month.
              </p>
              <button className="bg-white hover:bg-gray-100 text-[#0a2318] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 w-fit">
                View Report
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Background Graphic */}
            <MessageSquare className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
          </div>

        </div>

      </div>
    </div>
  );
}
