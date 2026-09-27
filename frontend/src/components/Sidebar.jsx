import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  MapPin,
  MessageSquareWarning,
  Search,
  BookMarked,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['student', 'faculty', 'admin'] },
    { label: 'Announcements', path: '/announcements', icon: Megaphone, roles: ['student', 'faculty', 'admin'] },
    { label: 'Campus Events', path: '/events', icon: CalendarDays, roles: ['student', 'faculty', 'admin'] },
    { label: 'Campus Map', path: '/campus-map', icon: MapPin, roles: ['student', 'faculty', 'admin'] },
    { label: 'Complaints', path: '/complaints', icon: MessageSquareWarning, roles: ['student', 'faculty', 'admin'] },
    { label: 'Lost & Found', path: '/lost-found', icon: Search, roles: ['student', 'faculty', 'admin'] },
    { label: 'Study Resources', path: '/study-resources', icon: BookMarked, roles: ['student', 'faculty', 'admin'] }
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Control', path: '/admin', icon: ShieldCheck, roles: ['admin'] });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-3.5 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100/80">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
          <UserCheck size={16} />
          <span>Logged in as</span>
        </div>
        <p className="text-xs text-slate-800 font-bold mt-1.5 truncate">{user?.name}</p>
        <p className="text-[11px] text-slate-500 capitalize">{user?.role} • {user?.department}</p>
      </div>
    </aside>
  );
}
