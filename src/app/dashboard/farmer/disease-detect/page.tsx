'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
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
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DiseaseDetectionPage() {
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasResult, setHasResult] = useState(false);
  const [isLowConfidence, setIsLowConfidence] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Backend data states
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<number[]>([0,0,0,0,0,0,0]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const getAiServiceUrl = () => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000/api/detect/';
      }
      return `${window.location.protocol}//${window.location.hostname}:8000/api/detect/`;
    }
    return process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000/api/detect/';
  };

  const fetchAssessments = async () => {
    try {
      const res = await api.get('/ai/assessments');
      if (res.data && res.data.success) {
        const mappedScans = (res.data.data.recentScans || []).map((scan: any, index: number) => {
          let rawImg = scan.image || '';
          if (rawImg.startsWith('blob:') || rawImg.includes('localhost:3000')) {
            rawImg = '/register.jpg';
          }
          return {
            id: scan._id || scan.id || `scan-${index}-${Date.now()}`,
            title: `${scan.crop} - ${scan.diseaseName}`,
            details: new Date(scan.createdAt).toLocaleDateString(),
            image: rawImg || '/register.jpg',
            treatment: scan.treatment,
            confidence: scan.confidence,
          };
        });
        setRecentScans(mappedScans);
        setMonthlyStats(res.data.data.monthlyStats || [0,0,0,0,0,0,0]);
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    }
  };

  // Form result states
  const [diseaseName, setDiseaseName] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [diseaseImage, setDiseaseImage] = useState('');
  const [treatment, setTreatment] = useState('');

  // Crop configuration options
  const cropOptions = [
    { id: 'rice', label: 'Rice' },
    { id: 'corn', label: 'Corn' },
    { id: 'potato', label: 'Potato' },
    { id: 'wheat', label: 'Wheat' },
    { id: 'tomato', label: 'Tomato' },
    { id: 'apple', label: 'Apple' },
  ];


  // Real leaf AI scanning sequence integrated with Python microservice
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Reset low confidence and previous status
      setIsLowConfidence(false);

      // Create local preview URL
      const previewUrl = URL.createObjectURL(file);
      setDiseaseImage(previewUrl);

      setScanning(true);
      setScanStep(1);

      // Start fetching from the Django microservice
      const formData = new FormData();
      formData.append('file', file);
      formData.append('crop', selectedCrop);

      const apiPromise = fetch(getAiServiceUrl(), {
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

        const finalDiseaseName = apiResult.disease_name || apiResult.detected_name;
        const finalConfidence = Number(apiResult.confidence) || 0;
        const finalTreatment = apiResult.suggestion || 'No suggestion available.';

        setScanning(false);
        setConfidence(finalConfidence);
        setDiseaseName(finalDiseaseName);
        setTreatment(finalTreatment);

        // Check if confidence is below 40% threshold
        if (finalConfidence < 40) {
          setIsLowConfidence(true);
          setHasResult(true);
          toast.error(
            `Confidence score is below 40% (${finalConfidence}%). This may not be a crop leaf, or the image is unclear. Please upload a proper crop disease image.`,
            { duration: 6000 }
          );
          return; // Do NOT save low confidence detection to history
        }

        // Confidence is valid (>= 40%)
        setIsLowConfidence(false);
        setHasResult(true);
        toast.success(`AI Diagnostics complete! ${finalDiseaseName} identified.`);

        // Save scan history to backend
        try {
          await api.post('/ai/assessments', {
            crop: selectedCrop,
            diseaseName: finalDiseaseName,
            confidence: finalConfidence,
            treatment: finalTreatment,
            image: previewUrl
          });
          // Refresh the left panel data
          fetchAssessments();
        } catch (saveErr) {
          console.error('Failed to save assessment to history:', saveErr);
        }
      } catch (error: any) {
        setScanning(false);
        setIsLowConfidence(false);
        toast.error(`Diagnostics failed: ${error.message || 'Check if ML service is running.'}`);
        console.error('Error during leaf diagnostic scan:', error);
      }
    }
    // Clear the input value so user can upload the same file again if desired
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSelectRecent = (scan: typeof recentScans[0]) => {
    setDiseaseName(scan.title);
    setConfidence(scan.confidence);
    setDiseaseImage(scan.image);
    setTreatment(scan.treatment);
    setIsLowConfidence(false);
    setHasResult(true);
    toast.success(`Loaded scan results for ${scan.title}`);
  };

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-5">


      {/* Main Grid: Upload Capture Box (Left) & Diagnosis Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload box, Precision Tips, and Analysis Results */}
        <div className="lg:col-span-7 lg:max-w-3xl space-y-4">
          
          {/* Supported Crops Disclaimer */}
          <div className="flex items-start gap-3 bg-[#edf4e2]/60 border border-[#d2dfc2] rounded-2xl p-3.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#1e4d1e] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-[#1e4d1e] uppercase tracking-wider mb-1">Supported Crops</p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                This AI disease detection tool is currently trained to identify diseases for the following 6 crops only:{' '}
                <span className="font-bold text-[#1e4d1e]">Rice, Corn, Potato, Wheat, Tomato</span> and{' '}
                <span className="font-bold text-[#1e4d1e]">Apple</span>.
                Results outside these categories may not be accurate.
              </p>
            </div>
          </div>

          {/* Low Confidence Warning Alert Banner */}
          {isLowConfidence && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm text-red-900 transition-all">
              <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center shrink-0 mt-0.5 text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <h4 className="text-sm font-bold text-red-900">
                    Low Confidence Detection ({confidence}%)
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide bg-red-200/80 text-red-800 px-2 py-0.5 rounded-full">
                    Score Below 40%
                  </span>
                </div>
                <p className="text-xs text-red-700 mt-1 leading-relaxed">
                  The uploaded image could not be identified with confidence. Either <strong>this is not a crop leaf</strong> or the <strong>image is unclear / poorly lit</strong>. Please upload a proper crop disease image.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Proper Crop Leaf Image</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Box */}
          <div className="border-2 border-dashed border-[#d2dfc2] rounded-2xl bg-white p-8 text-center relative group min-h-[220px] flex flex-col justify-center items-center shadow-sm hover:border-[#1e4d1e] transition-colors">
            {scanning ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-[#1e4d1e] animate-spin" />
                  <Camera className="w-4 h-4 text-[#1e4d1e] absolute" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 transition-all duration-300">
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
                <h3 className="text-base font-extrabold text-gray-950">Drag & drop or Click to upload</h3>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[240px] mx-auto">
                  Supports JPG, PNG, and WebP (Max 10MB). Hold camera close to the affected spot.
                </p>
                <input
                  ref={fileInputRef}
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
              <h4 className="text-base font-bold text-gray-900 leading-none">Scanning Tip</h4>
              <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                Ensure leaf details are bright and crisp. Choosing the specific crop pill at the top speeds up response times.
              </p>
            </div>
          </div>
          {/* Recent Assessments placed in Left Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-lg font-extrabold text-[#1e4d1e]">Recent Assessments</h3>
            </div>

            {/* Vertical list of cards */}
            <div className="flex flex-col gap-3">
              {recentScans.map((scan, idx) => (
                <button
                  key={scan.id || scan._id || `recent-scan-${idx}`}
                  onClick={() => handleSelectRecent(scan)}
                  className="bg-white border border-[#edf4e2] rounded-xl p-3 flex items-start gap-3 shadow-sm hover:shadow hover:border-[#1e4d1e] transition-all text-left w-full group relative"
                >
                  <img
                    src={scan.image}
                    alt={scan.title}
                    className="w-14 h-14 rounded-lg object-cover border border-[#edf4e2] shrink-0"
                  />
                  <div className="min-w-0 flex-1 pr-16">
                    <h4 className="text-base font-bold text-[#1e4d1e] truncate leading-snug">
                      {scan.title}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-medium block truncate mt-0.5">{scan.details}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Assessments & Chart */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Analysis Results Card placed in Right Column */}
          {hasResult ? (
            isLowConfidence ? (
              /* Low Confidence Error Card */
              <div className="bg-white border-2 border-red-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[320px]">
                <div className="space-y-4">
                  {/* Header details with Warning badge */}
                  <div className="flex justify-between items-center pb-3 border-b border-red-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <h3 className="text-lg font-extrabold text-gray-900">Analysis Output</h3>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Low Confidence ({confidence}%)
                    </span>
                  </div>

                  {/* Main Results Inner Grid */}
                  <div className="grid grid-cols-1 gap-4 items-start">
                    {/* Leaf preview image */}
                    <div>
                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative border-2 border-red-200 p-1 bg-red-50/40">
                        <div className="absolute top-3 right-3 z-10 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Below 40% Threshold
                        </div>
                        <img
                          src={diseaseImage}
                          alt="Uploaded Leaf Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Confidence bar & details */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-700">
                        <span>Confidence Score</span>
                        <span className="text-red-600 font-extrabold">
                          {confidence}% <span className="text-gray-400 font-normal text-[11px]">(Min. 40% required)</span>
                        </span>
                      </div>
                      <div className="w-full bg-red-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(confidence, 6)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prominent Error Message Card */}
                  <div className="bg-red-50/90 border border-red-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wide">
                          Unable to Identify Disease Confidently
                        </h4>
                        <p className="text-xs text-red-800 leading-relaxed mt-1 font-medium">
                          The confidence score is <strong>{confidence}%</strong>, which is below the 40% reliability threshold.
                        </p>
                        <ul className="text-[11px] text-red-700 mt-2 space-y-1 list-disc list-inside">
                          <li><strong>Not a crop leaf:</strong> The uploaded image may not be a crop or plant leaf.</li>
                          <li><strong>Unclear image:</strong> The photo might be blurry, dark, out of focus, or taken too far away.</li>
                          <li><strong>Please re-upload:</strong> Upload a clear, proper crop disease image showing visible symptoms.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Supported crops: Rice, Corn, Potato, Wheat, Tomato, and Apple.</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5 mt-5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-2.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Proper Crop Disease Image</span>
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/farmer/ai')}
                    className="flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <img src="/logo.png" alt="Logo" className="w-3.5 h-3.5 object-contain" />
                    <span>Ask AI Assistant for Help</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Normal AI Analysis Results Card (Confidence >= 40%) */
              <div className="bg-white border border-[#edf4e2] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[300px]">
                <div>
                  {/* Header details */}
                  <div className="flex justify-between items-center pb-3 border-b border-[#f4f5f0] mb-3">
                    <h3 className="text-lg font-extrabold text-gray-900">Analysis Output</h3>
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-green-600" /> Completed
                    </span>
                  </div>

                  {/* Main Results Inner Grid */}
                  <div className="grid grid-cols-1 gap-4 items-start">
                    {/* Left part: preview crop image */}
                    <div>
                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative border border-[#edf4e2] p-1 bg-gray-50">
                        <div className="absolute inset-1 rounded-lg border border-[#1e4d1e]/20 pointer-events-none z-10" />
                        <img
                          src={diseaseImage}
                          alt="Diseased Leaf Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Right part: statistics and labels */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">Identified Condition</span>
                        <h4 className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">{diseaseName}</h4>
                      </div>

                      {/* Confidence bar */}
                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
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
                    <h4 className="text-sm font-bold text-gray-900">Recommended Action</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {treatment}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-5">
                  <button
                    onClick={() => router.push('/dashboard/farmer/ai')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-base transition-colors shadow-sm cursor-pointer"
                  >
                    <img src="/logo.png" alt="Logo" className="w-3.5 h-3.5 object-contain" />
                    <span>Ask AI Assistant</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Result Empty State */
            <div className="bg-white border border-[#edf4e2] rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center min-h-[300px] text-gray-400">
              <Activity className="w-10 h-10 mb-3 text-gray-300 animate-pulse" />
              <h4 className="text-xl font-bold text-gray-900">Diagnostic Panel Idle</h4>
              <p className="text-xs text-gray-400 max-w-xs mt-1 leading-relaxed">
                Provide or capture a leaf photo on the left panel. The AI module will automatically analyze cells and suggest treatment options.
              </p>
            </div>
          )}

          <hr className="border-[#edf4e2]" />

          {/* MONTHLY SCAN ACTIVITY CHART */}
          <div className="space-y-4 pt-4">
            <h4 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-4">MONTHLY SCAN ACTIVITY</h4>
            
            {(() => {
              const maxValue = Math.max(...monthlyStats, 10);
              const chartMax = maxValue > 100 ? Math.ceil(maxValue / 100) * 100 : Math.ceil(maxValue / 10) * 10;
              const yTicks = [chartMax, chartMax * 0.75, chartMax * 0.5, chartMax * 0.25, 0];

              return (
                <div className="relative h-56 w-full font-sans pb-6 pl-10 pr-2">
                  {/* Y-axis Ticks and Dashed Lines */}
                  <div className="absolute inset-0 pb-6 pl-10 flex flex-col justify-between">
                    {yTicks.map((tick, i) => (
                      <div key={`ytick-${i}-${tick}`} className="relative flex items-center w-full border-t border-dashed border-gray-200">
                        <span className="absolute -left-10 w-8 text-right text-[10px] text-gray-400 font-bold -translate-y-1/2">{tick}</span>
                      </div>
                    ))}
                  </div>

                  {/* Axes (Solid Lines) */}
                  <div className="absolute left-10 right-0 bottom-6 top-0 border-l-2 border-b-2 border-gray-300 z-10 pointer-events-none"></div>

                  {/* Bars Container */}
                  <div className="absolute left-10 right-0 bottom-6 top-0 flex items-end justify-around px-2 pt-2 z-20">
                    {monthlyStats.map((stat, index) => {
                      const heightPercentage = Math.max((stat / chartMax) * 100, 1); // min 1%
                      
                      // Calculate month name
                      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                      const currentMonth = new Date().getMonth();
                      const monthIndex = (currentMonth - 6 + index + 12) % 12;
                      const monthName = monthNames[monthIndex];

                      return (
                        <div key={`monthly-stat-${index}-${monthName}`} className="relative group flex flex-col items-center justify-end h-full w-[12%] cursor-pointer">
                          {/* Bar */}
                          <div 
                            className="w-full relative rounded-t-md transition-all duration-300 bg-[#dbe3d3] group-hover:bg-[#1a401a] group-hover:scale-x-105 shadow-sm overflow-hidden"
                            style={{ height: `${heightPercentage}%` }}
                          >
                            {/* Hover Tooltip (Inside the bar) */}
                            <div className="absolute bottom-2 left-0 right-0 hidden group-hover:flex flex-col items-center justify-center pointer-events-none z-30">
                              <span className="text-[10px] font-extrabold text-white">{monthName}</span>
                              <span className="text-[8px] text-gray-200">value : {stat}</span>
                            </div>
                          </div>

                          {/* X-axis Label */}
                          <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">{monthName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
