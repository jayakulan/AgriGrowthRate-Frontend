'use client';

import React from 'react';
import RetailerChatbot from '@/components/Chatbot/RetailerChatbot';

export default function RetailerRecommendationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#1e4d1e] mb-2">Product Recommendations AI</h1>
      <p className="text-gray-600 mb-6 text-sm">Use this AI assistant to get recommendations for agricultural products to stock.</p>
      <RetailerChatbot />
    </div>
  );
}
