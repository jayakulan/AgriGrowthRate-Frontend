'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      router.push(`/dashboard/${loggedInUser.role}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#f9f9f6] flex flex-col justify-between">
      
      {/* Main container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">

        {/* Login form card wrapper */}
        <div className="w-full flex justify-center max-w-[440px]">
          <div className="w-full bg-white border border-[#e4e6df] rounded-2xl p-8 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-[#1e4d1e] mb-1">Welcome Back</p>
              <h1 className="text-sm text-gray-500">
                Login to your AgriGrowthRate account
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div>
                <label className="text-xs font-semibold text-gray-800 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]/5 transition-all text-sm"
                    placeholder="name@farm.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-800">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-[#1e4d1e] transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d1e]/5 transition-all text-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
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

              {/* Remember me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-50 border-gray-300 text-[#1e4d1e] focus:ring-[#1e4d1e] cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2.5 text-xs text-gray-600 font-medium cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              {/* Login Button */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-[0_4px_12px_rgba(30,77,30,0.15)]"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs">Or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google and Microsoft SSO */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="google-login-btn"
                type="button"
                className="flex items-center justify-center gap-2.5 py-2.5 bg-white border border-[#e4e6df] rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                onClick={() => toast('Google login coming soon!')}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-2.5 bg-white border border-[#e4e6df] rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                onClick={() => toast('Microsoft login coming soon!')}
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#F25022" d="M0 0h11v11H0z"/>
                  <path fill="#7FBA00" d="M12 0h11v11H12z"/>
                  <path fill="#00A4EF" d="M0 12h11v11H0z"/>
                  <path fill="#FFB900" d="M12 12h11v11H12z"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            {/* Register Link */}
            <p className="text-center text-xs text-gray-500 mt-8 font-medium">
              Don’t have an account?{' '}
              <Link href="/register" className="text-[#1e4d1e] font-bold hover:underline ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>



    </div>
  );
}
