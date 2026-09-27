import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Building,
  Mail,
  Lock,
  Phone,
  CheckCircle,
  XCircle,
  Trash2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // users, create_faculty, analytics

  // Create Faculty Form State
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    password: 'password123',
    employeeId: '',
    department: 'Computer Science',
    phone: ''
  });
  const [facultyMsg, setFacultyMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [uRes, aRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/analytics')
      ]);
      setUsersList(uRes.data);
      setAnalytics(aRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setFacultyMsg({ type: '', text: '' });
    try {
      const res = await API.post('/admin/create-faculty', facultyForm);
      setFacultyMsg({ type: 'success', text: res.data.message });
      setFacultyForm({
        name: '',
        email: '',
        password: 'password123',
        employeeId: '',
        department: 'Computer Science',
        phone: ''
      });
      fetchData();
    } catch (err) {
      setFacultyMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create faculty account' });
    }
  };

  const handleToggleUserStatus = async (id, currentStatus, currentRole) => {
    try {
      await API.put(`/admin/users/${id}`, { isActive: !currentStatus });
      fetchData();
    } catch (err) {
      alert('Error updating user status');
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await API.put(`/admin/users/${id}`, { role: newRole });
      fetchData();
    } catch (err) {
      alert('Error updating user role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Administrator Control Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage users, provision faculty accounts, audit campus grievances, and inspect system metrics.
          </p>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            User Directory ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('create_faculty')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'create_faculty' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <UserPlus size={14} /> Add Faculty
          </button>
        </div>
      </div>

      {/* Analytics Counter Row */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500">Total Students</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.students}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500">Faculty Members</span>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{analytics.faculty}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500">Pending Complaints</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{analytics.complaints?.pending || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500">Resolved Complaints</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{analytics.complaints?.resolved || 0}</p>
          </div>
        </div>
      )}

      {/* Tab 1: User Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-sm">All Campus Users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">ID Code</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                        className="bg-slate-100 font-bold text-slate-800 rounded-lg px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{user.department}</td>
                    <td className="p-3.5 text-slate-500">{user.studentId || user.employeeId || 'N/A'}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserStatus(user._id, user.isActive, user.role)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          user.isActive ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {user.isActive ? 'Disable' : 'Enable'}
                      </button>
                      {user._id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Provision Faculty Account */}
      {activeTab === 'create_faculty' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 max-w-xl mx-auto space-y-4">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">Provision Faculty Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Faculty accounts cannot self-register publicly and must be authorized by an Administrator.
            </p>
          </div>

          {facultyMsg.text && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              facultyMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {facultyMsg.text}
            </div>
          )}

          <form onSubmit={handleCreateFaculty} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Full Name *</label>
              <input
                type="text"
                required
                value={facultyForm.name}
                onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                placeholder="Prof. Sarah Jenkins"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Email *</label>
                <input
                  type="email"
                  required
                  value={facultyForm.email}
                  onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                  placeholder="faculty@campusconnect.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password *</label>
                <input
                  type="password"
                  required
                  value={facultyForm.password}
                  onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                <select
                  value={facultyForm.department}
                  onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID Code</label>
                <input
                  type="text"
                  value={facultyForm.employeeId}
                  onChange={(e) => setFacultyForm({ ...facultyForm, employeeId: e.target.value })}
                  placeholder="EMP-102"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={facultyForm.phone}
                onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-purple-200"
            >
              Create Faculty Account
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
