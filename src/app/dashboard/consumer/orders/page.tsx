'use client';

import {
  Truck,
  Box,
  CheckCircle,
  Clock,
  Headphones,
  FileText,
} from 'lucide-react';

export default function ConsumerOrdersPage() {
  const statusCards = [
    { label: 'In Transit', count: '03', icon: Truck },
    { label: 'Pending Pickup', count: '01', icon: Box },
    { label: 'Delivered (Month)', count: '12', icon: CheckCircle },
  ];

  const orderHistory = [
    {
      id: '#ORD-99281',
      date: 'Oct 24, 2023',
      items: 2,
      total: '$1,240.00',
      status: 'Shipped',
      image: 'https://images.unsplash.com/photo-1592982537447-6f2c6e6d1ebf?w=200&h=200&fit=crop',
      deliveryInfo: 'Arriving by Thursday, Oct 27 • Currently in Chicago, IL',
      buttons: [
        { label: 'View Details', style: 'outline' },
        { label: 'Track Order', style: 'primary', icon: Truck },
      ]
    },
    {
      id: '#ORD-99275',
      date: 'Oct 25, 2023',
      items: 5,
      total: '$450.00',
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1592887640955-4e3a89073145?w=200&h=200&fit=crop',
      buttons: [
        { label: 'View Details', style: 'outline' },
        { label: 'Track Order', style: 'disabled' },
      ]
    },
    {
      id: '#ORD-99150',
      date: 'Oct 10, 2023',
      items: 12,
      total: '$3,820.00',
      status: 'Delivered',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
      buttons: [
        { label: 'Order Details', style: 'outline' },
        { label: 'Buy Again', style: 'success' },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
      
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e4d1e]">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Track your agricultural equipment and produce deliveries.</p>
        </div>
        <div className="flex items-center bg-[#f4f5f0] border border-[#e4e6df] p-1 rounded-xl w-fit">
          <button className="bg-white text-[#1e4d1e] text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors">
            Current Orders
          </button>
          <button className="text-gray-500 hover:text-gray-900 text-xs font-bold px-6 py-2.5 rounded-lg transition-colors">
            Order History
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

      {/* ── Order List ─────────────────────────────────────── */}
      <div className="space-y-6 mb-8">
        {orderHistory.map((order, idx) => (
          <div key={idx} className="bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-[#f4f5f0] rounded-xl border border-[#e4e6df] overflow-hidden shrink-0">
                  <img src={order.image} alt={order.id} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-[#1e4d1e]">{order.id}</h2>
                    {order.status === 'Shipped' && (
                      <span className="bg-[#e2fbe9] text-[#1e4d1e] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Shipped
                      </span>
                    )}
                    {order.status === 'Pending' && (
                      <span className="bg-[#f4f5f0] text-gray-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                    {order.status === 'Delivered' && (
                      <span className="bg-[#e2fbe9] text-[#1e4d1e] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Delivered
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    Ordered on {order.date} • {order.items} Items
                  </p>
                  <p className="text-xl font-extrabold text-[#1e4d1e]">{order.total}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {order.buttons.map((btn, btnIdx) => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={btnIdx}
                      className={`
                        flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-colors
                        ${btn.style === 'outline' ? 'border border-[#e4e6df] text-gray-800 hover:bg-gray-50' : ''}
                        ${btn.style === 'primary' ? 'bg-[#1e4d1e] hover:bg-[#163d16] text-white shadow-sm border border-transparent' : ''}
                        ${btn.style === 'disabled' ? 'bg-[#f4f5f0] text-gray-400 cursor-not-allowed border border-transparent' : ''}
                        ${btn.style === 'success' ? 'bg-[#c6efc6] hover:bg-[#b0ebb0] text-[#1e4d1e] shadow-sm border border-transparent' : ''}
                      `}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {order.deliveryInfo && (
              <div className="bg-[#fcfdfa] border-t border-[#e4e6df] px-6 py-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1e4d1e]" />
                <span className="text-xs font-bold text-gray-700">{order.deliveryInfo}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Footer Action Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Subscription Savings (Span 2) */}
        <div className="md:col-span-2 bg-[#1e4d1e] rounded-2xl p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Subscription Savings</h3>
            <p className="text-sm text-white/80 max-w-sm leading-relaxed">
              You saved $124.00 last month by using AgriGrowthRate recurring orders.
            </p>
          </div>
          <button className="mt-8 bg-white/10 hover:bg-white/20 text-white w-fit px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
            Manage Subscriptions
          </button>
        </div>

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
            View 2023 Reports
          </button>
        </div>
        
      </div>

    </div>
  );
}
