'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check localStorage as a fallback to avoid React state race conditions during transitions
    const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('agri_user') : null;

    let activeUser = user;
    if (!activeUser && storedUserStr) {
      try {
        activeUser = JSON.parse(storedUserStr);
      } catch (e) {}
    }

    if (!activeUser) {
      router.replace('/login');
    } else {
      router.replace(`/dashboard/${activeUser.role}`);
    }
  }, [user, loading, router]);

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#0B1F14] text-slate-100 flex items-center justify-center p-4">
      {/* Background blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[128px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[128px]" />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg shadow-[#22C55E]/20"
        >
          <Sprout className="w-8 h-8 text-white animate-pulse" />
        </motion.div>
        <div className="flex items-center gap-2 mt-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#22C55E]" />
          <span className="text-sm font-semibold tracking-wide text-slate-300">
            Routing to your dashboard...
          </span>
        </div>
      </div>
    </div>
  );
}
