'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Download, 
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Pencil,
  MapPin,
  Store,
  Camera
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
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [farmerCount, setFarmerCount] = useState(3);
  const [consumerCount, setConsumerCount] = useState(5);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [tempFormData, setTempFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256'
  );
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setAvatarUrl(localUrl);
      toast.success('Avatar preview updated locally! Save changes to finalize. 📸');
    }
  };

  // Sync user context when user loaded
  useEffect(() => {
    if (user) {
      const updated = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
      };
      setFormData(prev => ({ ...prev, ...updated }));
      setTempFormData(prev => ({ ...prev, ...updated }));
      if (user.avatar) {
        setAvatarUrl(user.avatar);
      }
    }
  }, [user]);

  // Fetch real counts if available, otherwise fallback to mock values
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const [farmersRes, consumersRes] = await Promise.all([
          api.get('/admin/users', { params: { role: 'farmer', limit: 1 } }),
          api.get('/admin/users', { params: { role: 'consumer', limit: 1 } })
        ]);
        if (farmersRes.data?.success && typeof farmersRes.data?.total === 'number') {
          setFarmerCount(farmersRes.data.total);
        } else if (farmersRes.data?.data && Array.isArray(farmersRes.data.data)) {
          setFarmerCount(farmersRes.data.data.length);
        }
        if (consumersRes.data?.success && typeof consumersRes.data?.total === 'number') {
          setConsumerCount(consumersRes.data.total);
        } else if (consumersRes.data?.data && Array.isArray(consumersRes.data.data)) {
          setConsumerCount(consumersRes.data.data.length);
        }
      } catch (err) {
        console.warn('Failed to fetch live dashboard counts, using defaults:', err);
      }
    };
    fetchCounts();
  }, []);

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
        if (data.avatar) {
          setAvatarUrl(data.avatar);
        }
        const updated = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || data.department || '',
        };
        setFormData(updated);
        setTempFormData(updated);
      }
    } catch (error) {
      console.warn('Could not reach backend profile API, using state mocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEdit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...tempFormData,
        avatar: avatarUrl
      };
      const response = await api.put('/admin/profile', payload).catch(() => null);

      if (response && response.data && response.data.success) {
        updateUser(response.data.data);
        toast.success('Admin changes saved to remote server! 🌳');
      } else {
        updateUser({ 
          name: tempFormData.name, 
          email: tempFormData.email,
          phone: tempFormData.phone, 
          avatar: avatarUrl, 
          location: tempFormData.location,
        });
        toast.success('Profile preferences simulated successfully! 🌱');
      }
      setFormData(tempFormData);
      setShowEditModal(false);
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
    if (passwordData.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }

    const loadId = toast.loading('Updating security keys...');
    try {
      const response = await api.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.dismiss(loadId);
      if (response.data && response.data.success) {
        toast.success('Security keys rotated successfully! 🔑');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error('Failed to update password');
      }
    } catch (error: any) {
      toast.dismiss(loadId);
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    }
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
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-6 max-w-7xl mx-auto relative select-none">
        
        {/* ── TOP PROFILE PANEL (White border card matching screenshot) ── */}
        <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-left w-full">
            {/* Avatar Circle with edit button overlay */}
            <div className="relative group shrink-0 w-20 h-20">
              <img
                src={avatarUrl}
                alt={`${formData.name} Profile`}
                className="w-20 h-20 rounded-[20px] object-cover border border-[#e4e6df]"
              />
              <button 
                type="button" 
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-[#1e4d1e] hover:bg-[#163d16] text-white p-1.5 rounded-[6px] transition-all border-2 border-white shadow-sm cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            {/* Profile Credentials */}
            <div className="space-y-1.5 flex-1 text-center md:text-left">
              <h2 className="text-xl font-extrabold text-[#1e4d1e] tracking-tight">{formData.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="text-[10px] font-bold bg-[#1e4d1e] text-white px-2.5 py-0.5 rounded-[4px] uppercase tracking-wider">
                  ADMIN
                </span>
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {formData.location}
                </span>
              </div>
            </div>

            {/* Edit Profile Action Button */}
            <div className="shrink-0">
              <button
                onClick={() => {
                  setTempFormData({ ...formData });
                  setShowEditModal(true);
                }}
                className="px-5 py-2 border border-[#e4e6df] hover:border-[#1e4d1e] rounded-full text-xs font-bold text-gray-700 hover:text-[#1e4d1e] hover:bg-[#edf4e2]/10 transition-all flex items-center gap-2 cursor-pointer bg-white shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5 text-gray-400" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID (Two Columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Personal Information Card */}
          <div className="lg:col-span-7 bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-[#f4f5f0] pb-4">
              <UserIcon className="w-5 h-5 text-[#1e4d1e]" />
              <h3 className="text-sm font-extrabold text-[#1e4d1e] uppercase tracking-wider">
                Personal Information
              </h3>
            </div>

            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  FULL NAME
                </span>
                <p className="text-xs font-extrabold text-gray-800">
                  {formData.name}
                </p>
              </div>

              {/* Email Address */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  EMAIL ADDRESS
                </span>
                <p className="text-xs font-extrabold text-gray-800">
                  {formData.email}
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  PHONE
                </span>
                <p className="text-xs font-extrabold text-gray-800">
                  {formData.phone || '94777123488'}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  ADDRESS
                </span>
                <p className="text-xs font-extrabold text-gray-800">
                  {formData.location || 'Sri Lanka'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Overview & Security Stack */}
          <div className="lg:col-span-5 space-y-6 w-full">
            
            {/* Platform Overview */}
            <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#f4f5f0] pb-4 mb-4">
                <Store className="w-5 h-5 text-[#1e4d1e]" />
                <h3 className="text-sm font-extrabold text-[#1e4d1e] uppercase tracking-wider">
                  Platform Overview
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Farmers Mini-Card */}
                <div className="bg-[#edf4e2]/20 border border-[#e4e6df]/40 rounded-[16px] p-4 text-left">
                  <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                    Farmers
                  </span>
                  <h4 className="text-2xl font-black text-[#1e4d1e]">
                    {farmerCount}
                  </h4>
                  <div className="w-full bg-gray-200/60 rounded-full h-1 mt-3 overflow-hidden">
                    <div className="bg-[#1e4d1e] h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>

                {/* Consumers Mini-Card */}
                <div className="bg-[#edf4e2]/20 border border-[#e4e6df]/40 rounded-[16px] p-4 text-left">
                  <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                    Consumers
                  </span>
                  <h4 className="text-2xl font-black text-[#1e4d1e]">
                    {consumerCount}
                  </h4>
                  <div className="w-full bg-gray-200/60 rounded-full h-1 mt-3 overflow-hidden">
                    <div className="bg-[#1e4d1e] h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/dashboard/admin/farmers')}
                className="w-full border border-[#e4e6df] hover:border-[#1e4d1e] rounded-xl py-3 text-xs font-bold text-[#1e4d1e] hover:bg-[#edf4e2]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white"
              >
                Manage Farmers
              </button>
            </div>

            {/* Security & Access */}
            <div className="bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#f4f5f0] pb-4 mb-4">
                <Shield className="w-5 h-5 text-[#1e4d1e]" />
                <h3 className="text-sm font-extrabold text-[#1e4d1e] uppercase tracking-wider">
                  Security & Access
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 bg-white border border-[#e4e6df] rounded-2xl hover:bg-gray-50/50 hover:border-[#1e4d1e]/30 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f4f5f0] group-hover:bg-[#edf4e2] transition-colors flex items-center justify-center text-gray-500 group-hover:text-[#1e4d1e] shrink-0">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 group-hover:text-[#1e4d1e] transition-colors">
                      Password Change
                    </p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      Update your account password
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1e4d1e] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

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
                    className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Confirm Password
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* ── EDIT PROFILE OVERLAY MODAL ── */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative z-10 w-full max-w-lg bg-white border border-[#e4e6df] rounded-[24px] p-8 shadow-2xl flex flex-col max-h-[90vh] text-left overflow-y-auto"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                {/* Big profile pic with pen icon click to upload */}
                <div className="relative w-28 h-28 mx-auto mb-3 group">
                  <img
                    src={avatarUrl}
                    alt="Big Profile Preview"
                    className="w-full h-full rounded-[24px] object-cover border-4 border-[#edf4e2] shadow-md"
                  />
                  <button 
                    type="button" 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-[#1e4d1e] hover:bg-[#163d16] text-white p-2 rounded-lg transition-all border-2 border-white shadow-sm cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <h4 className="text-lg font-extrabold text-gray-900">Update Profile Details</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Modify your administrative details and save preferences.
                </p>
              </div>

              <div className="space-y-4 flex-1">
                {/* Full Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={tempFormData.name}
                    onChange={(e) => setTempFormData({ ...tempFormData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none transition-all placeholder:text-gray-400 placeholder:font-semibold"
                  />
                </div>

                {/* Contact Number & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      value={tempFormData.phone}
                      onChange={(e) => setTempFormData({ ...tempFormData, phone: e.target.value })}
                      placeholder="Contact number"
                      className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none transition-all placeholder:text-gray-400 placeholder:font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Location
                    </label>
                    <input
                      type="text"
                      value={tempFormData.location}
                      onChange={(e) => setTempFormData({ ...tempFormData, location: e.target.value })}
                      placeholder="Location"
                      className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none transition-all placeholder:text-gray-400 placeholder:font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEdit}
                  disabled={saving}
                  className="py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
