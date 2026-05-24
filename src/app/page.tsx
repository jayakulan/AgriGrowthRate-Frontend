'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  Layers, Zap, Shield, LayoutDashboard, Link2, TrendingUp, Star, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight, Sprout, Bot, ShoppingBag, Leaf, CloudSun, Target, Users, MapPin, Mail, Phone
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import OurFeatures from '@/components/OurFeatures';
import HowItWorks from '@/components/HowItWorks';
import ContactUs from '@/components/ContactUs';

const services = [
  {
    icon: ShoppingBag,
    title: 'Direct Marketplace',
    desc: 'Buy and sell fresh produce directly. Skip the middlemen and get the best prices.',
    color: 'from-[#22C55E] to-emerald-600',
  },
  {
    icon: Bot,
    title: 'AI Farming Assistant',
    desc: 'Get instant, expert advice on farming practices, pest control, and management.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Leaf,
    title: 'Crop Disease Detection',
    desc: 'Upload a photo of a sick plant and our AI will instantly diagnose the disease.',
    color: 'from-teal-500 to-green-600',
  },
  {
    icon: CloudSun,
    title: 'Weather Advisory',
    desc: 'Receive timely alerts and recommendations based on local weather forecasts.',
    color: 'from-green-600 to-teal-600',
  },
  {
    icon: Target,
    title: 'Smart Recommendations',
    desc: 'Get personalized crop suggestions based on your soil, climate, and demand.',
    color: 'from-emerald-600 to-green-500',
  }
];

const howItWorks = [
  {
    step: '01',
    title: 'Create an Account',
    desc: 'Sign up quickly as a farmer or consumer to access our smart platform.',
  },
  {
    step: '02',
    title: 'Access AI Tools',
    desc: 'Use our AI to scan crops, check weather, or chat for farming advice.',
  },
  {
    step: '03',
    title: 'Trade Directly',
    desc: 'List your produce or buy fresh goods from the marketplace securely.',
  }
];

export default function HomePage() {
  // Animation Presets
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden selection:bg-[#22C55E]/10 selection:text-[#22C55E] relative font-sans">
      
      {/* ── 🏠 HERO SECTION ─────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 🌿 OUR FEATURES SECTION ─────────────────────────────────────── */}
      <OurFeatures />



      {/* ── 🛠 HOW IT WORKS SECTION ─────────────────────────────────────── */}
      <HowItWorks />

      {/* ── 📞 CONTACT US SECTION ────────────────────────────────────────── */}
      <ContactUs />

      {/* ── 📌 FOOTER SECTION ────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-white border-t border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-8 mb-8">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-gray-900 text-base">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A6D2F] to-[#2E4A1C] flex items-center justify-center text-white">
                <Sprout className="w-4.5 h-4.5" />
              </span>
              <span>AgriGrowthRate</span>
            </Link>
            <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center">
              {['Services', 'How it Works', 'Marketplace', 'Contact', 'Privacy Policy'].map((label) => (
                <Link key={label} href="#" className="text-xs text-gray-500 hover:text-[#4A6D2F] transition-colors uppercase tracking-wider font-bold">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-400 text-xs text-center md:text-left leading-relaxed">
              <p className="mb-1">Empowering agriculture with modern AI and direct market access.</p>
              <p>© {new Date().getFullYear()} AgriGrowthRate. All rights reserved.</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#4A6D2F] hover:border-[#4A6D2F] transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
