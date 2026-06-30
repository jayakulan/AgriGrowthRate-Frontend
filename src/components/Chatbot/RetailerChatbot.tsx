'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, MessageSquare, Trash2, Edit2, Search, Menu, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import SubscriptionModal from './SubscriptionModal';

interface Message {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistory {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function RetailerChatbot() {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<{ id: string, title: string } | null>(null);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState('');

  const INITIAL_GREETING = "Welcome to AgriGrowthRate AI Assistant.\n\nThis AI Assistant is available only for product recommendations.\n\nPlease tell us what type of agricultural products you are looking for.\n\nExamples:\n- Vegetables\n- Fruits\n- Grains";

  useEffect(() => {
    fetchChats();
    startNewChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const { data } = await axios.get(`${apiUrl}/chat/history`, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) setChats(data.data);
    } catch (error) {
      console.error('Failed to fetch chats');
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([{ role: 'assistant', content: INITIAL_GREETING }]);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const loadChat = async (chatId: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const { data } = await axios.get(`${apiUrl}/chat/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setActiveChatId(chatId);
        setMessages(data.data.messages);
        if (window.innerWidth < 768) setSidebarOpen(false);
      }
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const openRenameModal = (chatId: string, oldTitle: string) => {
    setChatToRename({ id: chatId, title: oldTitle });
    setNewChatTitle(oldTitle);
    setRenameModalOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!chatToRename || !newChatTitle || newChatTitle === chatToRename.title) {
      setRenameModalOpen(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      await axios.put(`${apiUrl}/chat/${chatToRename.id}/rename`, { title: newChatTitle }, { headers: { Authorization: `Bearer ${token}` } });
      fetchChats();
    } catch (error) {
      toast.error('Failed to rename chat');
    } finally {
      setRenameModalOpen(false);
      setChatToRename(null);
    }
  };

  const openDeleteModal = (chatId: string) => {
    setChatToDelete(chatId);
    setDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!chatToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      await axios.delete(`${apiUrl}/chat/${chatToDelete}`, { headers: { Authorization: `Bearer ${token}` } });
      if (activeChatId === chatToDelete) startNewChat();
      fetchChats();
    } catch (error) {
      toast.error('Failed to delete chat');
    } finally {
      setDeleteModalOpen(false);
      setChatToDelete(null);
    }
  };

  const sendMessageToAPI = async (messageText: string) => {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    
    const response = await axios.post(`${apiUrl}/chat/message`, { 
      message: messageText,
      chatId: activeChatId,
      context: 'general'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      setActiveChatId(response.data.data.chatId);
      fetchChats();
      if (response.data.remainingChats === 0) {
        setShowSubscriptionModal(true);
      }
      return response.data.data.reply;
    }
    throw new Error('Failed');
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const reply = await sendMessageToAPI(userMsg);
      setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    } catch (error: any) {
      if (error.response?.status === 402 || error.response?.data?.requiresPayment) {
        setShowSubscriptionModal(true);
        setMessages(messages); // revert
      } else {
        setMessages([...updatedMessages, { role: 'assistant', content: 'Sorry, an error occurred while connecting to the AI service.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[80vh] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute md:relative z-10 w-72 h-full bg-[#f9f9f6] border-r border-gray-200 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <button onClick={startNewChat} className="flex-1 flex items-center gap-2 bg-[#1e4d1e] text-white px-4 py-2 rounded-xl hover:bg-[#163d16] transition-colors font-medium text-sm">
                <Plus className="w-4 h-4" /> New Chat
              </button>
              <button className="md:hidden ml-2 text-gray-500" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f4f5f0] text-sm pl-9 pr-4 py-2 rounded-lg outline-none focus:border-[#1e4d1e] border border-transparent transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredChats.length === 0 ? (
                <div className="text-center text-sm text-gray-400 mt-4">No chats found</div>
              ) : (
                filteredChats.map(chat => (
                  <div key={chat._id} className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${activeChatId === chat._id ? 'bg-[#e8f0e8] text-[#1e4d1e]' : 'hover:bg-gray-100 text-gray-700'}`} onClick={() => loadChat(chat._id)}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                      <span className="text-sm truncate font-medium">{chat.title}</span>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openRenameModal(chat._id, chat.title); }} className="p-1 hover:text-[#1e4d1e]"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); openDeleteModal(chat._id); }} className="p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="h-14 border-b border-gray-200 flex items-center px-4 justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-500 hover:text-gray-800" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            <h2 className="font-bold text-gray-800 hidden sm:block">Retailer Assistant</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[85%] md:max-w-[75%] gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-[#1e4d1e] text-white' : 'bg-gray-100 border border-gray-200'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <img src="/logo.png" alt="Logo" className="w-5 h-5 md:w-6 md:h-6 object-contain p-0.5" />}
                </div>
                <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user' ? 'bg-[#1e4d1e] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain p-0.5 animate-pulse" />
                </div>
                <div className="px-5 py-4 bg-white border border-gray-200 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message AI Assistant..."
              className="w-full bg-[#f4f5f0] border border-gray-200 rounded-2xl py-4 pl-5 pr-14 outline-none focus:border-[#1e4d1e] transition-colors text-base shadow-inner"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="absolute right-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">Retailer Assistant is restricted to product recommendations.</p>
        </div>
      </div>

      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />

      {/* Modals */}
      {renameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-xl overflow-hidden relative">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <h3 className="text-lg font-bold text-gray-900">Rename Chat</h3>
              </div>
              <button onClick={() => setRenameModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <input 
                type="text" 
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                className="w-full bg-[#f4f6ee] border border-[#e4e6df] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1e4d1e] mb-6"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={() => setRenameModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors">Cancel</button>
                <button onClick={handleRenameSubmit} className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-xl font-bold text-sm transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-xl overflow-hidden relative">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <h3 className="text-lg font-bold text-gray-900">Delete Chat</h3>
              </div>
              <button onClick={() => setDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors">Cancel</button>
                <button onClick={handleDeleteSubmit} className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
