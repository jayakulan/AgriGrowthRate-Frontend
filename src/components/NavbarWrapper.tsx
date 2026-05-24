'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide the public header/navbar on all dashboard and disease-detect routes
  if (pathname?.startsWith('/dashboard') || pathname === '/disease-detect') {
    return null;
  }

  return <Navbar />;
}
