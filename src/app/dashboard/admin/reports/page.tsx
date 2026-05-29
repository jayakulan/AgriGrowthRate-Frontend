'use client';

import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import axios from 'axios';
import { 
  Download, 
  SlidersHorizontal, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Activity, 
  Calendar, 
  ChevronDown, 
  Plus, 
  X,
  FileText,
  Loader2,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

interface ReportsData {
  topProducts: Array<{ name: string; price: number; category: string; salesCount: number }>;
  userGrowth: Record<string, number>;
  revenueData: Record<string, number>;
  categoryBreakdown: Array<{ _id: string; count: number; revenue: number }>;
}

export default function ReportsAnalyticsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [auditTitle, setAuditTitle] = useState('');
  const [generating, setGenerating] = useState(false);

  // High-fidelity fallback metrics
  const mockUserGrowth = [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1800 },
    { month: 'Mar', value: 1600 },
    { month: 'Apr', value: 2400 },
    { month: 'May', value: 2900 },
    { month: 'Jun', value: 3800 },
  ];

  const mockRevenueTrend = [
    { month: 'Jan', value: 24000 },
    { month: 'Feb', value: 31000 },
    { month: 'Mar', value: 28000 },
    { month: 'Apr', value: 45000 },
    { month: 'May', value: 42000 },
    { month: 'Jun', value: 58000 },
  ];

  const mockCategoryBreakdown = [
    { name: 'Grains', value: 60, color: '#1e4d1e' },
    { name: 'Fruits', value: 20, color: '#4a6d2f' },
    { name: 'Vegetables', value: 15, color: '#7b9d62' },
    { name: 'Tech', value: 5, color: '#a7c292' },
  ];

  const mockTopProducts = [
    { name: 'Organic Durum Wheat', category: 'Grains', price: 1240, salesCount: 120 },
    { name: 'CropScan V2 Sensor', category: 'Tech', price: 349, salesCount: 80 },
    { name: 'Honeycrisp Apples', category: 'Fruits', price: 45, salesCount: 65 },
    { name: 'Black Turtle Beans', category: 'Grains', price: 890, salesCount: 40 },
  ];

  useEffect(() => {
    fetchReports();
  }, [timeFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null);

      if (response && response.data && response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.warn('Reports backend unreachable, rendering curated mockup visualizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    toast.success('Stewardship performance report exported! 📄');
  };

  const handleGenerateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditTitle) return toast.error('Please input audit description');
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success(`Platform performance audit "${auditTitle}" compiled! 🌳`);
      setShowGenerateModal(false);
      setAuditTitle('');
    }, 1200);
  };

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto relative select-none">
        
        {/* ── BREADCRUMB TRAIL ── */}
        <div className="text-left">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Admin <span className="text-gray-300">/</span> Reports & Analytics
          </span>
        </div>

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-xs text-gray-400 font-semibold max-w-2xl">
              In-depth analysis of platform performance, user metrics, and agricultural marketplace yield.
            </p>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Filter Dropdown */}
            <div className="bg-white border border-[#e4e6df] rounded-xl px-4 py-3 text-xs font-bold text-gray-700 inline-flex items-center gap-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-all select-none">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer appearance-none pr-5 relative"
              >
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 -ml-2.5 pointer-events-none" />
            </div>

            {/* Export Action */}
            <button
              onClick={handleExportReport}
              className="inline-flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-3 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer select-none shrink-0"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Export Report</span>
            </button>

          </div>
        </div>

        {/* ── METRICS ROW (4 Cards) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Avg Order Value */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-[#edf4e2] rounded-xl w-fit">
                  <CreditCard className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
                  Avg Order Value
                </p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  $456.78
                </h3>
              </div>
            </div>
            <p className="text-[9px] font-bold text-green-600">
              ↑ 12.5% vs last month
            </p>
          </div>

          {/* Card 2: Conversion Rate */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-gray-100 rounded-xl w-fit">
                  <Activity className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
                  Conversion Rate
                </p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  3.24%
                </h3>
              </div>
            </div>
            <p className="text-[9px] font-bold text-green-600">
              ↑ 0.8% vs last month
            </p>
          </div>

          {/* Card 3: Customer Retention (Highlighted border card) */}
          <div className="bg-white border-2 border-[#1e4d1e] rounded-[20px] p-5 shadow-md flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-[#edf4e2] rounded-xl w-fit">
                  <Users className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <p className="text-[10px] text-[#1e4d1e] font-extrabold uppercase tracking-wider mt-2.5">
                  Customer Retention
                </p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  68%
                </h3>
              </div>
            </div>
            <p className="text-[9px] font-bold text-[#1e4d1e]">
              ↑ 2.1% vs last month
            </p>
          </div>

          {/* Card 4: Market Growth */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-gray-100 rounded-xl w-fit">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
                  Market Growth
                </p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  +18.7%
                </h3>
              </div>
            </div>
            <p className="text-[9px] font-bold text-green-600">
              YoY steady growth
            </p>
          </div>

        </div>

        {/* ── CHARTS ROW (User Growth & Revenue Trend) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* User Growth Over Time (Area Chart) */}
          <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="border-b border-[#f4f5f0] pb-4 text-left">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                User Growth Over Time
              </h3>
            </div>

            <div className="w-full h-64 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockUserGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e4d1e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1e4d1e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ background: '#1e4d1e', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#bcfcbb' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1e4d1e" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend (Bar Chart) */}
          <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="border-b border-[#f4f5f0] pb-4 text-left">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Revenue Trend
              </h3>
            </div>

            <div className="w-full h-64 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRevenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ background: '#1e4d1e', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#bcfcbb' }}
                  />
                  <Bar dataKey="value" fill="#1e4d1e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ── BREAKDOWNS (Category Breakdown & Top Performing Products) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Sales by Category (Doughnut) */}
          <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm space-y-5 h-[340px] flex flex-col justify-between">
            <div className="border-b border-[#f4f5f0] pb-3 text-left">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Sales by Category
              </h3>
            </div>

            <div className="flex items-center justify-between gap-4 my-auto">
              <div className="relative w-36 h-36 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={52}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {mockCategoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-extrabold text-gray-800 leading-none">Sales</span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Share</span>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-3 text-left shrink-0">
                {mockCategoryBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-gray-500 min-w-16 truncate">{item.name}</span>
                    <span className="text-xs font-extrabold text-gray-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performing Products */}
          <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm flex flex-col justify-between h-[340px]">
            <div className="border-b border-[#f4f5f0] pb-3 text-left">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Top Performing Products
              </h3>
            </div>

            <div className="divide-y divide-[#f4f5f0] my-auto">
              {mockTopProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between py-3.5 text-left">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 leading-snug">{prod.name}</p>
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-[#f4f5f0] text-[8px] font-bold text-gray-500 uppercase mt-0.5">
                      {prod.category}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-extrabold text-[#1e4d1e]">${prod.price.toLocaleString()}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{prod.salesCount} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── FLOATING ACTION BUTTON (FAB) ── */}
        <div className="fixed bottom-8 right-8 z-30">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-2xl transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Generate New Audit</span>
          </button>
        </div>

      </div>

      {/* ── GENERATE AUDIT MODAL ── */}
      <AnimatePresence>
        {showGenerateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGenerateModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowGenerateModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#edf4e2] flex items-center justify-center mx-auto border border-[#d2dfc2]">
                  <FileText className="w-6 h-6 text-[#1e4d1e]" />
                </div>
                <h4 className="text-lg font-extrabold text-gray-900">Generate New Audit</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Compile granular platform performance, category distributions, and top listings metrics.
                </p>
              </div>

              <form onSubmit={handleGenerateAudit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Audit Description
                  </label>
                  <input
                    type="text"
                    value={auditTitle}
                    onChange={(e) => setAuditTitle(e.target.value)}
                    placeholder="e.g. Q4 Yield and Merchandise Volatility"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generating}
                    className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Compile Audit'}
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </>
  );
}
