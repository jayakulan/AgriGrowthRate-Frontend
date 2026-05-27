'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Search, ChevronDown, Eye, ShoppingCart, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  consumer: { name: string; email: string; phone: string };
  farmer: { name: string; email: string; phone: string };
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrdersMonitoring = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: any = { page: currentPage, limit };
      if (statusFilter) params.status = statusFilter;

      const response = await axios.get('http://localhost:5001/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5001/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated');
      fetchOrders();
      setShowStatusModal(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusProgression = (status: string) => {
    const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    return statuses.indexOf(status);
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e4d1e]">Live Orders Monitoring</h1>
          <p className="text-gray-600 mt-1 text-sm">Real-time oversight of all agricultural transactions across the platform. High-density data for precise stewardship.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Total Orders Today</p>
                <p className="text-2xl font-bold text-gray-900">1,284</p>
              </div>
              <span className="text-xs font-bold text-green-600">+12%</span>
            </div>
            <div className="p-3 rounded-full w-fit bg-emerald-500">
              <ShoppingCart className="text-white" size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Daily Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$42,930</p>
              </div>
              <span className="text-xs font-bold text-green-600">+5.4%</span>
            </div>
            <div className="p-3 rounded-full w-fit bg-blue-500">
              <Eye className="text-white" size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-yellow-200 border-l-4 border-l-yellow-500">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">312</p>
              </div>
            </div>
            <div className="p-3 rounded-full w-fit bg-yellow-500">
              <AlertCircle className="text-white" size={20} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-red-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Failed/Cancelled</p>
                <p className="text-2xl font-bold text-red-600">14</p>
              </div>
              <span className="text-xs font-bold text-red-600">-2%</span>
            </div>
            <div className="p-3 rounded-full w-fit bg-red-500">
              <ShoppingCart className="text-white" size={20} />
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Export CSV
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Farmer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="text-gray-900 font-medium">{order.consumer.name}</p>
                          <p className="text-gray-600 text-xs">{order.consumer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="text-gray-900 font-medium">{order.farmer.name}</p>
                          <p className="text-gray-600 text-xs">{order.farmer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusModal(true);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition"
                        >
                          <Eye size={18} className="text-blue-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Change Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-bold mb-4">Update Order Status</h2>
              <p className="text-gray-600 mb-6">Order: <span className="font-semibold">#{selectedOrder._id.slice(-6).toUpperCase()}</span></p>
              <p className="text-gray-600 mb-6">Current status: <span className="font-semibold">{selectedOrder.status}</span></p>
              <div className="space-y-2 mb-6">
                {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                    className={`w-full px-4 py-2 rounded-lg transition text-left ${
                      selectedOrder.status === status
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersMonitoring;
