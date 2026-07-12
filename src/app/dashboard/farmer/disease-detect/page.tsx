'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  UploadCloud,
  History,
  RefreshCw,
  Activity,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DiseaseDetectionPage() {
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasResult, setHasResult] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('auto');

  // Form result states
  const [diseaseName, setDiseaseName] = useState('Early Blight');
  const [confidence, setConfidence] = useState(94);
  const [diseaseImage, setDiseaseImage] = useState(
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&h=600&fit=crop'
  );
  const [treatment, setTreatment] = useState(
    'Prune affected lower leaves immediately to prevent fungal spread. Apply copper-based fungicide at 7-10 day intervals during humid weather.'
  );

  // Crop configuration options
  const cropOptions = [
    { id: 'auto', label: 'All Crops' },
    { id: 'rice', label: 'Rice' },
    { id: 'corn', label: 'Corn' },
    { id: 'potato', label: 'Potato' },
    { id: 'wheat', label: 'Wheat' },
    { id: 'tomato', label: 'Tomato' },
    { id: 'apple', label: 'Apple' },
  ];

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

  // Real leaf AI scanning sequence integrated with Python microservice
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview URL
      const previewUrl = URL.createObjectURL(file);
      setDiseaseImage(previewUrl);

      setScanning(true);
      setScanStep(1);

      // Start fetching from the Django microservice
      const formData = new FormData();
      formData.append('file', file);
      formData.append('crop', selectedCrop);

      const apiPromise = fetch('http://localhost:8000/api/detect/', {
        method: 'POST',
        body: formData,
      }).then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Server error during detection');
        }
        return res.json();
      });

      // Step animations (minimum duration to maintain good UX)
      const stepPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          setScanStep(2);
          setTimeout(() => {
            setScanStep(3);
            setTimeout(() => {
              resolve();
            }, 1000);
          }, 1000);
        }, 1000);
      });

      try {
        // Wait for both the minimum animation time and the API request
        const [apiResult] = await Promise.all([apiPromise, stepPromise]);

        setScanning(false);
        setHasResult(true);
        setDiseaseName(apiResult.disease_name || apiResult.detected_name);
        setConfidence(apiResult.confidence || 0);
        setTreatment(apiResult.suggestion || 'No suggestion available.');
        toast.success(`AI Diagnostics complete! ${apiResult.disease_name || apiResult.detected_name} identified.`);
      } catch (error: any) {
        setScanning(false);
        toast.error(`Diagnostics failed: ${error.message || 'Check if ML service is running.'}`);
        console.error('Error during leaf diagnostic scan:', error);
      }
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
    <div className="p-5 max-w-6xl mx-auto space-y-5">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#e4e6df] pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#1e4d1e] tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1e4d1e]" />
            AI Leaf Doctor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Identify diseases, view targeted treatment options, and consult our agronomist engine.
          </p>
        </div>

        {/* Selected Crop Filter Row */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-bold text-gray-400 mr-1">Crop Type:</span>
          {cropOptions.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedCrop === crop.id
                  ? 'bg-[#1e4d1e] text-white border-[#1e4d1e]'
                  : 'bg-[#edf4e2] text-[#1e4d1e] border-transparent hover:bg-[#e2eccf]'
              }`}
            >
              {crop.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload Capture Box (Left) & Diagnosis Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload box and Precision Tips */}
        <div className="lg:col-span-6 space-y-4">
          {/* Upload Box */}
          <div className="border-2 border-dashed border-[#d2dfc2] rounded-2xl bg-white p-8 text-center relative group min-h-[220px] flex flex-col justify-center items-center shadow-sm hover:border-[#1e4d1e] transition-colors">
            {scanning ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-[#1e4d1e] animate-spin" />
                  <Camera className="w-4 h-4 text-[#1e4d1e] absolute" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 transition-all duration-300">
                    {scanStep === 1 && 'Processing crop image...'}
                    {scanStep === 2 && 'Isolating leaf anomaly cells...'}
                    {scanStep === 3 && 'Consulting neural agritech engine...'}
                  </h4>
                  <p className="text-[9px] text-gray-400 mt-0.5 font-medium">Scanning pathogens in real-time</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-[#1e4d1e] flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-extrabold text-gray-950">Drag & drop or Click to upload</h3>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[240px] mx-auto">
                  Supports JPG, PNG, and WebP (Max 10MB). Hold camera close to the affected spot.
                </p>
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
          <div className="bg-white border border-[#edf4e2] rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center text-[#1e4d1e] shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-none">Scanning Tip</h4>
              <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                Ensure leaf details are bright and crisp. Choosing the specific crop pill at the top speeds up response times.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Results Card */}
        <div className="lg:col-span-6">
          {hasResult ? (
            <div className="bg-white border border-[#edf4e2] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                {/* Header details */}
                <div className="flex justify-between items-center pb-3 border-b border-[#f4f5f0] mb-3">
                  <h3 className="text-sm font-extrabold text-gray-900">Analysis Output</h3>
                  <span className="flex items-center gap-1 text-[9px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3 text-green-600" /> Completed
                  </span>
                </div>

                {/* Main Results Inner Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  {/* Left part: preview crop image */}
                  <div className="sm:col-span-5">
                    <div className="aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden relative border border-[#edf4e2] p-1 bg-gray-50">
                      <div className="absolute inset-1 rounded-lg border border-[#1e4d1e]/20 pointer-events-none z-10" />
                      <img
                        src={diseaseImage}
                        alt="Diseased Leaf Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Right part: statistics and labels */}
                  <div className="sm:col-span-7 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Identified Condition</span>
                      <h4 className="text-base font-extrabold text-gray-900 leading-tight mt-0.5">{diseaseName}</h4>
                    </div>

                    {/* Confidence bar */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                        <span>Confidence Index</span>
                        <span className="text-[#1e4d1e] font-extrabold">{confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#1e4d1e] h-full rounded-full transition-all duration-500"
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment details */}
                <div className="pt-3 mt-4 border-t border-[#f4f5f0] space-y-1">
                  <h4 className="text-[11px] font-bold text-gray-900">Recommended Action</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                    {treatment}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={() => toast.success('Connecting to AI Agronomist...')}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <img src="/logo.png" alt="Logo" className="w-3.5 h-3.5 object-contain" />
                  <span>Ask AI Assistant</span>
                </button>

                <button
                  onClick={() => toast.success('Loading history log...')}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-50 border border-[#edf4e2] text-gray-700 font-bold rounded-xl text-xs transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-gray-500" />
                  <span>Scan History</span>
                </button>
              </div>
            </div>
          ) : (
            /* Result Empty State */
            <div className="bg-white border border-[#edf4e2] rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center min-h-[300px] text-gray-400">
              <Activity className="w-10 h-10 mb-3 text-gray-300 animate-pulse" />
              <h4 className="text-xs font-bold text-gray-900">Diagnostic Panel Idle</h4>
              <p className="text-[10px] text-gray-400 max-w-xs mt-1 leading-relaxed">
                Provide or capture a leaf photo on the left panel. The AI module will automatically analyze cells and suggest treatment options.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Recent Assessments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#edf4e2] pb-2">
          <h3 className="text-sm font-extrabold text-[#1e4d1e]">Recent Assessments</h3>
          <Link
            href="#"
            onClick={() => toast.success('Scan History log coming soon')}
            className="text-[11px] font-bold text-gray-400 hover:text-[#1e4d1e] transition-colors flex items-center gap-0.5"
          >
            <span>View All Logs</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Recent assessments list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentScans.map((scan) => (
            <button
              key={scan.id}
              onClick={() => handleSelectRecent(scan)}
              className="bg-white border border-[#edf4e2] rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow hover:border-[#1e4d1e] transition-all text-left w-full group"
            >
              <img
                src={scan.image}
                alt={scan.title}
                className="w-10 h-10 rounded-lg object-cover border border-[#edf4e2] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-gray-900 truncate leading-snug group-hover:text-[#1e4d1e] transition-colors">
                  {scan.title}
                </h4>
                <span className="text-[9px] text-gray-400 font-semibold block truncate mt-0.5">{scan.details}</span>
              </div>
            </button>
          ))}

          {/* Upload New Scan Trigger Card */}
          <div className="border border-dashed border-[#d2dfc2] hover:border-[#1e4d1e] bg-white/50 rounded-xl p-3 flex items-center gap-3 transition-colors cursor-pointer relative">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-snug">New Scan</h4>
              <span className="text-[9px] text-gray-400 font-semibold block mt-0.5">Analyze another leaf</span>
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
