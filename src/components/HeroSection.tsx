import React from 'react';
import { Phone, MapPin, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div id="home" className="relative w-full min-h-[600px] md:min-h-[700px] flex flex-col justify-center font-sans">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#2d471d]">
        <img
          src="/background.jpg"
          alt="Smart farm with lush crops"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-[82%_center] sm:object-[80%_center] md:object-center"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 via-black/40 to-black/20 md:from-black/70 md:via-black/40 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Text Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-20 text-white pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 bg-[#4A6D2F] text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-lg backdrop-blur-sm bg-opacity-90">
            <User className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">AI-Powered Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] max-w-3xl drop-shadow-lg">
            Grow Smarter. <br className="hidden md:block" />
            Trade Better.
          </h1>

          <p className="text-gray-200 text-sm sm:text-base md:text-xl max-w-2xl mb-6 sm:mb-10 leading-relaxed drop-shadow-md font-medium">
            Your all-in-one AI platform for crop disease detection, weather advisory, and a direct marketplace connecting farmers and consumers.
          </p>

          <button className="backdrop-blur-md bg-white/10 border border-white/50 hover:bg-white/20 text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer">
            Explore Marketplace
          </button>
        </motion.div>
      </div>

      {/* Floating Contact Info Bar */}
      <div className="relative md:absolute md:-bottom-12 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto max-w-6xl px-4 sm:px-6 md:px-0 z-30 pb-6 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.35 }}
          className="bg-[#B0C49F] p-3 sm:p-4 rounded-3xl md:rounded-full flex flex-col md:flex-row items-center gap-3 sm:gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-2 sm:border-4 border-white"
        >
          {/* Inner White Pill displaying Contact Details */}
          <div className="bg-white rounded-2xl md:rounded-full flex flex-1 w-full md:w-auto flex-col sm:flex-row items-start sm:items-center justify-around px-4 sm:px-6 md:px-8 py-3 sm:py-4 gap-2 sm:gap-4 md:gap-6 shadow-inner text-[#3E5C27] text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2 hover:text-[#4A6D2F] transition-colors">
              <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#4A6D2F] shrink-0" />
              <span>Phone: 077 334 4195</span>
            </div>

            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-2 hover:text-[#4A6D2F] transition-colors">
              <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#4A6D2F] shrink-0" />
              <span>Address: Kopay Center</span>
            </div>

            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-2 hover:text-[#4A6D2F] transition-colors">
              <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#4A6D2F] shrink-0" />
              <span>Email: info@agrlanka.com</span>
            </div>
          </div>

          {/* Action Button: Get Started navigating to Register */}
          <Link href="/register" className="w-full md:w-auto">
            <button className="w-full md:w-auto bg-[#4A6D2F] hover:bg-[#3E5C27] text-white px-6 sm:px-8 py-3 md:py-4 rounded-2xl md:rounded-full font-bold text-xs sm:text-sm transition-all shadow-md whitespace-nowrap cursor-pointer">
              Get Started
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
