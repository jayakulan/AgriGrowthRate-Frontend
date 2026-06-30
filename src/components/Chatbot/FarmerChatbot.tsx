'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Sprout, Plus, MessageSquare, Trash2, Edit2, Search, Menu, X, Download, Monitor, BookOpen, HelpCircle, Paperclip, Mic, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import SubscriptionModal from './SubscriptionModal';
import { useAuth } from '@/context/AuthContext';

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

const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mullaitivu', 
  'Vavuniya', 'Mannar', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 
  'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 
  'Ratnapura', 'Kegalle'
];

const SOIL_TYPES = [
  'Sandy Soil', 'Clay Soil', 'Loamy Soil', 'Red Soil', 'Alluvial Soil', 'Not Sure'
];

const LAND_SIZES = [
  'Less than 1 Acre', '1 – 2 Acres', '2 – 5 Acres', '5 – 10 Acres', 'More than 10 Acres'
];

const WATER_SOURCES = [
  'Rainwater Only', 'Well Water', 'Irrigation Canal', 'River / Tank Water', 'Multiple Sources'
];

const EXPERIENCE_LEVELS = [
  'Beginner (0–2 Years)', 'Intermediate (3–5 Years)', 'Experienced (6–10 Years)', 'Expert (10+ Years)'
];

const formatOptions = (options: string[]) => options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');

const validateSelection = (input: string, options: string[]) => {
  const num = parseInt(input, 10);
  if (isNaN(num) || num < 1 || num > options.length) return null;
  return options[num - 1];
};

export default function FarmerChatbot() {
  const { user } = useAuth();
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
  
  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Workflow State
  const [workflowState, setWorkflowState] = useState<'initial' | 'district' | 'soil' | 'land' | 'water' | 'experience' | 'crop_selection' | 'plan_generation' | 'pdf_prompt' | 'general'>('initial');
  const [farmerDetails, setFarmerDetails] = useState({ district: '', soilType: '', landSize: '', waterAvailability: '', currentSeason: '', farmingExperience: '' });
  const [selectedCrop, setSelectedCrop] = useState('');
  const [cultivationPlan, setCultivationPlan] = useState('');

  const INITIAL_GREETING = "Welcome to AgriGrowthRate AI Assistant.\n\nPlease choose an option by entering the corresponding number:\n\n1: Crop Recommendation\n2: Agriculture Related Questions\n\nEnter 1 or 2 to continue.";

  useEffect(() => {
    fetchChats();
    const pendingChatId = localStorage.getItem('pendingSubscriptionChatId');
    if (pendingChatId) {
      loadChat(pendingChatId);
      localStorage.removeItem('pendingSubscriptionChatId');
    } else {
      startNewChat();
    }
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
    } catch (error: any) {
      if (error?.response?.status !== 401) {
        console.warn('Could not fetch chats', error?.message);
      }
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([{ role: 'assistant', content: INITIAL_GREETING }]);
    setWorkflowState('initial');
    setFarmerDetails({ district: '', soilType: '', landSize: '', waterAvailability: '', currentSeason: '', farmingExperience: '' });
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
        setWorkflowState('general'); // Loaded chats default to general to avoid workflow trigger
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setInput((prev) => prev + (prev ? ' ' : '') + `[Attached: ${file.name}]`);
      toast.success(`Attached ${file.name}`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(30, 77, 30);
    doc.text('AgriGrowthRate', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Crop Cultivation Plan', 105, 30, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Farmer Name: ${user?.name || 'Valued Farmer'}`, 20, 45);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 20, 52);
    doc.text(`Selected Crop: ${selectedCrop}`, 20, 59);
    doc.text(`District: ${farmerDetails.district}`, 20, 66);
    doc.text(`Soil Type: ${farmerDetails.soilType}`, 20, 73);
    doc.text(`Land Size: ${farmerDetails.landSize}`, 20, 80);
    doc.text(`Water Availability: ${farmerDetails.waterAvailability}`, 20, 87);
    doc.text(`Farming Experience: ${farmerDetails.farmingExperience}`, 20, 94);
    doc.text(`Detected Season: ${farmerDetails.currentSeason}`, 20, 101);

    // Add plan content
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(cultivationPlan, 170);
    
    let yPos = 115;
    splitText.forEach((line: string) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 5;
    });

    doc.save(`Cultivation_Plan_${selectedCrop}.pdf`);
  };

  const sendMessageToAPI = async (messageText: string, contextOverride?: string) => {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    
    const response = await axios.post(`${apiUrl}/chat/message`, { 
      message: messageText,
      chatId: activeChatId,
      context: contextOverride || 'general'
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

  const handleSendMessage = async (overrideMsg?: string) => {
    const userMsg = overrideMsg || input.trim();
    if (!userMsg && workflowState !== 'crop_selection') return;
    if (!overrideMsg) setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      if (workflowState === 'initial') {
        if (userMsg === '1') {
          setWorkflowState('district');
          setMessages([...updatedMessages, { role: 'assistant', content: `Please select your district by entering the corresponding number:\n\n${formatOptions(DISTRICTS)}` }]);
        } else if (userMsg === '2') {
          setWorkflowState('general');
          setMessages([...updatedMessages, { role: 'assistant', content: 'You can now ask any agriculture-related questions!' }]);
        } else {
          setMessages([...updatedMessages, { role: 'assistant', content: 'Please enter 1 or 2.' }]);
        }
      } 
      else if (workflowState === 'district') {
        const selection = validateSelection(userMsg, DISTRICTS);
        if (!selection) {
          setMessages([...updatedMessages, { role: 'assistant', content: 'Please enter a valid number from the list.' }]);
          return;
        }
        setFarmerDetails({...farmerDetails, district: selection});
        setWorkflowState('soil');
        setMessages([...updatedMessages, { role: 'assistant', content: `Please select your soil type:\n\n${formatOptions(SOIL_TYPES)}` }]);
      }
      else if (workflowState === 'soil') {
        const selection = validateSelection(userMsg, SOIL_TYPES);
        if (!selection) {
          setMessages([...updatedMessages, { role: 'assistant', content: 'Please enter a valid number from the list.' }]);
          return;
        }
        setFarmerDetails({...farmerDetails, soilType: selection});
        setWorkflowState('land');
        setMessages([...updatedMessages, { role: 'assistant', content: `Please select your land size:\n\n${formatOptions(LAND_SIZES)}` }]);
      }
      else if (workflowState === 'land') {
        const selection = validateSelection(userMsg, LAND_SIZES);
        if (!selection) {
          setMessages([...updatedMessages, { role: 'assistant', content: 'Please enter a valid number from the list.' }]);
          return;
        }
        setFarmerDetails({...farmerDetails, landSize: selection});
        setWorkflowState('water');
        setMessages([...updatedMessages, { role: 'assistant', content: `Please select your available water source:\n\n${formatOptions(WATER_SOURCES)}` }]);
      }
      else if (workflowState === 'water') {
        const selection = validateSelection(userMsg, WATER_SOURCES);
        if (!selection) {
          setMessages([...updatedMessages, { role: 'assistant', content: 'Please enter a valid number from the list.' }]);
          return;
        }
        setFarmerDetails({...farmerDetails, waterAvailability: selection});
        setWorkflowState('experience');
        setMessages([...updatedMessages, { role: 'assistant', content: `Please select your farming experience:\n\n${formatOptions(EXPERIENCE_LEVELS)}` }]);
      }
      else if (workflowState === 'experience') {
        const selection = validateSelection(userMsg, EXPERIENCE_LEVELS);
        if (!selection) {
          setMessages([...updatedMessages, { role: 'assistant', content: 'Please enter a valid number from the list.' }]);
          return;
        }
        
        // Auto-detect season
        const currentMonth = new Date().getMonth(); // 0-11
        // April (3) to September (8) -> Yala, October (9) to March (2) -> Maha
        const detectedSeason = (currentMonth >= 3 && currentMonth <= 8) ? 'Yala Season' : 'Maha Season';

        const finalDetails = {...farmerDetails, farmingExperience: selection, currentSeason: detectedSeason};
        setFarmerDetails(finalDetails);
        
        const prompt = `Recommend suitable crops for a farmer with: District: ${finalDetails.district}, Soil: ${finalDetails.soilType}, Land Size: ${finalDetails.landSize}, Water: ${finalDetails.waterAvailability}, Season: ${finalDetails.currentSeason}, Experience: ${finalDetails.farmingExperience}. Provide recommendations as a numbered list.`;
        
        const reply = await sendMessageToAPI(prompt);
        setWorkflowState('crop_selection');
        setMessages([
          ...updatedMessages, 
          { role: 'assistant', content: reply },
          { role: 'assistant', content: 'Please select a crop from the recommended options by typing its number or name.' }
        ]);
      }
      else if (workflowState === 'crop_selection') {
        let actualCropName = userMsg;
        
        // If user entered a number, try to extract the crop name from the AI's recommendation list
        if (/^\d+$/.test(userMsg.trim())) {
          // The AI's recommendation was the message right before the system prompted "Please select a crop..."
          const recMessage = messages[messages.length - 2]?.content || '';
          const lines = recMessage.split('\n');
          const line = lines.find((l: string) => l.trim().startsWith(userMsg.trim() + '.'));
          
          if (line) {
            // Remove "1. ", remove any bold asterisks, and grab everything up to the colon
            actualCropName = line.replace(/^\s*\d+\.\s*/, '').split(':')[0].replace(/\*\*/g, '').trim();
          }
        }

        setSelectedCrop(actualCropName);
        const prompt = `Generate a detailed 6-month cultivation plan for ${actualCropName}. Include Month 1 to Month 6 with land prep, fertilizer, irrigation, pest management, and yield estimation.`;
        const reply = await sendMessageToAPI(prompt);
        setCultivationPlan(reply);
        setWorkflowState('pdf_prompt');
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: reply },
          { role: 'assistant', content: 'Would you like me to generate a downloadable PDF version of this cultivation plan?\n\n1. Yes\n2. No' }
        ]);
      }
      else if (workflowState === 'pdf_prompt') {
        if (userMsg === '1' || userMsg.toUpperCase() === 'YES') {
          generatePDF();
          setMessages([...updatedMessages, { role: 'assistant', content: 'Your PDF is ready. It should download automatically.' }]);
        } else {
          setMessages([...updatedMessages, { role: 'assistant', content: 'Okay! Let me know if you have any other questions.' }]);
        }
        setWorkflowState('general');
      }
      else {
        // General Chat
        const reply = await sendMessageToAPI(userMsg);
        setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
      }
    } catch (error: any) {
      if (error?.response?.status === 402 || error?.response?.data?.requiresPayment) {
        setShowSubscriptionModal(true);
        setMessages(messages); // revert
      } else if (error?.response?.status === 401) {
        setMessages([...updatedMessages, { role: 'assistant', content: 'Your session has expired. Please refresh the page or log in again.' }]);
      } else {
        console.error('AI API Error:', error);
        const errMsg = error?.response?.data?.message || error?.message || 'Unknown network error';
        setMessages([...updatedMessages, { role: 'assistant', content: `Sorry, an error occurred while connecting to the AI service. (${errMsg})` }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-full w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
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
              <button onClick={startNewChat} className="flex-1 flex items-center gap-2 bg-[#1e4d1e] text-white px-4 py-3 rounded-xl hover:bg-[#163d16] transition-colors font-medium text-sm">
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

            <div className="p-4 pb-2">
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Recent Conversations</h3>
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
            <h2 className="font-bold text-gray-800 hidden sm:block">AgriGrowthRate AI Assistant</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          {(messages.length === 1 && workflowState === 'initial') ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-4 py-8">
              <div className="w-16 h-16 bg-[#1e4d1e] rounded-2xl flex items-center justify-center shadow-lg mb-8">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1e4d1e] text-center mb-4 tracking-tight leading-tight">
                Welcome to<br/>AgriGrowthRate AI<br/>Assistant
              </h1>
              <p className="text-gray-500 text-center max-w-2xl mb-12 text-lg">
                Get real-time insights, crop recommendations, and detailed cultivation roadmaps powered by agricultural intelligence.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <button 
                  onClick={() => handleSendMessage('1')}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-8 text-left group flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-[#1e4d1e] focus:ring-opacity-50"
                >
                  <div className="w-12 h-12 bg-[#e8f0e8] text-[#1e4d1e] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">1. Crop Recommendation</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Find the best crops for your specific soil type, district, and weather patterns.
                  </p>
                </button>
                
                <button 
                  onClick={() => handleSendMessage('2')}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-8 text-left group flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-[#1e4d1e] focus:ring-opacity-50"
                >
                  <div className="w-12 h-12 bg-[#e8f0e8] text-[#1e4d1e] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">2. Agriculture Related Questions</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Ask about pests, irrigation, fertilizers, or harvest optimization techniques.
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
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
          )}
        </div>

        <div className="p-4 bg-white">
          <div className="max-w-4xl mx-auto relative flex items-center bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2 transition-shadow focus-within:shadow-md focus-within:border-[#1e4d1e]">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything about your crops..."
              className="flex-1 bg-transparent border-none py-3 px-3 outline-none text-gray-700 text-base"
              disabled={loading}
            />
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || (!input.trim() && workflowState !== 'crop_selection')}
                className="bg-[#1e4d1e] hover:bg-[#163d16] text-white p-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-wider font-medium">AGRIGROWTHRATE AI CAN MAKE MISTAKES. VERIFY IMPORTANT INFORMATION WITH LOCAL AGRICULTURAL AUTHORITIES.</p>
        </div>
      </div>

      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} activeChatId={activeChatId} />

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
