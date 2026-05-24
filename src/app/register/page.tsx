'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, MapPin, ShieldCheck, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

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
        otpCode
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
    <div className="min-h-[calc(100vh-56px)] bg-[#f9f9f6] flex flex-col justify-between">
      
      {/* Main split container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Stunning Misty tea hills visual panel */}
        <div className="hidden lg:block relative w-full h-full min-h-[720px]">
          <img
            src="https://images.unsplash.com/photo-1558224492-db89a890d5f6?auto=format&fit=crop&w=1200&q=80"
            alt="Misty tea gardens"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Caption Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
            <h2 className="text-3xl font-bold text-white mb-2">Cultivate the Future</h2>
            <p className="text-gray-200 text-sm max-w-sm">
              Experience the precision of modern stewardship in the heart of nature.
            </p>
          </div>
        </div>

        {/* Right Side: Account registration form card */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[540px] bg-white border border-[#e4e6df] rounded-2xl p-8 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            
            {/* Header info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#1e4d1e] tracking-tight mb-1">
                Create Your Account
              </h1>
              <p className="text-gray-500 text-sm">
                Join AgriGrowthRate and get started on your agricultural journey.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role selector switcher matches mock exactly */}
              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1.5">
                  I am a...
                </label>
                <div className="flex bg-[#f4f5f0] border border-[#e4e6df] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: 'farmer' })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      form.role === 'farmer'
                        ? 'bg-[#1e4d1e] text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: 'consumer' })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      form.role === 'consumer'
                        ? 'bg-[#1e4d1e] text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Consumer
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]/5 transition-all text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]/5 transition-all text-sm"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone & Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reg-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]/5 transition-all text-sm"
                      placeholder="+1 234..."
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reg-address"
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]/5 transition-all text-sm"
                      placeholder="City, Country"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reg-password"
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]/5 transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-semibold text-gray-800 block mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reg-confirm"
                      name="confirm"
                      type="password"
                      value={form.confirm}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]/5 transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-[0_4px_12px_rgba(30,77,30,0.15)]"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            {/* Bottom Switch Link */}
            <p className="text-center text-xs text-gray-500 mt-6 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-[#1e4d1e] font-bold hover:underline ml-1">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e4e6df] bg-[#f4f5f0] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-[#1e4d1e] text-sm mb-0.5">AgriGrowthRate</h2>
            <p className="text-xs text-gray-400">© 2024 AgriGrowthRate. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Security</Link>
            <Link href="#" className="hover:text-gray-800 transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>

      {/* Floating animated OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <div
              onClick={() => setShowOtpModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card container */}
            <div className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-2xl text-center">
              {/* Close button */}
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Shield key lock icon */}
              <div className="w-14 h-14 rounded-full bg-[#f4f5f0] border border-[#e4e6df] flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="w-7 h-7 text-[#1e4d1e]" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Phone Number</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                We sent a 6-digit security code to <span className="text-[#1e4d1e] font-semibold">{form.phone}</span>. Please enter it below.
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
                    className="w-11 h-11 text-center bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] focus:ring-2 focus:ring-[#1e4d1e]/5 text-gray-800 rounded-lg text-lg font-bold outline-none transition-all"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {/* Resend and Actions */}
              <div className="mb-6">
                {otpTimer > 0 ? (
                  <p className="text-xs text-gray-400">
                    Resend OTP code in <span className="text-gray-700 font-semibold">{otpTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs text-[#1e4d1e] hover:underline font-bold transition-colors flex items-center gap-1.5 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Resend Verification Code
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVerifyAndRegister()}
                  className="py-2.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify Code'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
