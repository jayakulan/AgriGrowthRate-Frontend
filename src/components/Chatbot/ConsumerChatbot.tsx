'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Send, User, Sprout, AlertTriangle } from 'lucide-react';
import SubscriptionModal from './SubscriptionModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ConsumerChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome! I am your AI Product Assistant. Please note: I am exclusively for agricultural product recommendations and purchasing advice.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      
      const response = await axios.post(`${apiUrl}/ai/chat`, { messages: newMessages }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
      }
    } catch (error: any) {
      if (error.response?.status === 402 || error.response?.data?.requiresPayment) {
        setShowSubscriptionModal(true);
        // revert the optimistic update since we failed
        setMessages(messages);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, an error occurred while connecting to the AI service.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#1e4d1e] text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
          <div>
            <h2 className="font-bold">Product Recommendation Assistant</h2>
            <p className="text-[10px] text-[#d2dfc2] flex items-center gap-1 mt-0.5 uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3" /> Products Only
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9f9f6]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-[#1e4d1e] text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-[#1e4d1e] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl rounded-tl-none shadow-sm">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask for product recommendations..."
          className="flex-1 px-4 py-3 bg-[#f4f5f0] border border-gray-200 rounded-xl outline-none focus:border-[#1e4d1e] transition-colors text-sm text-gray-800"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-[#1e4d1e] hover:bg-[#163d16] text-white p-3 rounded-xl transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
}
