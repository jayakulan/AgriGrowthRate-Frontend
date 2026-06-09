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
    <div className="flex flex-1 h-[calc(100vh-64px)] bg-[#f9f9f6] min-w-0 font-sans p-6">
      
      <div className="flex flex-1 bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm">
        
        {/* ── Left Sidebar (Messages List) ───────────────────── */}
        <section className="w-80 border-r border-[#e4e6df] flex flex-col shrink-0 bg-white">
          <div className="p-6 border-b border-[#e4e6df] flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Messages</h1>
            <span className="bg-[#1e4d1e] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">4 NEW</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatsList.map((chat) => (
              <button
                key={chat.id}
                className={`w-full p-4 flex items-center gap-3 transition-colors text-left border-l-[3px] ${
                  chat.isActive ? 'bg-[#f4f5f0]/80 border-[#1e4d1e]' : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#e4e6df]"
                  />
                  {chat.unread && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{chat.name}</h4>
                    <span className="text-[10px] font-semibold text-gray-400 shrink-0">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? 'text-gray-800 font-bold' : 'text-gray-500 font-medium'}`}>
                    {chat.lastMsg}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Right Content Window ────────────────────────────── */}
        <section className="flex-1 flex flex-col min-w-0 bg-white">
          
          {/* Header */}
          <header className="h-[72px] px-6 border-b border-[#e4e6df] bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1595858688461-8f5bc289569e?w=80&h=80&fit=crop"
                alt="Green Valley Organics"
                className="w-10 h-10 rounded-full object-cover border border-[#e4e6df]"
              />
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug">Green Valley Organics</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-semibold text-gray-400">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-[#e4e6df]">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-[#e4e6df]">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-[#e4e6df]">
                <Info className="w-4 h-4" />
              </button>
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
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#e4e6df]"
                  />
                )}

                <div className="max-w-[500px]">
                  {msg.isImage ? (
                    <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl rounded-tl-none p-2 mb-1 shadow-sm">
                      <img src={msg.imageSrc} alt="Document" className="w-full h-auto rounded-xl object-cover" />
                    </div>
                  ) : (
                    <div
                      className={`p-4 text-[13px] leading-relaxed shadow-sm ${
                        msg.isMe
                          ? 'bg-[#1e4d1e] text-white rounded-2xl rounded-tr-none'
                          : 'bg-white border border-[#e4e6df] text-gray-800 rounded-2xl rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                  <div className={`text-[10px] text-gray-400 font-medium mt-1.5 px-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </div>
                </div>

                {msg.isMe && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 object-cover shrink-0 border border-[#e4e6df] overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" alt="Me" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#e4e6df] shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <button type="button" className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full bg-[#f4f5f0] border border-[#e4e6df] rounded-xl pl-4 pr-12 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
                />
              </div>
              
              <button
                type="submit"
                className="w-12 h-12 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </div>

        </section>
      </div>
    </div>
  );
}
