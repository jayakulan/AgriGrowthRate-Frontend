'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FarmerSidebar from '@/components/FarmerSidebar';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import {
  Sprout,
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  MessageSquare,
  Activity,
  Cpu,
  User as UserIcon,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Edit3,
  Camera,
  MapPin,
  Shield,
  ChevronRight,
  Map,
  CheckCircle,
  Loader2,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FarmerProfilePage() {
  const { user } = useAuth();
  const [harvestAlerts, setHarvestAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(false);

  // Dynamic profile states
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('Silas Thorne');
  const [email, setEmail] = useState('silas.thorne@agrigrowth.com');
  const [phone, setPhone] = useState('+1 (555) 824-9102');
  const [address, setAddress] = useState('Verdant Valley Estates, Plot 42-B, North Highlands, CA 95660');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop');

  useEffect(() => {
    if (user) {
      setName(user.name || 'Silas Thorne');
      setEmail(user.email || 'silas.thorne@agrigrowth.com');
      setPhone(user.phone || '+1 (555) 824-9102');
      setAddress(user.address || 'Verdant Valley Estates, Plot 42-B, North Highlands, CA 95660');
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put('/auth/profile', { name, phone, address, avatar }).catch(() => null);
      if (response && response.data && response.data.success) {
        // Sync local storage state
        const updatedUser = { ...user, name, phone, address, avatar };
        localStorage.setItem('agri_user', JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success('Farmer profile changes saved successfully! 🌾');
      } else {
        // Graceful simulated update if backend isn't up
        const updatedUser = { ...user, name, phone, address, avatar };
        localStorage.setItem('agri_user', JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success('Farmer profile changes simulated successfully! 🚜');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handleSecurityAction = (actionName: string) => {
    toast.success(`${actionName} settings loaded`);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to permanently deactivate your AgriGrowthRate account? This action is irreversible.')) {
      toast.error('Account deactivation requested.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f6] flex flex-col font-sans">
      
      <div className="flex flex-1">
        
        {/* ── Left Sidebar (Consistent Dashboard Theme) ───────── */}
        <FarmerSidebar activeMenu="Profile" />

        {/* ── Right Dashboard Layout ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <header className="h-16 border-b border-[#e4e6df] bg-white flex items-center justify-between px-8 shrink-0">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2 bg-[#f4f5f0] border border-[#e4e6df] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1e4d1e]"
              />
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-6">
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-[#e4e6df]" />

              {/* Profile Avatar */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">{name}</h4>
                  <span className="text-[10px] font-extrabold text-[#4A6D2F] tracking-wide uppercase">Master Farmer</span>
                </div>
                <img
                  src={avatar}
                  alt={`${name} Profile`}
                  className="w-9 h-9 rounded-full object-cover border border-[#e4e6df]"
                />
              </div>
            </div>
          </header>

          {/* Main Profile Content Panel */}
          <main className="flex-1 p-8 overflow-y-auto">
            
            {/* Header with edit button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
                  Profile Settings
                </h1>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Manage your agricultural identity and account preferences.
                </p>
              </div>

              {/* Edit Profile Action Buttons */}
              <div className="flex gap-2.5">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center justify-center gap-2 bg-[#f4f5f0] hover:bg-[#e4e6df] text-gray-700 px-5 py-3 rounded-xl font-bold text-sm border border-[#e4e6df] transition-colors shrink-0 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-colors shrink-0 cursor-pointer disabled:opacity-60"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center justify-center gap-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-colors shrink-0 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Split layout grids */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              
              {/* Left Column: Profile Card and Farm address box */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Profile detail card */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-6 shadow-sm">
                  
                  {/* Photo & core info stack */}
                  <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-[#f4f5f0]">
                    
                    {/* Big avatar image with camera badge overlay */}
                    <div className="relative group shrink-0 w-28 h-28 rounded-2xl overflow-hidden border border-[#e4e6df]">
                      <img
                        src={avatar}
                        alt={`${name} profile`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          const newAvatarUrl = prompt("Enter Image URL for profile avatar:", avatar);
                          if (newAvatarUrl) {
                            setAvatar(newAvatarUrl);
                            toast.success("Profile avatar url loaded! 🌱");
                          }
                        }}
                        className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white border border-[#e4e6df] flex items-center justify-center text-gray-500 hover:text-[#1e4d1e] transition-colors shadow-sm"
                        title="Upload photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Dynamic credentials inputs or texts */}
                    {isEditing ? (
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-left">
                        <div>
                          <label className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">Full Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-lg text-xs font-bold text-gray-800 outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">Contact Number</label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2 bg-[#f4f5f0] border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-lg text-xs font-bold text-gray-800 outline-none transition-colors"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full mt-1.5 px-3 py-2 bg-[#f4f5f0]/60 border border-[#e4e6df] rounded-lg text-xs font-bold text-gray-400 outline-none cursor-not-allowed"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-left">
                        <div>
                          <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">Full Name</span>
                          <h3 className="font-extrabold text-gray-900 text-lg mt-0.5">{name}</h3>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">Contact Number</span>
                          <h3 className="font-extrabold text-gray-900 text-base mt-0.5">{phone}</h3>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">Email Address</span>
                          <h3 className="font-bold text-gray-900 text-sm mt-0.5">{email}</h3>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Farm Address Details matches mock */}
                  <div className="pt-6 text-left">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-[#1e4d1e]" />
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Farm Address</h4>
                    </div>

                    {/* Nested Card */}
                    <div className="bg-[#f4f5f0] border border-[#e4e6df] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {isEditing ? (
                        <div className="space-y-1.5 w-full">
                          <label className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">Address Location</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#e4e6df] focus:border-[#1e4d1e] rounded-lg text-xs font-bold text-gray-800 outline-none"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-sm font-bold text-gray-900">{address}</p>
                          
                          {/* Verified badge */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 rounded-md text-[9px] font-extrabold text-[#1e4d1e] tracking-wider uppercase mt-1">
                            <CheckCircle className="w-3 h-3 text-[#1e4d1e]" />
                            <span>Verified Farmstead</span>
                          </div>
                        </div>
                      )}

                      {/* Map Thumbnail mockup visual */}
                      <div className="relative w-36 h-20 rounded-lg overflow-hidden border border-[#e4e6df] shrink-0 bg-gray-100 flex items-center justify-center group cursor-pointer shadow-sm">
                        <img
                          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=120&fit=crop"
                          alt="Farm location map"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white border border-[#e4e6df] flex items-center justify-center text-[#1e4d1e] shadow-sm">
                            <Map className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column: Security and Notifications cards */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Security Settings Card */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm text-left">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#f4f5f0]">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#1e4d1e]">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Security Settings</h4>
                  </div>

                  {/* Buttons stack */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSecurityAction('Password')}
                      className="w-full flex items-center justify-between p-3 border border-[#e4e6df] hover:border-[#1e4d1e] rounded-xl text-left bg-gray-50/50 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">Update Password</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Last changed 3 months ago</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => handleSecurityAction('Two-Factor')}
                      className="w-full flex items-center justify-between p-3 border border-[#e4e6df] hover:border-[#1e4d1e] rounded-xl text-left bg-gray-50/50 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">Two-Factor Auth</p>
                        <p className="text-[10px] text-[#4A6D2F] font-bold mt-0.5">Enabled</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Notifications settings card */}
                <div className="bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm text-left">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#f4f5f0]">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#1e4d1e]">
                      <Bell className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Notifications</h4>
                  </div>

                  {/* Alerts switches list */}
                  <div className="space-y-4 pt-1">
                    {/* Harvest Alerts */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-900">Harvest Alerts</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Get notified for peak ripeness</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHarvestAlerts(!harvestAlerts);
                          toast.success(`Harvest alerts turned ${!harvestAlerts ? 'ON' : 'OFF'}`);
                        }}
                        className={`w-10 h-6 rounded-full transition-colors relative ${
                          harvestAlerts ? 'bg-[#1e4d1e]' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          harvestAlerts ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* Market Updates */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-900">Market Updates</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Daily crop price fluctuations</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMarketUpdates(!marketUpdates);
                          toast.success(`Market updates turned ${!marketUpdates ? 'ON' : 'OFF'}`);
                        }}
                        className={`w-10 h-6 rounded-full transition-colors relative ${
                          marketUpdates ? 'bg-[#1e4d1e]' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          marketUpdates ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Section: Danger zone Account deactivation */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm text-left">
              <div>
                <h4 className="text-xs font-extrabold text-red-600 uppercase tracking-wide">Account Deactivation</h4>
                <p className="text-[11px] text-gray-400 font-semibold mt-1">
                  Permanently delete your AgriGrowthRate account and data
                </p>
              </div>

              {/* Danger Action Trigger */}
              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-extrabold text-xs rounded-xl transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                Delete Account
              </button>
            </div>

          </main>

          {/* Footer */}
          <footer className="h-16 border-t border-[#e4e6df] bg-[#f4f5f0]/50 shrink-0 flex items-center justify-between px-8 text-xs text-gray-400 font-semibold">
            <p>© 2024 AgriGrowthRate. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-800 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-gray-800 transition-colors">Support</Link>
            </div>
          </footer>

        </div>

      </div>

    </div>
  );
}
