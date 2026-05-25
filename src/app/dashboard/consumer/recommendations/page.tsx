'use client';

import {
  Download,
  RefreshCcw,
  TrendingUp,
  Calendar,
  Leaf,
  CloudLightning,
  Users,
} from 'lucide-react';

export default function ConsumerRecommendationsPage() {
  const smallRecommendations = [
    {
      id: 'rec-1',
      name: 'IoT Sensor Kit',
      price: '$1,250.00',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
      reason: 'Trending with peers in your area to automate water scheduling.',
    },
    {
      id: 'rec-2',
      name: 'Organic Bio-Stimulant',
      price: '$89.00',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop',
      reason: 'Your last purchase of compost suggests a need for microbial enrichment.',
    },
    {
      id: 'rec-3',
      name: 'Pruning Toolset Pro',
      price: '$120.00',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop',
      reason: 'Suggested for seasonal vineyard maintenance starting in 15 days.',
    },
  ];

  return (
    <div className="p-8 max-w-[1100px] mx-auto">
      
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-8">
        <span className="bg-[#c6efc6] text-[#1e4d1e] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
          AI-Powered Predictions
        </span>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold text-[#1e4d1e] mb-3 tracking-tight">Smart Recommendations</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Insights derived from current seasonality, local user demand, and global agricultural trends to optimize your next harvest cycle.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="bg-[#f4f5f0] border border-[#e4e6df] text-gray-800 hover:bg-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export Trends
            </button>
            <button className="bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
              <RefreshCcw className="w-4 h-4" />
              Refresh Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* ── Main Feature Recommendation (Span 2) ───────────── */}
        <div className="lg:col-span-2 bg-white border border-[#e4e6df] rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="relative h-64 shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1530836369250-ef71a35921bf?w=800&h=400&fit=crop" 
              alt="Hydroponic Nutrient Blend V4" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-[#1e4d1e]/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block border border-white/20">
                High Potential
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Hydroponic Nutrient Blend V4</h2>
            </div>
          </div>
          <div className="p-8 flex-1 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
              <div className="flex-1">
                <p className="text-xs font-extrabold text-[#1e4d1e] mb-2 uppercase tracking-wide">Why this was recommended</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Based on the 15% increase in local vertical farming startups and the upcoming shift to cooler indoor temperatures. This formula accelerates leafy green maturation by 12% in low-light conditions.
                </p>
              </div>
              <div className="text-left md:text-right shrink-0">
                <p className="text-3xl font-extrabold text-[#1e4d1e]">$482.00</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Per Unit (25L)</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 border-t border-[#f4f5f0]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <TrendingUp className="w-5 h-5 text-[#1e4d1e]" />
                <span className="text-xs font-bold text-gray-800">Demand: +22% YoY</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Calendar className="w-5 h-5 text-[#1e4d1e]" />
                <span className="text-xs font-bold text-gray-800">Optimal: Oct - Feb</span>
              </div>
              <div className="flex-1" />
              <button className="w-full sm:w-auto bg-[#f4f5f0] hover:bg-[#e4e6df] text-gray-900 px-8 py-3 rounded-xl text-xs font-extrabold transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* ── Secondary Recommendation Card ──────────────────── */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-8 flex flex-col shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 bg-[#e2fbe9] rounded-xl flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-[#1e4d1e]" />
            </div>
            <span className="bg-[#f4f5f0] text-gray-600 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Top Season
            </span>
          </div>

          <div className="w-full h-40 rounded-xl overflow-hidden mb-6 border border-[#e4e6df] shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop" 
              alt="Drought-Resistant Maize Seeds" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 leading-tight mb-3">Drought-Resistant Maize Seeds</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            A premium hybrid strain specifically engineered for high yields with 30% less irrigation.
          </p>

          <div className="bg-[#f4f5f0] rounded-xl p-5 mb-6">
            <p className="text-[10px] font-extrabold text-[#1e4d1e] mb-2 uppercase tracking-wider">Why this was recommended</p>
            <p className="text-xs text-gray-700 font-medium italic leading-relaxed">
              "Weather forecasts predict a 20% rainfall deficit in your region next quarter."
            </p>
          </div>

          <button className="w-full bg-[#1e4d1e] hover:bg-[#163d16] text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-sm mt-auto">
            View Product
          </button>
        </div>

      </div>

      {/* ── Small Recommendation Cards ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {smallRecommendations.map((rec) => (
          <div key={rec.id} className="bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#e4e6df]">
                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">{rec.name}</h3>
                <p className="text-xs text-gray-500 font-bold">{rec.price}</p>
              </div>
            </div>
            <div className="bg-[#fcfdfa] border-l-2 border-[#1e4d1e] p-3 rounded-r-lg mt-auto">
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                {rec.reason}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Regional Trend Analysis ────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1e4d1e]">Regional Trend Analysis</h2>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#1e4d1e]" />
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <div className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-[#1e4d1e]" />
              <h3 className="text-xs font-bold text-gray-900">Market Price Surge</h3>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed mb-6 flex-1">
              Wheat futures are up 4.2% this week. Our recommendation: Hold current stock for another 12 days for peak valuation.
            </p>
            <button className="text-left text-[10px] font-extrabold text-[#1e4d1e] tracking-widest uppercase hover:text-[#163d16] transition-colors">
              Analyze Market Details
            </button>
          </div>

          <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <CloudLightning className="w-5 h-5 text-[#1e4d1e]" />
              <h3 className="text-xs font-bold text-gray-900">Weather Mitigation</h3>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed mb-6 flex-1">
              Incoming frost warning for Northern sectors. Recommended action: 15% discount on fast-acting frost blankets applied to your cart.
            </p>
            <button className="text-left text-[10px] font-extrabold text-[#1e4d1e] tracking-widest uppercase hover:text-[#163d16] transition-colors">
              Apply Discount Now
            </button>
          </div>

          <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-[#1e4d1e]" />
              <h3 className="text-xs font-bold text-gray-900">Community Demand</h3>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed mb-6 flex-1">
              34 local cooperatives are switching to solar-powered aeration systems. Bulk purchase orders are open for another 48 hours.
            </p>
            <button className="text-left text-[10px] font-extrabold text-[#1e4d1e] tracking-widest uppercase hover:text-[#163d16] transition-colors">
              Join Group Buy
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
