'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaPinterestP, FaGoogle, FaVimeoV } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-[#0b1f14] text-white py-12 overflow-hidden font-sans border-t border-[#1b3f27]/30">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-[url('/gardening_shears.png')] bg-cover bg-center bg-no-repeat pointer-events-none z-0"
      />
      
      {/* Rich forest-green overlay matching the uploaded reference design */}
      <div className="absolute inset-0 bg-[#0d3319]/85 pointer-events-none z-0" />

      {/* Content Wrapper */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Main Footer Container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left: Brand Logo & Subtitle */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img src="/logo.png" alt="Logo" className="w-auto h-12 object-contain" />
          </div>

          {/* Center: Navigation Links (matching updated Navbar theme) */}
          <div className="flex flex-wrap justify-center gap-x-6 lg:gap-x-8 gap-y-2">
            <Link href="/#home" className="text-[11px] font-bold text-gray-300 hover:text-[#22c55e] uppercase tracking-[0.18em] transition-colors">
              Home
            </Link>
            <Link href="/#feature" className="text-[11px] font-bold text-gray-300 hover:text-[#22c55e] uppercase tracking-[0.18em] transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-[11px] font-bold text-gray-300 hover:text-[#22c55e] uppercase tracking-[0.18em] transition-colors">
              How It Works
            </Link>
            <Link href="/#contact" className="text-[11px] font-bold text-gray-300 hover:text-[#22c55e] uppercase tracking-[0.18em] transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Right: Circular Social Media Icons */}
          <div className="flex items-center gap-2.5">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-[34px] h-[34px] rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-90 transition-all hover:scale-105"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-[34px] h-[34px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#22c55e] hover:border-[#22c55e] transition-all hover:scale-105"
            >
              <FaTwitter className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://pinterest.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-[34px] h-[34px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#22c55e] hover:border-[#22c55e] transition-all hover:scale-105"
            >
              <FaPinterestP className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-[34px] h-[34px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#22c55e] hover:border-[#22c55e] transition-all hover:scale-105"
            >
              <FaGoogle className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://vimeo.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-[34px] h-[34px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#22c55e] hover:border-[#22c55e] transition-all hover:scale-105"
            >
              <FaVimeoV className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Small Bottom Copyright */}
        <div className="border-t border-white/5 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-gray-500 text-[10px] tracking-wider">
            © {new Date().getFullYear()} AgriGrowthRate. All rights reserved.
          </p>
          <p className="text-gray-500 text-[9px] tracking-widest uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            All systems operational
          </p>
        </div>

      </div>
    </footer>
  );
}
