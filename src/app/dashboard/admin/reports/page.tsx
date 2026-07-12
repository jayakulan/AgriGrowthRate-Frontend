'use client';

import React, { useEffect, useState, useRef } from 'react';
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
import api from '@/lib/axios';
import { 
  Download, 
  Users, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Package, 
  ShoppingCart, 
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [stats, setStats] = useState({
    activeUsers: 0,
    productsSold: 0,
    totalOrdersCount: 0,
    totalRevenue: 0,
  });

  // Old Reports states & ref
  const [oldReportsOpen, setOldReportsOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<'none' | 'order' | 'product'>('none');
  const oldReportsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (oldReportsRef.current && !oldReportsRef.current.contains(event.target as Node)) {
        setOldReportsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchReports();
  }, [timeFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/reports').catch(() => null);

      if (response && response.data && response.data.data) {
        const resData = response.data.data;
        setData(resData);
        if (resData.stats) {
          setStats(resData.stats);
        }
      }
    } catch (error) {
      console.warn('Reports backend unreachable:', error);
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#1e4d1e', '#4a6d2f', '#7b9d62', '#a7c292', '#d2dfc2'];

  // Process live data from system database only (no mock data fallbacks)
  const userGrowthChart = data?.userGrowth && Object.keys(data.userGrowth).length > 0
    ? Object.entries(data.userGrowth)
        .map(([month, value]) => ({ month, value }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    : [];

  const revenueTrendChart = data?.revenueData && Object.keys(data.revenueData).length > 0
    ? Object.entries(data.revenueData)
        .map(([month, value]) => ({ month, value }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    : [];

  const categoryBreakdownChart = data?.categoryBreakdown && data.categoryBreakdown.length > 0
    ? data.categoryBreakdown.map((item, idx) => ({
        name: item._id || 'Uncategorized',
        value: item.count || 0,
        color: colors[idx % colors.length]
      }))
    : [];

  const topProductsList = data?.topProducts && data.topProducts.length > 0
    ? data.topProducts
    : [];

  // Export dynamically generated system summary report for last month
  const handleExportReport = () => {
    if (loading) {
      toast.error("Please wait until reports are fully loaded");
      return;
    }

    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const lastMonthName = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    const productsHtml = topProductsList.length > 0
      ? topProductsList.map(prod => `
        <tr>
          <td><strong>${prod.name}</strong></td>
          <td>${prod.category}</td>
          <td>₹${prod.price.toLocaleString('en-IN')}</td>
          <td><strong>${prod.salesCount || 0}</strong> units</td>
        </tr>
      `).join('')
      : `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 20px;">No top performing products found in system</td></tr>`;

    const categoriesHtml = categoryBreakdownChart.length > 0 
      ? categoryBreakdownChart.map(cat => `
        <tr>
          <td><strong>${cat.name}</strong></td>
          <td>${cat.value} products</td>
          <td>₹${((data?.categoryBreakdown?.find(c => c._id === cat.name)?.revenue) || 0).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')
      : `<tr><td colspan="3" style="text-align: center; color: #94a3b8; padding: 20px;">No category data available in system</td></tr>`;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AgriGrowthRate Report - ${lastMonthName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          body {
            font-family: 'Outfit', sans-serif;
            color: #1e293b;
            background: #fff;
            margin: 0;
            padding: 40px;
            -webkit-print-color-adjust: exact;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #1e4d1e;
            padding-bottom: 24px;
            margin-bottom: 40px;
          }
          .logo-container {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .logo-text {
            font-size: 28px;
            font-weight: 800;
            color: #1e4d1e;
            letter-spacing: -0.5px;
          }
          .logo-subtext {
            font-size: 11px;
            font-weight: 600;
            color: #4a6d2f;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .report-info {
            text-align: right;
          }
          .report-info h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
          }
          .report-info p {
            margin: 6px 0 0 0;
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 48px;
          }
          .kpi-card {
            border: 1px solid #e2e8f0;
            padding: 20px;
            border-radius: 16px;
            background: #fdfdfb;
          }
          .kpi-label {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .kpi-value {
            font-size: 22px;
            font-weight: 800;
            color: #1e4d1e;
          }
          .section-title {
            font-size: 13px;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 10px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          .table th {
            background: #edf4e2;
            color: #1e4d1e;
            text-align: left;
            padding: 12px 16px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .table td {
            padding: 14px 16px;
            font-size: 13px;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
          }
          .footer {
            margin-top: 60px;
            border-top: 1px solid #e2e8f0;
            padding-top: 24px;
            font-size: 10px;
            font-weight: 600;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            <div>
              <div class="logo-text">AgriGrowthRate</div>
              <div class="logo-subtext">Platform Administration</div>
            </div>
          </div>
          <div class="report-info">
            <h1>Monthly Summary Report</h1>
            <p>Statement Period: ${lastMonthName}</p>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Active Users</div>
            <div class="kpi-value">${stats.activeUsers.toLocaleString()}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Products Sold</div>
            <div class="kpi-value">${stats.productsSold.toLocaleString()}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Total Orders</div>
            <div class="kpi-value">${stats.totalOrdersCount.toLocaleString()}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Total Revenue</div>
            <div class="kpi-value">₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div class="section-title">Top Performing Products</div>
        <table class="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sales Volume</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <div class="section-title">Sales by Category Breakdown</div>
        <table class="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Product Count</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            ${categoriesHtml}
          </tbody>
        </table>

        <div class="footer">
          <span>Confidential - Internal Admin Report</span>
          <span>Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      toast.error("Pop-up blocked. Please allow popups to export the report.");
    }
  };

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto relative select-none">
        
        {/* ── HEADER ACTIONS ROW ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 select-none pb-2">
          {/* Calendar Filter */}
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
            className="inline-flex items-center justify-center gap-2 bg-[#edf4e2] hover:bg-[#e1ebd2] text-[#1e4d1e] px-5 py-3 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer select-none shrink-0"
          >
            <Download className="w-4 h-4 text-[#1e4d1e]" />
            <span>Export PDF</span>
          </button>

          {/* Old Reports Dropdown */}
          <div className="relative" ref={oldReportsRef}>
            <button
              onClick={() => {
                setOldReportsOpen(!oldReportsOpen);
                setSelectedReportType('none');
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-3 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer select-none shrink-0"
            >
              <span>Old Reports</span>
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            </button>

            {oldReportsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#e4e6df] rounded-2xl shadow-xl z-50 p-4 text-left">
                {selectedReportType === 'none' && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-1 mb-2">
                      Select Report Type
                    </h4>
                    <button
                      onClick={() => setSelectedReportType('order')}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#edf4e2]/60 hover:text-[#1e4d1e] rounded-lg transition-all flex items-center justify-between"
                    >
                      <span>Order Reports</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setSelectedReportType('product')}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#edf4e2]/60 hover:text-[#1e4d1e] rounded-lg transition-all flex items-center justify-between"
                    >
                      <span>Product Reports</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                )}

                {selectedReportType === 'order' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-1 mb-2">
                      <button
                        onClick={() => setSelectedReportType('none')}
                        className="text-[10px] font-bold text-gray-400 hover:text-[#1e4d1e] flex items-center gap-1"
                      >
                        ← Back
                      </button>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        Order Reports
                      </span>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {['jan.pdf', 'feb.pdf', 'mar.pdf', 'apr.pdf', 'may.pdf', 'jun.pdf'].map((file) => (
                        <button
                          key={file}
                          onClick={() => toast.success(`Downloading order report: ${file} 📄`)}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1e4d1e] rounded-md transition-all truncate"
                        >
                          📄 {file}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReportType === 'product' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-1 mb-2">
                      <button
                        onClick={() => setSelectedReportType('none')}
                        className="text-[10px] font-bold text-gray-400 hover:text-[#1e4d1e] flex items-center gap-1"
                      >
                        ← Back
                      </button>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        Product Reports
                      </span>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {['jan.pdf', 'feb.pdf', 'mar.pdf', 'apr.pdf', 'may.pdf', 'jun.pdf'].map((file) => (
                        <button
                          key={file}
                          onClick={() => toast.success(`Downloading product report: ${file} 📄`)}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1e4d1e] rounded-md transition-all truncate"
                        >
                          📄 {file}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── METRICS ROW (4 Cards Redesigned) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Active Users */}
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-center justify-between h-36 select-none">
            <div className="w-[60%] flex flex-col justify-between h-full text-left">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Active Users</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 leading-none mt-2">
                  {loading ? '...' : stats.activeUsers.toLocaleString()}
                </h3>
              </div>
              <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-2">
                ▲ 4.2% vs last week
              </p>
            </div>
            
            <div className="w-[40%] flex items-center justify-center pl-2">
              <svg viewBox="0 0 100 40" className="w-full h-10" fill="none">
                <defs>
                  <linearGradient id="sparklineGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e4d1e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#1e4d1e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d="M 0 32 Q 15 15 30 25 T 60 12 T 90 5 L 90 40 L 0 40 Z" fill="url(#sparklineGrad1)" />
                <path d="M 0 32 Q 15 15 30 25 T 60 12 T 90 5" stroke="#1e4d1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 2: Products Sold */}
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-center justify-between h-36 select-none">
            <div className="w-[60%] flex flex-col justify-between h-full text-left">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Products Sold</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 leading-none mt-2">
                  {loading ? '...' : stats.productsSold.toLocaleString()}
                </h3>
              </div>
              <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-2">
                Grains leading (60%)
              </p>
            </div>
            
            <div className="w-[40%] flex items-center justify-center pl-2">
              <div className="w-full space-y-1 text-left">
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-500">
                  <span>Usage</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-[#f4f5f0] rounded-full h-2 overflow-hidden border border-gray-100">
                  <div className="bg-[#1e4d1e] h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Total Orders */}
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-center justify-between h-36 select-none">
            <div className="w-[60%] flex flex-col justify-between h-full text-left">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Total Orders</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 leading-none mt-2">
                  {loading ? '...' : stats.totalOrdersCount.toLocaleString()}
                </h3>
              </div>
              <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-2">
                ▲ 12.5% vs last month
              </p>
            </div>
            
            <div className="w-[40%] flex items-center justify-center pl-2">
              <div className="flex items-end justify-between w-full h-10 px-1 gap-1">
                <div className="w-2.5 bg-[#edf4e2] rounded-t h-4" />
                <div className="w-2.5 bg-[#edf4e2] rounded-t h-7" />
                <div className="w-2.5 bg-[#1e4d1e] rounded-t h-10" />
                <div className="w-2.5 bg-[#edf4e2] rounded-t h-5" />
                <div className="w-2.5 bg-[#edf4e2] rounded-t h-8" />
                <div className="w-2.5 bg-[#1e4d1e] rounded-t h-9" />
                <div className="w-2.5 bg-[#edf4e2] rounded-t h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-center justify-between h-36 select-none">
            <div className="w-[60%] flex flex-col justify-between h-full text-left">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Total Revenue</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 leading-none mt-2">
                  {loading ? '...' : `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
              </div>
              <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-2">
                ▲ 24.3% vs last month
              </p>
            </div>
            
            <div className="w-[40%] flex items-center justify-center pl-2">
              <svg viewBox="0 0 100 40" className="w-full h-10" fill="none">
                <defs>
                  <linearGradient id="sparklineGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e4d1e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#1e4d1e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d="M 0 35 L 20 28 L 40 30 L 60 18 L 80 12 L 100 5 L 100 40 L 0 40 Z" fill="url(#sparklineGrad2)" />
                <path d="M 0 35 L 20 28 L 40 30 L 60 18 L 80 12 L 100 5" stroke="#1e4d1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
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
              {userGrowthChart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs font-bold text-gray-400">
                  No user growth data in system.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              )}
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
              {revenueTrendChart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs font-bold text-gray-400">
                  No revenue trend data in system.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrendChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              )}
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
              {categoryBreakdownChart.length === 0 ? (
                <div className="text-center py-10 w-full text-xs text-gray-400 font-bold">
                  No sales category data available in system.
                </div>
              ) : (
                <>
                  <div className="relative w-36 h-36 select-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryBreakdownChart}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={52}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {categoryBreakdownChart.map((entry, index) => (
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
                    {categoryBreakdownChart.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-gray-500 min-w-16 truncate">{item.name}</span>
                        <span className="text-xs font-extrabold text-gray-800">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
              {topProductsList.length === 0 ? (
                <div className="text-center py-10 w-full text-xs text-gray-400 font-bold">
                  No top performing products sold in system yet.
                </div>
              ) : (
                topProductsList.map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3.5 text-left">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 leading-snug">{prod.name}</p>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-[#f4f5f0] text-[8px] font-bold text-gray-500 uppercase mt-0.5">
                        {prod.category}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-[#1e4d1e]">₹{prod.price.toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-gray-400 font-bold">{prod.salesCount || 0} sales</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
