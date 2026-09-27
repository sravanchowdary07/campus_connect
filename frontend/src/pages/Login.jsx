import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('student@campusconnect.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-3">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to access your CampusConnect portal</p>
        </div>

        {/* Demo Quick Logins */}
        <div className="mb-6 p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 text-center mb-2">
            ⚡ Demo Accounts Quick Select:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => handleQuickDemo('student@campusconnect.edu', 'password123')}
              className="py-1.5 px-2 bg-white rounded-xl border border-indigo-200 text-indigo-700 font-semibold text-[11px] hover:bg-indigo-100 transition shadow-xs text-center"
            >
              🎓 Student
            </button>
            <button
              onClick={() => handleQuickDemo('faculty@campusconnect.edu', 'password123')}
              className="py-1.5 px-2 bg-white rounded-xl border border-indigo-200 text-indigo-700 font-semibold text-[11px] hover:bg-indigo-100 transition shadow-xs text-center"
            >
              📚 Faculty
            </button>
            <button
              onClick={() => handleQuickDemo('admin@campusconnect.edu', 'admin123')}
              className="py-1.5 px-2 bg-white rounded-xl border border-indigo-200 text-indigo-700 font-semibold text-[11px] hover:bg-indigo-100 transition shadow-xs text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campusconnect.edu"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          New Student?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Register for an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
