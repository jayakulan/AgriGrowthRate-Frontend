'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import {
  MapPin,
  Edit2,
  Camera,
  User as UserIcon,
  Store,
  Shield,
  ChevronRight,
  X,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Sri Lanka');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256');

  // Stats states
  const [farmersCount, setFarmersCount] = useState(0);
  const [consumersCount, setConsumersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Sync user info
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || 'Sri Lanka');
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  // Fetch admin-specific details and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get admin profile details
        const profRes = await api.get('/admin/profile').catch(() => null);
        if (profRes && profRes.data && profRes.data.data) {
          const d = profRes.data.data;
          setName(d.name || '');
          setEmail(d.email || '');
          setPhone(d.phone || '');
          setAddress(d.address || 'Sri Lanka');
          if (d.avatar) setAvatar(d.avatar);
        }

        // Get analytics count for Platform Overview
        const statsRes = await api.get('/admin/analytics').catch(() => null);
        if (statsRes && statsRes.data && statsRes.data.success) {
          setFarmersCount(statsRes.data.data.users.farmers || 0);
          setConsumersCount(statsRes.data.data.users.consumers || 0);
        }
      } catch (e) {
        console.warn('Failed to load admin profile info:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New Password and Confirm Password do not match');
      return;
    }
    setChangingPassword(true);
    try {
      const response = await api.put('/auth/update-password', { currentPassword, newPassword }).catch((e) => e.response);
      if (response && response.data && response.data.success) {
        toast.success('Password updated successfully!');
        setIsPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response?.data?.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/admin/profile', { name, phone, address, avatar }).catch(() => null);
      if (response && response.data && response.data.success) {
        updateUser(response.data.data);
        toast.success('Profile updated successfully!');
      } else {
        updateUser({ name, phone, address, avatar });
        toast.success('Profile updated (simulated)!');
      }
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatarUrl = reader.result as string;
        setAvatar(newAvatarUrl);
        try {
          const response = await api.put('/admin/profile', { name, phone, address, avatar: newAvatarUrl }).catch(() => null);
          if (response && response.data && response.data.success) {
            updateUser(response.data.data);
            toast.success('Avatar updated!');
          } else {
            updateUser({ name, phone, address, avatar: newAvatarUrl });
            toast.success('Avatar updated (locally)!');
          }
        } catch (error) {
          console.error(error);
          toast.success('Avatar updated (locally)!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-[#f9f9f6]">
        <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin mb-4" />
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Admin Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f9f9f6] p-8 font-sans">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      <div className="max-w-4xl mx-auto space-y-6">

        {/* TOP HEADER CARD */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative overflow-hidden">
          {/* Background subtle gradient matching original mockup */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#f9f9f6] to-transparent opacity-50 rounded-bl-[100px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 z-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={handleChangeAvatar}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-lg flex items-center justify-center border-2 border-white transition-colors shadow-sm"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[#1e4d1e]">{name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                <span className="bg-[#1e4d1e] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  ADMIN
                </span>
                <div className="flex items-center text-gray-500 text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {address.split(',').pop()?.trim() || 'Sri Lanka'}
                </div>
              </div>
            </div>
          </div>

          <div className="z-10">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#1e4d1e] text-[#1e4d1e] hover:bg-[#1e4d1e] hover:text-white transition-colors text-sm font-bold"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

          {/* LEFT COLUMN */}
          <div className="flex flex-col">

            {/* Personal Information Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f4f6ee]">
                <UserIcon className="w-5 h-5 text-[#4a6d2f]" />
                <h2 className="text-[20px] font-bold text-[#4a6d2f]">Personal Information</h2>
              </div>

              <div className="space-y-6 flex-1 text-left">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm text-gray-800 font-bold">{name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-sm text-gray-800 font-bold">{email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-gray-800 font-bold">{phone || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Address</p>
                  <p className="text-sm text-gray-800 font-bold leading-relaxed">{address}</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Platform Activity Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f4f6ee]">
                <Store className="w-5 h-5 text-[#4a6d2f]" />
                <h2 className="text-[20px] font-bold text-[#4a6d2f]">Platform Overview</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">

                {/* Registered Farmers */}
                <div className="bg-[#f8fae5] border border-[#eff1da] rounded-2xl p-5 text-left">
                  <p className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-wider">Farmers</p>
                  <p className="text-2xl font-bold text-[#1e4d1e]">{farmersCount}</p>
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#1e4d1e] w-1/2 rounded-full" />
                  </div>
                </div>

                {/* Registered Consumers */}
                <div className="bg-[#f8fae5] border border-[#eff1da] rounded-2xl p-5 text-left">
                  <p className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-wider">Consumers</p>
                  <p className="text-2xl font-bold text-[#1e4d1e]">{consumersCount}</p>
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#1e4d1e] w-1/3 rounded-full" />
                  </div>
                </div>

              </div>

              <button onClick={() => router.push('/dashboard/admin/farmers')} className="w-full py-3.5 rounded-xl border border-[#e4e6df] text-[#4a6d2f] text-sm font-bold hover:bg-[#f4f6ee] transition-colors cursor-pointer">
                Manage Farmers
              </button>
            </div>

            {/* Security & Access Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#f4f6ee]">
                <Shield className="w-5 h-5 text-[#4a6d2f]" />
                <h2 className="text-[20px] font-bold text-[#4a6d2f]">Security & Access</h2>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-4 border border-[#e4e6df] rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Password Change</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-xl overflow-hidden relative">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#f4f6ee] border border-[#e4e6df] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#1e4d1e]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#f4f6ee] border border-[#e4e6df] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#1e4d1e]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Mailing Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-[#f4f6ee] border border-[#e4e6df] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#1e4d1e] resize-none h-24"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-xl overflow-hidden relative">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#f4f6ee] border border-[#e4e6df] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#1e4d1e]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#f4f6ee] border border-[#e4e6df] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#1e4d1e]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#f4f6ee] border border-[#e4e6df] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#1e4d1e]"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}