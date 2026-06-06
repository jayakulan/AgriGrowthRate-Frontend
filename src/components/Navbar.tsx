import React from 'react';
import Link from 'next/link';
import { Sprout } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="w-full absolute top-0 left-0 right-0 z-50 font-sans pointer-events-none pt-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-[#edf4e2] rounded-full px-6 md:px-8 lg:px-10 py-3 md:py-4 shadow-md border border-white/20 relative pointer-events-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img src="/logo.png" alt="Logo" className="w-auto h-10 md:h-12 object-contain" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link href="/#home" className="text-gray-900 font-semibold text-base hover:text-[#4A6D2F] transition-colors">Home</Link>
            <Link href="/#feature" className="text-gray-900 font-semibold text-base hover:text-[#4A6D2F] transition-colors">Features</Link>
            <Link href="/#how-it-works" className="text-gray-900 font-semibold text-base hover:text-[#4A6D2F] transition-colors">How It Works</Link>
            <Link href="/#contact" className="text-gray-900 font-semibold text-base hover:text-[#4A6D2F] transition-colors">Contact Us</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-700 hover:text-[#4A6D2F] px-4 py-2.5 text-base font-semibold transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-[#4A6D2F] hover:bg-[#3E5C27] text-white px-5 py-2.5 rounded-full text-base font-semibold transition-colors shadow-sm hover:shadow-md">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
