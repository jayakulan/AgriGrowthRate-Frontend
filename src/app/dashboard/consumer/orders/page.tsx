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
  Star,
} from 'lucide-react';
import { orderService } from '@/services/orderService';
import { feedbackService } from '@/services/feedbackService';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ConsumerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rating & Feedback states
  const [orderToRate, setOrderToRate] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFeedbackSubmit = async () => {
    if (!orderToRate) return;
    if (!feedbackComment.trim()) {
      toast.error('Please write some feedback comment');
      return;
    }
    try {
      setSubmittingFeedback(true);
      const res = await feedbackService.submitFeedback({
        orderId: orderToRate._id,
        rating,
        comment: feedbackComment,
      });
      if (res && res.success) {
        toast.success('Thank you! Feedback submitted successfully.');
        setOrderToRate(null);
        setFeedbackComment('');
        setRating(5);
        fetchOrders();
      } else {
        toast.error(res.message || 'Failed to submit feedback');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const totalInTransit = orders.filter(o => o.status === 'processing' || o.status === 'shipped').length;
  const totalPending = orders.filter(o => o.status === 'pending').length;
  const totalDelivered = orders.filter(o => o.status === 'delivered').length;

  const statusCards = [
    { label: 'Pending Orders', count: totalPending.toString().padStart(2, '0'), icon: Box },
    { label: 'Delivered Orders (Total)', count: totalDelivered.toString().padStart(2, '0'), icon: CheckCircle },
  ];

  return (
    <div className="p-8 max-w-[1000px] mx-auto font-sans">


      {/* ── Status Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
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
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${order.status === 'delivered' ? 'bg-[#e2fbe9] text-[#1e4d1e]' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                            'bg-[#f4f5f0] text-gray-600'
                          }`}>
                          {order.status}
                        </span>

                        {/* Payment badging */}
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-[#e2fbe9] text-[#1e4d1e]' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 mb-2">
                        Ordered on {formattedDate} • {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-xl font-extrabold text-[#1e4d1e]">Rs {order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Rate & Review Button */}
                  {order.status === 'delivered' && (
                    <div className="shrink-0">
                      {order.isReviewedByConsumer ? (
                        <span className="text-[11px] font-bold text-gray-400 bg-[#f4f5f0] border border-[#e4e6df] px-3 py-1.5 rounded-lg">
                          Reviewed
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setOrderToRate(order);
                            setRating(5);
                            setFeedbackComment('');
                          }}
                          className="bg-[#1e4d1e] hover:bg-[#163d16] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                          Rate & Review
                        </button>
                      )}
                    </div>
                  )}
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
      {/* ── Product/Farmer Rating & Feedback Popup ──────────────────── */}
      {orderToRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-[#e4e6df] rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-scale-up">
            <h3 className="text-lg font-extrabold text-[#1e4d1e] mb-2">Rate & Review Product</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              How was the quality of <b>{orderToRate.items?.[0]?.product?.name || 'the produce'}</b>? Leave a rating and write your feedback.
            </p>

            {/* Stars selection */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="cursor-pointer transition-transform active:scale-95"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comments input */}
            <div className="mb-6">
              <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                Feedback Comments
              </label>
              <textarea
                rows={3}
                placeholder="Write your feedback here..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full p-3 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOrderToRate(null)}
                className="flex-1 border-2 border-[#e4e6df] text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingFeedback}
                onClick={handleFeedbackSubmit}
                className="flex-1 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
