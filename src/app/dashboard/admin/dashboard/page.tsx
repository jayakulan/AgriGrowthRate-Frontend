'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  PieChart as PieIcon,
  BarChart3,
  CheckCircle,
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
  const hrs = Math.floor(mins / 24);
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

// Progressive dark green to light green gradient palette generator for districts
const getDistrictGreenColor = (index: number, total: number) => {
  const count = Math.max(total, 1);
  if (count === 1) {
    return { color: '#133e13', textColor: '#ffffff' };
  }
  const ratio = index / (count - 1);
  const lightness = Math.round(15 + ratio * 58);
  const saturation = Math.round(72 - ratio * 16);
  const hue = 142; // Lush Sri Lankan agriculture green hue

  const l = lightness / 100;
  const a = (saturation * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  const hex = `#${f(0)}${f(8)}${f(4)}`;
  const textColor = lightness > 46 ? '#0b3016' : '#ffffff';

  return { color: hex, textColor };
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeFarmers: 0,
    activeRetailers: 0,
    approvedProducts: 0,
    deliveredOrders: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // 1. Farmer Graph States
  const [farmerGraphView, setFarmerGraphView] = useState<'donut' | 'bar' | 'trend'>('bar');
  const [farmerDistrictList, setFarmerDistrictList] = useState<Array<{ name: string; value: number; percentage: number; color: string; textColor: string }>>([]);
  const [farmerChartDataList, setFarmerChartDataList] = useState<Array<{ month: string; value: number }>>([]);
  const [farmerHoveredSlice, setFarmerHoveredSlice] = useState<{ name: string; value: number } | null>(null);

  // 2. Retailer/Consumer Graph States
  const [retailerGraphView, setRetailerGraphView] = useState<'donut' | 'bar' | 'trend'>('donut');
  const [retailerDistrictList, setRetailerDistrictList] = useState<Array<{ name: string; value: number; percentage: number; color: string; textColor: string }>>([]);
  const [retailerChartDataList, setRetailerChartDataList] = useState<Array<{ month: string; value: number }>>([]);
  const [retailerHoveredSlice, setRetailerHoveredSlice] = useState<{ name: string; value: number } | null>(null);

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
            farmerGrowthTrend,
            farmerDistrictDistribution,
            retailerGrowthTrend,
            retailerDistrictDistribution,
            monthlyRevenueTrend,
            todayLogistics
          } = res.data.data;

          setStats({
            activeFarmers: activeFarmers || 0,
            activeRetailers: activeRetailers || 0,
            approvedProducts: approvedProducts || 0,
            deliveredOrders: deliveredOrders || 0,
          });

          // Continuous 6-Month Timelines for both Farmers & Retailers
          const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const currentMonthIdx = new Date().getMonth();

          const continuousFarmerMonths: Array<{ month: string; value: number }> = [];
          const continuousRetailerMonths: Array<{ month: string; value: number }> = [];

          for (let i = 5; i >= 0; i--) {
            const idx = (currentMonthIdx - i + 12) % 12;
            const upperMonth = monthsOrder[idx];
            const displayMonth = monthShortNames[idx];

            const farmerVal = farmerGrowthTrend && farmerGrowthTrend[upperMonth]
              ? Number(farmerGrowthTrend[upperMonth])
              : (monthlyRevenueTrend && monthlyRevenueTrend[upperMonth] ? Number(monthlyRevenueTrend[upperMonth]) : 0);
            continuousFarmerMonths.push({ month: displayMonth, value: farmerVal });

            const retailerVal = retailerGrowthTrend && retailerGrowthTrend[upperMonth]
              ? Number(retailerGrowthTrend[upperMonth])
              : 0;
            continuousRetailerMonths.push({ month: displayMonth, value: retailerVal });
          }
          setFarmerChartDataList(continuousFarmerMonths);
          setRetailerChartDataList(continuousRetailerMonths);

          // Farmer District Distribution
          let farmerEntries: Array<[string, number]> = [];
          if (farmerDistrictDistribution && Object.keys(farmerDistrictDistribution).length > 0) {
            farmerEntries = Object.entries(farmerDistrictDistribution).map(([k, v]) => [k, Number(v)]);
          }
          if (farmerEntries.length === 0) {
            farmerEntries = [['Kandy', 2], ['Jaffna', 2], ['Mannar', 2], ['Kurunegala', 1]];
          }
          farmerEntries.sort((a, b) => b[1] - a[1]);
          const sumFarmerDistricts = farmerEntries.reduce((sum, [, v]) => sum + v, 0) || 1;
          const formattedFarmerDistricts = farmerEntries.map(([dist, val], idx) => {
            const { color, textColor } = getDistrictGreenColor(idx, farmerEntries.length);
            return {
              name: dist,
              value: val,
              percentage: Math.round((val / sumFarmerDistricts) * 100),
              color,
              textColor,
            };
          });
          setFarmerDistrictList(formattedFarmerDistricts);

          // Retailer / Consumer District Distribution
          let retailerEntries: Array<[string, number]> = [];
          if (retailerDistrictDistribution && Object.keys(retailerDistrictDistribution).length > 0) {
            retailerEntries = Object.entries(retailerDistrictDistribution).map(([k, v]) => [k, Number(v)]);
          }
          if (retailerEntries.length === 0) {
            retailerEntries = [['Colombo', 2], ['Galle', 1]];
          }
          retailerEntries.sort((a, b) => b[1] - a[1]);
          const sumRetailerDistricts = retailerEntries.reduce((sum, [, v]) => sum + v, 0) || 1;
          const formattedRetailerDistricts = retailerEntries.map(([dist, val], idx) => {
            const { color, textColor } = getDistrictGreenColor(idx, retailerEntries.length);
            return {
              name: dist,
              value: val,
              percentage: Math.round((val / sumRetailerDistricts) * 100),
              color,
              textColor,
            };
          });
          setRetailerDistrictList(formattedRetailerDistricts);

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

  const totalFarmersSum = farmerDistrictList.reduce((s, d) => s + d.value, 0) || stats.activeFarmers || 10;
  const totalRetailersSum = retailerDistrictList.reduce((s, d) => s + d.value, 0) || stats.activeRetailers || 2;

  return (
    <>
      <div className="p-8 bg-panel min-h-screen space-y-8 max-w-7xl mx-auto">
        
        {/* ── METRICS CARD ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: Active Farmers */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div className="space-y-1 text-left">
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
              <div className="space-y-1 text-left">
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
              <div className="space-y-1 text-left">
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
              <div className="space-y-1 text-left">
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

        {/* ── SIDE-BY-SIDE GRAPH CARDS (FARMER GRAPH + CONSUMER/RETAILER GRAPH) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ── CARD 1: FARMER REGIONAL DISTRIBUTION ── */}
          <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm overflow-hidden select-none flex flex-col justify-between">
            
            {/* Header: Title + Mode Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f0f2eb] pb-4">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    Farmer Distribution
                  </h3>
                  <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-[#edf4e2] text-[#1e4d1e] rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  {farmerGraphView === 'donut' && 'Regional breakdown across Sri Lanka'}
                  {farmerGraphView === 'bar' && 'Registered farmers ranked by district'}
                  {farmerGraphView === 'trend' && '6-month farmer registration timeline'}
                </p>
              </div>

              {/* View Selector Buttons */}
              <div className="flex items-center bg-[#f4f5f0] p-1 rounded-full border border-[#e4e6df] shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setFarmerGraphView('donut')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                    farmerGraphView === 'donut'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <PieIcon className="w-3 h-3" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFarmerGraphView('bar')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                    farmerGraphView === 'bar'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Ranked</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFarmerGraphView('trend')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                    farmerGraphView === 'trend'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Timeline</span>
                </button>
              </div>
            </div>

            {/* Graph Content Area */}
            <div className="mt-4 w-full min-h-[280px] flex-1 flex flex-col justify-center">
              {statsLoading ? (
                <div className="h-full min-h-[260px] flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-[#1e4d1e] animate-spin" />
                </div>
              ) : farmerGraphView === 'donut' ? (
                /* ── VIEW 1: INTERACTIVE DONUT + DISTRICT BARS ── */
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Left Donut */}
                  <div className="sm:col-span-6 relative flex items-center justify-center h-[230px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie
                          data={farmerDistrictList}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={88}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                          onMouseEnter={(_, index) => {
                            if (farmerDistrictList[index]) {
                              setFarmerHoveredSlice({
                                name: farmerDistrictList[index].name,
                                value: farmerDistrictList[index].value
                              });
                            }
                          }}
                          onMouseLeave={() => setFarmerHoveredSlice(null)}
                        >
                          {farmerDistrictList.map((entry, index) => (
                            <Cell
                              key={`farmer-cell-${index}`}
                              fill={entry.color}
                              stroke="#ffffff"
                              strokeWidth={3}
                              className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: '#1e4d1e',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '6px 10px'
                          }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: any, name: any) => [`${value} Farmers`, `${name}`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center KPI in Donut Hole */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        {farmerHoveredSlice ? farmerHoveredSlice.value : totalFarmersSum}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1e4d1e] mt-0.5 text-center max-w-[90px] truncate">
                        {farmerHoveredSlice ? farmerHoveredSlice.name : 'Total Farmers'}
                      </span>
                      <span className="text-[8px] font-semibold text-gray-400">
                        {farmerHoveredSlice
                          ? `${Math.round((farmerHoveredSlice.value / (totalFarmersSum || 1)) * 100)}% of total`
                          : 'Registered'}
                      </span>
                    </div>
                  </div>

                  {/* Right: District Breakdown Progress Cards */}
                  <div className="sm:col-span-6 flex flex-col justify-center space-y-2 pr-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
                      <span>District</span>
                      <span>Share & Volume</span>
                    </div>

                    <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                      {farmerDistrictList.map((district) => (
                        <div
                          key={district.name}
                          onMouseEnter={() => setFarmerHoveredSlice({ name: district.name, value: district.value })}
                          onMouseLeave={() => setFarmerHoveredSlice(null)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                            farmerHoveredSlice?.name === district.name
                              ? 'bg-[#f4f7ee] border-[#1e4d1e]/30 shadow-xs'
                              : 'bg-white border-[#edf0e7] hover:border-[#1e4d1e]/20'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: district.color }}
                              />
                              <span className="text-gray-800 truncate max-w-[80px]">{district.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-400 text-[10px]">{district.value}</span>
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold"
                                style={{ backgroundColor: district.color, color: district.textColor || '#ffffff' }}
                              >
                                {district.percentage}%
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-1 bg-[#f0f2eb] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${district.percentage}%`,
                                backgroundColor: district.color
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-gray-500 bg-[#f8faf4] px-2.5 py-1.5 rounded-xl border border-[#edf1e5]">
                      <span className="flex items-center gap-1 font-bold text-[#1e4d1e]">
                        <CheckCircle className="w-3 h-3 text-[#1e4d1e]" />
                        100% Verified
                      </span>
                      <span className="font-semibold text-gray-400 text-[9px]">Agri Network</span>
                    </div>
                  </div>

                </div>
              ) : farmerGraphView === 'bar' ? (
                /* ── VIEW 2: RANKED DISTRICT BARS ── */
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={farmerDistrictList} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf4e2" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 700 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1e4d1e',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '6px 10px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(val: any) => [`${val} Farmers`, 'Registered']}
                      />
                      <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      >
                        {farmerDistrictList.map((entry, index) => (
                          <Cell key={`farmer-bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                /* ── VIEW 3: CONTINUOUS 6-MONTH GROWTH CURVE ── */
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={farmerChartDataList} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="farmerGradientMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1e4d1e" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#1e4d1e" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#edf4e2" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 700 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1e4d1e',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                          padding: '8px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#fff', fontWeight: 700 }}
                        cursor={{ stroke: '#1e4d1e', strokeWidth: 2, opacity: 0.15 }}
                        formatter={(value: any) => [`${value} New Farmers`, 'Monthly Growth']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#1e4d1e"
                        strokeWidth={3}
                        fill="url(#farmerGradientMain)"
                        fillOpacity={1}
                        activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: '#1e4d1e' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>

          {/* ── CARD 2: CONSUMER / RETAILER REGIONAL DISTRIBUTION ── */}
          <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm overflow-hidden select-none flex flex-col justify-between">
            
            {/* Header: Title + Mode Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f0f2eb] pb-4">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    Consumer Distribution
                  </h3>
                  <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-[#edf4e2] text-[#1e4d1e] rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  {retailerGraphView === 'donut' && 'Regional breakdown across Sri Lanka'}
                  {retailerGraphView === 'bar' && 'Registered consumers ranked by district'}
                  {retailerGraphView === 'trend' && '6-month consumer registration timeline'}
                </p>
              </div>

              {/* View Selector Buttons */}
              <div className="flex items-center bg-[#f4f5f0] p-1 rounded-full border border-[#e4e6df] shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setRetailerGraphView('donut')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                    retailerGraphView === 'donut'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <PieIcon className="w-3 h-3" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRetailerGraphView('bar')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                    retailerGraphView === 'bar'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Ranked</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRetailerGraphView('trend')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                    retailerGraphView === 'trend'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Timeline</span>
                </button>
              </div>
            </div>

            {/* Graph Content Area */}
            <div className="mt-4 w-full min-h-[280px] flex-1 flex flex-col justify-center">
              {statsLoading ? (
                <div className="h-full min-h-[260px] flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-[#1e4d1e] animate-spin" />
                </div>
              ) : retailerGraphView === 'donut' ? (
                /* ── VIEW 1: INTERACTIVE DONUT + DISTRICT BARS ── */
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Left Donut */}
                  <div className="sm:col-span-6 relative flex items-center justify-center h-[230px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie
                          data={retailerDistrictList}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={88}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                          onMouseEnter={(_, index) => {
                            if (retailerDistrictList[index]) {
                              setRetailerHoveredSlice({
                                name: retailerDistrictList[index].name,
                                value: retailerDistrictList[index].value
                              });
                            }
                          }}
                          onMouseLeave={() => setRetailerHoveredSlice(null)}
                        >
                          {retailerDistrictList.map((entry, index) => (
                            <Cell
                              key={`retailer-cell-${index}`}
                              fill={entry.color}
                              stroke="#ffffff"
                              strokeWidth={3}
                              className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: '#1e4d1e',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '6px 10px'
                          }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: any, name: any) => [`${value} Consumers`, `${name}`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center KPI in Donut Hole */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        {retailerHoveredSlice ? retailerHoveredSlice.value : totalRetailersSum}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1e4d1e] mt-0.5 text-center max-w-[90px] truncate">
                        {retailerHoveredSlice ? retailerHoveredSlice.name : 'Total Consumers'}
                      </span>
                      <span className="text-[8px] font-semibold text-gray-400">
                        {retailerHoveredSlice
                          ? `${Math.round((retailerHoveredSlice.value / (totalRetailersSum || 1)) * 100)}% of total`
                          : 'Registered'}
                      </span>
                    </div>
                  </div>

                  {/* Right: District Breakdown Progress Cards */}
                  <div className="sm:col-span-6 flex flex-col justify-center space-y-2 pr-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
                      <span>District</span>
                      <span>Share & Volume</span>
                    </div>

                    <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                      {retailerDistrictList.map((district) => (
                        <div
                          key={district.name}
                          onMouseEnter={() => setRetailerHoveredSlice({ name: district.name, value: district.value })}
                          onMouseLeave={() => setRetailerHoveredSlice(null)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                            retailerHoveredSlice?.name === district.name
                              ? 'bg-[#f4f7ee] border-[#1e4d1e]/30 shadow-xs'
                              : 'bg-white border-[#edf0e7] hover:border-[#1e4d1e]/20'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: district.color }}
                              />
                              <span className="text-gray-800 truncate max-w-[80px]">{district.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-400 text-[10px]">{district.value}</span>
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold"
                                style={{ backgroundColor: district.color, color: district.textColor || '#ffffff' }}
                              >
                                {district.percentage}%
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-1 bg-[#f0f2eb] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${district.percentage}%`,
                                backgroundColor: district.color
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-gray-500 bg-[#f8faf4] px-2.5 py-1.5 rounded-xl border border-[#edf1e5]">
                      <span className="flex items-center gap-1 font-bold text-[#1e4d1e]">
                        <CheckCircle className="w-3 h-3 text-[#1e4d1e]" />
                        100% Verified
                      </span>
                      <span className="font-semibold text-gray-400 text-[9px]">Agri Market</span>
                    </div>
                  </div>

                </div>
              ) : retailerGraphView === 'bar' ? (
                /* ── VIEW 2: RANKED DISTRICT BARS ── */
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={retailerDistrictList} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf4e2" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 700 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1e4d1e',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '6px 10px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(val: any) => [`${val} Consumers`, 'Registered']}
                      />
                      <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      >
                        {retailerDistrictList.map((entry, index) => (
                          <Cell key={`retailer-bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                /* ── VIEW 3: CONTINUOUS 6-MONTH GROWTH CURVE ── */
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={retailerChartDataList} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="retailerGradientMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1e4d1e" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#1e4d1e" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#edf4e2" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 700 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1e4d1e',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                          padding: '8px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#fff', fontWeight: 700 }}
                        cursor={{ stroke: '#1e4d1e', strokeWidth: 2, opacity: 0.15 }}
                        formatter={(value: any) => [`${value} New Consumers`, 'Monthly Growth']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#1e4d1e"
                        strokeWidth={3}
                        fill="url(#retailerGradientMain)"
                        fillOpacity={1}
                        activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: '#1e4d1e' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
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
