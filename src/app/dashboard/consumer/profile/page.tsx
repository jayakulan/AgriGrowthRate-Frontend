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
  Bell,
  Shield,
  ChevronRight,
  X,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConsumerProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [name, setName] = useState('Consumer Name');
  const [email, setEmail] = useState('consumer@agrigrowth.com');
  const [phone, setPhone] = useState('+94 77 000 0000');
  const [address, setAddress] = useState('Colombo, Sri Lanka');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop');

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification states
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [orderMessages, setOrderMessages] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const router = useRouter();

  // Load from auth context
  useEffect(() => {
    if (user) {
      setName(user.name || 'Consumer Name');
      setEmail(user.email || 'consumer@agrigrowth.com');
      setPhone(user.phone || '+94 77 000 0000');
      setAddress(user.address || 'Colombo, Sri Lanka');
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  // Load notification preferences
  useEffect(() => {
    const savedPrefs = localStorage.getItem('agri_notification_prefs');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.priceAlerts !== undefined) setPriceAlerts(parsed.priceAlerts);
        if (parsed.orderMessages !== undefined) setOrderMessages(parsed.orderMessages);
        if (parsed.newsletter !== undefined) setNewsletter(parsed.newsletter);
      } catch (e) {
        console.error('Failed to parse notification preferences', e);
      }
    }
  }, []);

  const handleTogglePref = (prefKey: 'priceAlerts' | 'orderMessages' | 'newsletter') => {
    let updatedVal = false;
    if (prefKey === 'priceAlerts') {
      updatedVal = !priceAlerts;
      setPriceAlerts(updatedVal);
    } else if (prefKey === 'orderMessages') {
      updatedVal = !orderMessages;
      setOrderMessages(updatedVal);
    } else if (prefKey === 'newsletter') {
      updatedVal = !newsletter;
      setNewsletter(updatedVal);
    }

    const currentPrefs = {
      priceAlerts: prefKey === 'priceAlerts' ? updatedVal : priceAlerts,
      orderMessages: prefKey === 'orderMessages' ? updatedVal : orderMessages,
      newsletter: prefKey === 'newsletter' ? updatedVal : newsletter,
    };

    localStorage.setItem('agri_notification_prefs', JSON.stringify(currentPrefs));
    toast.success('Notification preferences updated successfully!');
  };

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
      const response = await api.put('/auth/profile', { name, phone, address, avatar }).catch(() => null);
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
    const newAvatarUrl = prompt("Enter Image URL for profile avatar:", avatar);
    if (newAvatarUrl) {
      setAvatar(newAvatarUrl);
      toast.success("Avatar updated!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f9f9f6] p-8 font-sans">
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
                  CONSUMER
                </span>
                <div className="flex items-center text-gray-500 text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {address.split(',')[0] || 'Location'}
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

              <div className="space-y-5 flex-1">
                <div>
                  <p className="text-[17px] text-gray-500 mb-1">Full Name</p>
                  <p className="text-sm text-gray-800 font-medium">{name}</p>
                </div>
                <div>
                  <p className="text-[17px] text-gray-500 mb-1">Email Address</p>
                  <p className="text-sm text-gray-800 font-medium">{email}</p>
                </div>
                <div>
                  <p className="text-[17px] text-gray-500 mb-1">Phone</p>
                  <p className="text-sm text-gray-800 font-medium">{phone}</p>
                </div>
                <div>
                  <p className="text-[17px] text-gray-500 mb-1">Address</p>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed max-w-[250px]">{address}</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Notifications Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f4f6ee]">
                <Bell className="w-5 h-5 text-[#4a6d2f]" />
                <h2 className="text-[20px] font-bold text-[#4a6d2f]">Notifications</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">Market Price Alerts</p>
                    <p className="text-xs text-gray-500">Notify when crop prices change</p>
                  </div>
                  <div
                    onClick={() => handleTogglePref('priceAlerts')}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer flex transition-all duration-200 ${priceAlerts ? 'bg-[#1e4d1e] justify-end' : 'bg-gray-200 justify-start'
                      }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">New Order Messages</p>
                    <p className="text-xs text-gray-500">Instant push notification for direct chats</p>
                  </div>
                  <div
                    onClick={() => handleTogglePref('orderMessages')}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer flex transition-all duration-200 ${orderMessages ? 'bg-[#1e4d1e] justify-end' : 'bg-gray-200 justify-start'
                      }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">Newsletter & Updates</p>
                    <p className="text-xs text-gray-500">Weekly sustainable farming insights</p>
                  </div>
                  <div
                    onClick={() => handleTogglePref('newsletter')}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer flex transition-all duration-200 ${newsletter ? 'bg-[#1e4d1e] justify-end' : 'bg-gray-200 justify-start'
                      }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
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
                  className="w-full flex items-center justify-between p-4 border border-[#e4e6df] rounded-2xl hover:bg-gray-50 transition-colors"
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
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
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
                  required
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
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
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
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
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
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
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
