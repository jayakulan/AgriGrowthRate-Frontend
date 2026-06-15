'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { X, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubscriptionModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const { data } = await axios.post(`${apiUrl}/subscriptions/create-checkout-session`, {
        returnUrl: window.location.href.split('?')[0],
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session.');
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Payment failed to initialize. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            <h3 className="text-lg font-bold text-gray-900">Unlock AI Chatbot</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-500 text-sm leading-relaxed">
              Your free limit has been reached or your subscription has expired. Subscribe now to get unlimited access to our agriculture AI assistant for 1 month.
            </p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            <span>Pay $10 / Month</span>
          </button>

          <p className="text-center text-xs text-gray-400 mt-4 font-semibold">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
