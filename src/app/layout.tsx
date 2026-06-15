import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import NavbarWrapper from '@/components/NavbarWrapper';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AgriGrowthRate',
  description:
    'AI-powered agricultural marketplace for farmers and consumers. Detect crop diseases, get smart recommendations, and trade farm produce.',
  keywords: 'agriculture, crop disease detection, AI farming, marketplace, organic produce',
  openGraph: {
    title: 'AgriGrowthRate',
    description: 'Smart Agriculture Platform powered by AI',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="bg-[#f4f5f0] text-gray-900 min-h-screen">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a2e1a',
                color: '#e8f5e9',
                border: '1px solid #2d5a2d',
              },
            }}
          />
          <NavbarWrapper />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
