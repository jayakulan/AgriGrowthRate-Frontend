'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Check localStorage as a fallback to avoid React state update race condition on login transition
    const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('agri_user') : null;

    const isActuallyAuthenticated = isAuthenticated || !!storedUserStr;

    if (!isActuallyAuthenticated) {
      router.replace('/login');
      return;
    }

    // Parse user role from localStorage if state is not loaded yet
    let activeUser = user;
    if (!activeUser && storedUserStr) {
      try {
        activeUser = JSON.parse(storedUserStr);
      } catch (e) {
        console.error(e);
      }
    }

    if (!activeUser) return; // Wait for state or localStorage to resolve

    // Guard sub-routes: ensure the user can only access their specific dashboard path
    // example: /dashboard/admin can only be accessed by admin
    const pathParts = pathname.split('/');
    const roleFromPath = pathParts[2]; // e.g. admin, farmer, consumer

    if (roleFromPath && roleFromPath !== activeUser.role) {
      // User is trying to access a different role's dashboard, redirect to their own
      router.replace(`/dashboard/${activeUser.role}`);
    }
  }, [user, loading, isAuthenticated, pathname, router]);

  // Determine actual authentication using localStorage fallback to prevent flash of loading screen
  const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('agri_user') : null;
  const isActuallyAuthenticated = isAuthenticated || !!storedUserStr;

  if (loading || !isActuallyAuthenticated) {
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
              Verifying credentials...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Parse active user for path validation check
  let activeUser = user;
  if (!activeUser && storedUserStr) {
    try {
      activeUser = JSON.parse(storedUserStr);
    } catch (e) {}
  }

  // Double check path match to prevent flash of content before router.replace takes effect
  const pathParts = pathname.split('/');
  const roleFromPath = pathParts[2];
  if (activeUser && roleFromPath && roleFromPath !== activeUser.role) {
    return null;
  }

  return <>{children}</>;
}
