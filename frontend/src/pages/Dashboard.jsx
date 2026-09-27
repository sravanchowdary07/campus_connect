import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Calendar,
  MessageSquareWarning,
  Search,
  BookOpen,
  ArrowUpRight,
  Clock,
  Sparkles,
  Bus,
  Coffee,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analRes, annRes, eveRes, compRes] = await Promise.all([
          API.get('/admin/analytics'),
          API.get('/announcements'),
          API.get('/events'),
          API.get('/complaints')
        ]);

        setAnalytics(analRes.data);
        setRecentAnnouncements(annRes.data.slice(0, 3));
        setUpcomingEvents(eveRes.data.slice(0, 3));
        setMyComplaints(compRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // "What's Happening Around Campus?" real-time stream items
  const campusHighlights = [
    { id: 1, icon: Bus, color: 'text-amber-500 bg-amber-50', text: 'Campus Bus Shuttle Route #2 arriving at Main Gate in 5 minutes', category: 'Transit' },
    { id: 2, icon: Coffee, color: 'text-emerald-500 bg-emerald-50', text: 'Central Canteen queue low (Est. wait time < 4 mins)', category: 'Canteen' },
    { id: 3, icon: Megaphone, color: 'text-indigo-500 bg-indigo-50', text: 'End Semester Exam Schedule published by Dean Office', category: 'Announcement' },
    { id: 4, icon: Calendar, color: 'text-purple-500 bg-purple-50', text: 'HackCampus 2.0 hackathon registration ends tomorrow', category: 'Event' },
    { id: 5, icon: CheckCircle2, color: 'text-blue-500 bg-blue-50', text: 'Hostel Block B Wi-Fi Maintenance completed successfully', category: 'Status' }
  ];

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs font-semibold">
        Loading personalized dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-100 mb-3">
              <Sparkles size={14} className="text-amber-300" />
              <span>CampusConnect Live Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {user?.name}! 👋
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
              Here is your daily campus overview for {user?.department} • {user?.role.toUpperCase()}. Stay informed and connected.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/campus-map"
              className="px-4 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-50 transition shadow-md flex items-center gap-1.5"
            >
              <MapPin size={16} /> View Campus Map
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        <Link to="/announcements" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Announcements</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition">
              <Megaphone size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{analytics?.announcements || 0}</p>
          <span className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 mt-1">
            Browse all <ChevronRight size={12} />
          </span>
        </Link>

        <Link to="/events" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Events</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition">
              <Calendar size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{analytics?.events || 0}</p>
          <span className="text-[11px] text-purple-600 font-medium flex items-center gap-1 mt-1">
            Upcoming <ChevronRight size={12} />
          </span>
        </Link>

        <Link to="/complaints" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Complaints</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition">
              <MessageSquareWarning size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{analytics?.complaints?.total || 0}</p>
          <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
            {analytics?.complaints?.pending || 0} Pending <ChevronRight size={12} />
          </span>
        </Link>

        <Link to="/lost-found" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Lost & Found</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition">
              <Search size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{analytics?.lostFound || 0}</p>
          <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
            Active posts <ChevronRight size={12} />
          </span>
        </Link>

        <Link to="/study-resources" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Study Materials</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
              <BookOpen size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{analytics?.studyResources || 0}</p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            Digital library <ChevronRight size={12} />
          </span>
        </Link>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Cols: What's Happening & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* What's Happening Around Campus Ticker Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                <h2 className="font-extrabold text-slate-900 text-sm">
                  What's Happening Around Campus?
                </h2>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Live Feed
              </span>
            </div>

            <div className="space-y-3">
              {campusHighlights.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition">
                    <div className={`p-2 rounded-xl ${item.color} shrink-0`}>
                      <ItemIcon size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-800">{item.text}</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">{item.category} • Updated just now</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Announcements Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-indigo-600" />
                <h2 className="font-extrabold text-slate-900 text-sm">Latest Campus Announcements</h2>
              </div>
              <Link to="/announcements" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentAnnouncements.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent announcements</p>
              ) : (
                recentAnnouncements.map((ann) => (
                  <div key={ann._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 transition">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ann.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {ann.priority.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">{ann.category}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900">{ann.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{ann.content}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                      <span>By {ann.author?.name || 'Administration'}</span>
                      <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right 1-Col: Upcoming Events & My Complaints */}
        <div className="space-y-6">
          
          {/* Upcoming Events Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-purple-600" />
                <h2 className="font-extrabold text-slate-900 text-sm">Upcoming Events</h2>
              </div>
              <Link to="/events" className="text-xs text-purple-600 font-bold hover:underline">
                Explore
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No upcoming events</p>
              ) : (
                upcomingEvents.map((evt) => (
                  <div key={evt._id} className="p-3.5 rounded-2xl border border-slate-100 bg-purple-50/30">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {evt.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1.5">{evt.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock size={12} /> {new Date(evt.date).toLocaleDateString()} • {evt.time}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin size={12} /> {evt.venue}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Grievances Status */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareWarning size={18} className="text-amber-600" />
                <h2 className="font-extrabold text-slate-900 text-sm">My Active Complaints</h2>
              </div>
              <Link to="/complaints" className="text-xs text-amber-600 font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {myComplaints.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No complaints submitted</p>
              ) : (
                myComplaints.map((comp) => (
                  <div key={comp._id} className="p-3.5 rounded-2xl border border-slate-100 bg-amber-50/20">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        comp.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                        comp.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {comp.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400">{comp.category}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mt-1.5">{comp.title}</h4>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
