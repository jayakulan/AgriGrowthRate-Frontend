'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full absolute top-0 left-0 right-0 z-50 font-sans pointer-events-none pt-3 px-3 md:pt-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-[#edf4e2] rounded-3xl sm:rounded-full px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 shadow-md border border-white/20 relative pointer-events-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img src="/logo.png" alt="Logo" className="w-auto h-8 sm:h-10 md:h-12 object-contain" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link href="/#home" className="text-gray-900 font-semibold text-sm md:text-base hover:text-[#4A6D2F] transition-colors">Home</Link>
            <Link href="/#feature" className="text-gray-900 font-semibold text-sm md:text-base hover:text-[#4A6D2F] transition-colors">Features</Link>
            <Link href="/#how-it-works" className="text-gray-900 font-semibold text-sm md:text-base hover:text-[#4A6D2F] transition-colors">How It Works</Link>
            <Link href="/#contact" className="text-gray-900 font-semibold text-sm md:text-base hover:text-[#4A6D2F] transition-colors">Contact Us</Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link href="/login" className="text-gray-700 hover:text-[#4A6D2F] px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm md:text-base font-semibold transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-[#4A6D2F] hover:bg-[#3E5C27] text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-colors shadow-sm hover:shadow-md">
              Register
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#1e4d1e] hover:bg-white/40 rounded-xl transition-colors ml-0.5 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Links */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#d2dfc2] flex flex-col gap-1.5 pb-1 animate-fade-in">
            <Link href="/#home" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 font-semibold text-xs sm:text-sm px-3 py-2 rounded-xl hover:bg-white/50 transition-colors">Home</Link>
            <Link href="/#feature" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 font-semibold text-xs sm:text-sm px-3 py-2 rounded-xl hover:bg-white/50 transition-colors">Features</Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 font-semibold text-xs sm:text-sm px-3 py-2 rounded-xl hover:bg-white/50 transition-colors">How It Works</Link>
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 font-semibold text-xs sm:text-sm px-3 py-2 rounded-xl hover:bg-white/50 transition-colors">Contact Us</Link>
          </div>
        )}
      </div>
    </div>
  );
}
