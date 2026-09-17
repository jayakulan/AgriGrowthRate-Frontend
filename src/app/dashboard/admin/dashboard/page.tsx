'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  UserPlus, 
  ShoppingBag, 
  MessageSquare, 
  ChevronRight,
  Loader2,
} from 'lucide-react';
import DailyLogisticsCard from '@/components/DailyLogisticsCard';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

interface ActivityItem {
  type: 'user_registered' | 'order' | 'product' | string;
  action: string;
  target: string;
  detail?: string;
  timestamp: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function ActivityIcon({ type }: { type: string }) {
  if (type === 'user_registered') {
    return (
      <div className="w-8 h-8 rounded-full bg-sidebar border border-[#d2dfc2] flex items-center justify-center shrink-0">
        <UserPlus className="w-4 h-4 text-brand-dark" />
      </div>
    );
  }
  if (type === 'order') {
    return (
      <div className="w-8 h-8 rounded-full bg-sidebar border border-[#d2dfc2] flex items-center justify-center shrink-0">
        <ShoppingBag className="w-4 h-4 text-[var(--brand-dark)]" />
      </div>
    );
  }
  if (type === 'product') {
    return (
      <div className="w-8 h-8 rounded-full bg-sidebar border border-[#d2dfc2] flex items-center justify-center shrink-0">
        <Package className="w-4 h-4 text-brand-dark" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-sidebar border border-[#d2dfc2] flex items-center justify-center shrink-0">
      <MessageSquare className="w-4 h-4 text-brand-dark" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [range, setRange] = useState<'1M'|'6M'|'1Y'>('6M');
  const [stats, setStats] = useState({
    activeFarmers: 0,
    activeRetailers: 0,
    approvedProducts: 0,
    deliveredOrders: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Original revenue trend states & logistics state
  const [revenueData, setRevenueData] = useState<Array<{ name: string; value: number }>>([]);
  const [logistics, setLogistics] = useState({
    totalToday: 0,
    dispatchedToday: 0,
    dispatchPercentage: 100
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await api.get('/admin/analytics');
        if (res.data && res.data.success) {
          const { 
            activeFarmers, 
            activeRetailers, 
            approvedProducts, 
            deliveredOrders,
            monthlyRevenueTrend,
            todayLogistics
          } = res.data.data;

          setStats({
            activeFarmers: activeFarmers || 0,
            activeRetailers: activeRetailers || 0,
            approvedProducts: approvedProducts || 0,
            deliveredOrders: deliveredOrders || 0,
          });

          if (monthlyRevenueTrend) {
            const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const formatted = Object.entries(monthlyRevenueTrend).map(([name, value]) => ({
              name,
              value: value as number
            })).sort((a, b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));
            setRevenueData(formatted);
          }

          if (todayLogistics) {
            setLogistics({
              totalToday: todayLogistics.totalToday || 0,
              dispatchedToday: todayLogistics.dispatchedToday || 0,
              dispatchPercentage: todayLogistics.dispatchPercentage ?? 100
            });
          }
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const res = await api.get('/admin/activity-logs');
        if (res.data && res.data.success) {
          setActivities(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching activity logs:', err);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchStats();
    fetchActivities();
  }, []);

  // Filter displayed data based on range selector
  const displayedData = (() => {
    if (revenueData.length === 0) return [];
    if (range === '1M') return [revenueData[revenueData.length - 1]];
    if (range === '6M') return revenueData.slice(-6);
    return revenueData;
  })();

  const displayedDataWithIndex = displayedData.map((d, i) => ({ ...d, __i: i }));

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const CustomBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    const idx = payload?.__i ?? 0;
    const isHovered = hoveredBar === idx;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={8}
          fill={isHovered ? 'var(--brand-dark)' : '#d9e0ce'}
          onMouseEnter={() => setHoveredBar(idx)}
          onMouseLeave={() => setHoveredBar(null)}
        />
        <rect x={x} y={y} width={width} height={6} rx={3} className={`bar-shine-top ${isHovered ? 'hovered' : ''}`} />
      </g>
    );
  };



  return (
    <>
      <div className="p-8 bg-panel min-h-screen space-y-8 max-w-7xl mx-auto">
        
        {/* ── METRICS CARD ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: Active Farmers */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <Users className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Active Farmers
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">
                  {statsLoading ? '...' : stats.activeFarmers.toLocaleString()}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>

          {/* Card 2: Active Retailers */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <Package className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Active Retailers
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">
                  {statsLoading ? '...' : stats.activeRetailers.toLocaleString()}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.2%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#4A6D2F] rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Card 3: Approved Products */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <ShoppingCart className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Approved Products
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">
                  {statsLoading ? '...' : stats.approvedProducts.toLocaleString()}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.9%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          {/* Card 4: Delivered Orders */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2.5 bg-[#edf4e2] rounded-xl w-fit">
                  <ShoppingBag className="w-5 h-5 text-[#1e4d1e]" />
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">Delivered Orders</p>
                <h3 className="text-2xl font-extrabold text-gray-900 leading-none">
                  {statsLoading ? '...' : stats.deliveredOrders.toLocaleString()}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+7.3%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

        </div>

        {/* ── REVENUE SECTION (full width) ── */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white-acc border border-global rounded-[24px] p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-4">
              <div className="text-left space-y-0.5">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Revenue Growth
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold">
                  Monthly yield financial distribution
                </p>
              </div>
              <select value={range} onChange={(e) => setRange(e.target.value as any)} className="bg-[#f4f5f0] border border-[#e4e6df] rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="1M">Last Month</option>
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
              </select>
            </div>

            <div className="w-full h-72 mt-4 select-none">
              {statsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
                </div>
              ) : revenueData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs font-bold text-gray-400">
                  No revenue data available in system.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayedDataWithIndex} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#1e4d1e', strokeWidth: 1.5 }} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} />
                    <YAxis tickLine={false} axisLine={{ stroke: '#1e4d1e', strokeWidth: 1.5 }} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--brand-dark)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: '#fff', fontWeight: 700 }}
                      cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="value" radius={[6,6,0,0]} shape={<CustomBar />} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* ── BOTTOM SPLIT: Recent Activity (left) + Operations Overview (right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Activities (left) */}
          <div className="bg-white-acc border border-global rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
            <div className="border-b border-[#f4f5f0] pb-4">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider text-left">
                Recent Activity
              </h3>
            </div>

            <div className="space-y-4 my-4 flex-1">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#1e4d1e] animate-spin" />
                </div>
              ) : activities.length === 0 ? (
                <p className="text-xs text-gray-400 font-semibold text-center py-8">No recent activity found.</p>
              ) : (
                activities.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-left">
                    <ActivityIcon type={item.type} />
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-primary leading-snug">{item.action}</p>
                      <p className="text-[10px] text-muted font-semibold truncate leading-none">{item.target}{item.detail ? ` — ${item.detail}` : ''}</p>
                      <p className="text-[9px] text-brand-dark font-bold">{timeAgo(item.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>


          </div>

          {/* Right side: Logistics summary card */}
          <div className="h-full">
            <DailyLogisticsCard 
              headline={logistics.totalToday > 0 ? `${logistics.dispatchPercentage}% of Orders Dispatched` : '100% Logistics Operational'}
              description={logistics.totalToday > 0
                ? `Out of today's harvest transactions, ${logistics.dispatchedToday} orders are successfully dispatched between farmers and consumers.`
                : `No new transactions recorded today. All past ${stats.deliveredOrders} orders are successfully fulfilled and archived.`}
            />
          </div>

        </div>

      </div>
    </>
  );
}
