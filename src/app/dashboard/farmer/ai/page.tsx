'use client';

import { useState } from 'react';
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
  Bot,
  Paperclip,
  Mic,
  Send,
  Thermometer,
  Droplets,
  CloudRain,
  Compass,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIAdvisorPage() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Dummy conversation messages matching screenshot
  const [conversation, setConversation] = useState([
    {
      id: 'ai-1',
      sender: 'AgriGrowth AI Advisor',
      isMe: false,
      text: "Good morning, Silas. How can I assist your harvest today? I've noticed the humidity levels in Plot B are slightly higher than average for this time of day.",
      time: 'Just now',
    },
    {
      id: 'farmer-2',
      sender: 'Silas Thorne',
      isMe: true,
      text: "Best time to plant organic corn in this weather? I'm looking at the northern terrace.",
      time: 'Sent 1m ago',
    },
    {
      id: 'ai-3',
      sender: 'AgriGrowth AI Advisor',
      isMe: false,
      text: "Based on the current 10-day forecast and your soil's nitrogen levels in the Northern Terrace, the **optimal window is between April 14th and April 18th**.",
      time: 'Just now',
      hasStats: true,
      stats: [
        { label: 'Soil Temp', value: '62°F', icon: Thermometer, color: 'text-amber-600' },
        { label: 'Moisture', value: '24%', icon: Droplets, color: 'text-blue-500' },
        { label: 'Rain Risk', value: 'Low', icon: CloudRain, color: 'text-emerald-500' },
      ],
    },
  ]);

  const quickSuggestions = [
    { label: 'Analyze Soil Health', reply: 'Can you analyze the soil health for Sector B?' },
    { label: 'Pest Control Tips', reply: 'What are the best organic pest control tips for early blight?' },
    { label: 'Yield Forecast', reply: 'What is the current wheat yield forecast based on sensor logs?' },
    { label: 'Irrigation Audit', reply: 'Can we do an irrigation audit for the southern terrace?' },
  ];

  const handleSuggestionClick = (queryText: string) => {
    setInputValue(queryText);
    toast.success('Suggestion selected!');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'Silas Thorne',
      isMe: true,
      text: inputValue,
      time: 'Just now',
    };

    setConversation((prev) => [...prev, userMessage]);
    const userQuery = inputValue;
    setInputValue('');
    setLoading(true);

    try {
      // Simulate AI advisor response delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse = {
        id: `ai-${Date.now()}`,
        sender: 'AgriGrowth AI Advisor',
        isMe: false,
        text: `I've analyzed your query regarding: "${userQuery}". Based on active field data in Sacramento Valley, CA, nitrogen levels are stable, and humidity is 55%. I suggest keeping standard watering rates today. Let me know if you need specific fertilizer suggestions!`,
        time: 'Just now',
      };

      setConversation((prev) => [...prev, aiResponse]);
      toast.success('Advisor recommendation received!');
    } catch {
      toast.error('Failed to contact advisor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] justify-between p-6">
            
            {/* Conversations Feed Scroll Container */}
            <div className="flex-grow space-y-6 max-w-4xl mx-auto w-full">
              
              {/* Header Info Alert matches mock exactly */}
              <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-6 text-center max-w-2xl mx-auto mb-8 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#e4e6df] flex items-center justify-center text-[#1e4d1e] mx-auto mb-4">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-lg font-extrabold text-[#1e4d1e]">AgriGrowth AI Advisor</h2>
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  Optimized for your current location: <span className="font-extrabold text-gray-800">Sacramento Valley, CA</span>. I have access to your soil sensors and the latest 10-day weather forecast.
                </p>
              </div>

              {/* Chat Dialogues */}
              <div className="space-y-5">
                {conversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-4 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    
                    {/* Bot Left Icon */}
                    {!msg.isMe && (
                      <div className="w-9 h-9 rounded-lg bg-[#1e4d1e] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}

                    {/* Chat Bubble */}
                    <div className="max-w-2xl space-y-1">
                      <div
                        className={`p-5 text-xs leading-relaxed border rounded-2xl ${
                          msg.isMe
                            ? 'bg-[#cde8c8]/95 border-[#b6dcb0] text-gray-900 rounded-tr-none'
                            : 'bg-white border-[#e4e6df] text-gray-800 rounded-tl-none shadow-[0_2px_12px_rgba(0,0,0,0.01)]'
                        }`}
                      >
                        <p className="font-medium whitespace-pre-line">{msg.text}</p>

                        {/* Sensor cards inside AI bubble if present (matches mock) */}
                        {msg.hasStats && msg.stats && (
                          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#f4f5f0]">
                            {msg.stats.map((stat, i) => {
                              const StatIcon = stat.icon;
                              return (
                                <div
                                  key={i}
                                  className="bg-[#f9f9f6] border border-[#e4e6df] rounded-xl p-3 text-left"
                                >
                                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                                    <StatIcon className={`w-3.5 h-3.5 ${stat.color}`} />
                                    <span>{stat.label}</span>
                                  </div>
                                  <h4 className="text-sm font-extrabold text-gray-900 mt-1">{stat.value}</h4>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>

                      {/* Timeline */}
                      <span className={`text-[9px] font-semibold text-gray-400 block px-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </span>
                    </div>

                    {/* Farmer Right Icon Avatar */}
                    {msg.isMe && (
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                        alt={msg.sender}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#e4e6df] shadow-sm"
                      />
                    )}

                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Actions Tray and input */}
            <div className="max-w-4xl mx-auto w-full mt-6 space-y-4">
              
              {/* Quick Pills Suggesters */}
              <div className="flex flex-wrap gap-2 justify-center py-1">
                {quickSuggestions.map((pill) => (
                  <button
                    key={pill.label}
                    onClick={() => handleSuggestionClick(pill.reply)}
                    className="px-4 py-2 bg-white border border-[#e4e6df] hover:border-[#1e4d1e] text-gray-600 hover:text-gray-900 rounded-full text-xs font-bold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Messaging Typing bar */}
              <form onSubmit={handleSendMessage} className="bg-white border border-[#e4e6df] rounded-2xl p-3 flex items-center gap-3 shadow-md">
                
                {/* Accessory Attachment */}
                <button
                  type="button"
                  onClick={() => toast.success('Attachment select opened')}
                  className="p-2 hover:bg-[#f4f5f0] text-gray-400 hover:text-gray-700 rounded-full transition-all shrink-0"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Main input */}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your farming question here..."
                  className="flex-grow bg-transparent border-none text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                  disabled={loading}
                />

                {/* Mic & Send Accessories */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toast.success('Mic listening activated... 🎙️')}
                    className="p-2 hover:bg-[#f4f5f0] text-gray-400 hover:text-gray-700 rounded-full transition-all"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <button
                    type="submit"
                    className="w-9 h-9 bg-[#1e4d1e] hover:bg-[#163d16] text-white flex items-center justify-center rounded-full transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>

              {/* Disclaimer */}
              <p className="text-[10px] text-gray-400 text-center select-none leading-none">
                AI can make mistakes. Verify critical agronomic decisions with a certified professional.
              </p>

            </div>

    </div>
  );
}
