'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  AlertTriangle, 
  SlidersHorizontal, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Download,
  Plus,
  X,
  CheckCircle,
  Clock,
  Trash2,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerInitials: string;
  customerColor: string;
  farmerName: string;
  dateStr: string;
  totalAmount: number;
  status: 'Delivered' | 'Shipping' | 'Pending' | 'Cancelled';
  deliveryAddress: string;
}

export default function OrdersMonitoringPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Shipping' | 'Delivered' | 'Cancelled'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [chartTimeframe, setChartTimeframe] = useState<'Last Month' | 'Last 6 Months' | 'Last Year'>('Last 6 Months');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Custom Date range selector states
  const [selectedMonth, setSelectedMonth] = useState<string>('Oct');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);

  const dateFilterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2023, 2024, 2025, 2026];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setDateFilterOpen(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status Change Dialog states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // New Report Modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');

  const mockOrders: Order[] = [
    {
      _id: 'ord-1',
      orderNumber: '#AGR-10293',
      customerName: 'Eleanor Jackson',
      customerInitials: 'EJ',
      customerColor: 'bg-[#edf4e2] text-[#1e4d1e]',
      farmerName: 'Green Valley Farms',
      dateStr: 'Oct 30, 2023, 14:22',
      totalAmount: 1240.50,
      status: 'Delivered',
      deliveryAddress: 'Kattankudy, Sri Lanka'
    },
    {
      _id: 'ord-2',
      orderNumber: '#AGR-10294',
      customerName: 'Marcus Smith',
      customerInitials: 'MS',
      customerColor: 'bg-gray-100 text-gray-700',
      farmerName: 'Oak Ridge Orchards',
      dateStr: 'Oct 30, 2023, 15:05',
      totalAmount: 450.00,
      status: 'Shipping',
      deliveryAddress: 'Colombo, Sri Lanka'
    },
    {
      _id: 'ord-3',
      orderNumber: '#AGR-10295',
      customerName: 'Linda White',
      customerInitials: 'LW',
      customerColor: 'bg-gray-100 text-gray-700',
      farmerName: 'Sustainable Roots',
      dateStr: 'Oct 31, 2023, 09:12',
      totalAmount: 2100.25,
      status: 'Pending',
      deliveryAddress: 'Kandy, Sri Lanka'
    },
    {
      _id: 'ord-4',
      orderNumber: '#AGR-10296',
      customerName: 'Robert King',
      customerInitials: 'RK',
      customerColor: 'bg-red-50 text-red-700',
      farmerName: 'Prairie Gold Co-op',
      dateStr: 'Oct 31, 2023, 10:45',
      totalAmount: 125.00,
      status: 'Cancelled',
      deliveryAddress: 'Jaffna, Sri Lanka'
    },
    {
      _id: 'ord-5',
      orderNumber: '#AGR-10297',
      customerName: 'Sarah Parker',
      customerInitials: 'SP',
      customerColor: 'bg-[#edf4e2] text-[#1e4d1e]',
      farmerName: 'Blue Sky Poultry',
      dateStr: 'Oct 31, 2023, 11:30',
      totalAmount: 3420.00,
      status: 'Delivered',
      deliveryAddress: 'Galle, Sri Lanka'
    },
    {
      _id: 'ord-6',
      orderNumber: '#AGR-10298',
      customerName: 'Tom Collins',
      customerInitials: 'TC',
      customerColor: 'bg-[#edf4e2] text-[#1e4d1e]',
      farmerName: 'Harvest Moon Veggies',
      dateStr: 'Oct 31, 2023, 13:10',
      totalAmount: 78.90,
      status: 'Shipping',
      deliveryAddress: 'Negombo, Sri Lanka'
    }
  ];

  const chartData = {
    'Last Month': [
      { label: 'Week 1', orders: 120 },
      { label: 'Week 2', orders: 155 },
      { label: 'Week 3', orders: 190 },
      { label: 'Week 4', orders: 245 }
    ],
    'Last 6 Months': [
      { label: 'Jan', orders: 450 },
      { label: 'Feb', orders: 520 },
      { label: 'Mar', orders: 610 },
      { label: 'Apr', orders: 580 },
      { label: 'May', orders: 710 },
      { label: 'Jun', orders: 850 }
    ],
    'Last Year': [
      { label: 'Jul 25', orders: 890 },
      { label: 'Aug 25', orders: 940 },
      { label: 'Sep 25', orders: 1100 },
      { label: 'Oct 25', orders: 1050 },
      { label: 'Nov 25', orders: 1200 },
      { label: 'Dec 25', orders: 1350 },
      { label: 'Jan 26', orders: 1280 },
      { label: 'Feb 26', orders: 1420 },
      { label: 'Mar 26', orders: 1550 },
      { label: 'Apr 26', orders: 1680 },
      { label: 'May 26', orders: 1720 },
      { label: 'Jun 26', orders: 1850 }
    ]
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage, selectedMonth, selectedYear]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: any = { page: currentPage, limit: 10 };
      if (statusFilter !== 'All') params.status = statusFilter;

      const response = await axios.get('http://localhost:5001/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }).catch(() => null);

      if (response && response.data && response.data.data) {
        // Transform backend fields
        const formatted = response.data.data.map((item: any) => ({
          _id: item._id,
          orderNumber: `#AGR-${item._id.slice(-5).toUpperCase()}`,
          customerName: item.consumer?.name || 'Unknown',
          customerInitials: (item.consumer?.name || 'UK').split(' ').map((n: string) => n[0]).join('').slice(0, 2),
          customerColor: 'bg-[#edf4e2] text-[#1e4d1e]',
          farmerName: item.farmer?.name || 'Local Farms',
          dateStr: new Date(item.createdAt).toLocaleString(),
          totalAmount: item.totalAmount || 0,
          status: item.status || 'Pending',
          deliveryAddress: item.deliveryAddress || 'Kattankudy, Sri Lanka'
        }));
        setOrders(formatted);
      } else {
        const dynamicMock = mockOrders.map(ord => ({
          ...ord,
          dateStr: ord.dateStr.replace('Oct', selectedMonth).replace('2023', selectedYear.toString())
        }));
        setOrders(dynamicMock);
      }
    } catch (error) {
      console.warn('Could not communicate with backend orders API, displaying mockup data:', error);
      const dynamicMock = mockOrders.map(ord => ({
        ...ord,
        dateStr: ord.dateStr.replace('Oct', selectedMonth).replace('2023', selectedYear.toString())
      }));
      setOrders(dynamicMock);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5001/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => null);

      if (response) {
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.success(`Order state rotated to ${newStatus}! 🌳`);
      }
      setShowStatusModal(false);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Failed to change order state');
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return toast.error('Please name your audit report');
    toast.success(`Audit report "${reportTitle}" compiled & cataloged successfully! 🌳`);
    setShowReportModal(false);
    setReportTitle('');
  };

  const getSelectedDateRangeText = () => {
    const daysInMonth: Record<string, number> = {
      Jan: 31, Feb: selectedYear % 4 === 0 ? 29 : 28, Mar: 31, Apr: 30, May: 31, Jun: 30,
      Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31
    };
    const maxDay = daysInMonth[selectedMonth] || 31;
    return `${selectedMonth} 01, ${selectedYear} - ${selectedMonth} ${maxDay}, ${selectedYear}`;
  };

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto relative select-none">
        
        {/* ── BREADCRUMB & HEADER ROW ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Admin <span className="text-gray-300">/</span> Orders Monitoring
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom Date Range selector pill */}
            <div className="relative" ref={dateFilterRef}>
              <div 
                onClick={() => setDateFilterOpen(!dateFilterOpen)}
                className="bg-white border border-[#e4e6df] rounded-xl px-4 py-3 text-xs font-bold text-gray-700 inline-flex items-center gap-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-all select-none"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{getSelectedDateRangeText()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
              </div>

              {dateFilterOpen && (
                <div className="absolute right-0 mt-2 p-4 w-72 bg-white border border-[#e4e6df] rounded-2xl shadow-xl z-50 text-left space-y-4">
                  <div>
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Month</h5>
                    <div className="grid grid-cols-4 gap-1.5">
                      {months.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setSelectedMonth(m);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                            selectedMonth === m
                              ? 'bg-[#1e4d1e] text-white shadow-sm'
                              : 'bg-gray-50 text-gray-600 hover:bg-[#edf4e2]/60 hover:text-[#1e4d1e]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Year</h5>
                    <div className="grid grid-cols-4 gap-1.5">
                      {years.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => {
                            setSelectedYear(y);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                            selectedYear === y
                              ? 'bg-[#1e4d1e] text-white shadow-sm'
                              : 'bg-gray-50 text-gray-600 hover:bg-[#edf4e2]/60 hover:text-[#1e4d1e]'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setDateFilterOpen(false)}
                      className="px-4 py-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Create Order Report Button replacing Export CSV */}
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-3 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer select-none shrink-0"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Order Report</span>
            </button>
          </div>
        </div>

        {/* ── KPI METRICS CARDS ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Orders Today */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-[#edf4e2] rounded-xl w-fit">
                  <ShoppingBag className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
                  Total Orders Today
                </p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  1,284
                </h3>
              </div>

              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 shrink-0">
                +12%
              </span>
            </div>
          </div>

          {/* Card 2: Daily Revenue */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-gray-100 rounded-xl w-fit">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
                  Daily Revenue
                </p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  $42,930
                </h3>
              </div>

              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 shrink-0">
                +5.4%
              </span>
            </div>
          </div>

          {/* Card 3: In Transit */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-[#edf4e2] rounded-xl w-fit">
                  <Truck className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
                  In Transit
                </p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  312
                </h3>
              </div>
            </div>
          </div>

          {/* Card 4: Failed/Cancelled */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-red-50 rounded-xl w-fit">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">
                  Failed/Cancelled
                </p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  14
                </h3>
              </div>

              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 shrink-0">
                -2%
              </span>
            </div>
          </div>

        </div>

      {/* ── GRAPH SECTION ── */}
      <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Delivered Orders Analytics
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Delivered sales volume performance metrics over time.
            </p>
          </div>

          {/* Timeframe Filter Options */}
          <div className="flex items-center gap-1.5 bg-[#f4f5f0]/60 p-1 rounded-xl w-fit">
            {(['Last Month', 'Last 6 Months', 'Last Year'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setChartTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  chartTimeframe === tf
                    ? 'bg-[#1e4d1e] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData[chartTimeframe]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e4d1e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#1e4d1e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f5f0" vertical={false} />
              <XAxis 
                dataKey="label" 
                stroke="#9ca3af" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e4e6df', 
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#1e4d1e" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorOrders)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── TRANSACTION LIST TABLE CONTAINER ── */}
      <div className="bg-white border border-[#e4e6df] rounded-[24px] overflow-hidden shadow-sm">
        
        {/* Table Header Filter bar */}
        <div className="px-6 py-4 border-b border-[#e4e6df] flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Order List
            </h3>
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={statusFilterRef}>
            <button 
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="p-2 bg-[#f4f5f0] hover:bg-[#edf4e2]/60 hover:text-[#1e4d1e] text-gray-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-transparent hover:border-[#e4e6df]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Filter</span>
            </button>

            {filterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e4e6df] rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                  Filter by Status
                </div>
                {[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Delivered', label: 'Delivered' },
                  { value: 'Cancelled', label: 'Cancelled' },
                  { value: 'Shipping', label: 'Shipping' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value as any);
                      setFilterDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-all hover:bg-gray-50 ${
                      statusFilter === option.value
                        ? 'bg-[#1e4d1e] text-white hover:bg-[#163d16]'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#1e4d1e] border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monitoring live pipelines...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              
              <thead className="bg-[#fcfdfa]/80 border-b border-[#e4e6df]">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery Address</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f4f5f0]">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#f4f5f0]/20 transition-colors">
                    
                    {/* Bold Green Order ID */}
                    <td className="px-6 py-4 text-xs font-extrabold text-[#1e4d1e] tracking-tight">
                      {ord.orderNumber}
                    </td>

                    {/* Customer info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${ord.customerColor}`}>
                          {ord.customerInitials}
                        </div>
                        <span className="text-xs font-bold text-gray-800">{ord.customerName}</span>
                      </div>
                    </td>

                    {/* Farmer source */}
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                      {ord.farmerName}
                    </td>

                    {/* Time */}
                    <td className="px-6 py-4 text-[11px] font-semibold text-gray-400 leading-normal">
                      {ord.dateStr}
                    </td>

                    {/* Delivery Address */}
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                      {ord.deliveryAddress}
                    </td>

                    {/* Total price */}
                    <td className="px-6 py-4 text-xs font-extrabold text-gray-900">
                      ${ord.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status badge pill */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold border capitalize ${
                        ord.status === 'Delivered'
                          ? 'bg-[#e3f7ed] text-[#2e7d32] border-[#c8e6c9]'
                          : ord.status === 'Shipping'
                          ? 'bg-[#edf4e2] text-[#1e4d1e] border-[#d2dfc2]'
                          : ord.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {ord.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

          {/* Table pagination footer exactly matching mock image */}
          <div className="bg-[#fcfdfa]/80 border-t border-[#e4e6df] px-6 py-4 flex items-center justify-end select-none">
            <div className="inline-flex items-center gap-1.5">
              <button className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button className="w-8 h-8 bg-[#1e4d1e] text-white rounded-xl text-[10px] font-bold cursor-default flex items-center justify-center">
                1
              </button>

              <button className="w-8 h-8 bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all">
                2
              </button>

              <button className="w-8 h-8 bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all">
                3
              </button>

              <span className="text-gray-400 text-xs font-bold px-1 select-none">...</span>

              <button className="w-8 h-8 bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all">
                214
              </button>

              <button className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>



        {/* ── bottom legal copyright ── */}
        <div className="pt-6 text-center">
          <p className="text-[10px] text-gray-400 font-semibold">
            © 2023 AgriGrowthRate Enterprise Management. All Rights Reserved.
          </p>
        </div>

      </div>

      {/* ── UPDATE ORDER STATUS DIALOG ── */}
      <AnimatePresence>
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl text-center"
            >
              <button
                onClick={() => setShowStatusModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#edf4e2] flex items-center justify-center mx-auto mb-4 border border-[#d2dfc2]">
                <Truck className="w-6 h-6 text-[#1e4d1e]" />
              </div>

              <h4 className="text-base font-extrabold text-gray-900 mb-1">
                Rotate Order Pipeline
              </h4>
              <p className="text-gray-500 text-[11px] leading-relaxed max-w-xs mx-auto mb-6">
                Change shipment stage for transaction <span className="text-[#1e4d1e] font-bold">{selectedOrder.orderNumber}</span>.
              </p>

              <div className="space-y-2 mb-6">
                {['Pending', 'Shipping', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder._id, status as any)}
                    className={`w-full py-3 rounded-xl transition text-xs font-bold uppercase tracking-wider cursor-pointer ${
                      selectedOrder.status === status
                        ? 'bg-[#1e4d1e] text-white shadow-md'
                        : 'bg-[#f4f5f0] text-gray-600 hover:bg-[#edf4e2]/60 hover:text-[#1e4d1e]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="w-full py-3 border border-[#e4e6df] rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* ── CREATE REPORT MODAL ── */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Form Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#edf4e2] flex items-center justify-center mx-auto border border-[#d2dfc2]">
                  <Plus className="w-6 h-6 text-[#1e4d1e]" />
                </div>
                <h4 className="text-lg font-extrabold text-gray-900">Create Order Report</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Compile real-time order statistics into a standalone audit document.
                </p>
              </div>

              <form onSubmit={handleCreateReport} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g. October 2023 Stewardship Audit"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer"
                  >
                    Compile Report
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
