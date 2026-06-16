'use client';

import { useState } from 'react';
import {
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Image as ImageIcon,
  Send,
  Check,
  Smile,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConsumerChatPage() {
  const [typedMessage, setTypedMessage] = useState('');

  // Dummy chats list matching screenshot 2
  const chatsList = [
    {
      id: 'chat-1',
      name: 'Green Valley Organics',
      avatar: 'https://images.unsplash.com/photo-1595858688461-8f5bc289569e?w=80&h=80&fit=crop',
      lastMsg: 'Absolutely, we ...',
      time: '10:24 AM',
      isActive: true,
      unread: true,
    },
    {
      id: 'chat-2',
      name: 'Millstone Bakery',
      avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop',
      lastMsg: 'Thank you ...',
      time: 'Yesterday',
      isActive: false,
      unread: false,
    },
    {
      id: 'chat-3',
      name: 'Dairy Meadows Farm',
      avatar: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=80&h=80&fit=crop',
      lastMsg: 'The fresh b...',
      time: 'Tue',
      isActive: false,
      unread: false,
    },
    {
      id: 'chat-4',
      name: 'Sunrise Equipment',
      avatar: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&h=80&fit=crop',
      lastMsg: "We've updated...",
      time: 'Oct 12',
      isActive: false,
      unread: false,
    },
  ];

  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'Green Valley Organics',
      isImage: true,
      imageSrc: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
      time: '10:22 AM',
      isMe: false,
    },
    {
      id: 'msg-2',
      sender: 'Green Valley Organics',
      text: 'Absolutely, we can ship the heirloom tomatoes tomorrow morning via refrigerated truck to ensure they arrive in peak condition. Would you like me to process an invoice for the first 100 lbs?',
      time: '10:24 AM',
      isMe: false,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Me',
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, newMsg]);
    setTypedMessage('');
    toast.success('Message sent');
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] min-w-0 overflow-hidden font-sans">
      
        {/* ── Left Sidebar (Messages List) ───────────────────── */}
        <section className="w-80 border-r border-[#e4e6df] flex flex-col shrink-0 bg-[#f9f9f6]">
          <div className="p-4">
            <div className="flex items-center bg-white border border-[#e4e6df] shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-full px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input type="text" placeholder="Filter messages..." className="w-full bg-transparent text-[13px] text-gray-800 focus:outline-none placeholder-gray-400 font-medium" />
            </div>
          </div>

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

        {/* ── Right Content Window ────────────────────────────── */}
        <section className="flex-1 flex flex-col min-w-0 bg-white">
          
          {/* Header */}
          <header className="h-20 px-8 border-b border-[#e4e6df] bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1595858688461-8f5bc289569e?w=80&h=80&fit=crop"
                alt="Green Valley Organics"
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 leading-snug">Green Valley Organics</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-[11px] font-bold text-green-700">Active Now</span>
                </div>
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                
                {!msg.isMe && (
                  <img
                    src="https://images.unsplash.com/photo-1595858688461-8f5bc289569e?w=80&h=80&fit=crop"
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm"
                  />
                )}

                <div className="max-w-[500px]">
                  {msg.isImage ? (
                    <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl rounded-bl-sm p-2 mb-1 shadow-sm">
                      <img src={msg.imageSrc} alt="Document" className="w-full h-auto rounded-xl object-cover" />
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

          {/* Input Area */}
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
