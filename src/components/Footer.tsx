'use client';

import Link from 'next/link';
import { Sprout, Mail } from 'lucide-react';
import { FaXTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa6';

const footerLinks = {
  Platform: [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Disease Detect', href: '/disease-detect' },
    { label: 'AI Advisory', href: '/ai-advisory' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#1e3a1e] bg-[#0a0f0a] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Agri<span className="text-green-400">GrowthRate</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Empowering farmers with AI-powered crop disease detection, smart recommendations, and a digital marketplace.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { Icon: FaXTwitter, href: '#', id: 'footer-twitter' },
                { Icon: FaGithub, href: '#', id: 'footer-github' },
                { Icon: FaLinkedinIn, href: '#', id: 'footer-linkedin' },
                { Icon: Mail, href: 'mailto:support@agrigrowthrate.com', id: 'footer-email' },
              ].map(({ Icon, href, id }) => (
                <a
                  key={id}
                  id={id}
                  href={href}
                  className="w-9 h-9 rounded-lg border border-green-900/30 flex items-center justify-center text-gray-500 hover:text-green-400 hover:border-green-700 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-semibold text-white mb-3">{group}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-green-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1e3a1e] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} AgriGrowthRate. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span className="pulse-dot w-2 h-2" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
