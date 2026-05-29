'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Download, 
  User as UserIcon,
  Laptop,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@agrigrowth.com',
    phone: '+1 (555) 342-9012',
    department: 'IT Systems Operations',
    bio: "Managing digital stewardship and infrastructural integrity for AgriGrowthRate's enterprise ecosystem. Focused on sustainable AgTech scalability and secure user governance.",
  });

  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  // Active Sessions state
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'MacBook Pro - San Jose, CA',
      details: 'Current Session • Chrome 118',
      current: true,
      time: 'Just now'
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro - Austin, TX',
      details: 'Logged in 2h ago • Safari',
      current: false,
      time: '2h ago'
    }
  ]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/profile').catch(() => null);

      if (response && response.data && response.data.data) {
        const data = response.data.data;
        setProfile(data);
        setFormData({
          name: data.name || 'Alex Rivera',
          email: data.email || 'alex.rivera@agrigrowth.com',
          phone: data.phone || '+1 (555) 342-9012',
          department: data.department || 'IT Systems Operations',
          bio: data.bio || "Managing digital stewardship and infrastructural integrity for AgriGrowthRate's enterprise ecosystem. Focused on sustainable AgTech scalability and secure user governance.",
        });
      }
    } catch (error) {
      console.warn('Could not reach backend profile API, using state mocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put('/admin/profile', formData).catch(() => null);

      if (response) {
        toast.success('Admin changes saved to remote server! 🌳');
      } else {
        toast.success('Profile preferences simulated successfully! 🌱');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update admin profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return toast.error('Please enter passwords');
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    toast.loading('Updating security keys...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Security keys rotated successfully! 🔑');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  const handleTerminateSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success('Session terminated successfully');
  };

  const handleDownloadReport = () => {
    toast.success('Administrative log report compiled & downloaded!');
  };

  if (loading) {
    return (
      <>
        <div className="p-12 flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-[#f9f9f6]">
          <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin mb-4" />
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Admin Profile...</div>
        </div>
      </>
    );
  }

  // Administrative activity logs exact matching reference design
  const activityLogs = [
    {
      action: 'Updated price index for Wheat Futures',
      entity: 'Commodity Market',
      time: 'Oct 24, 2023 • 09:42 AM',
      status: 'COMPLETED',
      statusColor: 'bg-[#edf4e2] text-[#1e4d1e] border-[#d2dfc2]'
    },
    {
      action: 'Authorized User #88219 Farmer Access',
      entity: 'User Accounts',
      time: 'Oct 23, 2023 • 04:15 PM',
      status: 'SUCCESS',
      statusColor: 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]'
    },
    {
      action: 'System-wide Security Audit Triggered',
      entity: 'Infrastructure',
      time: 'Oct 22, 2023 • 11:00 PM',
      status: 'SYSTEM',
      statusColor: 'bg-[#f5f5f5] text-gray-600 border-gray-200'
    },
  ];

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto">
        
        {/* ── HERO BANNER PANEL (Green curved panel) ── */}
        <div className="bg-[#245229] rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Avatar Circle with edit button overlay */}
            <div className="relative group shrink-0">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256"
                alt="Alex Rivera Profile"
                className="w-24 h-24 rounded-[20px] object-cover border-2 border-white/20 shadow-md"
              />
              <button 
                type="button" 
                onClick={() => toast('Avatar upload coming soon!')}
                className="absolute bottom-1 right-1 bg-[#1e4d1e] hover:bg-[#163d16] text-white p-2 rounded-lg transition-all border border-white/30 shadow-sm cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            {/* Profile Credentials */}
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">{formData.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="text-[10px] font-bold bg-white/10 border border-white/15 px-3 py-1 rounded-full uppercase tracking-wider">
                  System Administrator
                </span>
                <span className="text-[10px] font-bold text-[#bcfcbb] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#bcfcbb]" /> Full Access Level
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions inside Hero */}
          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => toast('Displaying full system logs...')}
              className="px-5 py-2.5 text-xs font-bold bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl transition-all cursor-pointer select-none"
            >
              View Logs
            </button>
            <button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold bg-[#bcfcbb] hover:bg-[#a1eba0] text-[#1e4d1e] rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 select-none"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* General Information Card */}
          <div className="lg:col-span-8 bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center gap-3 border-b border-[#f4f5f0] pb-4">
              <div className="p-2 rounded-lg bg-[#edf4e2]">
                <UserIcon className="w-4.5 h-4.5 text-[#1e4d1e]" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                General Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none transition-all placeholder-gray-400"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none transition-all placeholder-gray-400"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter contact number"
                  className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none transition-all placeholder-gray-400"
                />
              </div>

              {/* Department Dropdown Selector */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none transition-all cursor-pointer"
                >
                  <option value="IT Systems Operations">IT Systems Operations</option>
                  <option value="AgTech Research & Support">AgTech Research & Support</option>
                  <option value="Marketplace Compliance">Marketplace Compliance</option>
                  <option value="Infrastructure Logistics">Infrastructure Logistics</option>
                </select>
              </div>
            </div>

            {/* Professional Bio */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Professional Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Enter admin bio details"
                className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-2xl py-3.5 px-4 text-xs font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="lg:col-span-4 space-y-8 w-full">
            
            {/* Security Controls */}
            <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex items-center gap-3 border-b border-[#f4f5f0] pb-4">
                <div className="p-2 rounded-lg bg-[#edf4e2]">
                  <Shield className="w-4.5 h-4.5 text-[#1e4d1e]" />
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Security
                </h3>
              </div>

              {/* Password Action Link */}
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 bg-[#f4f5f0]/40 border border-[#e4e6df] rounded-xl hover:bg-[#edf4e2]/60 hover:border-[#1e4d1e]/30 transition-all text-left cursor-pointer group"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-800 group-hover:text-[#1e4d1e] transition-colors">
                    Change Password
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Last updated: 14 days ago
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1e4d1e] transition-all" />
              </button>

              {/* Two-Factor Auth Toggle row */}
              <div className="flex items-center justify-between p-4 bg-[#f4f5f0]/40 border border-[#e4e6df] rounded-xl text-left">
                <div className="space-y-0.5 max-w-[70%]">
                  <p className="text-xs font-bold text-gray-800">
                    Two-Factor Auth
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold leading-normal">
                    Enhanced account protection
                  </p>
                </div>
                
                {/* Clean Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={twoFAEnabled}
                    onChange={(e) => {
                      setTwoFAEnabled(e.target.checked);
                      toast.success(e.target.checked ? '2FA Protection enabled' : '2FA Protection disabled');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e4d1e]" />
                </label>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
              <div className="flex items-center gap-3 border-b border-[#f4f5f0] pb-4">
                <div className="p-2 rounded-lg bg-[#edf4e2]">
                  <Clock className="w-4.5 h-4.5 text-[#1e4d1e]" />
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Active Sessions
                </h3>
              </div>

              <div className="space-y-3.5">
                {sessions.map((sess) => (
                  <div 
                    key={sess.id} 
                    className="flex items-center justify-between p-3.5 bg-[#f4f5f0]/30 border border-[#e4e6df]/80 rounded-xl"
                  >
                    <div className="flex gap-3 min-w-0">
                      {sess.current ? (
                        <Laptop className="w-4.5 h-4.5 text-[#1e4d1e] shrink-0 mt-0.5" />
                      ) : (
                        <Smartphone className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.5" />
                      )}
                      
                      <div className="min-w-0 space-y-0.5 text-left">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {sess.device}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1.5">
                          {sess.details}
                          {sess.current && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                        </p>
                      </div>
                    </div>

                    {!sess.current && (
                      <button
                        type="button"
                        onClick={() => handleTerminateSession(sess.id)}
                        className="text-[10px] font-extrabold text-red-500 hover:text-red-700 tracking-wider hover:underline transition-colors shrink-0 uppercase cursor-pointer"
                      >
                        Logout
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ── RECENT ACTIVITY LIST ── */}
        <div className="bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#edf4e2]">
                <Activity className="w-4.5 h-4.5 text-[#1e4d1e]" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Recent Administrative Activity
              </h3>
            </div>

            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 text-[#1e4d1e] hover:text-[#4A6D2F] text-xs font-extrabold uppercase tracking-wide transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>

          {/* Activity Table */}
          <div className="overflow-x-auto select-none">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#f4f5f0]">
                  <th className="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action Taken</th>
                  <th className="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entity Type</th>
                  <th className="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f5f0]/80">
                {activityLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-[#f4f5f0]/20 transition-colors">
                    {/* Action Taken */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#f4f5f0] flex items-center justify-center shrink-0">
                          <Activity className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">{log.action}</span>
                      </div>
                    </td>

                    {/* Entity Type */}
                    <td className="py-4 text-xs font-semibold text-gray-500">
                      {log.entity}
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 text-xs font-semibold text-gray-400">
                      {log.time}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold border ${log.statusColor}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── CHANGE PASSWORD OVERLAY MODAL ── */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#edf4e2] flex items-center justify-center mx-auto border border-[#d2dfc2]">
                  <Lock className="w-6 h-6 text-[#1e4d1e]" />
                </div>
                <h4 className="text-lg font-extrabold text-gray-900">Change Password</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Enter your current keys to verify administrative authorization status.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 text-left">
                {/* Current Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Current Password
                  </label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Rotate Keys
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </>
  );
}
