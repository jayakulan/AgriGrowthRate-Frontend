'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Users, Package, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';

interface Analytics {
  users: { total: number; farmers: number; consumers: number; admins: number };
  products: { total: number; active: number; pending: number };
  orders: { total: number; delivered: number; pending: number };
  revenue: number;
  monthlyOrderTrend: Record<string, number>;
}

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(response.data.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center h-full">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  const trendData = Object.entries(analytics?.monthlyOrderTrend || {}).map(([month, count]) => ({
    month,
    orders: count,
  }));

  const userDistribution = [
    { name: 'Farmers', value: analytics?.users.farmers || 0 },
    { name: 'Consumers', value: analytics?.users.consumers || 0 },
    { name: 'Admins', value: analytics?.users.admins || 0 },
  ];

  const COLORS = ['#16a34a', '#86efac', '#dcfce7'];

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening on your platform today.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={analytics?.users.total || 0}
            color="bg-blue-500"
          />
          <StatCard
            icon={Package}
            label="Total Products"
            value={analytics?.products.total || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={analytics?.orders.total || 0}
            color="bg-purple-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={analytics?.revenue || 0}
            color="bg-orange-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Orders Trend */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Orders Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">User Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="text-yellow-500" size={24} />
              <h3 className="font-bold text-gray-900">Pending Products</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{analytics?.products.pending || 0}</p>
            <p className="text-gray-600 text-sm mt-2">Awaiting approval</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="text-green-500" size={24} />
              <h3 className="font-bold text-gray-900">Active Products</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{analytics?.products.active || 0}</p>
            <p className="text-gray-600 text-sm mt-2">Live on marketplace</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingCart className="text-blue-500" size={24} />
              <h3 className="font-bold text-gray-900">Pending Orders</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{analytics?.orders.pending || 0}</p>
            <p className="text-gray-600 text-sm mt-2">Require attention</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
