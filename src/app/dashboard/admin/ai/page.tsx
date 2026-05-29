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
        const response = await axios.get('http://localhost:5001/api/admin/ai-management', {
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
      <div className="p-8 bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1e4d1e]">AI Management</h1>
            <p className="text-gray-600 mt-1 text-sm">Refine the cognitive core of your agricultural enterprise. Control datasets, monitor real-time sentiment, and balance operational precision.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Export Report
            </button>
            <button className="px-4 py-2 bg-[#1e4d1e] text-white rounded-lg text-sm font-medium hover:bg-[#163d16] transition">
              Force Retrain
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Total Queries</p>
            <p className="text-2xl font-bold text-gray-900 mb-3">{data?.totalQueries || 0}</p>
            <span className="text-xs font-bold text-green-600">↑ 23.5%</span>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Avg Response Time</p>
            <p className="text-2xl font-bold text-gray-900 mb-3">{data?.avgResponseTime || 0}ms</p>
            <span className="text-xs font-bold text-green-600">↓ 12ms</span>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Positive Reactions</p>
            <p className="text-2xl font-bold text-green-600">{data?.positiveReactions || 0}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Negative Reactions</p>
            <p className="text-2xl font-bold text-red-600">{data?.negativeReactions || 0}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Knowledge Base Management */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Knowledge Base Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Dataset Name</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Size</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Last Sync</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-900">Soil Composition Metrics 2024</td>
                    <td className="py-3 px-2 text-gray-600">42.5 GB</td>
                    <td className="py-3 px-2 text-gray-600">2h ago</td>
                    <td className="py-3 px-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Trained</span></td>
                    <td className="py-3 px-2"><button className="text-blue-600 hover:text-blue-700 text-xs font-semibold">Edit</button></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-900">Satellite Multi-Spectral Imagery</td>
                    <td className="py-3 px-2 text-gray-600">12 TB</td>
                    <td className="py-3 px-2 text-gray-600">14m ago</td>
                    <td className="py-3 px-2"><div className="w-12 h-1 bg-gray-300 rounded"><div className="h-full w-4/5 bg-blue-500 rounded"></div></div></td>
                    <td className="py-3 px-2"><button className="text-gray-600 hover:text-gray-700 text-xs font-semibold">Config</button></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-900">Historical Crop Yields (10yr)</td>
                    <td className="py-3 px-2 text-gray-600">860 MB</td>
                    <td className="py-3 px-2 text-gray-600">Oct 12, 2023</td>
                    <td className="py-3 px-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Trained</span></td>
                    <td className="py-3 px-2"><button className="text-blue-600 hover:text-blue-700 text-xs font-semibold">Edit</button></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-900">Real-time IoT Sensor Stream</td>
                    <td className="py-3 px-2 text-gray-600">Streaming</td>
                    <td className="py-3 px-2 text-green-600 font-semibold">Live</td>
                    <td className="py-3 px-2"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">Syncing</span></td>
                    <td className="py-3 px-2"><button className="text-gray-600 hover:text-gray-700 text-xs font-semibold">Config</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              + Add New Data Source
            </button>
          </div>

          {/* Model Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Model Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Model Version</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">v2.4</span>
                </div>
                <p className="text-sm text-gray-600">Latest production model</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Optimization Priority</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">Precision</span>
                </div>
                <p className="text-sm text-gray-600">Precision mode increases hallucination checks and cross-references multi-spectral data before responding.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Inference Engine</p>
                  <span className="text-xs text-gray-600 font-medium">GPU - RTX A6000</span>
                </div>
                <p className="text-sm text-gray-600">Optimized for low latency</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Training Mode</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1e4d1e] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e4d1e]"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">Continuous learning enabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Activity Logs & Sentiment */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">AI Activity Logs & Sentiment</h2>
            <button className="text-xs text-gray-600 hover:text-gray-900">Last 24 Hours</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">14,282</p>
              <p className="text-xs text-gray-600 mt-1">Total Queries</p>
              <p className="text-xs text-green-600 font-semibold mt-1">+2% ↑</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">88%</p>
              <p className="text-xs text-gray-600 mt-1">Positive Sentiment</p>
              <p className="text-xs text-gray-600 mt-1">Optimistic</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">420ms</p>
              <p className="text-xs text-gray-600 mt-1">Processing Category</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Optimal</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">0.02%</p>
              <p className="text-xs text-gray-600 mt-1">Hallucination Rate</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Safe</p>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(data?.recentActivity || []).slice(0, 5).map((activity, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg border-l-2 border-blue-500">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">Q</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.query?.substring(0, 80)}...</p>
                  <p className="text-xs text-gray-600 mt-1">Response Accuracy: 98% | {new Date(activity.createdAt).toLocaleTimeString()}</p>
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
