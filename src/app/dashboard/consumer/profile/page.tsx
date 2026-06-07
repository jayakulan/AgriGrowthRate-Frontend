'use client';

import { useEffect, useState, useRef } from 'react';
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
  X,
  Save,
  Loader2,
  Camera,
  Trash2,
  Shield,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function ConsumerProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile states (no dummy default data fallbacks)
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop');

  // Payment method states
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');

  // Password modal states
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    setUpdatingPassword(true);
    try {
      const response = await api.put('/auth/update-password', {
        currentPassword,
        newPassword
      });
      if (response.data && response.data.success) {
        toast.success('Password updated successfully! 🔐');
        setShowUpdatePasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to update password');
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Notification states
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [orderMessages, setOrderMessages] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  // Sync details from database-backed context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      if (user.avatar) {
        setAvatar(user.avatar);
      }
    }
  }, [user]);

  // Load custom payment cards and notifications from persistent localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem('agri_cards');
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        console.error('Failed to parse cards from storage', e);
      }
    }

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

  // Handler for image file upload -> base64
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Avatar size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success('Profile avatar loaded! Click Save Changes to apply. 🥑');
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Save
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Full name is required');
      return;
    }
    setSaving(true);
    try {
      const response = await api.put('/auth/profile', { name, phone, address, avatar });
      if (response.data && response.data.success) {
        updateUser(response.data.data);
        setIsEditing(false);
        toast.success('Consumer profile changes saved successfully! 🛒');
      } else {
        toast.error('Failed to save profile changes');
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to save profile changes';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Add Card Submission
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedNum = newCardNumber.replace(/\s/g, '');
    if (cleanedNum.length < 15) {
      toast.error('Please enter a valid card number');
      return;
    }
    if (newCardExpiry.length < 5) {
      toast.error('Please enter expiry details in MM/YY format');
      return;
    }

    const last4 = cleanedNum.slice(-4);
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      last4,
      expiry: newCardExpiry,
      isDefault: cards.length === 0,
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem('agri_cards', JSON.stringify(updatedCards));

    // Reset fields
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvv('');
    setShowAddCardModal(false);
    toast.success('Payment card saved successfully! 💳');
  };

  // Delete Card
  const handleDeleteCard = (cardId: string) => {
    const updatedCards = cards.filter((c) => c.id !== cardId);
    // If we deleted default, set another default
    if (updatedCards.length > 0 && !updatedCards.some((c) => c.isDefault)) {
      updatedCards[0].isDefault = true;
    }
    setCards(updatedCards);
    localStorage.setItem('agri_cards', JSON.stringify(updatedCards));
    toast.success('Payment method removed successfully.');
  };

  // Toggle Notification preferences
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

  // Device log out
  const handleSignOutAll = async () => {
    if (window.confirm('Are you sure you want to sign out of all devices?')) {
      try {
        await logout();
        toast.success('Signed out of all devices successfully');
        window.location.href = '/login';
      } catch (e) {
        toast.error('Failed to log out of all devices');
      }
    }
  };

  // Account Deactivation
  const handleDeactivate = async () => {
    const confirmation = window.confirm(
      'WARNING: Are you sure you want to deactivate your account? This will permanently delete your user profile and all saved data. This action cannot be undone.'
    );
    if (confirmation) {
      try {
        const response = await api.delete('/auth/profile');
        if (response.data && response.data.success) {
          toast.success("Account deactivated successfully. We're sad to see you go! 🥬");
          await logout();
          window.location.href = '/login';
        }
      } catch (err) {
        toast.error('Failed to deactivate account. Please try again.');
      }
    }
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* ── Top Profile Card ───────────────────────────────── */}
      <div className="bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatar}
              alt={`${name || 'User'} Profile`}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#e2fbe9]"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#1e4d1e] hover:bg-[#163d16] text-white rounded-full flex items-center justify-center border-2 border-white transition-colors shadow-sm"
              title="Change Profile Avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1e4d1e]">{name || 'Guest User'}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sustainable Consumer • Member
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-[#e2fbe9] text-[#1e4d1e] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                Verified Buyer
              </span>
              <span className="bg-[#f4f5f0] text-gray-600 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                Top Buyer
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Edit Profile Actions */}
        <div className="flex gap-2 w-full md:w-auto">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  if (user) {
                    setName(user.name || '');
                    setPhone(user.phone || '');
                    setAddress(user.address || '');
                    setAvatar(user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop');
                  }
                }}
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
                  <p className="text-sm text-gray-500">{name || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div className="w-full">
                <p className="text-xs font-bold text-gray-900 mb-1">Email Address</p>
                <p className="text-sm text-gray-500">{email || 'Not provided'}</p>
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
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-sm text-gray-500">{phone || 'Not added yet'}</p>
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

        {/* ── Payments & Security Column ────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* ── Payments Card ── */}
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-sm text-left">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#1e4d1e]">Payments</h2>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4 max-h-[160px] overflow-y-auto mb-4 pr-1">
              {cards.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No saved cards.</p>
              ) : (
                cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-[#f4f5f0] border border-[#e4e6df] rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-[#1e4d1e]" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">•••• {card.last4}</p>
                        <p className="text-[10px] text-gray-500">EXPIRES {card.expiry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.isDefault && (
                        <span className="bg-[#e2fbe9] text-[#1e4d1e] text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Default
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowAddCardModal(true)}
              className="w-full border border-dashed border-[#d1d5db] text-gray-500 hover:text-gray-800 hover:border-gray-400 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Method
            </button>
          </div>

          {/* ── Security Card ── */}
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-8 shadow-sm text-left">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#1e4d1e]">Security</h2>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowUpdatePasswordModal(true)}
                className="w-full flex items-center justify-between p-3 border border-[#e4e6df] hover:border-[#1e4d1e] rounded-xl text-left bg-gray-50/50 transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-gray-900">Update Password</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Change your account password</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
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
                  placeholder="Enter delivery address"
                />
              ) : (
                <p className="text-[12px] text-gray-600 font-bold leading-relaxed whitespace-pre-line">
                  {address || 'No delivery address saved yet.'}
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
              <div
                onClick={() => handleTogglePref('priceAlerts')}
                className={`w-10 h-6 rounded-full p-1 cursor-pointer flex transition-all duration-200 ${
                  priceAlerts ? 'bg-[#1e4d1e] justify-end' : 'bg-gray-200 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-0.5">New Order Messages</p>
                <p className="text-[11px] text-gray-500">Instant push notification for direct chats</p>
              </div>
              <div
                onClick={() => handleTogglePref('orderMessages')}
                className={`w-10 h-6 rounded-full p-1 cursor-pointer flex transition-all duration-200 ${
                  orderMessages ? 'bg-[#1e4d1e] justify-end' : 'bg-gray-200 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-0.5">Newsletter & Updates</p>
                <p className="text-[11px] text-gray-500">Weekly sustainable farming insights</p>
              </div>
              <div
                onClick={() => handleTogglePref('newsletter')}
                className={`w-10 h-6 rounded-full p-1 cursor-pointer flex transition-all duration-200 ${
                  newsletter ? 'bg-[#1e4d1e] justify-end' : 'bg-gray-200 justify-start'
                }`}
              >
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
          <button
            onClick={handleSignOutAll}
            className="flex-1 sm:flex-none border border-[#fca5a5] text-[#b91c1c] hover:bg-[#fef2f2] px-6 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
          >
            Sign Out All Devices
          </button>
          <button
            onClick={handleDeactivate}
            className="flex-1 sm:flex-none bg-[#b91c1c] hover:bg-[#991b1b] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
          >
            Deactivate Account
          </button>
        </div>
      </div>

      {/* ── Add Card Modal ────────────────────────────────── */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[#1e4d1e] mb-4">Add Payment Method</h3>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={newCardNumber}
                  onChange={(e) => {
                    const val = e.target.value
                      .replace(/\D/g, '')
                      .replace(/(.{4})/g, '$1 ')
                      .trim();
                    setNewCardNumber(val);
                  }}
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-xs font-semibold text-gray-800 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={newCardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) {
                        val = val.slice(0, 2) + '/' + val.slice(2, 4);
                      }
                      setNewCardExpiry(val);
                    }}
                    className="w-full px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-xs font-semibold text-gray-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="123"
                    value={newCardCvv}
                    onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-xs font-semibold text-gray-800 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1e4d1e] hover:bg-[#163d16] text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Update Password Modal ────────────────────────── */}
      {showUpdatePasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-left">
            <button
              onClick={() => {
                setShowUpdatePasswordModal(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#f4f5f0]">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#1e4d1e]">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#1e4d1e] uppercase tracking-wider">Update Password</h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-lg text-xs font-bold text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-lg text-xs font-bold text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-lg text-xs font-bold text-gray-800 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdatePasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 bg-[#f4f5f0] hover:bg-[#e4e6df] text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="flex-1 bg-[#1e4d1e] hover:bg-[#163d16] text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {updatingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
