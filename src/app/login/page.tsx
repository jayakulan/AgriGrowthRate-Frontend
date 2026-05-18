'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Loader2, Mail, Lock, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await loginWithGoogle(undefined, tokenResponse.access_token);
        toast.success('Welcome back!');
        router.push('/dashboard');
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
    if (!email || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#f4f5f0] flex flex-col">
      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* ── Left: headline + image ─────────────────────── */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
              Sustainable Innovation for Global Agriculture.
            </h1>
            <p className="text-gray-500 text-base mb-8">
              Empowering agronomists with precision data and AI-driven growth analytics to feed the future.
            </p>
            <div className="overflow-hidden rounded-2xl border border-[#e4e6df] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=700&h=420&fit=crop"
                alt="Hydroponic lettuce farm"
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
          </div>

          {/* ── Right: login card ──────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#e4e6df] shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-500 text-sm mb-7">Access your dashboard and manage your crops.</p>

            <form onSubmit={handleSubmit} id="login-form" className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-xs text-[#2d6a2d] hover:underline font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</>
                ) : 'Login'}
              </button>
            </form>

            {/* OR divider */}
            <div className="divider-text my-6">OR</div>

            {/* Google SSO (placeholder) */}
            <div className="w-full">
              <button
                id="google-login-btn"
                type="button"
                className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#dadce0] rounded-lg text-sm font-medium text-[#3c4043] bg-white hover:bg-[#f8f9fa] transition-colors cursor-pointer shadow-sm"
                onClick={() => handleGoogleLogin()}
                disabled={loading}
              >
                {/* Google icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Gmail
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#2d6a2d] font-bold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-[#e4e6df] py-6 bg-[#f4f5f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-[#2d6a2d] text-sm mb-0.5">
              <Sprout className="w-4 h-4" /> AgriGrowthRate
            </div>
            <p className="text-xs text-gray-400">© 2024 AgriGrowthRate AI Platform. Sustainable Innovation for Global Agriculture.</p>
          </div>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Sustainability', 'Contact'].map((l) => (
              <Link key={l} href="#" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
