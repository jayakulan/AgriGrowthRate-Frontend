import React from 'react';
import Link from 'next/link';
import { Search, Lock, User, Sprout } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="w-full absolute top-0 left-0 right-0 z-50 font-sans pointer-events-none">
      <div className="w-full bg-[#edf4e2] rounded-b-2xl px-6 lg:px-8 py-4 shadow-sm relative pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#4A6D2F] text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Sprout className="w-6 h-6 md:w-8 md:h-8" />
              AgriGrowthRate
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link href="#home" className="text-gray-900 font-semibold text-sm hover:text-[#4A6D2F] transition-colors">Home</Link>
            <Link href="#service" className="text-gray-900 font-semibold text-sm hover:text-[#4A6D2F] transition-colors">Service</Link>
            <Link href="#feature" className="text-gray-900 font-semibold text-sm hover:text-[#4A6D2F] transition-colors">Feature</Link>
            <Link href="#howitworks" className="text-gray-900 font-semibold text-sm hover:text-[#4A6D2F] transition-colors">How it Works</Link>
            <Link href="#contact" className="text-gray-900 font-semibold text-sm hover:text-[#4A6D2F] transition-colors">Contact us</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/login" className="bg-[#4A6D2F] hover:bg-[#3E5C27] text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-colors shadow-md">
              <User className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
