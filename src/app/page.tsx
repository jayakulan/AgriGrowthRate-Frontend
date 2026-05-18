'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  Layers, Zap, Shield, LayoutDashboard, Link2, TrendingUp, Star, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight, Sprout
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Clean Modern UI',
    desc: 'Beautiful and minimal interface designed for great user experience.',
    color: 'from-[#22C55E] to-emerald-600',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.08)]',
  },
  {
    icon: Zap,
    title: 'Fast Performance',
    desc: 'Optimized for speed and smooth interactions across all devices.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.08)]',
  },
  {
    icon: Shield,
    title: 'Secure Architecture',
    desc: 'Built with strong security principles for safe and reliable applications.',
    color: 'from-teal-500 to-green-600',
    glow: 'shadow-[0_0_20px_rgba(20,184,166,0.08)]',
  },
  {
    icon: LayoutDashboard,
    title: 'Smart Dashboard System',
    desc: 'Powerful admin and user dashboards with real-time updates.',
    color: 'from-green-600 to-teal-600',
    glow: 'shadow-[0_0_20px_rgba(21,128,61,0.08)]',
  },
  {
    icon: Link2,
    title: 'Easy Integration',
    desc: 'Connect APIs and services effortlessly with flexible architecture.',
    color: 'from-emerald-600 to-green-500',
    glow: 'shadow-[0_0_20px_rgba(5,150,105,0.08)]',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Design',
    desc: 'Built to grow with your product from MVP to production.',
    color: 'from-teal-600 to-emerald-700',
    glow: 'shadow-[0_0_20px_rgba(13,148,136,0.08)]',
  },
];

const testimonials = [
  {
    quote: "Clean UI and excellent performance. Very professional design.",
    author: "Alex Rivers",
    role: "Senior Frontend Architect",
    avatar: "A",
    color: "from-green-500 to-emerald-600"
  },
  {
    quote: "Simple, fast, and production-ready structure.",
    author: "Elena Rostova",
    role: "Lead Product Designer",
    avatar: "E",
    color: "from-[#22C55E] to-teal-500"
  },
  {
    quote: "Perfect balance between design and functionality.",
    author: "Marcus Chen",
    role: "Fullstack Engineering Lead",
    avatar: "M",
    color: "from-teal-500 to-green-600"
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

  const floatAnimation1: Variants = {
    animate: {
      y: [0, -12, 0],
      x: [0, 8, 0],
      transition: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatAnimation2: Variants = {
    animate: {
      y: [0, 10, 0],
      x: [0, -8, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden selection:bg-[#22C55E]/10 selection:text-[#22C55E] relative font-sans">
      
      {/* ── 🎭 BACKGROUND EFFECTS ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Floating gradient glow circles */}
        <motion.div 
          variants={floatAnimation1}
          animate="animate"
          className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-[#22C55E]/5 blur-[120px]" 
        />
        <motion.div 
          variants={floatAnimation2}
          animate="animate"
          className="absolute top-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-emerald-500/4 blur-[100px]" 
        />
      </div>

      {/* ── 🏠 HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          {/* Tagline Badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-100 bg-[#DCFCE7]/40 text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-8 shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Designed for Performance
          </motion.div>

          {/* Title */}
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] max-w-5xl text-gray-900"
          >
            Build Modern Digital Experiences <br className="hidden sm:inline" />
            with <span className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] bg-clip-text text-transparent">Simplicity and Speed</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-gray-500 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Create scalable, secure, and user-friendly applications with a clean and modern development approach.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link 
                href="/register" 
                id="hero-get-started" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white shadow-lg shadow-[#22C55E]/15 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link 
                href="#features" 
                id="hero-learn-more" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-200 bg-white text-gray-700 hover:border-[#22C55E]/40 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* Supporting line */}
          <motion.p
            variants={fadeInUp}
            className="text-xs sm:text-sm text-gray-400 font-semibold tracking-wide mb-16 border-t border-gray-100 pt-6 w-full max-w-md"
          >
            “Modern design. Clean architecture. Better user experience.”
          </motion.p>

          {/* Elegant White Dashboard Telemetry Mockup */}
          <motion.div 
            variants={fadeInUp}
            className="relative w-full max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-200/60 backdrop-blur-sm"
          >
            {/* Window Top Bar Mockup */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-[#16A34A] bg-[#DCFCE7]/30 border border-emerald-100/50 px-4 py-1 rounded-lg">
                https://saas-dashboard.v2.local
              </div>
              <div className="w-12 h-2.5"></div>
            </div>

            {/* Dashboard grid panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 text-left">
              
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Status</span>
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mb-1">99.98%</div>
                <p className="text-[10.5px] text-[#16A34A] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Core Systems Active
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">API Response</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mb-1">12 ms</div>
                <p className="text-[10.5px] text-[#16A34A] font-semibold">
                  Optimized Edge Telemetry
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active nodes</span>
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mb-1">1,024</div>
                <p className="text-[10.5px] text-teal-600 font-semibold">
                  Dynamic Server Clustering
                </p>
              </div>

            </div>

            {/* Glowing Accent Underlay border */}
            <div className="absolute -bottom-px left-16 right-16 h-[2px] bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_12px_rgba(34,197,94,0.4)]"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── ⚡ FEATURES SECTION ─────────────────────────────────────────── */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100 bg-[#F9FAFB]/40">
        <div className="text-center mb-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
              Everything You Need to Build Better Products
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Equip your development workspace with high-performance architectures engineered for rapid conversion and scalability.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, idx) => (
            <motion.div 
              key={f.title}
              variants={fadeInUp}
              whileHover={{ 
                y: -6, 
                borderColor: '#22C55E', 
                boxShadow: '0 20px 40px -15px rgba(34,197,94,0.12)' 
              }}
              className="group border border-gray-200/80 rounded-2xl p-7 bg-white transition-all duration-300 relative overflow-hidden shadow-sm"
            >
              {/* Subtle hover gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-[#22C55E]/2 group-hover:to-[#22C55E]/5 rounded-bl-3xl transition-colors duration-300" />
              
              <div className={`w-12 h-12 rounded-xl mb-6 bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-md shadow-[#22C55E]/10`}>
                <f.icon className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#22C55E] transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 📊 ABOUT SECTION ─────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-100 bg-[#DCFCE7]/40 text-[#16A34A] text-[10px] font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Optimized Approach
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.15]">
              Designed for Simplicity. <br />Built for Scale.
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
              We focus on building clean, modern, and scalable applications that solve real-world problems with efficient design and smooth user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">Performance</h4>
                  <p className="text-sm text-gray-900 font-bold">Ultralight Execution</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">Design</h4>
                  <p className="text-sm text-gray-900 font-bold">Glassmorphic Core</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleUp}
            className="relative"
          >
            {/* Soft decorative blur */}
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#22C55E] to-teal-500 opacity-10 blur-2xl pointer-events-none" />
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl p-5">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&h=450&fit=crop"
                alt="Agricultural drone scan mockup"
                className="w-full h-64 object-cover rounded-xl mb-4 border border-gray-100"
              />
              
              {/* Telemetry panel */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Dynamic Asset Core</div>
                    <div className="text-[10px] text-gray-400">Status: Integrated & Fully Operational</div>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-[#16A34A] bg-[#DCFCE7]/50 border border-emerald-100 px-3 py-1 rounded-lg">
                  Active (Edge v1.0)
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 💬 TESTIMONIALS SECTION ─────────────────────────────────────────────── */}
      <section id="testimonials" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100 bg-[#F9FAFB]/40">
        <div className="text-center mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              Trusted by Developers & Teams Worldwide
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Real feedback from enterprise engineering teams and modern startup builders.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="border border-gray-200 rounded-2xl p-8 bg-white relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-8 text-[#22C55E]/5 font-serif text-8xl leading-none pointer-events-none select-none">“</div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#22C55E] text-[#22C55E]" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-8 relative z-10">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-4 mt-auto">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${t.color} flex items-center justify-center text-white font-bold text-sm shadow`}>
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{t.author}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 🚀 CALL TO ACTION SECTION ─────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleUp}
          className="relative rounded-3xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50 p-8 sm:p-14 text-center overflow-hidden shadow-xl"
        >
          {/* Subtle green glow inside card */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#22C55E]/5 blur-[80px]" />

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-5 max-w-2xl mx-auto">
            Start Building Your Idea Today
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Join a modern development experience built for speed, simplicity, and scalability.
          </p>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link 
              href="/register" 
              className="px-10 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white shadow-lg shadow-[#22C55E]/15 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 📌 FOOTER SECTION ────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-white border-t border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-8 mb-8">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-gray-900 text-base">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-white">
                <Sprout className="w-4.5 h-4.5" />
              </span>
              <span>AgriGrowthRate</span>
            </Link>
            <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center">
              {['Features', 'About', 'Contact', 'Privacy'].map((label) => (
                <Link key={label} href="#" className="text-xs text-gray-400 hover:text-[#22C55E] transition-colors uppercase tracking-wider font-bold">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-400 text-xs text-center md:text-left leading-relaxed">
              <p className="mb-1">Built with modern technologies for better user experience.</p>
              <p>© 2026 All rights reserved.</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all">
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
