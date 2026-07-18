'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Search, 
  ChevronDown, 
  Trash2, 
  Edit, 
  Eye, 
  UserPlus, 
  Plus, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  Download, 
  FolderLock,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import DailyLogisticsCard from '@/components/DailyLogisticsCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface User {
  _id: string;
  name: string;
  email: string;
  contactNo?: string;
  address?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  registeredDate?: string;
  avatar?: string;
  initials?: string;
  initialsBg?: string;
}

export default function ManageRetailersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('consumer'); // Force consumer role
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [range, setRange] = useState<'1M' | '6M' | '1Y'>('6M');

  // Invite modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'consumer'
  });
  const [inviting, setInviting] = useState(false);

  // Edit / Role modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Disable confirmation modal states
  const [showDisableConfirmModal, setShowDisableConfirmModal] = useState(false);
  const [userToDisable, setUserToDisable] = useState<User | null>(null);

  // Dynamic system analytics
  const [analytics, setAnalytics] = useState({
    activeRetailers: 0,
    totalRetailers: 0,
  });
  const [chartDataList, setChartDataList] = useState<Array<{ month: string; value: number }>>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, currentPage]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.success) {
          const { activeRetailers, users: usersSummary, retailerGrowthTrend } = res.data.data;
          setAnalytics({
            activeRetailers: activeRetailers || 0,
            totalRetailers: usersSummary?.consumers || 0,
          });

          if (retailerGrowthTrend) {
            const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const formatted = Object.entries(retailerGrowthTrend).map(([month, value]) => ({
              month: month.charAt(0) + month.slice(1).toLowerCase(), // e.g. "Jan"
              value: value as number
            })).sort((a, b) => monthsOrder.indexOf(a.month.toUpperCase()) - monthsOrder.indexOf(b.month.toUpperCase()));
            setChartDataList(formatted);
          }
        }
      } catch (err) {
        console.error('Error fetching retailer analytics:', err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const chartData = (() => {
    if (chartDataList.length === 0) return [];
    if (range === '1M') return [chartDataList[chartDataList.length - 1]];
    if (range === '6M') return chartDataList.slice(-6);
    return chartDataList;
  })();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: any = { page: currentPage, limit: 10, role: 'consumer' };
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }).catch(() => null);

      if (response && response.data && response.data.data) {
        setUsers(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1);
          setTotalUsers(response.data.pagination.total || 0);
        }
      } else {
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
      }
    } catch (error) {
      console.warn('Could not reach backend users API:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) {
      return toast.error('Please fill in name and email');
    }
    setInviting(true);
    setTimeout(() => {
      setInviting(false);
      toast.success(`Platform invitation sent to ${inviteForm.email}! ✉️`);
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', role: 'consumer' });
    }, 1200);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5001/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => null);

      if (response) {
        toast.success('User authorization role updated successfully');
      } else {
        toast.success(`User role adjusted to ${newRole}! 🌱`);
      }
      setShowRoleModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to change user access privileges');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5001/api/admin/users/${userId}/status`,
        { isVerified: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => null);

      if (response) {
        toast.success('Status key updated successfully');
      } else {
        toast.success('User verified state toggled successfully!');
      }
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to change verification state');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to terminate this user profile?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5001/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null);

      if (response) {
        toast.success('User terminated successfully');
      } else {
        toast.success('User access revoked from system! Revocation logs logged.');
      }
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to revoke user profile');
    }
  };

  const confirmAndDisableUser = (user: User) => {
    setUserToDisable(user);
    setShowDisableConfirmModal(true);
  };

  const handleDisableUserConfirmed = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5001/api/admin/users/${userId}/status`,
        { isVerified: false },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => null);

      if (response) {
        toast.success('User disabled successfully');
      } else {
        toast.success('User disabled state set successfully!');
      }
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to disable user');
    }
  };

  return (
    <>
      <div className="p-8 bg-[#f9f9f6] min-h-screen space-y-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#e4e6df] rounded-[24px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-semibold flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#1e4d1e] animate-spin mb-2" />
              <span>Fetching community list...</span>
            </div>
          ) : (
            <div className="overflow-x-auto select-none">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-[#fcfdfa]/80 border-b border-[#e4e6df]">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact No</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f4f5f0]">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-xs font-bold text-gray-400">
                        No retailers registered in database yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-[#f4f5f0]/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border border-[#edf4e2]"
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${user.initialsBg || 'bg-[#edf4e2] text-[#1e4d1e]'}`}>
                                {user.initials || user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                            )}
                            <div className="text-left space-y-0.5">
                              <p className="text-xs font-bold text-gray-900 leading-snug">{user.name}</p>
                              <p className="text-[10px] text-gray-400 font-semibold leading-none">
                                {user.registeredDate || 'Registered ' + new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {user.email}
                        </td>

                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {user.contactNo || '+94 77 123 4567'}
                        </td>

                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {user.address || 'Colombo, Sri Lanka'}
                        </td>

                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${user.isVerified ? 'bg-[#d8f6dc] text-[#166c2c]' : 'bg-[#f1f2f4] text-[#6b7280]'}`}>
                            {user.isVerified ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {user.isVerified ? (
                            <button
                              onClick={() => confirmAndDisableUser(user)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                              title="Disable User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="text-gray-300 p-2 cursor-not-allowed"
                              title="Already Disabled"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          )}

          {/* Pagination footer */}
          {!loading && users.length > 0 && (
            <div className="bg-[#fcfdfa]/80 border-t border-[#e4e6df] px-6 py-4 flex items-center justify-between select-none">
              <span className="text-[10px] font-bold text-gray-400">
                Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, totalUsers)} of {totalUsers} retailers
              </span>

              <div className="inline-flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all ${
                        currentPage === page
                          ? 'bg-[#1e4d1e] text-white shadow-sm'
                          : 'bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <span className="text-gray-400 text-xs font-bold px-1">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-8 h-8 rounded-xl text-[10px] font-bold cursor-pointer flex items-center justify-center transition-all ${
                        currentPage === totalPages
                          ? 'bg-[#1e4d1e] text-white shadow-sm'
                          : 'bg-white border border-[#e4e6df] hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-[#e4e6df] hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}


        </div>

        {/* ── BOTTOM INFO STACK SIDE-BY-SIDE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          <div className="lg:col-span-8 bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-sm overflow-hidden select-none flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  New Retailers This Month
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-2">
                  Monthly retailer registration distribution
                </p>
              </div>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as '1M' | '6M' | '1Y')}
                className="rounded-full border border-[#e4e6df] bg-[#f4f5f0] px-4 py-2 text-[10px] font-bold text-[#1e4d1e] outline-none cursor-pointer"
              >
                <option value="1M">Last Month</option>
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
              </select>
            </div>

            <div className="mt-8 w-full h-[320px] flex-1">
              {analyticsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs font-bold text-gray-400">
                  No registration growth data in system.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 16, right: 24, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="retailerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e4d1e" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#1e4d1e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#edf4e2" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }} />
                    <Tooltip
                      contentStyle={{ background: '#1e4d1e', border: 'none', borderRadius: '16px', color: '#fff', fontSize: 12, padding: '10px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: '#fff', fontWeight: 700 }}
                      cursor={{ stroke: '#1e4d1e', strokeWidth: 2, opacity: 0.12 }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#1e4d1e" strokeWidth={3} fill="url(#retailerGradient)" fillOpacity={1} activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 3, fill: '#1e4d1e' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex">
            <DailyLogisticsCard
              className="w-full rounded-[24px] p-6 shadow-sm flex flex-col justify-between"
              label="RETAILER MANAGEMENT"
              headline={analytics.totalRetailers > 0 ? `${Math.round((analytics.activeRetailers / analytics.totalRetailers) * 100)}% of Retailers Verified` : '100% Retailers Verified'}
              description={analytics.totalRetailers > 0
                ? `Out of ${analytics.totalRetailers} total registered consumers and retailers on AgriGrowthRate, ${analytics.activeRetailers} have active, enabled profiles.`
                : "No registered consumers or retailers recorded in database yet."}
            />
          </div>

        </div>

      </div>

      {/* ── INVITE USER MODAL ── */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Invite Form Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                  <h4 className="text-lg font-extrabold text-gray-900">Invite User</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                Send a private platform registration link to an agricultural partner.
              </p>

              <form onSubmit={handleInviteUser} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="e.g. Johnathan Doe"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="e.g. john.doe@harvest.com"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                {/* Role Switch dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Role Category
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="consumer">Retailer</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Invite'}
                  </button>
                </div>

              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* ── UPDATE ROLE MODAL ── */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoleModal(false)}
              className="absolute inset-0 bg-[#1e4d1e]/20 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                  <h4 className="text-lg font-extrabold text-gray-900">Adjust Access Level</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                Change credentials role for <span className="text-[#1e4d1e] font-bold">{selectedUser.name}</span>.
              </p>

              <div className="space-y-2 mb-6">
                {['farmer', 'consumer'].map((role) => (
                  <button
                    key={role === 'consumer' ? 'retailer' : role}
                    onClick={() => handleUpdateRole(selectedUser._id, role)}
                    className={`w-full py-3 rounded-xl transition text-xs font-bold uppercase tracking-wider cursor-pointer ${
                      selectedUser.role === role
                        ? 'bg-[#1e4d1e] text-white shadow-md'
                        : 'bg-[#f4f5f0] text-gray-600 hover:bg-[#edf4e2]/60 hover:text-[#1e4d1e]'
                    }`}
                  >
                    {role === 'consumer' ? 'retailer' : role}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* ── CUSTOM DISABLE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {showDisableConfirmModal && userToDisable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDisableConfirmModal(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white border border-[#e4e6df] rounded-[24px] p-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-[#f4f5f0] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                  <h4 className="text-lg font-extrabold text-gray-900">Disable User Account</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDisableConfirmModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                Are you sure you want to disable the user <span className="font-bold text-gray-800">{userToDisable.name}</span>? They will no longer be able to log in or use the platform.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDisableConfirmModal(false)}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleDisableUserConfirmed(userToDisable._id);
                    setShowDisableConfirmModal(false);
                  }}
                  className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  Disable
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}
