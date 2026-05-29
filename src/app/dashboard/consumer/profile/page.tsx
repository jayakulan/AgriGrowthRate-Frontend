'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import {
  Edit3,
  User,
  Settings,
  CreditCard,
  Plus,
  MapPin,
  Bell,
  ChevronRight,
  X,
  Save,
  Loader2,
  Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConsumerProfilePage() {
  const { user } = useAuth();
  
  // Dynamic profile states
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('Julian Sterling');
  const [email, setEmail] = useState('julian.sterling@agri-growth.com');
  const [phone, setPhone] = useState('+1 (555) 012-3456');
  const [address, setAddress] = useState('122 Oakwood Trail, Salem, OR 97301');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1595858688461-8f5bc289569e?w=150&h=150&fit=crop');

  useEffect(() => {
    if (user) {
      setName(user.name || 'Julian Sterling');
      setEmail(user.email || 'julian.sterling@agri-growth.com');
      setPhone(user.phone || '+1 (555) 012-3456');
      setAddress(user.address || '122 Oakwood Trail, Salem, OR 97301');
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put('/auth/profile', { name, phone, address, avatar }).catch(() => null);
      if (response && response.data && response.data.success) {
        // Sync local storage state
        const updatedUser = { ...user, name, phone, address, avatar };
        localStorage.setItem('agri_user', JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success('Consumer profile changes saved successfully! 🛒');
      } else {
        // Graceful simulated update if backend isn't up
        const updatedUser = { ...user, name, phone, address, avatar };
        localStorage.setItem('agri_user', JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success('Consumer profile changes simulated successfully! 🌿');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
      
      {/* ── Top Profile Card ───────────────────────────────── */}
      <div className="bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatar}
              alt={`${name} Profile`}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#e2fbe9]"
            />
            <button 
              onClick={() => {
                const newAvatarUrl = prompt("Enter Image URL for profile avatar:", avatar);
                if (newAvatarUrl) {
                  setAvatar(newAvatarUrl);
                  toast.success("Profile avatar url loaded! 🥑");
                }
              }}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-full flex items-center justify-center border-2 border-white transition-colors shadow-sm"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1e4d1e]">{name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sustainable Consumer • Member since June 2022
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-[#e2fbe9] text-[#1e4d1e] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                Verified Buyer
              </span>
              <span className="bg-[#f4f5f0] text-gray-600 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                Top Buyer 2023
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Edit Profile Actions */}
        <div className="flex gap-2 w-full md:w-auto">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 md:flex-none bg-[#f4f5f0] hover:bg-[#e4e6df] text-gray-700 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-[#e4e6df] transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 md:flex-none bg-[#1e4d1e] hover:bg-[#163d16] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#1e4d1e] hover:bg-[#163d16] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm w-full md:w-auto justify-center"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* ── Account Settings (Spans 2 cols) ───────────────── */}
        <div className="md:col-span-2 bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#1e4d1e]">Account Settings</h2>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between group">
              <div className="w-full">
                <p className="text-xs font-bold text-gray-900 mb-1">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-xs font-bold text-gray-800 outline-none"
                  />
                ) : (
                  <p className="text-sm text-gray-500">{name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div className="w-full">
                <p className="text-xs font-bold text-gray-900 mb-1">Email Address</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between group">
              <div className="w-full">
                <p className="text-xs font-bold text-gray-900 mb-1">Phone Number</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-xs font-bold text-gray-800 outline-none"
                  />
                ) : (
                  <p className="text-sm text-gray-500">{phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div className="w-full">
                <p className="text-xs font-bold text-gray-900 mb-1">Password</p>
                <p className="text-sm text-gray-500 tracking-widest">••••••••••••</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Payments ──────────────────────────────────────── */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#1e4d1e]">Payments</h2>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>

          <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-xl p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-[#1e4d1e]" />
              <div>
                <p className="text-sm font-bold text-gray-900">•••• 4421</p>
                <p className="text-[10px] text-gray-500">EXPIRES 12/26</p>
              </div>
            </div>
            <span className="bg-[#e4e6df] text-gray-600 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              Default
            </span>
          </div>

          <button className="w-full border border-dashed border-[#d1d5db] text-gray-500 hover:text-gray-800 hover:border-gray-400 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add New Method
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* ── Saved Addresses ───────────────────────────────── */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#1e4d1e]">Saved Addresses</h2>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-xl p-4 relative group">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#1e4d1e]" />
                <span className="text-xs font-bold text-gray-900">Delivery Address</span>
              </div>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-white border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-xs font-semibold text-gray-800 outline-none resize-none leading-relaxed"
                />
              ) : (
                <p className="text-[12px] text-gray-600 font-bold leading-relaxed whitespace-pre-line">
                  {address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Notifications ─────────────────────────────────── */}
        <div className="bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#1e4d1e]">Notifications</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-0.5">Market Price Alerts</p>
                <p className="text-[11px] text-gray-500">Notify when crop prices change by &gt; 5%</p>
              </div>
              {/* Toggle switch mock */}
              <div className="w-10 h-6 bg-[#1e4d1e] rounded-full p-1 cursor-pointer flex justify-end">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-0.5">New Order Messages</p>
                <p className="text-[11px] text-gray-500">Instant push notification for direct chats</p>
              </div>
              <div className="w-10 h-6 bg-[#1e4d1e] rounded-full p-1 cursor-pointer flex justify-end">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-0.5">Newsletter & Updates</p>
                <p className="text-[11px] text-gray-500">Weekly sustainable farming insights</p>
              </div>
              <div className="w-10 h-6 bg-gray-200 rounded-full p-1 cursor-pointer flex justify-start">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Account Security ──────────────────────────────── */}
      <div className="bg-[#fdf8f6] border border-[#fce8e6] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#b91c1c] mb-1">Account Security</h2>
          <p className="text-sm text-gray-600">Manage your login devices and data privacy</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none border border-[#fca5a5] text-[#b91c1c] hover:bg-[#fef2f2] px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
            Sign Out All Devices
          </button>
          <button className="flex-1 sm:flex-none bg-[#b91c1c] hover:bg-[#991b1b] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
            Deactivate Account
          </button>
        </div>
      </div>

    </div>
  );
}
