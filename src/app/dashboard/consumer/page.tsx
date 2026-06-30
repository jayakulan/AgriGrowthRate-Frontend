'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
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
import { useLanguage } from '@/context/LanguageContext';

export default function ConsumerDashboardPage() {
  const { user } = useAuth();
  const userName = user?.name || 'Alex';
  const langContext = useLanguage();
  const t = langContext ? langContext.t : (key: string) => key;

  const [favCount, setFavCount] = useState(0);
  const [favFarmers, setFavFarmers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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
    
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        if (res && res.success) {
          setOrders(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchFavorites();
    fetchOrders();
  }, []);


  return (
    <div className="p-8 max-w-[1200px] bg-[#f9faf7] min-h-screen">

      {/* ── Top Stats Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Total Orders */}
        <div className="bg-white border border-[#e4e6df] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('consumer.totalOrders')}</h3>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e2fbe9] flex items-center justify-center text-[#1e4d1e]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1e4d1e] rounded-full w-full"></div>
            </div>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white border border-[#e4e6df] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('consumer.activeDeliveries')}</h3>
              <p className="text-3xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length.toString().padStart(2, '0')}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f4f5f0] flex items-center justify-center text-gray-600">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length > 0 ? (
              <>
                <div className="w-2 h-2 rounded-full bg-[#1e4d1e] animate-pulse"></div>
                <span className="text-xs font-medium text-gray-500">
                  Latest: {orders.find(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped')?.items?.[0]?.product?.name || 'In transit'}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <span className="text-xs font-medium text-gray-400">No active deliveries</span>
              </>
            )}
          </div>
        </div>

        {/* Favorite Farmers */}
        <div className="bg-white border border-[#e4e6df] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('consumer.favoriteFarmers')}</h3>
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
              <p className="text-[11px] text-gray-400 font-medium">{t('consumer.noFavorites')}</p>
            )}
          </div>
        </div>

      </div>

      {/* ── Bottom Section ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-[#e4e6df] rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#1e4d1e] mb-8">{t('consumer.recentActivity')}</h2>

          <div className="flex flex-col gap-6">
            {orders.length === 0 ? (
              <p className="text-xs font-medium text-gray-400">No recent orders found</p>
            ) : (
              orders.slice(0, 3).map((ord) => {
                const statusText = ord.status === 'delivered' ? t('consumer.delivered') :
                  ord.status === 'pending' ? t('consumer.processing') :
                  ord.status === 'shipped' ? t('consumer.outForDelivery') : ord.status.toUpperCase();

                const formattedOrderDate = new Date(ord.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div key={ord._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ord.status === 'delivered' ? 'bg-[#e2fbe9] text-[#1e4d1e]' :
                          ord.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                            'bg-[#f4f5f0] text-gray-500'
                        }`}>
                        {ord.status === 'delivered' ? (
                          <Package className="w-5 h-5" />
                        ) : ord.status === 'shipped' ? (
                          <Truck className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-gray-900 mb-0.5">Order #{ord.orderConfirmationNumber || ord._id.slice(-6).toUpperCase()}</h4>
                        <p className="text-[11px] font-medium text-gray-500">{formattedOrderDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${ord.status === 'delivered' ? 'bg-[#1e4d1e] text-white' :
                          ord.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-[#e5e7eb] text-gray-600'
                        }`}>
                        {statusText}
                      </span>
                      <span className="text-[15px] font-bold text-gray-900 w-24 text-right">Rs {ord.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="flex flex-col gap-6">

          {/* Farm Proximity */}
          <div className="bg-white border border-[#e4e6df] rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-[15px] font-medium text-gray-600 mb-4">{t('consumer.farmProximity')}</h3>
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
              {t('consumer.farmsProximityDesc').replace('{count}', '12')}
            </p>
          </div>

          {/* Sustainable Choice */}
          <div className="bg-[#0a2318] rounded-[2rem] p-8 relative overflow-hidden text-white flex-1 flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="text-[15px] font-bold mb-3">{t('consumer.sustainableChoice')}</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                {t('consumer.sustainableDesc')}
              </p>
              <button className="bg-white hover:bg-gray-100 text-[#0a2318] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 w-fit">
                {t('consumer.viewReport')}
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
