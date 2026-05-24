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
  const [activeMenu, setActiveMenu] = useState('Chat');
  const [typedMessage, setTypedMessage] = useState('');

  // Sidebar Menu Items (consistent layout)
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/farmer' },
    { name: 'My Products', icon: Package, href: '/dashboard/farmer/products' },
    { name: 'Add Product', icon: PlusCircle, href: '/dashboard/farmer/add-product' },
    { name: 'Orders', icon: ShoppingBag, href: '/dashboard/farmer/orders' },
    { name: 'Chat', icon: MessageSquare, href: '/dashboard/farmer/chat' },
    { name: 'Crop Disease Detection', icon: Activity, href: '/dashboard/farmer/disease-detect' },
    { name: 'AI Assistant', icon: Cpu, href: '/dashboard/farmer/ai' },
    { name: 'Profile', icon: UserIcon, href: '/dashboard/farmer/profile' },
  ];

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
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      
      <div className="flex flex-1">
        
        {/* ── Left Sidebar (Consistent Dashboard Theme) ───────── */}
        <aside className="w-64 border-r border-[#e4e6df] bg-[#f4f5f0] flex flex-col justify-between p-6 shrink-0 min-h-screen">
          <div className="space-y-8">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1e4d1e] flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-[#1e4d1e] text-base leading-tight">AgriGrowthRate</h2>
                <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Modern Stewardship</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setActiveMenu(item.name)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#cde8c8]/70 text-[#1e4d1e] shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* New Harvest Button */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl transition-colors shadow-md text-sm mt-8">
            <Sprout className="w-4 h-4" />
            <span>New Harvest</span>
          </button>
        </aside>

        {/* ── Right Dashboard Layout ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <header className="h-16 border-b border-[#e4e6df] bg-white flex items-center justify-between px-8 shrink-0">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
              />
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-6">
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-[#e4e6df]" />

              {/* Silas Thorne Profile Avatar */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Silas Thorne</h4>
                  <span className="text-[10px] font-extrabold text-[#4A6D2F] tracking-wide uppercase">Chief Steward</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                  alt="Silas Thorne Profile"
                  className="w-9 h-9 rounded-full object-cover border border-[#e4e6df]"
                />
              </div>
            </div>
          </header>

          {/* Main Messaging Layout (Double Column Split) */}
          <main className="flex-1 flex min-h-0 bg-white">
            
            {/* ── Chat Sidebar (Left List) ───────────────────── */}
            <section className="w-80 border-r border-[#e4e6df] flex flex-col shrink-0">
              <div className="p-6 border-b border-[#e4e6df]">
                <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Active Buyers & Logistics</p>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#f4f5f0]">
                {chatsList.map((chat) => (
                  <button
                    key={chat.id}
                    className={`w-full p-4 flex items-start gap-3 transition-colors text-left relative ${
                      chat.isActive ? 'bg-[#edf4e2]/60' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#e4e6df]"
                      />
                      {chat.isActive && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="text-xs font-extrabold text-gray-900 truncate">{chat.name}</h4>
                        <span className="text-[9px] font-bold text-gray-400 shrink-0">{chat.time}</span>
                      </div>
                      <h5 className="text-[10px] font-bold text-gray-800 truncate">{chat.title}</h5>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5 font-medium">{chat.lastMsg}</p>
                    </div>

                    {/* Unread circle dot */}
                    {chat.unread && (
                      <span className="w-2 h-2 rounded-full bg-green-600 mt-2 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Chat Messages Content Window (Right Side) ──── */}
            <section className="flex-1 flex flex-col min-w-0 bg-[#f9f9f6]/20">
              
              {/* Chat Window Header */}
              <header className="h-16 px-6 border-b border-[#e4e6df] bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                      alt="Marcus Chen Header Profile"
                      className="w-10 h-10 rounded-full object-cover border border-[#e4e6df]"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">Marcus Chen</h3>
                    <span className="text-[10px] font-semibold text-gray-400">Inquiry: Premium Hard Red Winter Wheat</span>
                  </div>
                </div>

                {/* Call & Video icons options */}
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="hover:text-gray-800 transition-colors p-1" onClick={() => toast('Call feature coming soon!')}>
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="hover:text-gray-800 transition-colors p-1" onClick={() => toast('Video chat feature coming soon!')}>
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="hover:text-gray-800 transition-colors p-1">
                    <Info className="w-4 h-4" />
                  </button>
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
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#e4e6df]"
                      />
                    )}

                    {/* Chat Bubble Details */}
                    <div className="max-w-[460px] space-y-1">
                      
                      {/* Document template bubble matches mock */}
                      {msg.isFile ? (
                        <div className="bg-white border border-[#e4e6df] rounded-xl p-4 flex items-center justify-between gap-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-bold text-gray-900">{msg.fileName}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">{msg.fileSize}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toast.success(`Downloading ${msg.fileName}...`)}
                            className="p-1.5 hover:bg-[#f4f5f0] rounded-lg transition-colors text-gray-600"
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`p-4 text-xs leading-relaxed ${
                            msg.isMe
                              ? 'bg-[#1e4d1e] text-white rounded-2xl rounded-tr-none'
                              : 'bg-[#f4f5f0] text-gray-800 rounded-2xl rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}

                      {/* Small Time Details underneath bubble */}
                      <div className={`flex items-center gap-1 text-[9px] text-gray-400 font-semibold px-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.time}</span>
                        {msg.isMe && (
                          <span className="text-green-600 flex items-center">
                            <Check className="w-3 h-3" />
                            <Check className="w-3 h-3 -ml-1.5" />
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Right profile initials for outgoing message */}
                    {msg.isMe && (
                      <div className="w-7 h-7 rounded-full bg-[#1e4d1e] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        ME
                      </div>
                    )}

                  </div>
                ))}

              </div>

              {/* Bottom typing editor layout matches mock */}
              <form onSubmit={handleSendMessage} className="p-6 border-t border-[#e4e6df] bg-white flex items-end gap-3 shrink-0">
                
                {/* Accessory Attachment triggers */}
                <div className="flex items-center gap-1 pb-1.5 text-gray-400">
                  <button
                    type="button"
                    onClick={() => toast('Select action')}
                    className="p-2 hover:bg-[#f4f5f0] hover:text-gray-700 rounded-full transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toast('Select file')}
                    className="p-2 hover:bg-[#f4f5f0] hover:text-gray-700 rounded-full transition-all"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>

                {/* Input Text Box */}
                <div className="flex-1 relative flex items-center bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl px-4 py-3">
                  <textarea
                    rows={1}
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow bg-transparent border-none text-xs text-gray-800 placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => toast('Emojis panel coming soon!')}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  className="w-11 h-11 bg-[#1e4d1e] hover:bg-[#163d16] text-white flex items-center justify-center rounded-full transition-colors shadow-sm shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>

              </form>

            </section>

          </main>

        </div>

      </div>

    </div>
  );
}
