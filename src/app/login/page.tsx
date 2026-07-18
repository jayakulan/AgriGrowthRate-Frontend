'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowUpRight, 
  Check, 
  X, 
  Smartphone, 
  KeyRound, 
  Lock,
  Send,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Enter Phone, 2: Verify OTP, 3: Reset Password
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtpDigits, setForgotOtpDigits] = useState(['', '', '', '', '', '']);
  const [forgotNewPwd, setForgotNewPwd] = useState('');
  const [forgotConfirmPwd, setForgotConfirmPwd] = useState('');
  const [showForgotNewPwd, setShowForgotNewPwd] = useState(false);
  const [showForgotConfirmPwd, setShowForgotConfirmPwd] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const loggedInUser = await loginWithGoogle(undefined, tokenResponse.access_token);
        toast.success('Welcome back!');
        if (loggedInUser.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push(`/dashboard/${loggedInUser.role}`);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Google sign-in failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error('Google sign-in failed'),
  });

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }
    if (!isEmailValid(email)) {
      return toast.error('Please enter a valid email address');
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success('Welcome back!');

      if (loggedInUser.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push(`/dashboard/${loggedInUser.role}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newDigits = [...forgotOtpDigits];
    newDigits[index] = value.slice(-1);
    setForgotOtpDigits(newDigits);

    if (value && index < 5) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleForgotOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !forgotOtpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`forgot-otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
        const newDigits = [...forgotOtpDigits];
        newDigits[index - 1] = '';
        setForgotOtpDigits(newDigits);
      }
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone) return toast.error('Please enter your phone number');
    
    // Validate phone number format
    if (!/^(?:\+94|0)?7[0-9]{8}$/.test(forgotPhone.trim().replace(/[\s\-]/g, ''))) {
      return toast.error('Invalid Sri Lankan phone number format (e.g. 077XXXXXXXX)');
    }

    setForgotLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/forgot-password/send-otp', {
        phone: forgotPhone
      });
      if (res.data && res.data.success) {
        toast.success('Reset OTP sent successfully! ✉️');
        setForgotOtpDigits(['', '', '', '', '', '']);
        setForgotStep(2);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Is this number registered?');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = forgotOtpDigits.join('');
    if (otpCode.length !== 6) {
      return toast.error('Please enter a valid 6-digit OTP code');
    }

    setForgotLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/forgot-password/verify-otp', {
        phone: forgotPhone,
        otp: otpCode
      });
      if (res.data && res.data.success) {
        toast.success('OTP verified successfully! 🔑');
        setForgotStep(3);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = forgotOtpDigits.join('');
    if (!forgotNewPwd || !forgotConfirmPwd) {
      return toast.error('Please fill in all fields');
    }
    if (forgotNewPwd.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    if (forgotNewPwd !== forgotConfirmPwd) {
      return toast.error('Passwords do not match');
    }

    setForgotLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/forgot-password/reset', {
        phone: forgotPhone,
        otp: otpCode,
        password: forgotNewPwd
      });
      if (res.data && res.data.success) {
        toast.success('Password updated successfully! Please login with your new credentials.');
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotPhone('');
        setForgotOtpDigits(['', '', '', '', '', '']);
        setForgotNewPwd('');
        setForgotConfirmPwd('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col justify-between font-sans overflow-x-hidden relative pt-18 ">

      {/* Dynamic background lighting elements */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#edf4e2] filter blur-3xl opacity-60 pointer-events-none select-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#cde8c8]/40 filter blur-3xl opacity-50 pointer-events-none select-none" />

      {/* Main Centered Login Section wrapper */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10 relative">

        {/* ── Enlarged & Optimized Login Box Container styled in signature green ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 md:h-[620px] border border-[#e4e6df]"
        >

          {/* Left Column: Image Background (col-span-6) */}
          <div className="md:col-span-6 relative p-8 flex flex-col justify-between overflow-hidden rounded-r-[50px] min-h-[350px] md:min-h-auto border-r border-[#e4e6df]">

            {/* Background Image with Transparency */}
            <div className="absolute inset-0 z-0">
              <img
                src="/login.jpg"
                alt="Agriculture background"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-[#1e4d1e]/30 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e4d1e]/90 via-[#1e4d1e]/10 to-transparent" />
            </div>

            {/* Bottom "Visit site" pill action */}
            <div className="relative z-10 self-start mt-auto">
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-[#cde8c8]/80 hover:bg-[#b8dcb2] text-[#1e4d1e] px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <span>Back to Home</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right Column: Clean White Sign In Area (Enlarged) */}
          <div className="md:col-span-6 bg-white p-8 sm:p-12 md:p-14 flex flex-col justify-center">

            <div className="max-w-sm w-full mx-auto space-y-12">

              {/* Header Title */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <img src="/logo.png" alt="Logo" className="w-12 h-10 object-contain" />
                  <h1 className="text-4xl font-extrabold text-[#1e4d1e] tracking-tight">
                    Sign In
                  </h1>
                </div>
                <p className="text-xs md:text-sm text-gray-400 font-semibold mt-0.5">
                  Enter your credentials to access your dashboard.
                </p>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email bottom-only line */}
                <div className="text-left relative group flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2 pr-8 text-sm text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>

                {/* Password bottom-only line */}
                <div className="text-left relative group">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2 pr-16 text-sm text-gray-800 placeholder-gray-400"
                    required
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot password button right under the password field */}
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotPhone('');
                      setForgotOtpDigits(['', '', '', '', '', '']);
                      setForgotNewPwd('');
                      setForgotConfirmPwd('');
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] font-bold text-[#1e4d1e] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit CTA button in signature Forest Green */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-md uppercase tracking-wider"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</>
                  ) : (
                    'Sign In'
                  )}
                </button>

              </form>

              {/* Separator below the form */}
              <div className="relative flex items-center justify-center py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative bg-white px-3 text-[10px] md:text-xs font-extrabold text-gray-400 tracking-widest uppercase">
                  - OR CONTINUE WITH -
                </span>
              </div>

              {/* Bottom Google Sign-In Button */}
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-[#e4e6df] hover:border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>

              {/* Register redirection links matching Forest Green theme */}
              <p className="text-center text-xs text-gray-400 font-bold tracking-wide">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#1e4d1e] hover:text-[#4A6D2F] transition-colors ml-1 uppercase hover:underline">
                  Register
                </Link>
              </p>

            </div>

          </div>

        </motion.div>

      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop with blurring */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!forgotLoading) {
                  setShowForgotModal(false);
                }
              }}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] shadow-2xl overflow-hidden"
            >
              {/* STEP 1: Enter Mobile Number */}
              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp}>
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-[#e4e6df] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="Logo" className="w-6 h-5 object-contain" />
                      <h3 className="text-lg font-bold text-gray-900">Forgot Password</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      disabled={forgotLoading}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Enter your registered Sri Lankan phone number to receive a verification OTP code.
                    </p>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        placeholder="e.g. 0771234567"
                        disabled={forgotLoading}
                        className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none disabled:opacity-60"
                        required
                      />
                    </div>

                    {/* Footer Buttons Side-by-side */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(false)}
                        disabled={forgotLoading}
                        className="flex-1 py-3 bg-[#f4f5f0] hover:bg-[#e8eae0] text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {forgotLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Smartphone className="w-4 h-4" />
                        )}
                        Send OTP
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 2: Verify OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp}>
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-[#e4e6df] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="Logo" className="w-6 h-5 object-contain" />
                      <h3 className="text-lg font-bold text-gray-900">Verify OTP</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      disabled={forgotLoading}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      We sent a 6-digit OTP code to <span className="font-bold text-[#1e4d1e]">{forgotPhone}</span>. Please enter it below.
                    </p>

                    {/* OTP Digits input boxes */}
                    <div className="flex gap-2 justify-center mb-6">
                      {forgotOtpDigits.map((digit, i) => (
                        <input
                          key={i}
                          id={`forgot-otp-${i}`}
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleForgotOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleForgotOtpKeyDown(i, e)}
                          className="w-11 h-11 text-center bg-[#f4f6ee] border border-[#e4e6df] focus:border-[#1e4d1e] text-gray-800 rounded-xl text-lg font-bold outline-none transition-all"
                          autoFocus={i === 0}
                          disabled={forgotLoading}
                        />
                      ))}
                    </div>

                    {/* Footer Buttons Side-by-side */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        disabled={forgotLoading}
                        className="flex-1 py-3 bg-[#f4f5f0] hover:bg-[#e8eae0] text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {forgotLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Verify Code
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 3: Reset Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword}>
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-[#e4e6df] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="Logo" className="w-6 h-5 object-contain" />
                      <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      disabled={forgotLoading}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Choose a secure new password of at least 6 characters.
                    </p>

                    {/* New Password */}
                    <div className="space-y-1.5 text-left relative">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showForgotNewPwd ? 'text' : 'password'}
                          value={forgotNewPwd}
                          onChange={(e) => setForgotNewPwd(e.target.value)}
                          placeholder="••••••••"
                          disabled={forgotLoading}
                          className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 pr-12 text-xs font-bold text-gray-800 outline-none disabled:opacity-60"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPwd(!showForgotNewPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showForgotNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5 text-left relative">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showForgotConfirmPwd ? 'text' : 'password'}
                          value={forgotConfirmPwd}
                          onChange={(e) => setForgotConfirmPwd(e.target.value)}
                          placeholder="••••••••"
                          disabled={forgotLoading}
                          className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 pr-12 text-xs font-bold text-gray-800 outline-none disabled:opacity-60"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotConfirmPwd(!showForgotConfirmPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showForgotConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Footer Buttons Side-by-side */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(false)}
                        disabled={forgotLoading}
                        className="flex-1 py-3 bg-[#f4f5f0] hover:bg-[#e8eae0] text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {forgotLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                        Update Password
                      </button>
                    </div>
                  </div>
                </form>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Public Footer */}
      <Footer />

    </div>
  );
}
