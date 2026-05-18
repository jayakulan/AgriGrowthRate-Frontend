'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sprout } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '🌱 Hello! I\'m AgriBot, your AI farming assistant. Ask me about crop diseases, weather advisories, best practices, or market prices!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      let replyContent: string;
      if (isAuthenticated) {
        const res = await aiService.chat(userMsg.content, history);
        replyContent = res.data?.reply || res.reply || 'I received your message!';
      } else {
        // Demo responses for unauthenticated users
        const demos: Record<string, string> = {
          disease: '🔬 Crop diseases vary by plant type. Common ones include Powdery Mildew, Leaf Blight, and Root Rot. Please log in to get AI-powered detection from your crop photos!',
          weather: '☀️ Weather affects crops significantly. Log in to get real-time weather advisories for your region.',
          default: '👋 Great question! For personalized AI recommendations, please log in or create a free account.',
        };
        const key = userMsg.content.toLowerCase().includes('disease') ? 'disease'
          : userMsg.content.toLowerCase().includes('weather') ? 'weather' : 'default';
        replyContent = demos[key];
        await new Promise((r) => setTimeout(r, 800));
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: replyContent, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Something went wrong. Please try again.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Button */}
      <button
        id="chat-widget-btn"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-400 shadow-lg shadow-green-900/40 flex items-center justify-center hover:scale-110 transition-all ${open ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-300 rounded-full animate-ping opacity-75" />
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[580px] flex flex-col glass-card shadow-2xl shadow-black/60 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-green-900/20 bg-gradient-to-r from-green-900/40 to-emerald-900/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AgriBot</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors p-1" id="chat-close-btn">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[320px] max-h-[400px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-green-900' : 'bg-green-700'}`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-green-400" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-tr-none'
                      : 'bg-[#1a2e1a] text-gray-200 rounded-tl-none border border-green-900/20'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-gray-600">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-green-900 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-400" />
                </div>
                <div className="px-3 py-2 rounded-xl rounded-tl-none bg-[#1a2e1a] border border-green-900/20">
                  <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2 flex gap-2 overflow-x-auto">
            {['Crop diseases', 'Weather tips', 'Best fertilizers'].map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="flex-shrink-0 text-xs bg-green-900/30 text-green-400 border border-green-900/30 px-2.5 py-1 rounded-full hover:bg-green-900/50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-green-900/20">
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about crops, weather..."
              className="flex-1 bg-transparent border border-green-900/30 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-green-600 transition-colors"
            />
            <button
              id="chat-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-green-600 disabled:bg-green-900/40 disabled:text-gray-600 text-white flex items-center justify-center hover:bg-green-500 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
