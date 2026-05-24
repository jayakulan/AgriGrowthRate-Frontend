import React from 'react';
import { Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-[600px] md:min-h-[700px] flex flex-col justify-center font-sans">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <img
          src="/smart_farm_hero.png"
          alt="Smart farm with lush crops"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Text Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-20 text-white pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 bg-[#4A6D2F] text-white px-4 py-2 rounded-full mb-6 shadow-lg backdrop-blur-sm bg-opacity-90">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">AI-Powered Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-3xl drop-shadow-lg">
            Grow Smarter. <br className="hidden md:block" />
            Trade Better.
          </h1>

          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed drop-shadow-md font-medium">
            Your all-in-one AI platform for crop disease detection, weather advisory, and a direct marketplace connecting farmers and consumers.
          </p>

          <button className="backdrop-blur-md bg-white/10 border border-white/50 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            Explore Marketplace
          </button>
        </motion.div>
      </div>

      {/* Floating Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-auto max-w-5xl bg-[#B0C49F] p-3 rounded-full flex flex-col md:flex-row items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-30 border-4 border-white"
      >
        {/* Inner White Pill */}
        <div className="bg-white rounded-full flex flex-1 w-full md:w-auto items-center px-6 py-3 md:py-4 gap-4 shadow-inner">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search crops or products..."
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium text-sm md:text-base focus:ring-0"
            />
          </div>

          <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

          <div className="flex-1 min-w-[200px] hidden md:block">
            <input
              type="text"
              placeholder="Location..."
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium text-base focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <button className="text-gray-400 hover:text-gray-700 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-700 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="w-6 h-6 rounded-full bg-[#4A6D2F] text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full md:w-auto bg-[#4A6D2F] hover:bg-[#3E5C27] text-white px-8 py-3 md:py-4 rounded-full font-bold text-sm transition-all shadow-md whitespace-nowrap">
          Search
        </button>
      </motion.div>
    </div>
  );
}
