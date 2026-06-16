'use client';

import React from 'react';
import { Compass } from 'lucide-react';
import FarmerChatbot from '@/components/Chatbot/FarmerChatbot';

export default function AIAdvisorPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full p-4 md:p-8 bg-transparent">
      <div className="flex-1 w-full h-full">
        <FarmerChatbot />
      </div>
    </div>
  );
}
