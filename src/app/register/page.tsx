'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sprout, Eye, EyeOff, Loader2, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'consumer' as 'farmer' | 'consumer', phone: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome to AgriGrowthRate 🌱');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 to-emerald-950/60" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595412965389-e4a9e91de8e8?w=800&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-2xl float">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Join AgriGrowthRate</h2>
          <p className="text-gray-400 max-w-xs mx-auto leading-relaxed mb-8">
            Whether you&apos;re a farmer or a consumer, start your journey towards smarter agriculture today.
          </p>
          {/* Role cards */}
          <div className="space-y-3 max-w-sm mx-auto text-left">
            <div className="glass-card p-4 border-green-700/30">
              <p className="text-green-400 font-semibold text-sm mb-1">🌾 As a Farmer</p>
              <p className="text-gray-500 text-xs">Detect diseases, get AI recommendations, sell produce directly to consumers.</p>
            </div>
            <div className="glass-card p-4 border-emerald-700/30">
              <p className="text-emerald-400 font-semibold text-sm mb-1">🛒 As a Consumer</p>
              <p className="text-gray-500 text-xs">Buy fresh, verified organic produce directly from farmers at fair prices.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Agri<span className="text-green-400">GrowthRate</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-gray-500 mb-8">Start your free farming journey</p>

          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3">
              {(['farmer', 'consumer'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all capitalize ${
                    form.role === r
                      ? 'border-green-500 bg-green-900/30 text-green-400'
                      : 'border-green-900/30 text-gray-500 hover:border-green-800'
                  }`}
                  id={`role-${r}`}
                >
                  {r === 'farmer' ? '🌾' : '🛒'} {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input id="reg-name" name="name" type="text" value={form.name} onChange={handleChange}
                className="input-field pl-10" placeholder="Full name" required />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange}
                className="input-field pl-10" placeholder="Email address" required />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input id="reg-phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                className="input-field pl-10" placeholder="Phone number (optional)" />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input id="reg-password" name="password" type={showPwd ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                className="input-field pl-10 pr-10" placeholder="Password (min 6 chars)" required />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input id="reg-confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange}
                className="input-field pl-10" placeholder="Confirm password" required />
            </div>

            <button id="register-submit" type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
            </button>

            <p className="text-xs text-gray-600 text-center">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-green-500 hover:text-green-400">Terms</Link> and{' '}
              <Link href="/privacy" className="text-green-500 hover:text-green-400">Privacy Policy</Link>
            </p>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
