'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Lock, Bell, Shield, Eye, EyeOff, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

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

const AdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.data);
      setFormData({
        name: response.data.data.name,
        phone: response.data.data.phone || '',
        address: response.data.data.address || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/admin/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    // This would be an API call in production
    toast.success('Password changed successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center h-full">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </AdminLayout>
    );
  }

  const activityLogs = [
    { action: 'Login', ip: '192.168.1.100', time: '2 hours ago' },
    { action: 'Updated Product Status', ip: '192.168.1.100', time: '5 hours ago' },
    { action: 'Approved User', ip: '192.168.1.100', time: '1 day ago' },
    { action: 'Viewed Reports', ip: '192.168.1.100', time: '2 days ago' },
  ];

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Security</h1>
          <p className="text-gray-600 mt-2">Manage your admin account settings and security preferences.</p>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Admin Info Card */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Admin Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {!editMode ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                    {profile?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Admin Name</p>
                    <p className="text-xl font-bold text-gray-900">{profile?.name}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Email Address</p>
                  <p className="text-gray-900">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Phone Number</p>
                  <p className="text-gray-900">{profile?.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Role</p>
                  <p className="text-gray-900 font-semibold">{profile?.role}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Member Since</p>
                  <p className="text-gray-900">{new Date(profile?.createdAt || '').toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <Lock className="text-blue-500" size={24} />
                <h3 className="font-bold text-gray-900">Security Level</h3>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-semibold text-gray-900">85%</span>
              </div>
              <p className="text-xs text-gray-600">Strong security configuration</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="text-green-500" size={24} />
                <h3 className="font-bold text-gray-900">Last Active</h3>
              </div>
              <p className="text-sm text-gray-900">2 hours ago</p>
              <p className="text-xs text-gray-600 mt-2">From 192.168.1.100</p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Change Password */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="text-green-500" size={24} />
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="text-blue-500" size={24} />
              <h2 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h2>
            </div>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                Two-factor authentication adds an extra layer of security to your account by requiring a code in addition to your password when logging in.
              </p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-900 font-medium">Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFAEnabled}
                  onChange={(e) => setTwoFAEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {twoFAEnabled ? 'Enabled via authenticator app' : 'Disabled'}
            </p>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition">
              {twoFAEnabled ? 'Manage' : 'Enable'} 2FA
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="text-orange-500" size={24} />
            <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Order Alerts', desc: 'Notify when orders are placed' },
              { name: 'Product Updates', desc: 'Notify when products change status' },
              { name: 'User Activity', desc: 'Notify about user signups/changes' },
              { name: 'System Alerts', desc: 'Notify about system issues' },
            ].map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{notif.name}</p>
                  <p className="text-sm text-gray-600">{notif.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <p className="text-gray-900 font-medium">{log.action}</p>
                  <p className="text-sm text-gray-600">IP: {log.ip}</p>
                </div>
                <p className="text-sm text-gray-600">{log.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
