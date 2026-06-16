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
  Phone,
  Video,
  Info,
  Plus,
  Paperclip,
  Smile,
  Send,
  FileText,
  Download,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FarmerChatPage() {
  const [typedMessage, setTypedMessage] = useState('');

  // Dummy chats list matching left sidebar of chat window
  const chatsList = [
    {
      id: 'chat-1',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
      title: 'Wheat Bulk Order #882',
      lastMsg: 'Is the protein content consistent acros...',
      time: '2m ago',
      isActive: true,
      unread: true,
    },
    {
      id: 'chat-2',
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
      title: 'Organic Rye Specs',
      lastMsg: 'Thanks for sending the certificate...',
      time: '1h ago',
      isActive: false,
      unread: false,
    },
    {
      id: 'chat-3',
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
      title: 'Logistics: Truck #42',
      lastMsg: 'Driver is 20 minutes away from silo...',
      time: '4h ago',
      isActive: false,
      unread: false,
    },
  ];

  // Prepopulated conversation list
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
      text: "Hello! I'm reviewing the laboratory reports for the wheat lot #882. The moisture content looks perfect at 12.5%.",
      time: '10:14 AM',
      isMe: false,
    },
    {
      id: 'msg-2',
      sender: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
      text: 'One question: Is the protein content consistent across all 50 tons, or do you have variance between the silos?',
      time: '10:15 AM',
      isMe: false,
    },
    {
      id: 'msg-3',
      sender: 'Silas Thorne',
      text: 'Hi Marcus! Yes, we mix during the transfer process to ensure uniformity. The protein is holding steady at 13.8% across the entire batch.',
      time: '10:18 AM',
      isMe: true,
    },
    {
      id: 'msg-4',
      sender: 'Silas Thorne',
      isFile: true,
      fileName: 'Quality_Report_Wheat_882.pdf',
      fileSize: '2.4 MB • PDF Document',
      time: '10:18 AM',
      isMe: true,
    },
    {
      id: 'msg-5',
      sender: 'Silas Thorne',
      text: "I've attached the full certificate of analysis for your records. Does this look good to move forward with the purchase agreement?",
      time: '10:19 AM',
      isMe: true,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Silas Thorne',
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, newMsg]);
    setTypedMessage('');
    toast.success('Message sent');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* ── Chat Sidebar (Left List) ───────────────────── */}
      <section className="w-80 border-r border-[#e4e6df] flex flex-col shrink-0 bg-[#f9f9f6]">
        <div className="p-4">
          <div className="flex items-center bg-white border border-[#e4e6df] shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-full px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input type="text" placeholder="Filter messages..." className="w-full bg-transparent text-[13px] text-gray-800 focus:outline-none placeholder-gray-400 font-medium" />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chatsList.map((chat) => (
            <button
              key={chat.id}
              className={`w-full p-3.5 flex items-start gap-3 transition-colors text-left relative rounded-2xl ${
                chat.isActive ? 'bg-[#edf4e2] border border-[#d2dfc2]/50' : 'hover:bg-gray-100/50 border border-transparent'
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-11 h-11 rounded-full object-cover border border-white shadow-sm"
                />
                {chat.isActive && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 border-2 border-white rounded-full" />
                )}
                {!chat.isActive && chat.unread && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-[13px] font-bold text-gray-900 truncate">{chat.name}</h4>
                  <span className="text-[10px] font-bold text-gray-500 shrink-0">{chat.time}</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">{chat.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Chat Messages Content Window (Right Side) ──── */}
      <section className="flex-1 flex flex-col min-w-0 bg-[#ffffff]">

        {/* Chat Window Header */}
        <header className="h-20 px-8 border-b border-[#e4e6df] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                alt="Samuel Harrison Header Profile"
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 leading-snug">Samuel Harrison</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-600 rounded-full" />
                <span className="text-[11px] font-bold text-green-700">Active Now</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Date tag separator matches mock */}
          <div className="text-center my-6">
            <span className="text-[9px] font-extrabold tracking-wider bg-gray-100 text-gray-400 px-3 py-1 rounded-full uppercase">
              October 24, 2023
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >

              {/* Left profile for incoming message */}
              {!msg.isMe && (
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm"
                />
              )}

              {/* Chat Bubble Details */}
              <div className="max-w-[500px] space-y-1">

                {/* Document template bubble matches mock */}
                {msg.isFile ? (
                  <div className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e] shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-gray-900">{msg.fileName}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{msg.fileSize}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success(`Downloading ${msg.fileName}...`)}
                      className="p-2 hover:bg-[#f4f5f0] rounded-xl transition-colors text-gray-600 border border-transparent hover:border-[#e4e6df]"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`p-4 text-[13px] leading-relaxed shadow-sm ${
                      msg.isMe
                        ? 'bg-[#1e4d1e] text-white rounded-2xl rounded-br-sm'
                        : 'bg-white border border-[#e4e6df] text-gray-800 rounded-2xl rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {/* Small Time Details underneath bubble */}
                <div className={`flex items-center gap-1 text-[10px] text-gray-400 font-bold px-1 mt-1.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <span>{msg.time}</span>
                  {msg.isMe && (
                    <span className="text-green-600 flex items-center ml-0.5">
                      <Check className="w-3 h-3" />
                      <Check className="w-3 h-3 -ml-1.5" />
                    </span>
                  )}
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Bottom typing editor layout matches mock */}
        <div className="p-6 bg-white shrink-0 border-t border-[#e4e6df]/50">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center bg-[#f4f5f0] rounded-full px-4 py-2 gap-3 shadow-inner">
            <button
              type="button"
              onClick={() => toast('Select file')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 rounded-full transition-all"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => toast('Emojis panel coming soon!')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 rounded-full transition-all"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Write your message..."
              className="flex-1 bg-transparent text-[13px] font-medium text-gray-800 placeholder-gray-500 focus:outline-none py-2"
            />
            
            <button
              type="submit"
              className="w-10 h-10 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-full flex items-center justify-center transition-colors shadow-md shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

      </section>

    </div>
  );
}
