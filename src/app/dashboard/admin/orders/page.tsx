'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
  ShoppingBag,
  CreditCard,
  Truck,
  AlertTriangle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  PackageCheck,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

// All valid statuses from the backend
const ALL_STATUSES = ['Pending', 'Delivered', 'Cancelled'] as const;
type OrderStatus = typeof ALL_STATUSES[number];

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerInitials: string;
  farmerName: string;
  dateStr: string;
  totalAmount: number;
  status: string;
}

interface Stats {
  delivered: number;
  cancelled: number;
  pending: number;
  revenue: number;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s === 'delivered') return 'bg-[#e3f7ed] text-[#2e7d32] border-[#c8e6c9]';
  if (s === 'cancelled') return 'bg-red-50 text-red-700 border-red-100';
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
  return 'bg-gray-50 text-gray-600 border-gray-200';
}

export default function OrdersMonitoringPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState<Stats>({
    delivered: 0,
    cancelled: 0,
    pending: 0,
    revenue: 0,
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: ITEMS_PER_PAGE };
      if (statusFilter !== 'All') params.status = statusFilter;

      const response = await api.get('/admin/orders', { params });

      if (response.data && response.data.data) {
        const raw = response.data.data;

        const formatted: Order[] = raw.map((item: any) => ({
          _id: item._id,
          orderNumber: `#AGR-${String(item._id).slice(-6).toUpperCase()}`,
          customerName: item.consumer?.name || item.buyerName || 'Unknown Customer',
          customerInitials: initials(item.consumer?.name || item.buyerName || 'UK'),
          farmerName:
            item.items?.[0]?.product?.farmer?.name ||
            item.farmerName ||
            'Local Farm',
          dateStr: new Date(item.createdAt).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          totalAmount: item.totalAmount || 0,
          status: item.status || 'Pending',
        }));

        setOrders(formatted);

        // Pagination
        const pagination = response.data.pagination;
        if (pagination) {
          setTotalPages(pagination.pages || 1);
          setTotalOrders(pagination.total || formatted.length);
        }

        // Stats cards
        const counts = response.data.counts || {};
        setStats({
          delivered: counts.delivered || 0,
          cancelled: counts.cancelled || 0,
          pending: counts.pending || 0,
          revenue: response.data.revenue || 0,
        });
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order updated to "${newStatus}"`);
      setShowStatusModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filterTabs = ['All', ...ALL_STATUSES];

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalOrders);

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto relative select-none">

        {/* ── KPI METRICS CARDS ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Revenue */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-gray-100 rounded-xl w-fit">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">Revenue</p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  {loading ? '...' : `₹${stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 shrink-0">Live</span>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-[#edf4e2] rounded-xl w-fit">
                  <ShoppingBag className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">Delivered</p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  {loading ? '...' : stats.delivered.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-[#edf4e2] rounded-xl w-fit">
                  <Truck className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">Pending</p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  {loading ? '...' : stats.pending.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white border border-[#e4e6df] rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-32 text-left">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="p-2 bg-red-50 rounded-xl w-fit">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">Cancelled</p>
                <h3 className="text-xl font-extrabold text-gray-900 leading-none">
                  {loading ? '...' : stats.cancelled.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

        </div>

        {/* ── ORDERS TABLE ── */}
        <div className="bg-white border border-[#e4e6df] rounded-[24px] overflow-hidden shadow-sm">

          {/* Filter bar */}
          <div className="px-6 py-4 border-b border-[#e4e6df] flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              All Platform Orders
            </h3>

            <div className="flex items-center gap-1.5 bg-[#f4f5f0]/60 p-1 rounded-xl flex-wrap">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setStatusFilter(tab); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-[#1e4d1e] animate-spin" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <PackageCheck className="w-10 h-10 text-gray-300" />
              <p className="text-sm font-bold text-gray-400">No orders found</p>
              <p className="text-xs text-gray-300">
                {statusFilter !== 'All' ? `No "${statusFilter}" orders exist yet.` : 'No orders have been placed yet.'}
              </p>
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
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f4f5f0]">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-[#f4f5f0]/20 transition-colors">

                      <td className="px-6 py-4 text-xs font-extrabold text-[#1e4d1e] tracking-tight">
                        {ord.orderNumber}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#edf4e2] text-[#1e4d1e] flex items-center justify-center text-[9px] font-bold shrink-0">
                            {ord.customerInitials}
                          </div>
                          <span className="text-xs font-bold text-gray-800">{ord.customerName}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-semibold text-gray-600">{ord.farmerName}</td>

                      <td className="px-6 py-4 text-[11px] font-semibold text-gray-400 leading-normal">{ord.dateStr}</td>

                      <td className="px-6 py-4 text-xs font-extrabold text-gray-900">
                        ₹{ord.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold border capitalize ${statusColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>



                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination footer */}
          {!loading && orders.length > 0 && (
            <div className="bg-[#fcfdfa]/80 border-t border-[#e4e6df] px-6 py-4 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400">
                Showing {startItem}–{endItem} of {totalOrders} orders
              </span>

              <div className="inline-flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all ${
                        currentPage === page
                          ? 'bg-[#1e4d1e] text-white shadow-sm'
                          : 'bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <span className="text-gray-400 text-xs font-bold px-1">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-8 h-8 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all ${
                        currentPage === totalPages
                          ? 'bg-[#1e4d1e] text-white shadow-sm'
                          : 'bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── UPDATE ORDER STATUS DIALOG ── */}
      <AnimatePresence>
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowStatusModal(false); setSelectedOrder(null); }}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                  <h4 className="text-lg font-extrabold text-gray-900">Update Order Status</h4>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowStatusModal(false); setSelectedOrder(null); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 space-y-1">
                <p className="text-gray-500 text-[13px] leading-relaxed">
                  Update the status for order <span className="text-[#1e4d1e] font-bold">{selectedOrder.orderNumber}</span>.
                </p>
                <p className="text-[10px] text-gray-400 font-semibold">
                  Current: <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${statusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {ALL_STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                    disabled={updatingStatus || selectedOrder.status === status}
                    className={`w-full py-3 rounded-xl transition text-xs font-bold uppercase tracking-wider cursor-pointer disabled:cursor-not-allowed ${
                      selectedOrder.status === status
                        ? 'bg-[#1e4d1e] text-white shadow-md opacity-90'
                        : 'bg-[#f4f5f0] text-gray-600 hover:bg-[#edf4e2]/60 hover:text-[#1e4d1e] disabled:opacity-50'
                    }`}
                  >
                    {updatingStatus && selectedOrder.status !== status ? (
                      <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                    ) : (
                      status
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowStatusModal(false); setSelectedOrder(null); }}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}