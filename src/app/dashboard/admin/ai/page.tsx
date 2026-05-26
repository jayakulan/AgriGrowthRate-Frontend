'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Zap, TrendingUp, Smile, Frown, Settings } from 'lucide-react';

interface AIData {
  totalQueries: number;
  avgResponseTime: number;
  positiveReactions: number;
  negativeReactions: number;
  neutralReactions: number;
  sentimentAnalysis: Record<string, number>;
  recentActivity: Array<any>;
}

const AIManagement = () => {
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/ai-management', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch AI data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAIData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center h-full">
          <div className="text-gray-500">Loading AI Management data...</div>
        </div>
      </AdminLayout>
    );
  }

  const sentimentData = data?.sentimentAnalysis
    ? Object.entries(data.sentimentAnalysis).map(([sentiment, count]) => ({
        name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
        value: count,
      }))
    : [];

  const performanceData = [
    { time: '00:00', accuracy: 95 },
    { time: '04:00', accuracy: 94 },
    { time: '08:00', accuracy: 96 },
    { time: '12:00', accuracy: 97 },
    { time: '16:00', accuracy: 95 },
    { time: '20:00', accuracy: 96 },
  ];

  const COLORS = ['#16a34a', '#86efac', '#dcfce7'];

  const StatCard = ({ icon: Icon, label, value, change, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        {change && <span className="text-green-600 text-sm font-semibold">{change}</span>}
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Management</h1>
            <p className="text-gray-600 mt-2">Monitor and optimize AgriGrowth AI Advisor performance.</p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <Settings size={20} />
            <span>AI Settings</span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Zap}
            label="Total Queries"
            value={data?.totalQueries || 0}
            change="↑ 23.5%"
            color="bg-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Response Time"
            value={`${data?.avgResponseTime || 0}ms`}
            change="↓ 12ms"
            color="bg-green-500"
          />
          <StatCard
            icon={Smile}
            label="Positive Feedback"
            value={data?.positiveReactions || 0}
            color="bg-green-600"
          />
          <StatCard
            icon={Frown}
            label="Negative Feedback"
            value={data?.negativeReactions || 0}
            color="bg-red-500"
          />
        </div>

        {/* Sentiment Analysis & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sentiment Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Query Sentiment Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* AI Performance Over Time */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">AI Accuracy Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knowledge Base & Model Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Knowledge Base */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Knowledge Base Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Soil Composition Database</p>
                  <p className="text-sm text-gray-600">42.5 GB | Last updated 2h ago</p>
                </div>
                <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition">
                  Update
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Crop Disease Atlas</p>
                  <p className="text-sm text-gray-600">12 TB | Last updated 1d ago</p>
                </div>
                <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition">
                  Update
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Weather & Climate Data</p>
                  <p className="text-sm text-gray-600">8.7 TB | Streaming</p>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition">
                  Sync
                </button>
              </div>
            </div>
          </div>

          {/* Model Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Model Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Model Version</p>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">v2.4</span>
                </div>
                <p className="text-sm text-gray-600">Latest production model</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Inference Engine</p>
                  <span className="text-sm text-gray-600">GPU - RTX A6000</span>
                </div>
                <p className="text-sm text-gray-600">Optimized for low latency</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Training Mode</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">Continuous learning enabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent AI Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent AI Activity Logs</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(data?.recentActivity || []).slice(0, 10).map((activity, idx) => (
              <div key={idx} className="flex items-start space-x-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium text-sm">{activity.query?.substring(0, 100)}</p>
                  <p className="text-gray-600 text-xs mt-1">Response confidence: 94% | {new Date(activity.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AIManagement;
