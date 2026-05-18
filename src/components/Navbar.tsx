'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/#process' },
  { label: 'Pricing', href: '/pricing' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
    setDropOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#f4f5f0]/95 backdrop-blur-md border-b border-[#e4e6df]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 font-bold text-[#2d6a2d] text-base">
            <Sprout className="w-5 h-5" />
            AgriGrowthRate
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-md text-sm transition-colors ${
                  pathname === link.href
                    ? 'text-[#2d6a2d] font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  id="user-menu-btn"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2d6a2d] flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-[#e4e6df] shadow-lg py-1.5">
                    <div className="px-3 py-2 border-b border-[#e4e6df] mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm text-gray-800 font-medium truncate">{user?.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors" id="logout-btn">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Login</Link>
                <Link href="/register" className="btn-primary text-sm py-1.5 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-gray-500 p-1.5" onClick={() => setMenuOpen(!menuOpen)} id="mobile-menu-btn">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e4e6df] bg-[#f4f5f0] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-white hover:text-gray-900 transition-colors">
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 text-center text-sm text-gray-700 border border-[#e4e6df] rounded-lg py-2 hover:bg-white transition-colors" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="btn-primary flex-1 justify-center text-sm py-2" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
