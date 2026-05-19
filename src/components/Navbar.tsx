'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'About', href: '/#about' },
  { label: 'Testimonials', href: '/#testimonials' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Track active section on scroll for homepage anchor links
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = ['features', 'about', 'testimonials'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // Offset for navbar

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
    setDropOpen(false);
  };

  // Smooth scroll handler for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Navbar height offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setMenuOpen(false);
      }
    }
  };

  // Dynamic Dashboard href matching the user's role
  const getDashboardHref = () => {
    if (!user) return '/login';
    return `/dashboard/${user.role}`;
  };

  const isLinkActive = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      return activeSection === id;
    }
    return pathname === href;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-gray-900 text-lg hover:opacity-90 transition-opacity">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-white shadow-md shadow-[#22C55E]/20">
              <Sprout className="w-5 h-5" />
            </span>
            <span className="tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              AgriGrowth<span className="text-[#22C55E]">Rate</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-[#22C55E] font-bold bg-[#DCFCE7]/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#22C55E] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  id="user-menu-btn"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#22C55E]/10">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs text-gray-800 font-semibold truncate mt-0.5">{user?.email}</p>
                      </div>
                      <Link href={getDashboardHref()} onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#22C55E] transition-all">
                        <LayoutDashboard className="w-4 h-4 text-[#22C55E]" /> Dashboard
                      </Link>
                      <div className="border-t border-gray-50 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all" id="logout-btn">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white shadow-md shadow-[#22C55E]/15 hover:shadow-[0_0_15px_rgba(34,197,94,0.35)]"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(!menuOpen)} id="mobile-menu-btn">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 overflow-hidden shadow-inner"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active 
                      ? 'text-[#22C55E] bg-[#DCFCE7]/30 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#22C55E]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isAuthenticated ? (
              <div className="flex gap-2.5 pt-4 border-t border-gray-50 mt-4">
                <Link href="/login" className="flex-1 text-center text-sm font-medium text-gray-600 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-all" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="flex-1 text-center text-sm font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl py-2.5 transition-all shadow-md shadow-[#22C55E]/15 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-50 mt-4 space-y-1">
                <Link href={getDashboardHref()} className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#22C55E] transition-all" onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard className="w-4 h-4 text-[#22C55E]" /> Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all" id="logout-btn">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
