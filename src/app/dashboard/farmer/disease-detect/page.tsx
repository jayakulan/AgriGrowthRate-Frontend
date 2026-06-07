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
  Camera,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  UploadCloud,
  History,
  Bot,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DiseaseDetectionPage() {
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasResult, setHasResult] = useState(true);

  // Form result states
  const [diseaseName, setDiseaseName] = useState('Early Blight');
  const [confidence, setConfidence] = useState(94);
  const [diseaseImage, setDiseaseImage] = useState(
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&h=600&fit=crop'
  );
  const [treatment, setTreatment] = useState(
    'Prune affected lower leaves immediately to prevent fungal spread. Apply copper-based fungicide at 7-10 day intervals during humid weather.'
  );

  // Mock scan history records
  const recentScans = [
    {
      id: 'scan-1',
      title: 'Nitrogen Deficiency',
      details: 'Corn Field A-2 • 2 days ago',
      image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=80&h=80&fit=crop',
      treatment: 'Apply nitrogen-rich fertilizer (urea or ammonium sulfate) near the root zone.',
      confidence: 88,
    },
    {
      id: 'scan-2',
      title: 'Healthy Crop',
      details: 'Wheat Plot 4 • 5 days ago',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&h=80&fit=crop',
      treatment: 'No disease detected. Continue standard watering and solar cycles.',
      confidence: 99,
    },
  ];

  // Simulating leaf AI scanning sequence
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanning(true);
      setScanStep(1);
      
      // Step 1: Processing image
      setTimeout(() => {
        setScanStep(2);
        
        // Step 2: Isolating pathogen cells
        setTimeout(() => {
          setScanStep(3);
          
          // Step 3: Fetching Neural Engine database
          setTimeout(() => {
            setScanning(false);
            setHasResult(true);
            setDiseaseName('Late Blight');
            setConfidence(91);
            setDiseaseImage('https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&h=600&fit=crop');
            setTreatment('Remove entire plant if infestation is severe. Spray protectant fungicides (chlorothalonil or mancozeb) on surrounding healthy crops.');
            toast.success('AI Diagnostics complete! Late Blight identified.');
          }, 1000);
        }, 1000);
      }, 1000);
    }
  };

  const handleSelectRecent = (scan: typeof recentScans[0]) => {
    setDiseaseName(scan.title);
    setConfidence(scan.confidence);
    setDiseaseImage(scan.image);
    setTreatment(scan.treatment);
    toast.success(`Loaded scan results for ${scan.title}`);
  };

  return (
    <div className="p-8">
            
            {/* Title description banner */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
                Crop Disease Detection
              </h1>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed max-w-2xl">
                Upload a clear photo of your crop&apos;s leaf to identify potential threats and receive treatment recommendations instantly.
              </p>
            </div>

            {/* Split layout: Upload Capture Box (Left) & Diagnosis Panel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              
              {/* Left Column: Upload box and Precision Tips */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Upload dash area */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-white p-12 text-center relative group min-h-[300px] flex flex-col justify-center items-center shadow-sm">
                  
                  {scanning ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative flex items-center justify-center">
                        <RefreshCw className="w-12 h-12 text-[#1e4d1e] animate-spin" />
                        <Camera className="w-5 h-5 text-[#1e4d1e] absolute" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {scanStep === 1 && 'Processing crop image...'}
                          {scanStep === 2 && 'Isolating leaf anomaly cells...'}
                          {scanStep === 3 && 'Consulting neural agritech engine...'}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">Please stand by, scanning pathogens</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Circle camera icon matching mock */}
                      <div className="w-16 h-16 rounded-full bg-[#1e4d1e] flex items-center justify-center text-white mb-4 shadow-md">
                        <Camera className="w-7 h-7" />
                      </div>
                      <h3 className="text-sm font-extrabold text-gray-950">Capture or Upload</h3>
                      <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, or TIFF (Max 20MB). Focus on the affected area.</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}

                </div>

                {/* Precision Tip Card */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center text-[#1e4d1e] shrink-0">
                    <Lightbulb className="w-5 h-5 text-[#1e4d1e]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900 leading-snug">Precision Tip</h4>
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed font-semibold">
                      Ensure natural lighting and hold the camera 4-6 inches away from the leaf for the highest confidence scores.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: AI Analysis Results Card */}
              <div className="lg:col-span-5">
                
                {hasResult ? (
                  <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
                    
                    <div>
                      {/* Card Header details */}
                      <div className="flex justify-between items-center pb-4 border-b border-[#f4f5f0] mb-4">
                        <h3 className="text-base font-extrabold text-gray-900">Analysis Result</h3>
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-green-600">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Processed
                        </span>
                      </div>

                      {/* Diagnostic Confidence indicators */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                          <span>Detected: <span className="text-gray-900 font-extrabold">{diseaseName}</span></span>
                          <span>{confidence}% Confidence</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1e4d1e] h-full rounded-full transition-all duration-500"
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                      </div>

                      {/* Centered Close up leaf image */}
                      <div className="aspect-square w-full rounded-xl overflow-hidden relative border border-[#e4e6df] p-1.5 bg-gray-50 mb-5">
                        <div className="absolute inset-1.5 rounded-lg border-2 border-[#1e4d1e]/40 pointer-events-none z-10" />
                        <img
                          src={diseaseImage}
                          alt="Diseased Tomato Leaf"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Treatment details */}
                      <div className="pt-4 border-t border-[#f4f5f0] space-y-1.5 mb-6 text-left">
                        <h4 className="text-xs font-bold text-gray-900">Recommended Action</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                          {treatment}
                        </p>
                      </div>
                    </div>

                    {/* Action Banners */}
                    <div className="space-y-2">
                      <button
                        onClick={() => toast.success('Connecting to AI Agronomist...')}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        <Bot className="w-4 h-4" />
                        <span>Consult AI Assistant</span>
                      </button>

                      <button
                        onClick={() => toast.success('Loading history log...')}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-50 border border-[#e4e6df] text-gray-700 font-bold rounded-xl text-xs transition-colors"
                      >
                        <History className="w-4 h-4" />
                        <span>View Scan History</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  // Result Empty state
                  <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center min-h-[460px] text-gray-400">
                    <Activity className="w-12 h-12 mb-4 text-gray-300 animate-pulse" />
                    <h4 className="text-sm font-bold text-gray-900">Diagnostic Panel Inactive</h4>
                    <p className="text-xs text-gray-400 max-w-xs mt-1.5">
                      Upload or capture a photo of a crop leaf on the left panel to trigger the AI Diagnostic analysis system.
                    </p>
                  </div>
                )}

              </div>

            </div>

            {/* Bottom Row: Recent Assessments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Assessments</h3>
                <Link
                  href="#"
                  onClick={() => toast.success('Scan History log coming soon')}
                  className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Three assessments cards row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {recentScans.map((scan) => (
                  <button
                    key={scan.id}
                    onClick={() => handleSelectRecent(scan)}
                    className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left w-full"
                  >
                    <img
                      src={scan.image}
                      alt={scan.title}
                      className="w-12 h-12 rounded-xl object-cover border border-[#e4e6df] shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 leading-snug">{scan.title}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold mt-0.5 block">{scan.details}</span>
                    </div>
                  </button>
                ))}

                {/* Upload New Scan Trigger Card */}
                <div className="border-2 border-dashed border-gray-200 hover:border-[#1e4d1e] bg-white/40 rounded-2xl p-4 flex items-center gap-4 transition-colors cursor-pointer relative">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-200">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-950">Upload New Scan</h4>
                    <span className="text-[10px] text-gray-400 font-semibold mt-0.5 block">Analyze a new plot</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

              </div>
            </div>

    </div>
  );
}
