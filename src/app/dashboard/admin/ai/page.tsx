'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Zap,
  Smile,
  Settings,
  Download,
  Clock,
  ShieldCheck,
  Plus,
  Sliders,
  Database,
  X,
  Loader2,
  FileText,
  CloudLightning,
  Wifi,
  Pause,
  AlertCircle,
  Activity,
  Heart,
  TrendingUp,
  Cpu,
  Brain,
  MessageSquare,
  AlertTriangle,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

interface AIData {
  totalQueries: number;
  avgResponseTime: number;
  positiveReactions: number;
  negativeReactions: number;
  neutralReactions: number;
  sentimentAnalysis: Record<string, number>;
  recentActivity: Array<any>;
}

interface KnowledgeBaseDoc {
  _id: string;
  originalName: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

export default function AIManagementPage() {
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [datasetName, setDatasetName] = useState('');
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [pdfCount, setPdfCount] = useState(0);

  // Model settings states exactly matching mockup
  const [priority, setPriority] = useState<'Precision' | 'Performance'>('Precision');
  const [contextVal, setContextVal] = useState(70); // slider percent
  const [creativityVal, setCreativityVal] = useState(40); // slider percent
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeBaseDoc[]>([]);

  useEffect(() => {
    fetchAIData();
    fetchKnowledgeBase();
  }, []);

  const fetchKnowledgeBase = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/ai/knowledge', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setKnowledgeDocs(response.data.data);
      }
    } catch (error) {
      console.warn('Failed to fetch knowledge base documents', error);
    }
  };

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/ai-management', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null);

      if (response && response.data && response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.warn('AI monitoring API offline, utilizing fallback mock statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceRetrain = () => {
    toast.success('Force retrain requested! Initiating continuous neural pipeline retrain... 🚀');
  };

  const handleExportAIReport = () => {
    toast.success('AI performance catalog exported successfully! 📄');
  };

  const handleAddDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetFile) return toast.error('Please select a PDF file');
    setSyncing(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('pdf', datasetFile);

      const response = await axios.post('http://localhost:5001/api/ai/upload-knowledge', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success(`PDF "${datasetFile.name}" uploaded and processing! 📦`);
        setPdfCount(prev => prev + 1);
        setShowAddModal(false);
        setDatasetName('');
        setDatasetFile(null);
        fetchKnowledgeBase();
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error uploading file');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto relative select-none">

        {/* ── TOP ACTIONS ── */}
        <div className="flex justify-end">
        </div>

        {/* ── MIDDLE GRID (KNOWLEDGE BASE & MODEL SETTINGS) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Knowledge Base Management (col-span-7) */}
          <div className="lg:col-span-8 bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[420px] text-left">
            <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e] shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Knowledge Base Management
                </h3>
              </div>

              <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-400">
                {knowledgeDocs.length} Active Sources
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[500px]">

                <thead className="bg-[#fcfdfa]/80 border-b border-[#e4e6df]">
                  <tr>
                    <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Dataset Name</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Size</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Last Sync</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f4f5f0]">
                  {knowledgeDocs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-400">
                        No active data sources found. Add a PDF to get started.
                      </td>
                    </tr>
                  ) : (
                    knowledgeDocs.map((doc) => (
                      <tr key={doc._id}>
                        <td className="px-4 py-3 text-xs font-bold text-gray-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{doc.originalName}</span>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-500">{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</td>
                        <td className="px-4 py-3 text-[10px] font-semibold text-gray-400">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {doc.status === 'active' || doc.status === 'trained' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#e3f7ed] text-[#2e7d32] border border-[#c8e6c9] text-[9px] font-bold">Active</span>
                          ) : doc.status === 'processing' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold">Processing</span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold">Failed</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-[10px] font-bold text-[#1e4d1e] hover:underline cursor-pointer">Config</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full mt-4 py-3 border-2 border-dashed border-[#d2dfc2] hover:border-[#1e4d1e] text-gray-500 font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:bg-[#edf4e2]/10 transition-all cursor-pointer text-center"
            >
              + Add New Data Source
            </button>
          </div>

          {/* Model Configuration & Settings (col-span-5) */}
          <div className="lg:col-span-4 bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm space-y-4 min-h-[420px] flex flex-col justify-between text-left">
            <div className="flex items-center gap-3 border-b border-[#f4f5f0] pb-3">
              <div className="w-8 h-8 rounded-full bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e] shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Model Settings
              </h3>
            </div>

            {/* Optimization Priority card */}
            <div className="p-4 bg-[#fcfdfa] border border-[#e4e6df] rounded-[18px] space-y-3">
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Optimization Priority</span>

              <div className="flex bg-[#f4f5f0]/80 p-0.5 rounded-lg select-none">
                <button
                  type="button"
                  onClick={() => setPriority('Precision')}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${priority === 'Precision'
                    ? 'bg-[#1e4d1e] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  Precision
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('Performance')}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${priority === 'Performance'
                    ? 'bg-[#1e4d1e] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  Performance
                </button>
              </div>

              <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                Precision mode increases hallucination checks and cross-references multi-spectral data before responding.
              </p>
            </div>

            {/* PDF Documents Count */}
            <div className="p-4 bg-[#fcfdfa] border border-[#e4e6df] rounded-[18px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#edf4e2] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#1e4d1e]" />
                </div>
                <div>
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">PDFs Uploaded</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Knowledge base documents</p>
                </div>
              </div>
              <span className="text-3xl font-black text-[#1e4d1e]">{pdfCount}</span>
            </div>

            {/* Info notice box at the bottom */}
            <div className="bg-[#edf4e2] border border-[#d2dfc2] rounded-xl p-3 flex gap-2.5 items-start mt-2">
              <AlertCircle className="w-4 h-4 text-[#1e4d1e] shrink-0 mt-0.5" />
              <p className="text-[9px] text-[#1e4d1e] font-semibold leading-relaxed">
                Changing settings will restart the AI inference server. Estimated downtime: 12 seconds.
              </p>
            </div>
          </div>

        </div>



        {/* ── MODEL HEALTH ARCHITECTURE ── */}
        <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm space-y-6 text-left relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[#f4f5f0] pb-4">
            <div className="w-8 h-8 rounded-full bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e] shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Model Health Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">

            {/* Left large circular model icon */}
            <div className="md:col-span-4 flex justify-center py-4 select-none relative">

              <div className="w-32 h-32 rounded-full border border-gray-150 flex items-center justify-center relative">

                {/* Glowing Green Central dot */}
                <div className="w-16 h-16 rounded-full bg-[#1e4d1e] shadow-2xl flex items-center justify-center text-white">
                  <Brain className="w-7 h-7 fill-white" />
                </div>

                {/* Outer tracking ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-gray-250 animate-[spin_40s_linear_infinite]" />
              </div>

            </div>

            {/* Right progress monitoring lines exactly matching mockup */}
            <div className="md:col-span-8 space-y-5 text-left pr-4">

              {/* Progress 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Inference Engine v4.2</span>
                  <span className="text-[#1e4d1e]">78% CPU</span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              {/* Progress 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Vector DB Connectivity</span>
                  <span className="text-[#1e4d1e]">90% Stability</span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              {/* Progress 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Request Queue</span>
                  <span className="text-gray-400 font-bold text-[10px]">Idle</span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1e4d1e] rounded-full" style={{ width: '5%' }} />
                </div>
              </div>

              {/* Primary Model metadata row */}
              <div className="pt-2 border-t border-[#f4f5f0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-gray-400 font-bold">
                <span>Primary Model: <span className="text-gray-700">Agri-Sage-LLM-Large</span></span>
                <span>Uptime: <span className="text-gray-700">1,422 Hours (99.99%)</span></span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ── ADD DATA SOURCE MODAL ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#edf4e2] flex items-center justify-center mx-auto border border-[#d2dfc2]">
                  <Database className="w-6 h-6 text-[#1e4d1e]" />
                </div>
                <h4 className="text-lg font-extrabold text-gray-900">Add New Data Source</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Provide credentials or stream paths to train your local agricultural intelligence.
                </p>
              </div>

              <form onSubmit={handleAddDataset} className="space-y-4 text-left">
                {/* Dataset Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Dataset Title
                  </label>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="e.g. Soil Composition Metrics 2024"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Upload PDF Document
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setDatasetFile(e.target.files[0]);
                      }
                    }}
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={syncing}
                    className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Register Stream'}
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </>
  );
}

// ── CUSTOM INLINE MINI-ICONS MATCHING VISUAL LABELS ──
function UserIcon() {
  return (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.475 3.475 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.475 3.475 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.475 3.475 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.475 3.475 0 013.138-3.138z" />
    </svg>
  );
}