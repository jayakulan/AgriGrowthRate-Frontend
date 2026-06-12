'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, MapPin, ShieldCheck, X, RefreshCw, ArrowUpRight, CreditCard, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'farmer' as 'farmer' | 'consumer',
    phone: '',
    address: '',
    farmerCardNo: '', // Custom ID number for Farmers
  });

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // OTP input logic
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

  // Submit flow triggers SMS OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return toast.error('Please fill in all required fields');
    }
    if (!form.phone) {
      return toast.error('Phone number is required for SMS verification');
    }
    if (form.role === 'farmer') {
      if (!form.farmerCardNo) {
        return toast.error('Farmer Card Number is required for registration');
      }
      const farmerCardRegex = /^FSN\d{7}$/;
      if (!farmerCardRegex.test(form.farmerCardNo)) {
        return toast.error('Invalid Farmer Card Number Format');
      }
    }
    if (form.password !== form.confirm) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const { authService } = await import('@/services/authService');
      await authService.sendOtp(form.phone, form.email);
      toast.success('Verification OTP code sent to your phone! 📱');
      setShowOtpModal(true);
      setOtpTimer(30);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to send verification SMS';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Verify code and submit to backend registration endpoint
  const handleVerifyAndRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length < 6) {
      return toast.error('Please enter all 6 digits of your OTP code');
    }

    setLoading(true);
    try {
      const loggedInUser = await register(
        form.name,
        form.email,
        form.password,
        form.role,
        form.phone,
        otpCode,
        form.farmerCardNo
      );

      toast.success('Verification complete! Account created 🌱');
      setShowOtpModal(false);
      router.push(`/dashboard/${loggedInUser.role}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'OTP verification failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP trigger
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
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col justify-between font-sans overflow-x-hidden relative pt-20 ">

      {/* Dynamic background lighting elements to make it extra premium */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#edf4e2] filter blur-3xl opacity-60 pointer-events-none select-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#cde8c8]/40 filter blur-3xl opacity-50 pointer-events-none select-none" />

      {/* Main Centered Register Section wrapper */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10 relative">

        {/* ── Outer Registration Container ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="w-full max-w-5xl bg-white rounded-[32px] shadow-[0_20px_60px_rgba(30,77,30,0.06)] overflow-hidden grid grid-cols-1 md:grid-cols-12 md:h-[820px] border border-[#e4e6df] relative z-10"
        >

          {/* Swapped Layout - Left Column: Clean White Register Form Area (col-span-6) */}
          <div className="md:col-span-6 bg-white p-8 sm:p-10 md:py-8 md:px-14 flex flex-col justify-center order-2 md:order-1">

            <div className="max-w-md w-full mx-auto space-y-8">

              {/* Header Title styled cleanly in Forest Green */}
              <div className="text-left space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <img src="/logo.png" alt="Logo" className="w-12 h-10 object-contain" />
                  <h1 className="text-4xl font-extrabold text-[#1e4d1e] tracking-tight">
                    Create Account
                  </h1>
                </div>
                <p className="text-xs md:text-sm text-gray-400 font-semibold leading-relaxed">
                  Enter your details to create your secure modern platform access.
                </p>
              </div>

              {/* Role switch toggle matches the clean forest green brand styles */}
              <div className="text-left space-y-5">
                <label className="text-xs md:text-sm font-extrabold text-[#4A6D2F] tracking-wider uppercase ">
                  Choose Account Type
                </label>
                <div className="flex bg-[#f4f5f0] border border-[#e4e6df] p-1 rounded-xl shadow-inner relative">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: 'farmer' })}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer relative z-10 ${form.role === 'farmer'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: 'consumer' })}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer relative z-10 ${form.role === 'consumer'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    Consumer
                  </button>

                  {/* Animated sliding background capsule */}
                  <motion.div
                    layoutId="roleActiveCapsule"
                    className="absolute top-1 bottom-1 bg-[#1e4d1e] rounded-lg shadow-sm"
                    style={{
                      width: 'calc(50% - 4px)',
                      left: form.role === 'farmer' ? '4px' : 'calc(50%)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-8 text-left">

                {/* Full Name & Email Input Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="relative group">
                    <User className="absolute left-1 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1e4d1e] transition-colors" />
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2.5 pl-7 text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-1 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1e4d1e] transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2.5 pl-7 text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Address Input Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="relative group">
                    <Phone className="absolute left-1 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1e4d1e] transition-colors" />
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number (SMS OTP)"
                      className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2.5 pl-7 text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <MapPin className="absolute left-1 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1e4d1e] transition-colors" />
                    <input
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Address (City, Country)"
                      className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2.5 pl-7 text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Conditional Farmer Card No Field - Slides in dynamically for Farmer role */}
                <AnimatePresence initial={false}>
                  {form.role === 'farmer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="relative group">
                        <CreditCard className="absolute left-1 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1e4d1e] transition-colors" />
                        <input
                          name="farmerCardNo"
                          type="text"
                          value={form.farmerCardNo}
                          onChange={handleChange}
                          placeholder="Farmer Card Number (e.g. FSN0000000)"
                          className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2.5 pl-7 text-sm text-gray-800 placeholder-gray-400 font-semibold tracking-wide"
                          required={form.role === 'farmer'}
                        />
                        <span className="text-[10px] text-[#4A6D2F] font-bold mt-1.5 block">
                          * Required to verify registered agricultural producer status.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password & Confirm Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="relative group">
                    <Lock className="absolute left-1 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1e4d1e] transition-colors" />
                    <input
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2.5 pl-7 pr-8 text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-1 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-1 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#1e4d1e] transition-colors" />
                    <input
                      name="confirm"
                      type="password"
                      value={form.confirm}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2.5 pl-7 text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Submit CTA button styled in signature Forest Green */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 mt-6 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-md uppercase tracking-wider hover:shadow-lg transform active:scale-[0.98]"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Verifying details...</>
                  ) : (
                    'Register & Verify'
                  )}
                </button>

              </form>

              {/* Separator below the form */}
              <div className="relative flex items-center justify-center py-1 mt-4">
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
                onClick={() => toast('Google sign-up coming soon!')}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 mb-4 bg-white border border-[#e4e6df] hover:border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign up with Google</span>
              </button>

              {/* Login redirection footer link in Forest Green */}
              <p className="text-center text-xs text-gray-400 font-bold tracking-wide">
                Already have an account?{' '}
                <Link href="/login" className="text-[#1e4d1e] hover:text-[#4A6D2F] transition-colors ml-1 uppercase hover:underline">
                  Login
                </Link>
              </p>

            </div>

          </div>

          {/* Swapped Layout - Right Column: Image Background (col-span-6) */}
          <div className="md:col-span-6 relative p-8 flex flex-col justify-between overflow-hidden rounded-l-[50px] min-h-[350px] md:min-h-auto order-1 md:order-2 border-l border-[#e4e6df]">

            {/* Background Image with Transparency */}
            <div className="absolute inset-0 z-0">
              <img
                src="/register.png"
                alt="Agriculture background"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-[#1e4d1e]/30 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e4d1e]/90 via-[#1e4d1e]/30 to-transparent" />
            </div>



            {/* Bottom "Back to Home" pill action */}
            <div className="relative z-10 self-start mt-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#cde8c8]/80 hover:bg-[#b8dcb2] text-[#1e4d1e] px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <span>Back to Home</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </motion.div>

      </div>

      {/* Floating animated OTP Verification Modal themed in matching Forest Green */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Modal Backdrop with fade animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card with scaling spring animation */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl text-center"
            >
              {/* Close button */}
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Shield key lock icon matching signature green theme */}
              <div className="w-14 h-14 rounded-full bg-[#edf4e2] border border-[#d2dfc2] flex items-center justify-center mx-auto mb-5 shadow-sm">
                <ShieldCheck className="w-7 h-7 text-[#1e4d1e]" />
              </div>

              <h3 className="text-lg font-extrabold text-gray-900 mb-2">Verify Phone Number</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                We sent a 6-digit verification code to <span className="text-[#1e4d1e] font-bold">{form.phone}</span>. Please enter it to complete activation.
              </p>

              {/* OTP Digits input boxes */}
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
                    className="w-11 h-11 text-center bg-[#f9f9f6] border border-[#e4e6df] focus:border-[#1e4d1e] focus:ring-2 focus:ring-[#1e4d1e]/10 text-gray-800 rounded-xl text-lg font-bold outline-none transition-all"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {/* Resend OTP actions */}
              <div className="mb-6">
                {otpTimer > 0 ? (
                  <p className="text-[11px] text-gray-400 font-bold">
                    Resend code in <span className="text-gray-700 font-extrabold">{otpTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[11px] text-[#1e4d1e] hover:text-[#4A6D2F] hover:underline font-extrabold transition-colors flex items-center gap-1.5 mx-auto uppercase"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend Verification Code
                  </button>
                )}
              </div>

              {/* Modal controls */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] rounded-xl text-xs font-bold text-gray-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVerifyAndRegister()}
                  className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify Code'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Public Footer */}
      <Footer />

    </div>
  );
}
