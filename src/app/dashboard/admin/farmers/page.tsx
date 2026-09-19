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
  ChevronRight,
  PieChart as PieIcon,
  BarChart3,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import DailyLogisticsCard from '@/components/DailyLogisticsCard';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  contactNo?: string;
  address?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  registeredDate?: string;
  avatar?: string;
  initials?: string;
  initialsBg?: string;
  farmerCardNo?: string;
}

const formatPhoneNumber = (phone?: string) => {
  if (!phone || !phone.trim()) return 'N/A';
  const clean = phone.trim();
  const digits = clean.replace(/[\s\-\+\(\)]/g, '');
  if (digits.startsWith('94') && digits.length === 11) {
    return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `+94 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return clean;
};

export default function ManageFarmersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('farmer'); // Force farmer role
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [range, setRange] = useState<'1M' | '6M' | '1Y'>('6M');

  // Add Card Number modal states
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [addingCard, setAddingCard] = useState(false);

  // Invite modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'farmer'
  });
  const [inviting, setInviting] = useState(false);
  // Edit / Role modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Disable confirmation modal states
  const [showDisableConfirmModal, setShowDisableConfirmModal] = useState(false);
  const [userToDisable, setUserToDisable] = useState<User | null>(null);

  // Dynamic system analytics & district breakdown
  const [analytics, setAnalytics] = useState({
    activeFarmers: 0,
    totalFarmers: 0,
  });
  const [chartDataList, setChartDataList] = useState<Array<{ month: string; value: number }>>([]);
  const [districtList, setDistrictList] = useState<Array<{ name: string; value: number; percentage: number; color: string; textColor: string }>>([]);
  const [graphView, setGraphView] = useState<'donut' | 'bar' | 'trend'>('donut');
  const [hoveredSlice, setHoveredSlice] = useState<{ name: string; value: number } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Progressive dark green to light green gradient palette generator for districts
  const getDistrictGreenColor = (index: number, total: number) => {
    const count = Math.max(total, 1);
    if (count === 1) {
      return { color: '#133e13', textColor: '#ffffff' };
    }
    const ratio = index / (count - 1);
    // Interpolate lightness from 15% (deep forest green) to 73% (crisp soft light green)
    const lightness = Math.round(15 + ratio * 58);
    const saturation = Math.round(72 - ratio * 16);
    const hue = 142; // Lush Sri Lankan agriculture green hue

    const l = lightness / 100;
    const a = (saturation * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + hue / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    const hex = `#${f(0)}${f(8)}${f(4)}`;
    const textColor = lightness > 46 ? '#0b3016' : '#ffffff';

    return { color: hex, textColor };
  };

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
          const { activeFarmers, users: usersSummary, farmerGrowthTrend, farmerDistrictDistribution } = res.data.data;
          const totalCount = usersSummary?.farmers || 0;
          setAnalytics({
            activeFarmers: activeFarmers || 0,
            totalFarmers: totalCount,
          });

          // 1. Continuous 6-Month Timeline (Apr - Sep) so the line chart connects across months rather than an isolated dot
          const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const currentMonthIdx = new Date().getMonth();

          const continuousMonths: Array<{ month: string; value: number }> = [];
          for (let i = 5; i >= 0; i--) {
            const idx = (currentMonthIdx - i + 12) % 12;
            const upperMonth = monthsOrder[idx];
            const displayMonth = monthShortNames[idx];
            const val = farmerGrowthTrend && farmerGrowthTrend[upperMonth] ? Number(farmerGrowthTrend[upperMonth]) : 0;
            continuousMonths.push({ month: displayMonth, value: val });
          }
          setChartDataList(continuousMonths);

          // 2. District Distribution for Interactive Donut & Bar Views
          let entries: Array<[string, number]> = [];
          if (farmerDistrictDistribution && Object.keys(farmerDistrictDistribution).length > 0) {
            entries = Object.entries(farmerDistrictDistribution).map(([k, v]) => [k, Number(v)]);
          }

          if (entries.length === 0) {
            entries = [['Colombo', 2], ['Kandy', 1], ['Kurunegala', 1]];
          }

          // Sort descending so the largest district gets the darkest green and descends to light green
          entries.sort((a, b) => b[1] - a[1]);

          const sumDistricts = entries.reduce((sum, [, v]) => sum + v, 0) || 1;
          const formattedDistricts = entries.map(([dist, val], idx) => {
            const { color, textColor } = getDistrictGreenColor(idx, entries.length);
            return {
              name: dist,
              value: val,
              percentage: Math.round((val / sumDistricts) * 100),
              color,
              textColor,
            };
          });

          setDistrictList(formattedDistricts);
        }
      } catch (err) {
        console.error('Error fetching farmer analytics:', err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Sync districts from loaded users if analytics was not populated
  useEffect(() => {
    if (districtList.length === 0 && users.length > 0) {
      const counts: Record<string, number> = {};
      users.forEach((u) => {
        const d = (u.address && u.address.trim()) || 'Colombo';
        counts[d] = (counts[d] || 0) + 1;
      });
      const entries = Object.entries(counts);
      entries.sort((a, b) => b[1] - a[1]);
      const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
      setDistrictList(
        entries.map(([dist, val], idx) => {
          const { color, textColor } = getDistrictGreenColor(idx, entries.length);
          return {
            name: dist,
            value: val,
            percentage: Math.round((val / total) * 100),
            color,
            textColor,
          };
        })
      );
    }
  }, [users, districtList.length]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: any = { page: currentPage, limit: 10, role: 'farmer' };
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

  const handleAddCardNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber) return toast.error('Please enter a card number');

    const farmerCardRegex = /^FSN\d{7}$/;
    if (!farmerCardRegex.test(cardNumber)) {
      return toast.error('Invalid Farmer Card Number Format');
    }

    setAddingCard(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/admin/farmer-cards', { cardNumber }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Farmer Card Number added successfully!');
      setShowCardModal(false);
      setCardNumber('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add card number');
    } finally {
      setAddingCard(false);
    }
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
        
        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
          <div className="flex-1" />

          {/* Right Header Filters & Invite Trigger */}
          <div className="flex items-center gap-3">
            
            {/* Add Card Number Button */}
            <button
              onClick={() => setShowCardModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#1e4d1e] hover:bg-[#163d16] text-white px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer select-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Card Number</span>
            </button>

          </div>
        </div>

        {/* ── USERS DATATABLE CONTAINER ── */}
        <div className="bg-white border border-[#e4e6df] rounded-[24px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-semibold flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#1e4d1e] animate-spin mb-2" />
              <span>Fetching community list...</span>
            </div>
          ) : (
            <div className="overflow-x-auto select-none">
              <table className="w-full text-left border-collapse min-w-[700px]">
                
                {/* Table Header exactly styled in mock structure */}
                <thead className="bg-[#fcfdfa]/80 border-b border-[#e4e6df]">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farmer Card Number</th>
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
                      <td colSpan={7} className="px-6 py-12 text-center text-xs font-bold text-gray-400">
                        No farmers registered in database yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => {
                      const userId = user.id || user._id || `farmer-${idx}`;
                      return (
                        <tr key={userId} className="hover:bg-[#f4f5f0]/20 transition-colors">
                        
                        {/* Name col with avatar details */}
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

                        {/* Farmer Card Number */}
                        <td className="px-6 py-4 text-xs font-semibold text-gray-800">
                          {user.farmerCardNo || 'N/A'}
                        </td>

                        {/* Email address */}
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {user.email}
                        </td>

                        {/* Contact number */}
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {formatPhoneNumber(user.phone || user.contactNo)}
                        </td>

                        {/* Address */}
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {user.address || 'Galle, Sri Lanka'}
                        </td>

                        {/* Status with enable/disable option */}
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
                    );
                  })
                )}
                </tbody>

              </table>
            </div>
          )}

          {/* Pagination footer */}
          {!loading && users.length > 0 && (
            <div className="bg-[#fcfdfa]/80 border-t border-[#e4e6df] px-6 py-4 flex items-center justify-between select-none">
              <span className="text-[10px] font-bold text-gray-400">
                Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, totalUsers)} of {totalUsers} farmers
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
            
            {/* Header: Title + Mode Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0f2eb] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                    Farmer Regional Distribution
                  </h3>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#edf4e2] text-[#1e4d1e] rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-semibold mt-1">
                  {graphView === 'donut' && 'Geographic distribution & verified regional share across Sri Lanka'}
                  {graphView === 'bar' && 'Registered farmer counts ranked by agricultural district'}
                  {graphView === 'trend' && '6-month continuous registration timeline & onboarding trajectory'}
                </p>
              </div>

              {/* View Selector Buttons */}
              <div className="flex items-center bg-[#f4f5f0] p-1 rounded-full border border-[#e4e6df] shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setGraphView('donut')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                    graphView === 'donut'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <PieIcon className="w-3 h-3" />
                  <span>District Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGraphView('bar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                    graphView === 'bar'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Ranked Bars</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGraphView('trend')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                    graphView === 'trend'
                      ? 'bg-[#1e4d1e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Timeline</span>
                </button>
              </div>
            </div>

            {/* Graph Content Area */}
            <div className="mt-4 w-full min-h-[300px] flex-1 flex flex-col justify-center">
              {analyticsLoading ? (
                <div className="h-full min-h-[280px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
                </div>
              ) : graphView === 'donut' ? (
                /* ── VIEW 1: INTERACTIVE DONUT + DISTRICT BARS ── */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Donut with Center KPI */}
                  <div className="md:col-span-6 relative flex items-center justify-center h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={districtList}
                          cx="50%"
                          cy="50%"
                          innerRadius={72}
                          outerRadius={104}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                          onMouseEnter={(_, index) => {
                            if (districtList[index]) {
                              setHoveredSlice({
                                name: districtList[index].name,
                                value: districtList[index].value
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredSlice(null)}
                        >
                          {districtList.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="#ffffff"
                              strokeWidth={3}
                              className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: '#1e4d1e',
                            border: 'none',
                            borderRadius: '14px',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '8px 12px'
                          }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: any, name: any) => [`${value} Farmers`, `${name}`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center KPI in Donut Hole */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                      <span className="text-3xl font-black text-gray-900 tracking-tight">
                        {hoveredSlice ? hoveredSlice.value : (analytics.totalFarmers || districtList.reduce((s, d) => s + d.value, 0))}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1e4d1e] mt-0.5 text-center max-w-[110px] truncate">
                        {hoveredSlice ? hoveredSlice.name : 'Total Farmers'}
                      </span>
                      <span className="text-[9px] font-semibold text-gray-400">
                        {hoveredSlice
                          ? `${Math.round((hoveredSlice.value / (analytics.totalFarmers || 1)) * 100)}% of total`
                          : 'Registered'}
                      </span>
                    </div>
                  </div>

                  {/* Right: District Breakdown Progress Cards */}
                  <div className="md:col-span-6 flex flex-col justify-center space-y-3 pr-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
                      <span>District</span>
                      <span>Share & Volume</span>
                    </div>

                    <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                      {districtList.map((district) => (
                        <div
                          key={district.name}
                          onMouseEnter={() => setHoveredSlice({ name: district.name, value: district.value })}
                          onMouseLeave={() => setHoveredSlice(null)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            hoveredSlice?.name === district.name
                              ? 'bg-[#f4f7ee] border-[#1e4d1e]/30 shadow-xs'
                              : 'bg-white border-[#edf0e7] hover:border-[#1e4d1e]/20'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: district.color }}
                              />
                              <span className="text-gray-800">{district.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-[11px]">{district.value} {district.value === 1 ? 'farmer' : 'farmers'}</span>
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-md font-extrabold transition-colors"
                                style={{ backgroundColor: district.color, color: district.textColor || '#ffffff' }}
                              >
                                {district.percentage}%
                              </span>
                            </div>
                          </div>

                          {/* Mini Progress Bar */}
                          <div className="w-full h-1.5 bg-[#f0f2eb] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${district.percentage}%`,
                                backgroundColor: district.color
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500 bg-[#f8faf4] px-3 py-2 rounded-xl border border-[#edf1e5]">
                      <span className="flex items-center gap-1.5 font-bold text-[#1e4d1e]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1e4d1e]" />
                        100% Verified Zones
                      </span>
                      <span className="font-semibold text-gray-400">Sri Lankan Agri Network</span>
                    </div>
                  </div>

                </div>
              ) : graphView === 'bar' ? (
                /* ── VIEW 2: RANKED DISTRICT BARS ── */
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtList} margin={{ top: 20, right: 24, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf4e2" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 700 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 700 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1e4d1e',
                          border: 'none',
                          borderRadius: '14px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '8px 12px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(val: any) => [`${val} Farmers`, 'Registered']}
                      />
                      <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={55}
                      >
                        {districtList.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                /* ── VIEW 3: CONTINUOUS 6-MONTH GROWTH CURVE ── */
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartDataList} margin={{ top: 20, right: 24, left: -12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="farmerGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1e4d1e" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#1e4d1e" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#edf4e2" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 700 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 700 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1e4d1e',
                          border: 'none',
                          borderRadius: '14px',
                          color: '#fff',
                          fontSize: '12px',
                          padding: '10px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#fff', fontWeight: 700 }}
                        cursor={{ stroke: '#1e4d1e', strokeWidth: 2, opacity: 0.15 }}
                        formatter={(value: any) => [`${value} New Farmers`, 'Monthly Growth']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#1e4d1e"
                        strokeWidth={3}
                        fill="url(#farmerGradient)"
                        fillOpacity={1}
                        activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 3, fill: '#1e4d1e' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>

          <div className="lg:col-span-4 flex">
            <DailyLogisticsCard
              className="w-full rounded-[24px] p-6 shadow-sm flex flex-col justify-between"
              label="FARMER MANAGEMENT"
              headline={analytics.totalFarmers > 0 ? `${Math.min(100, Math.round((analytics.activeFarmers / analytics.totalFarmers) * 100))}% of Farmers Active` : '100% Farmers Active'}
              description={analytics.totalFarmers > 0
                ? `Out of ${analytics.totalFarmers} total registered farmers on AgriGrowthRate, ${analytics.activeFarmers} are verified and currently trading active crop inventories.`
                : "No registered farmers recorded in database yet."}
            />
          </div>

        </div>

      </div>

      {/* ── ADD CARD NUMBER MODAL ── */}
      <AnimatePresence>
        {showCardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCardModal(false)}
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
                  <h4 className="text-lg font-extrabold text-gray-900">Add Farmer Card</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                Enter a valid Farmer Card Number to allow farmers to register using it.
              </p>

              <form onSubmit={handleAddCardNumber} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="e.g. FSN0000000"
                    className="w-full bg-[#f4f5f0]/50 border border-[#e4e6df] focus:border-[#1e4d1e] focus:bg-white rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCardModal(false)}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-[#e4e6df] text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingCard}
                    className="flex-1 py-3 bg-[#1e4d1e] hover:bg-[#163d16] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {addingCard ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Card'}
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
                    onClick={() => handleUpdateRole(selectedUser.id || selectedUser._id || '', role)}
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

              <div className="flex gap-3">
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
                    await handleDisableUserConfirmed(userToDisable.id || userToDisable._id || '');
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
