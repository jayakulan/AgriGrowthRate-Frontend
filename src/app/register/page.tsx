'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Sprout, Eye, EyeOff, Loader2, Mail, Lock, User, Phone, ArrowRight, Activity, ShieldCheck, Cpu, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Static background glowing green nodes
const BackgroundBlurs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[128px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[128px]" />
    </div>
  );
};

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'consumer' as 'farmer' | 'consumer', phone: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // SMS OTP Verification States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);

  // Resend OTP countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const id = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(id);
    }
  }, [otpTimer]);

  // Dynamic Password Strength Calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'Empty', color: 'bg-slate-800', width: 'w-0', text: 'text-slate-500' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4', text: 'text-red-400' };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4', text: 'text-amber-400' };
      case 3:
        return { label: 'Good', color: 'bg-[#22C55E]', width: 'w-3/4', text: 'text-[#22C55E]' };
      case 4:
        return { label: 'Strong', color: 'bg-[#15803D]', width: 'w-full', text: 'text-emerald-400' };
      default:
        return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4', text: 'text-red-400' };
    }
  };

  const strength = getPasswordStrength(form.password);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await loginWithGoogle(undefined, tokenResponse.access_token);
        toast.success('Registration successful! Welcome 🌱');
        router.push('/dashboard');
      } catch (error) {
        toast.error('Google registration failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error('Google registration failed');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // OTP key listeners
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      }
    }
  };

  // Trigger OTP SMS Flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return toast.error('Please fill in all required fields');
    }
    if (!form.phone) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return toast.error('Phone number is required for SMS OTP verification');
    }
    if (form.password !== form.confirm) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return toast.error('Password must be at least 6 characters');
    }
    if (!acceptTerms) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return toast.error('You must accept the Terms and Conditions');
    }

    setLoading(true);
    try {
      // Import dynamic authService client API
      const { authService } = await import('@/services/authService');
      await authService.sendOtp(form.phone, form.email);
      toast.success('Verification OTP code sent to your phone! 📱');
      setShowOtpModal(true);
      setOtpTimer(30);
    } catch (err: any) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      const msg = err.response?.data?.message || err.message || 'Failed to send verification SMS';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Verify Code & Final Account Registration
  const handleVerifyAndRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length < 6) {
      return toast.error('Please enter all 6 digits of your OTP code');
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role, form.phone, otpCode);
      toast.success('Verification complete! Account created 🌱');
      setShowOtpModal(false);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'OTP verification failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    setLoading(true);
    try {
      const { authService } = await import('@/services/authService');
      await authService.sendOtp(form.phone, form.email);
      toast.success('New OTP verification code sent! 📱');
      setOtpTimer(30);
      setOtpDigits(['', '', '', '', '', '']);
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend OTP';
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
        className="relative z-10 w-full max-w-6xl bg-[#0F2A1A]/40 backdrop-blur-xl border border-[#14532D]/80 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(34,197,94,0.15)] grid lg:grid-cols-12 min-h-[700px]"
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
              Create Your Digital Farming Account
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Join thousands of farmers and smart consumers leveraging advanced neural engines for precision cultivation.
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

        {/* ── Right: Standard Glassmorphic registration card ──── */}
        <div className="lg:col-span-7 flex flex-col justify-center p-8 sm:p-12 lg:p-14 relative">
          <div className="w-full max-w-lg mx-auto">
            {/* Header info */}
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
              <p className="text-slate-400 text-sm mt-1.5">
                Join our platform to manage crops and purchase organic produce directly.
              </p>
            </div>

            {/* Form system */}
            <motion.form
              animate={{ x: isShake ? [-10, 10, -10, 10, -5, 5, 0] : 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Role selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                  Select Your Platform Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['farmer', 'consumer'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all capitalize flex items-center justify-center gap-2 cursor-pointer ${
                        form.role === r
                          ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                          : 'border-[#14532D] bg-[#0B1F14]/30 text-slate-505 hover:border-[#22C55E] hover:text-[#22C55E]'
                      }`}
                      id={`role-${r}`}
                    >
                      <span>{r === 'farmer' ? '🌾' : '🛒'}</span>
                      <span>{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid for Name & Email on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22C55E] transition-colors" />
                    <input
                      id="reg-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0B1F14]/60 hover:bg-[#0B1F14]/80 focus:bg-[#0F2A1A]/80 border border-[#14532D] focus:border-[#22C55E] rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all text-sm font-medium"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22C55E] transition-colors" />
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0B1F14]/60 hover:bg-[#0B1F14]/80 focus:bg-[#0F2A1A]/80 border border-[#14532D] focus:border-[#22C55E] rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all text-sm font-medium"
                      placeholder="example@agri.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Phone Number <span className="text-[#22C55E] lowercase">(required for SMS OTP verification)</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22C55E] transition-colors" />
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B1F14]/60 hover:bg-[#0B1F14]/80 focus:bg-[#0F2A1A]/80 border border-[#14532D] focus:border-[#22C55E] rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all text-sm font-medium"
                    placeholder="94771234567"
                    required
                  />
                </div>
              </div>

              {/* Grid for Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22C55E] transition-colors" />
                    <input
                      id="reg-password"
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#0B1F14]/60 hover:bg-[#0B1F14]/80 focus:bg-[#0F2A1A]/80 border border-[#14532D] focus:border-[#22C55E] rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all text-sm font-medium"
                      placeholder="••••••••"
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

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22C55E] transition-colors" />
                    <input
                      id="reg-confirm"
                      name="confirm"
                      type="password"
                      value={form.confirm}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0B1F14]/60 hover:bg-[#0B1F14]/80 focus:bg-[#0F2A1A]/80 border border-[#14532D] focus:border-[#22C55E] rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all text-sm font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password strength indicator */}
              {form.password && (
                <div className="bg-[#0B1F14]/40 border border-[#14532D]/60 p-2.5 rounded-xl">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
                    <span>Password Strength</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strength.width.replace('w-', '') }}
                      className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                      style={{
                        width: strength.width === 'w-1/4' ? '25%' : strength.width === 'w-2/4' ? '50%' : strength.width === 'w-3/4' ? '75%' : strength.width === 'w-full' ? '100%' : '0%'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Terms and Conditions checkbox */}
              <div className="flex items-start">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#22C55E] rounded bg-[#0B1F14] border-[#14532D] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="accept-terms" className="ml-2.5 text-xs text-slate-400 font-semibold cursor-pointer select-none leading-normal">
                  I accept the AgriGrowthRate{' '}
                  <Link href="/terms" className="text-[#22C55E] hover:text-[#86EFAC] underline font-bold">Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#22C55E] hover:text-[#86EFAC] underline font-bold">Privacy Policy</Link>.
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                id="register-submit"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#22C55E] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Create Free Account <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </motion.form>

            {/* Social Separator */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Google and GitHub Sign-up */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                id="google-login-btn"
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 py-2 bg-[#0B1F14]/60 hover:bg-[#0B1F14] border border-[#14532D]/80 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
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
                onClick={() => toast('GitHub registration coming soon!')}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 py-2 bg-[#0B1F14]/60 hover:bg-[#0B1F14] border border-[#14532D]/80 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-[#F0F6FC]" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </motion.button>
            </div>

            {/* Bottom Switch Link */}
            <p className="text-center text-xs text-slate-400 mt-6 font-semibold">
              Already have an account?{' '}
              <Link href="/login" className="text-[#22C55E] hover:text-[#86EFAC] transition-colors font-bold underline decoration-[#22C55E]/30 hover:decoration-[#22C55E] ml-1">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating animated OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Glass overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpModal(false)}
              className="absolute inset-0 bg-[#0B1F14]/80 backdrop-blur-md cursor-pointer pointer-events-auto"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative z-10 w-full max-w-md bg-[#0F2A1A]/95 border border-[#14532D] rounded-3xl p-8 shadow-2xl text-center pointer-events-auto"
            >
              {/* Close button */}
              <button 
                onClick={() => setShowOtpModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Shield key lock icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Verify Phone Number</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                We sent a 6-digit security code to <span className="text-[#22C55E] font-semibold">{form.phone}</span>. Please enter it below.
              </p>

              {/* OTP Input Fields */}
              <div className="flex gap-2 justify-center mb-6">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-11 text-center bg-[#0B1F14] border border-[#14532D] focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10 text-white rounded-xl text-lg font-bold outline-none transition-all"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {/* Resend and Actions */}
              <div className="mb-6">
                {otpTimer > 0 ? (
                  <p className="text-xs text-slate-500">
                    Resend OTP code in <span className="text-slate-300 font-semibold">{otpTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs text-[#22C55E] hover:text-[#86EFAC] font-bold underline decoration-[#22C55E]/30 transition-colors cursor-pointer flex items-center gap-1.5 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend Verification Code
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="py-2.5 bg-[#0B1F14]/60 hover:bg-[#0B1F14] border border-[#14532D]/80 rounded-xl text-xs font-bold text-slate-400 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVerifyAndRegister()}
                  className="py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#22C55E] text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify Code'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
