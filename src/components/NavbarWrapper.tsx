'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide the public header/navbar on all dashboard, disease-detect, login, and register routes
  if (pathname?.startsWith('/dashboard') || pathname === '/disease-detect' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return <Navbar />;
}
