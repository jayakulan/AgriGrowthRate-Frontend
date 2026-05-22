'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Loader2, Mail, Lock, Sprout, ArrowRight, Activity, ShieldCheck, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Static background glowing green nodes
const BackgroundBlurs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[128px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[128px]" />
    </div>
  );
};

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Email format validation helper
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const loggedInUser = await loginWithGoogle(undefined, tokenResponse.access_token);
        toast.success('Welcome back!');
        router.push(`/dashboard/${loggedInUser.role}`);
      } catch (error) {
        toast.error('Google login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error('Google login failed');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return toast.error('Please fill in all fields');
    }
    if (!isEmailValid(email)) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return toast.error('Please enter a valid email address');
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success('Welcome back!');
      router.push(`/dashboard/${loggedInUser.role}`);
    } catch (err: any) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-[#0B1F14] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Static Background Layout */}
      <BackgroundBlurs />

      {/* Auth Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-6xl bg-[#0F2A1A]/40 backdrop-blur-xl border border-[#14532D]/80 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(34,197,94,0.15)] grid lg:grid-cols-12 min-h-[650px]"
      >
        
        {/* ── Left: Smart Agritech Visual orbital panel ────────── */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#0F2A1A]/70 border-r border-[#14532D]/60 p-12 flex-col justify-between overflow-hidden">
          {/* Orbital grid blur */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 font-bold text-[#22C55E] text-lg mb-6">
              <Sprout className="w-6 h-6 animate-pulse" />
              <span>Agri<span className="text-white">GrowthRate</span></span>
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#86EFAC] leading-tight">
              AI-Powered Agricultural Precision
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Unlock crop disease detection, dynamic yield forecasting, and optimal growth recommendations in real-time.
            </p>
          </div>

          {/* Interactive animated orbital graphic */}
          <div className="relative z-10 my-8 flex items-center justify-center h-48 w-full">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute w-44 h-44 rounded-full border border-[#22C55E]/20 border-dashed"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute w-36 h-36 rounded-full border border-[#15803D]/30"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-28 h-28 rounded-full bg-[#22C55E]/5 shadow-[0_0_40px_rgba(34,197,94,0.2)]"
            />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#86EFAC] flex items-center justify-center shadow-2xl relative z-20">
              <Sprout className="w-8 h-8 text-slate-950" />
            </div>
          </div>

          {/* SaaS metrics display */}
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="bg-[#0B1F14]/50 border border-[#14532D]/80 rounded-xl p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22C55E]">
                <Cpu className="w-3.5 h-3.5" /> Core Diagnostic
              </div>
              <p className="text-xl font-bold mt-1">98.4%</p>
              <span className="text-[10px] text-slate-500">Classification Accuracy</span>
            </div>
            <div className="bg-[#0B1F14]/50 border border-[#14532D]/80 rounded-xl p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#86EFAC]">
                <Activity className="w-3.5 h-3.5" /> System Health
              </div>
              <p className="text-xl font-bold mt-1">Active</p>
              <span className="text-[10px] text-slate-500">99.9% Platform Uptime</span>
            </div>
          </div>
        </div>

        {/* ── Right: Standard Glassmorphic login card ────────── */}
        <div className="lg:col-span-7 flex flex-col justify-center p-8 sm:p-12 lg:p-16 relative">
          <div className="w-full max-w-md mx-auto">
            {/* Header info */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
              <p className="text-slate-400 text-sm mt-2">
                Enter your credentials to access your smart diagnostic portal.
              </p>
            </div>

            {/* Form system */}
            <motion.form
              animate={{ x: isShake ? [-10, 10, -10, 10, -5, 5, 0] : 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22C55E] transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0B1F14]/60 hover:bg-[#0B1F14]/80 focus:bg-[#0F2A1A]/80 border border-[#14532D] focus:border-[#22C55E] rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all text-sm font-medium"
                    placeholder="example@agri.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-[#22C55E] hover:text-[#86EFAC] font-semibold transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22C55E] transition-colors" />
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#0B1F14]/60 hover:bg-[#0B1F14]/80 focus:bg-[#0F2A1A]/80 border border-[#14532D] focus:border-[#22C55E] rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all text-sm font-medium"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me toggle */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#22C55E] rounded bg-[#0B1F14] border-[#14532D] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2.5 text-xs text-slate-400 font-semibold cursor-pointer select-none">
                  Remember me on this device
                </label>
              </div>

              {/* Login Button with animations */}
              <motion.button
                id="login-submit"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#22C55E] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Secure Sign-in <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </motion.form>

            {/* Social Separator */}
            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Google and GitHub Sign-in */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                id="google-login-btn"
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 py-2.5 bg-[#0B1F14]/60 hover:bg-[#0B1F14] border border-[#14532D]/80 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Gmail</span>
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast('GitHub Sign-in coming soon!')}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 py-2.5 bg-[#0B1F14]/60 hover:bg-[#0B1F14] border border-[#14532D]/80 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-[#F0F6FC]" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </motion.button>
            </div>

            {/* Bottom Switch Link */}
            <p className="text-center text-xs text-slate-400 mt-8 font-semibold">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="text-[#22C55E] hover:text-[#86EFAC] transition-colors font-bold underline decoration-[#22C55E]/30 hover:decoration-[#22C55E] ml-1">
                Register Free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
