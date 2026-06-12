'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout,
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  MessageSquare,
  Activity,
  Cpu,
  User as UserIcon,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Filter,
  Calendar,
  Download,
  MoreVertical,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Loader2,
  CircleAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '@/services/orderService';

export default function OrdersManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Confirmation popup states
  const [confirmingOrder, setConfirmingOrder] = useState<any | null>(null);
  const [userInputRef, setUserInputRef] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getFarmerOrders();
      if (res && res.success) {
        setOrders(res.data || []);
      } else {
        toast.error(res.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Could not fetch orders from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateStatus(orderId, status);
      if (res && res.success) {
        toast.success(`Order successfully completed`);
        setConfirmingOrder(null);
        setUserInputRef('');
        setValidationError(null);
        fetchOrders();
      } else {
        toast.error(res.message || 'Failed to update order');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to change order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = () => {
    toast.success('Orders data exported successfully! 📊');
  };

  const totalPending = orders.filter(o => o.status === 'pending').length;
  const totalCompleted = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="p-8">
            
            {/* Header Title with floating mini statistics widgets */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
                  Orders Management
                </h1>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Oversee your agricultural trade and fulfillment logistics.
                </p>
              </div>

              {/* Small header metric panels */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Pending */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex items-center gap-4 shadow-sm w-36">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400">Pending</span>
                    <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">{totalPending}</h4>
                  </div>
                </div>

                {/* Completed */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex items-center gap-4 shadow-sm w-36">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#1e4d1e]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400">Completed</span>
                    <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">{totalCompleted}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter control bar */}
            <div className="bg-white border border-[#e4e6df] rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
              <div className="flex flex-wrap gap-2 w-full md:flex-1">
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
                  />
                </div>
                <button className="flex items-center gap-2 bg-[#f4f5f0] border border-[#e4e6df] px-4 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span>Filter</span>
                </button>

                <button className="flex items-center gap-2 bg-[#f4f5f0] border border-[#e4e6df] px-4 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Last 30 Days</span>
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
            {/* Orders Details Table */}
            <div className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm mb-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
                  <p className="text-sm text-gray-500 mt-2">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No orders received yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f4f5f0]/50 border-b border-[#e4e6df] text-xs font-bold text-gray-500">
                        <th className="py-4 px-6">Order ID</th>
                        <th className="py-4 px-6">Customer Name</th>
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Quantity</th>
                        <th className="py-4 px-6">Total Price</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f5f0]">
                      {orders
                        .filter(ord => {
                          const customerName = ord.consumer?.name || 'Guest';
                          const orderNo = ord.orderConfirmationNumber || '';
                          const pName = ord.items?.[0]?.product?.name || '';
                          return (
                            customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pName.toLowerCase().includes(searchQuery.toLowerCase())
                          );
                        })
                        .map((ord) => {
                          const firstItem = ord.items?.[0];
                          const product = firstItem?.product;
                          const formattedDate = new Date(ord.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          });

                          return (
                            <tr key={ord._id} className="text-xs text-gray-700 hover:bg-[#f9f9f6]/40 transition-colors">
                              {/* Order ID */}
                              <td className="py-4 px-6 font-bold font-mono text-[#1e4d1e]">
                                {ord.orderConfirmationNumber || `#ORD-${ord._id.slice(-6).toUpperCase()}`}
                              </td>
                              
                              {/* Customer */}
                              <td className="py-4 px-6 font-bold text-gray-900">
                                <div className="flex items-center gap-2.5">
                                  {ord.consumer?.avatar ? (
                                    <img
                                      src={ord.consumer.avatar}
                                      alt={ord.consumer.name}
                                      className="w-7 h-7 rounded-full object-cover border border-[#e4e6df]"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold bg-[#1e4d1e]/10 text-[#1e4d1e]">
                                      {(ord.consumer?.name || 'G').slice(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="flex flex-col">
                                    <span>{ord.consumer?.name || 'Anonymous'}</span>
                                    <span className="text-[10px] text-gray-400 font-semibold font-sans">{ord.consumer?.phone || ''}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Product */}
                              <td className="py-4 px-6 font-medium text-gray-900">{product?.name || 'N/A'}</td>
                              
                              {/* Quantity */}
                              <td className="py-4 px-6 font-bold text-gray-500">
                                {firstItem?.quantity} {product?.unit || 'items'}
                              </td>
                              
                              {/* Total Price */}
                              <td className="py-4 px-6 font-extrabold text-gray-900">
                                ${ord.totalAmount.toFixed(2)}
                              </td>
                              
                              {/* Status Badge */}
                              <td className="py-4 px-6">
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase ${
                                  ord.status === 'delivered' ? 'bg-[#edf4e2] text-[#4A6D2F]' :
                                  ord.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                  ord.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                  'bg-blue-50 text-blue-600'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              
                              {/* Date */}
                              <td className="py-4 px-6 font-medium text-gray-400">{formattedDate}</td>
                              
                              {/* Action Button */}
                              <td className="py-4 px-6">
                                {ord.status === 'delivered' ? (
                                  <span className="text-[#1e4d1e] font-extrabold text-xs">Completed</span>
                                ) : (
                                  <button
                                    disabled={updatingId === ord._id}
                                    onClick={() => {
                                      setConfirmingOrder(ord);
                                      setUserInputRef('');
                                      setValidationError(null);
                                    }}
                                    className="bg-[#1e4d1e] hover:bg-[#163d16] text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                  >
                                    Complete
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table pagination stats footer */}
              {!loading && orders.length > 0 && (
                <div className="bg-[#f4f5f0]/30 border-t border-[#e4e6df] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] font-semibold text-gray-400">Showing all {orders.length} orders</span>
                </div>
              )}

            </div>

            {/* Bottom Row Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Box 1: Top Selling Crop */}
              <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-40">
                <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">Top Selling This Week</span>
                
                <div className="flex items-center gap-4 my-2">
                  <div className="w-11 h-11 rounded-xl bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center text-[#1e4d1e]">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900 leading-snug">Organic Alfalfa</h4>
                    <span className="text-[11px] text-gray-400 font-semibold mt-0.5 block">124 Orders</span>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1e4d1e] h-full w-[78%] rounded-full" />
                </div>
              </div>

              {/* Box 2: Revenue Growth */}
              <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-start justify-between h-40">
                <div className="flex flex-col justify-between h-full">
                  <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">Revenue Growth</span>
                  
                  <div className="mt-2">
                    <h3 className="text-xl font-extrabold text-gray-900">$12,840.00</h3>
                    <span className="text-[9px] font-extrabold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md mt-1.5 inline-block">
                      +12.4% vs last week
                    </span>
                  </div>
                </div>

                {/* Small bar graphics matching mockup */}
                <div className="flex items-end gap-1 h-20 self-end">
                  <div className="w-2.5 bg-gray-200 rounded-t h-[30%]" />
                  <div className="w-2.5 bg-gray-300 rounded-t h-[45%]" />
                  <div className="w-2.5 bg-[#d2dfc2] rounded-t h-[60%]" />
                  <div className="w-2.5 bg-[#4A6D2F] rounded-t h-[75%]" />
                  <div className="w-2.5 bg-[#1e4d1e] rounded-t h-[95%]" />
                </div>
              </div>

              {/* Box 3: Fulfillment Rate */}
              <div className="bg-[#1e4d1e] text-white rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
                <span className="text-[10px] font-extrabold text-white/50 tracking-wider uppercase">Fulfillment Rate</span>
                
                <div className="mt-2 z-10">
                  <h3 className="text-4xl font-extrabold text-white">98.2%</h3>
                  <span className="text-[10px] text-white/70 mt-1 block">Average processing time: 4.2h</span>
                </div>

                {/* Stars Sparkles Watermark Icon matches mock */}
                <div className="absolute bottom-4 right-4 text-white/10 select-none">
                  <Sparkles className="w-20 h-20" />
                </div>
              </div>

            </div>

            {/* ── Order Confirmation Popup ──────────────────── */}
            {confirmingOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
                <div className="bg-white border border-[#e4e6df] rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-scale-up">
                  <h3 className="text-lg font-extrabold text-[#1e4d1e] mb-2">Confirm Order Completion</h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    Please ask the consumer for the <b>Order Reference Number</b> sent to their phone to verify delivery. Enter it below to complete fulfillment.
                  </p>

                  {/* Info details */}
                  <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-xl p-4 mb-4 text-xs font-semibold text-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Customer:</span>
                      <span>{confirmingOrder.consumer?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Product:</span>
                      <span>{confirmingOrder.items?.[0]?.product?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-bold text-[#1e4d1e]">${confirmingOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Input field */}
                  <div className="mb-6">
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Order Reference Number
                    </label>
                    <div className={`flex items-center bg-[#f4f5f0] border-2 ${validationError ? 'border-red-400' : 'border-[#e4e6df]'} focus-within:border-[#1e4d1e] rounded-xl overflow-hidden`}>
                      <span className="pl-4 pr-1 py-3 text-sm font-extrabold text-[#1e4d1e] select-none tracking-widest">AGR-</span>
                      <input
                        type="text"
                        placeholder="XXXXXX"
                        value={userInputRef}
                        onChange={(e) => {
                          setUserInputRef(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                          setValidationError(null);
                        }}
                        className="flex-1 py-3 pr-4 bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none tracking-widest uppercase"
                      />
                    </div>
                    {validationError && (
                      <div className="mt-2 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-2">
                        <CircleAlert className="w-3.5 h-3.5 shrink-0" />
                        {validationError}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmingOrder(null)}
                      className="flex-1 border-2 border-[#e4e6df] text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === confirmingOrder._id}
                      onClick={() => {
                        const targetRef = confirmingOrder.orderConfirmationNumber || '';
                        const fullInput = `AGR-${userInputRef.trim()}`;
                        if (fullInput.toUpperCase() !== targetRef.toUpperCase()) {
                          setValidationError('Incorrect Reference Number. Please verify with the consumer and try again.');
                          return;
                        }
                        setValidationError(null);
                        handleUpdateStatus(confirmingOrder._id, 'delivered');
                      }}
                      className="flex-1 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      Verify & Complete
                    </button>
                  </div>
                </div>
              </div>
            )}

    </div>
  );
}
