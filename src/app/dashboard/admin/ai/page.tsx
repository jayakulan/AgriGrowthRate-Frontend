'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  Play,
  Folder,
  Search
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

export default function AIManagementPage() {
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [datasetName, setDatasetName] = useState('');
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Model settings states exactly matching mockup
  const [priority, setPriority] = useState<'Precision' | 'Performance'>('Precision');
  const [contextVal, setContextVal] = useState(70); // slider percent
  const [creativityVal, setCreativityVal] = useState(40); // slider percent

  // Hidden Model settings modal toggle
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Log Search Text state
  const [logSearchTerm, setLogSearchTerm] = useState('');

  // Folder Upload States & Ref
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolderFiles, setSelectedFolderFiles] = useState<File[]>([]);
  const [selectedFolderName, setSelectedFolderName] = useState('');
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Data Sources State
  const [dataSources, setDataSources] = useState([
    {
      id: 'ds-1',
      name: 'Soil Composition Metrics 2024',
      size: '42.5 GB',
      lastSync: '2h ago',
      status: 'Trained',
      progress: 100,
      iconType: 'file'
    },
    {
      id: 'ds-2',
      name: 'Satellite Multi-Spectral Imagery',
      size: '1.2 TB',
      lastSync: '14m ago',
      status: 'Processing',
      progress: 65,
      iconType: 'satellite'
    },
    {
      id: 'ds-3',
      name: 'Historical Crop Yields (10yr)',
      size: '850 MB',
      lastSync: 'Oct 24, 2023',
      status: 'Trained',
      progress: 100,
      iconType: 'file'
    },
    {
      id: 'ds-4',
      name: 'Real-time IoT Sensor Stream',
      size: 'Streaming Live',
      lastSync: 'Live',
      status: 'Syncing',
      progress: 100,
      iconType: 'wifi'
    }
  ]);

  const [logs, setLogs] = useState([
    {
      id: 'log-1',
      time: '4m ago',
      type: 'Query from Farmer: #8291',
      content: '"Why are my nitrogen levels dropping in Section D despite regular fertilization?"',
      accuracy: '98%',
      sentiment: 'Curiously Urgent',
      reasoning: '',
      isAlert: false
    },
    {
      id: 'log-2',
      time: '18m ago',
      type: 'Automated Harvest Schedule Generation',
      content: '"Scheduling Section F for harvest tomorrow at 05:00 based on dew point and humidity trends."',
      accuracy: '',
      sentiment: '',
      confidence: '99.4%',
      reasoning: 'Multi-Spectral Analysis',
      isAlert: false
    },
    {
      id: 'log-3',
      time: '1h ago',
      type: 'Anomaly Detection Alert',
      content: '"Potential pest infestation detected via thermal satellite drift in Western Ridge."',
      accuracy: '',
      sentiment: 'Negative Sentiment: High Concern',
      reasoning: 'AI Advice: Dispatching Drones',
      isAlert: true
    }
  ]);

  const filteredLogs = logs.filter(log => 
    log.type.toLowerCase().includes(logSearchTerm.toLowerCase()) || 
    log.content.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
    (log.sentiment && log.sentiment.toLowerCase().includes(logSearchTerm.toLowerCase())) ||
    (log.reasoning && log.reasoning.toLowerCase().includes(logSearchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchAIData();
  }, []);

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

  // Directory Folder Selector picker handlers
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const firstPath = fileList[0].webkitRelativePath || '';
    const folderName = firstPath.split('/')[0] || 'Uploaded Folder';

    setSelectedFolderFiles(fileList);
    setSelectedFolderName(folderName);
    setShowFolderModal(true);

    // Reset input value to allow triggering pick folder again
    if (e.target) e.target.value = '';
  };

  const confirmFolderUpload = () => {
    setShowFolderModal(false);
    const folderName = selectedFolderName;
    const fileCount = selectedFolderFiles.length;

    // Trigger simulation vectorization progress bar row
    const newId = `ds-${Date.now()}`;
    const newSource = {
      id: newId,
      name: folderName,
      size: `${(fileCount * 1.5).toFixed(1)} MB`,
      lastSync: 'Just now',
      status: 'Processing',
      progress: 0,
      iconType: 'folder'
    };

    setDataSources(prev => [...prev, newSource]);

    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 10;
      setDataSources(prev => 
        prev.map(ds => ds.id === newId ? { ...ds, progress: progressVal, status: progressVal === 100 ? 'Trained' : 'Processing' } : ds)
      );

      if (progressVal >= 100) {
        clearInterval(interval);
        toast.success(`Folder "${folderName}" vectorization complete! RAG Database updated successfully. 🌳`);
      }
    }, 450);
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
        setShowAddModal(false);
        setDatasetName('');
        setDatasetFile(null);
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
        
        {/* ── MIDDLE GRID (KNOWLEDGE BASE & SYSTEM HEALTH) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Knowledge Base Management (col-span-8) */}
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
                {dataSources.length} Active Sources
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
                  {dataSources.map((ds) => {
                    let IconComponent = FileText;
                    if (ds.iconType === 'satellite') IconComponent = CloudLightning;
                    else if (ds.iconType === 'wifi') IconComponent = Wifi;
                    else if (ds.iconType === 'folder') IconComponent = Folder;

                    return (
                      <tr key={ds.id}>
                        <td className="px-4 py-3 text-xs font-bold text-gray-800 flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[220px]">{ds.name}</span>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-500">{ds.size}</td>
                        <td className="px-4 py-3 text-[10px] font-semibold text-gray-400">{ds.lastSync}</td>
                        <td className="px-4 py-3">
                          {ds.progress < 100 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1e4d1e] rounded-full transition-all duration-300" style={{ width: `${ds.progress}%` }}></div>
                              </div>
                              <span className="text-[9px] font-bold text-gray-500">{ds.progress}%</span>
                              {ds.status === 'Processing' && (
                                <button type="button" className="p-0.5 text-gray-400 hover:text-gray-700 cursor-pointer animate-pulse">
                                  <Pause className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              ds.status === 'Trained' 
                                ? 'bg-[#e3f7ed] text-[#2e7d32] border border-[#c8e6c9]' 
                                : ds.status === 'Syncing'
                                ? 'bg-blue-50 text-blue-600 border border-blue-150'
                                : 'bg-gray-50 text-gray-600 border border-gray-150'
                            }`}>
                              {ds.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {ds.status === 'Trained' && (
                            <button type="button" className="text-[10px] font-bold text-[#1e4d1e] hover:underline cursor-pointer">Edit</button>
                          )}
                          {ds.status === 'Syncing' && (
                            <button type="button" className="text-[10px] font-bold text-gray-400 hover:underline cursor-pointer">Config</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>

            <button
              onClick={() => folderInputRef.current?.click()}
              className="w-full mt-4 py-3 border-2 border-dashed border-[#d2dfc2] hover:border-[#1e4d1e] text-gray-500 font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:bg-[#edf4e2]/10 transition-all cursor-pointer text-center"
            >
              + Add New Data Source
            </button>
            <input
              type="file"
              ref={folderInputRef}
              onChange={handleFolderUpload}
              style={{ display: 'none' }}
              {...({ webkitdirectory: "", directory: "", multiple: true } as any)}
            />
          </div>

          {/* System Health & Performance (col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[420px] text-left">
            <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e] shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  System Health
                </h3>
              </div>
              
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                title="Model Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* 2x2 Grid of Metrics */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              {/* Metric 1: Queries / Active Sessions */}
              <div className="border border-[#e4e6df] rounded-xl p-3 bg-[#fcfdfa]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 uppercase tracking-wider text-[8px] font-bold mb-1">
                    <MessageSquare className="w-3 h-3 text-[#1e4d1e]" />
                    <span>Active Sessions</span>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900">142 Active</div>
                  <div className="text-[10px] font-semibold text-gray-500 mt-0.5">12.8k Queries</div>
                </div>
                <div className="flex items-center text-[9px] font-bold text-green-600 mt-2">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  <span>+23% today</span>
                </div>
              </div>

              {/* Metric 2: Avg Response Latency */}
              <div className="border border-[#e4e6df] rounded-xl p-3 bg-[#fcfdfa]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 uppercase tracking-wider text-[8px] font-bold mb-1">
                    <Clock className="w-3 h-3 text-[#1e4d1e]" />
                    <span>Avg Latency</span>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900">420ms</div>
                  
                  {/* Sparkline */}
                  <div className="mt-1">
                    <svg className="w-full h-5 text-[#1e4d1e]" viewBox="0 0 100 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 18 Q10 8 20 15 T40 5 T60 12 T80 7 T100 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-green-600 mt-1">
                  Optimal performance
                </div>
              </div>

              {/* Metric 3: Grounding Accuracy */}
              <div className="border border-[#e4e6df] rounded-xl p-3 bg-[#fcfdfa]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 uppercase tracking-wider text-[8px] font-bold mb-1">
                    <ShieldCheck className="w-3 h-3 text-[#1e4d1e]" />
                    <span>Accuracy</span>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900">99.4%</div>
                  
                  <div className="w-full bg-gray-150 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#1e4d1e]" style={{ width: '99.4%' }} />
                  </div>
                </div>
                <div className="text-[9px] font-bold text-green-700 mt-1">
                  0.02% Hallucination
                </div>
              </div>

              {/* Metric 4: Token Usage & Budget */}
              <div className="border border-[#e4e6df] rounded-xl p-3 bg-[#fcfdfa]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 uppercase tracking-wider text-[8px] font-bold mb-1">
                    <Database className="w-3 h-3 text-[#1e4d1e]" />
                    <span>Token Costs</span>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900">$12.40</div>
                  <div className="text-[10px] font-semibold text-gray-500 mt-0.5">84K Daily Tokens</div>
                </div>
                <div className="text-[9px] font-bold text-green-600 mt-2">
                  78% Budget left
                </div>
              </div>
            </div>

            {/* Info notice box at the bottom */}
            <div className="bg-[#edf4e2] border border-[#d2dfc2] rounded-xl p-3 flex gap-2.5 items-start mt-4">
              <AlertCircle className="w-4 h-4 text-[#1e4d1e] shrink-0 mt-0.5" />
              <p className="text-[9px] text-[#1e4d1e] font-semibold leading-relaxed">
                System resources healthy. Inference engines operational across all Section sectors.
              </p>
            </div>
          </div>

        </div>

        {/* ── AI ACTIVITY LOGS & SENTIMENT ── */}
        <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#f4f5f0] pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#edf4e2] flex items-center justify-center text-[#1e4d1e] shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                AI Activity Logs & Sentiment Feed
              </h3>
            </div>
            
            {/* Live query search filter input */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-gray-400" />
              </span>
              <input
                type="text"
                value={logSearchTerm}
                onChange={(e) => setLogSearchTerm(e.target.value)}
                placeholder="Search queries or logs..."
                className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-1.5 pl-9 pr-4 text-xs font-bold text-[#1e4d1e] outline-none placeholder:text-gray-400 placeholder:font-semibold transition-all"
              />
            </div>
          </div>

          {/* Activity items list styled precisely like screenshot boxes */}
          <div className="space-y-4 pt-2">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-xs font-semibold text-gray-400">
                No matching activity logs found.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`bg-[#f8f9f6]/80 border border-[#e4e6df] rounded-[18px] p-5 text-left relative transition-all ${
                    log.isAlert ? 'border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <span className="absolute top-4 right-4 text-[9px] font-bold text-gray-400">{log.time}</span>
                  
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      log.isAlert 
                        ? 'bg-red-50 border border-red-100 text-red-600' 
                        : 'bg-[#edf4e2] border border-[#d2dfc2] text-[#1e4d1e]'
                    }`}>
                      {log.isAlert ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : log.type.includes('Farmer') ? (
                        <UserIcon />
                      ) : (
                        <CalendarIcon />
                      )}
                    </div>
                    
                    <div className="space-y-2 flex-1 min-w-0 pr-8">
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">{log.type}</p>
                      <p className="text-xs font-semibold text-gray-600 italic leading-relaxed">
                        {log.content}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 pt-1 text-[10px] text-gray-400 font-bold">
                        {log.accuracy && (
                          <span className="flex items-center gap-1">
                            <TargetIcon className="w-3.5 h-3.5 text-[#1e4d1e]" /> Response Accuracy: {log.accuracy}
                          </span>
                        )}
                        {log.confidence && (
                          <span className="flex items-center gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5 text-[#1e4d1e]" /> Confidence: {log.confidence}
                          </span>
                        )}
                        {log.sentiment && (
                          <span className={`flex items-center gap-1 ${log.isAlert ? 'text-red-500' : ''}`}>
                            {log.isAlert ? <AlertTriangle className="w-3.5 h-3.5" /> : <Brain className="w-3.5 h-3.5 text-[#1e4d1e]" />} Sentiment: {log.sentiment}
                          </span>
                        )}
                        {log.reasoning && (
                          <span className="flex items-center gap-1 text-[#1e4d1e]">
                            {log.reasoning.startsWith('AI Advice:') ? (
                              <MessageSquare className="w-3.5 h-3.5 text-[#1e4d1e]" />
                            ) : (
                              <Activity className="w-3.5 h-3.5 text-[#1e4d1e]" />
                            )}
                            <span>{log.reasoning}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right-aligned secondary button */}
          <div className="flex justify-end pt-2">
            <button className="px-5 py-2.5 bg-[#edf4e2] hover:bg-[#d2dfc2] text-[#1e4d1e] text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer select-none">
              View All Logs (24,000+ entries)
            </button>
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

      {/* ── MODEL SETTINGS MODAL ── */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl space-y-6 text-left"
            >
              <button
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-[#edf4e2] flex items-center justify-center mx-auto border border-[#d2dfc2]">
                  <Sliders className="w-6 h-6 text-[#1e4d1e]" />
                </div>
                <h4 className="text-lg font-extrabold text-gray-900">Model Optimization Settings</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Fine-tune context limits, creativity temperature, and core priority levels.
                </p>
              </div>

              {/* Optimization Priority card */}
              <div className="p-4 bg-[#fcfdfa] border border-[#e4e6df] rounded-[18px] space-y-3">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Optimization Priority</span>
                
                <div className="flex bg-[#f4f5f0]/80 p-0.5 rounded-lg select-none">
                  <button
                    type="button"
                    onClick={() => setPriority('Precision')}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                      priority === 'Precision'
                        ? 'bg-[#1e4d1e] text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Precision
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('Performance')}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                      priority === 'Performance'
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

              {/* Context Window Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Context Window</span>
                  <span className="text-[#1e4d1e]">128k Tokens</span>
                </div>
                
                <div className="relative w-full h-1 bg-gray-150 rounded-full">
                  <div className="absolute left-0 top-0 bottom-0 bg-[#1e4d1e] rounded-full" style={{ width: `${contextVal}%` }} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contextVal}
                    onChange={(e) => setContextVal(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="absolute w-3 h-3 bg-[#1e4d1e] border-2 border-white rounded-full -top-1 shadow-md transition-all pointer-events-none" style={{ left: `calc(${contextVal}% - 6px)` }} />
                </div>
              </div>

              {/* Creativity Temperature Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Creativity (Temperature)</span>
                  <span className="text-[#1e4d1e]">{(creativityVal / 100).toFixed(1)}</span>
                </div>
                
                <div className="relative w-full h-1 bg-gray-150 rounded-full">
                  <div className="absolute left-0 top-0 bottom-0 bg-[#1e4d1e] rounded-full" style={{ width: `${creativityVal}%` }} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creativityVal}
                    onChange={(e) => setCreativityVal(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="absolute w-3 h-3 bg-[#1e4d1e] border-2 border-white rounded-full -top-1 shadow-md transition-all pointer-events-none" style={{ left: `calc(${creativityVal}% - 6px)` }} />
                </div>
              </div>

              <div className="bg-[#edf4e2] border border-[#d2dfc2] rounded-xl p-3 flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-[#1e4d1e] shrink-0 mt-0.5" />
                <p className="text-[9px] text-[#1e4d1e] font-semibold leading-relaxed">
                  Changing settings will restart the AI inference server. Estimated downtime: 12 seconds.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsModal(false);
                    toast.success("Model optimization settings applied!");
                  }}
                  className="w-full py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  Apply Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FOLDER PREVIEW MODAL ── */}
      <AnimatePresence>
        {showFolderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFolderModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl flex flex-col max-h-[90vh] text-left"
            >
              <button
                onClick={() => setShowFolderModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#edf4e2] flex items-center justify-center mx-auto border border-[#d2dfc2]">
                  <Folder className="w-6 h-6 text-[#1e4d1e]" />
                </div>
                <h4 className="text-lg font-extrabold text-gray-900">Upload Directory Folder</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Folder name: <span className="font-extrabold text-[#1e4d1e]">{selectedFolderName}</span> ({selectedFolderFiles.length} files detected)
                </p>
              </div>

              {/* Scrollable File List */}
              <div className="flex-1 overflow-y-auto border border-[#e4e6df] rounded-xl p-4 bg-[#fcfdfa] space-y-2 mb-6 max-h-60">
                {selectedFolderFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#f4f5f0] last:border-0">
                    <div className="flex items-center gap-2 min-w-0 mr-4">
                      <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-bold text-gray-700 truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 shrink-0">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmFolderUpload}
                  className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-all cursor-pointer text-center"
                >
                  Initiate Vectorization
                </button>
              </div>
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
