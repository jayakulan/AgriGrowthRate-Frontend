'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Email format validation helper
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

      // Route to appropriate dashboard based on role
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

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col justify-between font-sans overflow-x-hidden relative pt-16">

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
          className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 md:h-[580px] border border-[#e4e6df]"
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

            <div className="max-w-sm w-full mx-auto space-y-7">

              {/* Header Title */}
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-[#1e4d1e] tracking-tight">
                  Sign In
                </h1>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  Enter your credentials to access your dashboard.
                </p>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email bottom-only line */}
                <div className="text-left">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2 text-xs text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>

                {/* Password bottom-only line */}
                <div className="text-left relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#1e4d1e] focus:outline-none transition-all py-2 pr-10 text-xs text-gray-800 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Submit CTA button in signature Forest Green */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-xs shadow-md uppercase tracking-wider"
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
                <span className="relative bg-white px-3 text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">
                  - OR CONTINUE WITH -
                </span>
              </div>

              {/* Bottom Google Sign-In Button */}
              <button
                type="button"
                onClick={() => toast('Google login coming soon!')}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-[#e4e6df] hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Register redirection links matching Forest Green theme */}
              <p className="text-center text-[10px] text-gray-400 font-bold tracking-wide">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#1e4d1e] hover:text-[#4A6D2F] transition-colors ml-1 uppercase hover:underline">
                  Register
                </Link>
              </p>

            </div>

          </div>

        </motion.div>

      </div>

      {/* Public Footer */}
      <Footer />

    </div>
  );
}
