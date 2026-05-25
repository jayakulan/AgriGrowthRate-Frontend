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
import Footer from '@/components/Footer';

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
      <Footer />
    </div>
  );
}
