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
      <div className="min-h-screen bg-[#f9f9f6] flex items-center justify-center">
        <img src="/logo.png" alt="Loading" className="w-48 h-auto object-contain animate-pulse" />
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
