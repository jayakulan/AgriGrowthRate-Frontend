'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, Info, Paperclip, Image as ImageIcon, Send, Check, Smile, FileText, Download, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { socket } from '@/lib/socket';

export default function FarmerChatPage() {
  const [typedMessage, setTypedMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('agri_user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    
    socket.connect();
    fetchConversations();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
      socket.emit('join_conversation', activeConversation._id);
    }
  }, [activeConversation]);

  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      if (activeConversation && message.conversationId === activeConversation._id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
      fetchConversations(); // Update last message in sidebar
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [activeConversation]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      if (res.data.success) {
        setConversations(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await api.get(`/conversations/${conversationId}/messages`);
      if (res.data.success) {
        setMessages(res.data.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeConversation || !currentUser) return;

    socket.emit('send_message', {
      conversationId: activeConversation._id,
      senderId: currentUser._id,
      text: typedMessage,
    });

    setTypedMessage('');
  };

  const getOtherParticipant = (conversation: any) => {
    if (!currentUser || !conversation) return null;
    return conversation.participants.find((p: any) => p._id !== currentUser._id) || conversation.participants[0];
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] min-w-0 overflow-hidden font-sans">
      
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
            {conversations.map((chat) => {
              const otherUser = getOtherParticipant(chat);
              const isActive = activeConversation?._id === chat._id;
              
              return (
                <button
                  key={chat._id}
                  onClick={() => setActiveConversation(chat)}
                  className={`w-full p-3.5 flex items-start gap-3 transition-colors text-left relative rounded-2xl ${
                    isActive ? 'bg-[#edf4e2] border border-[#d2dfc2]/50' : 'hover:bg-gray-100/50 border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={otherUser?.avatar || 'https://via.placeholder.com/150'}
                      alt={otherUser?.name || 'User'}
                      className="w-11 h-11 rounded-full object-cover border border-white shadow-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-[13px] font-bold text-gray-900 truncate">{otherUser?.name || 'Unknown'}</h4>
                      <span className="text-[10px] font-bold text-gray-500 shrink-0">
                        {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">
                      {chat.lastMessage ? chat.lastMessage.text : 'Start a conversation'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Chat Messages Content Window (Right Side) ──── */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#ffffff]">
          {activeConversation ? (
            <>
              {/* Chat Window Header */}
              <header className="h-20 px-8 border-b border-[#e4e6df] bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={getOtherParticipant(activeConversation)?.avatar || 'https://via.placeholder.com/150'}
                      alt={getOtherParticipant(activeConversation)?.name}
                      className="w-12 h-12 rounded-full object-cover shadow-sm"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 leading-snug">{getOtherParticipant(activeConversation)?.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 bg-green-600 rounded-full" />
                      <span className="text-[11px] font-bold text-green-700">Online</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.sender._id === currentUser?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Left profile for incoming message */}
                      {!isMe && (
                        <img
                          src={msg.sender?.avatar || 'https://via.placeholder.com/150'}
                          alt={msg.sender?.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm"
                        />
                      )}

                      {/* Chat Bubble Details */}
                      <div className="max-w-[500px] space-y-1">
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
                              isMe
                                ? 'bg-[#1e4d1e] text-white rounded-2xl rounded-br-sm'
                                : 'bg-white border border-[#e4e6df] text-gray-800 rounded-2xl rounded-bl-sm'
                            }`}
                          >
                            {msg.text}
                          </div>
                        )}

                        {/* Small Time Details underneath bubble */}
                        <div className={`flex items-center gap-1 text-[10px] text-gray-400 font-bold px-1 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && (
                            <span className="text-green-600 flex items-center ml-0.5">
                              <Check className="w-3 h-3" />
                              <Check className="w-3 h-3 -ml-1.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom typing editor layout */}
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
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </section>
    </div>
  );
}
