'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Download, Filter } from 'lucide-react';

interface ReportsData {
  topProducts: Array<{ name: string; price: number; category: string; salesCount: number }>;
  userGrowth: Record<string, number>;
  revenueData: Record<string, number>;
  categoryBreakdown: Array<{ _id: string; count: number; revenue: number }>;
}

const ReportsAnalytics = () => {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center h-full">
          <div className="text-gray-500">Loading reports...</div>
        </div>
      </AdminLayout>
    );
  }

  const userGrowthData = Object.entries(data?.userGrowth || {}).map(([month, count]) => ({
    month,
    users: count,
  }));

  const revenueChartData = Object.entries(data?.revenueData || {}).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  const COLORS = ['#16a34a', '#86efac', '#dcfce7', '#bbf7d0', '#a7f3d0'];

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header with Export */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">In-depth analysis of platform performance and growth metrics.</p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter size={18} />
            <span className="text-sm">Filter</span>
          </button>
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Last Year</option>
          </select>
        </div>

        {/* User Growth & Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">User Growth Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.categoryBreakdown || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry._id}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(data?.categoryBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Products</h2>
            <div className="space-y-4">
              {(data?.topProducts || []).slice(0, 5).map((product, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${product.price}</p>
                    <p className="text-sm text-gray-600">{product.salesCount} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">$456.78</p>
            <p className="text-green-600 text-sm mt-2">↑ 12.5% vs last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">3.24%</p>
            <p className="text-green-600 text-sm mt-2">↑ 0.8% vs last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">Customer Retention</p>
            <p className="text-2xl font-bold text-gray-900">68%</p>
            <p className="text-green-600 text-sm mt-2">↑ 2.1% vs last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">Market Growth</p>
            <p className="text-2xl font-bold text-gray-900">+18.7%</p>
            <p className="text-green-600 text-sm mt-2">YoY growth</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsAnalytics;
