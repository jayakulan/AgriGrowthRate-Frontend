'use client';

import { useState, useEffect } from 'react';
import {
  Truck,
  Box,
  CheckCircle,
  Clock,
  Headphones,
  FileText,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { orderService } from '@/services/orderService';
import Link from 'next/link';

export default function ConsumerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getMyOrders();
        if (res && res.success) {
          setOrders(res.data || []);
        } else {
          setError(res.message || 'Failed to load orders');
        }
      } catch (err: any) {
        console.error('Failed to load orders:', err);
        setError(err.response?.data?.message || 'Could not fetch orders. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalInTransit = orders.filter(o => o.status === 'processing' || o.status === 'shipped').length;
  const totalPending = orders.filter(o => o.status === 'pending').length;
  const totalDelivered = orders.filter(o => o.status === 'delivered').length;

  const statusCards = [
    { label: 'In Transit', count: totalInTransit.toString().padStart(2, '0'), icon: Truck },
    { label: 'Pending Orders', count: totalPending.toString().padStart(2, '0'), icon: Box },
    { label: 'Delivered (Total)', count: totalDelivered.toString().padStart(2, '0'), icon: CheckCircle },
  ];

  return (
    <div className="p-8 max-w-[1000px] mx-auto font-sans">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e4d1e]">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Track your agricultural equipment and produce deliveries.</p>
        </div>
        <div className="flex items-center bg-[#f4f5f0] border border-[#e4e6df] p-1 rounded-xl w-fit">
          <button className="bg-white text-[#1e4d1e] text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors">
            All Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* ── Status Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {statusCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-[#1e4d1e]" />
                <span className="text-xs font-bold text-gray-900">{card.label}</span>
              </div>
              <p className="text-3xl font-extrabold text-[#1e4d1e]">{card.count}</p>
            </div>
          );
        })}
      </div>

      {/* ── Loading / Error / Empty States ────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e4e6df] rounded-2xl mb-8">
          <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
          <p className="text-sm text-gray-500 mt-2">Fetching your orders...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e4e6df] rounded-2xl mb-8 px-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm font-bold text-gray-800">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs font-bold text-[#1e4d1e] underline mt-3 hover:text-[#163d16]"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e4e6df] rounded-2xl mb-8 text-center px-4">
          <Box className="w-10 h-10 text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-700">No orders placed yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">Browse the agriculture store and make your first fresh purchase today.</p>
          <Link 
            href="/dashboard/consumer/browse-products" 
            className="mt-4 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            Browse Store
          </Link>
        </div>
      )}

      {/* ── Order List ─────────────────────────────────────── */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6 mb-8">
          {orders.map((order) => {
            const firstItem = order.items && order.items[0];
            const product = firstItem?.product;
            
            // Image fallback resolver
            const productImg = product?.images && product.images[0] 
              ? (product.images[0].startsWith('http') || product.images[0].startsWith('data:') ? product.images[0] : `http://localhost:5001${product.images[0]}`) 
              : 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop';

            const itemsCount = order.items ? order.items.reduce((sum: number, it: any) => sum + it.quantity, 0) : 0;
            const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });

            return (
              <div key={order._id} className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-[#f4f5f0] rounded-xl border border-[#e4e6df] overflow-hidden shrink-0">
                      <img src={productImg} alt={product?.name || 'Produce Item'} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1.5">
                        <h2 className="text-base font-extrabold text-[#1e4d1e] tracking-tight">
                          {order.orderConfirmationNumber || `#ORD-${order._id.slice(-6).toUpperCase()}`}
                        </h2>
                        
                        {/* Status badging */}
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-[#e2fbe9] text-[#1e4d1e]' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-[#f4f5f0] text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                        
                        {/* Payment badging */}
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.paymentStatus === 'paid' ? 'bg-[#e2fbe9] text-[#1e4d1e]' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 mb-2">
                        Ordered on {formattedDate} • {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-xl font-extrabold text-[#1e4d1e]">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      href={`/dashboard/consumer/browse-products/${product?._id || ''}`}
                      className="flex-1 sm:flex-none text-center border border-[#e4e6df] text-gray-800 hover:bg-gray-50 px-6 py-3 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Product
                    </Link>
                  </div>
                </div>

                {order.status === 'shipped' && (
                  <div className="bg-[#fcfdfa] border-t border-[#e4e6df] px-6 py-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1e4d1e]" />
                    <span className="text-xs font-bold text-gray-700">In Transit • Package is on its way to your destination</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer Action Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Contact Support */}
        <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <Headphones className="w-6 h-6 text-[#1e4d1e] mb-4" />
            <p className="text-xs font-bold text-gray-900 leading-relaxed mb-4">
              Need help with an order? Our specialists are online.
            </p>
          </div>
          <button className="text-left text-xs font-extrabold text-[#1e4d1e] underline underline-offset-4 hover:text-[#163d16]">
            Contact Support
          </button>
        </div>

        {/* Download Tax Receipts */}
        <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <FileText className="w-6 h-6 text-[#1e4d1e] mb-4" />
            <p className="text-xs font-bold text-gray-900 leading-relaxed mb-4">
              Download annual tax receipts for all purchases.
            </p>
          </div>
          <button className="text-left text-xs font-extrabold text-[#1e4d1e] underline underline-offset-4 hover:text-[#163d16]">
            View 2026 Reports
          </button>
        </div>

        {/* Support Help Center */}
        <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <HelpCircle className="w-6 h-6 text-[#1e4d1e] mb-4" />
            <p className="text-xs font-bold text-gray-900 leading-relaxed mb-4">
              Access the grower manual and platform resource FAQs.
            </p>
          </div>
          <button className="text-left text-xs font-extrabold text-[#1e4d1e] underline underline-offset-4 hover:text-[#163d16]">
            Platform FAQs
          </button>
        </div>

      </div>

    </div>
  );
}
