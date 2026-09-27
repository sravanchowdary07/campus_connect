import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle,
  XCircle,
  X,
  Trash2,
  UserCheck
} from 'lucide-react';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState(null);

  // Create Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(100);

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events', {
        params: { category: selectedCategory }
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const handleRegisterToggle = async (eventId) => {
    try {
      const res = await API.post(`/events/${eventId}/register`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating registration');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await API.post('/events', {
        title,
        description,
        category,
        date,
        time,
        venue,
        maxCapacity
      });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setVenue('');
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Campus Events & Workshops</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover upcoming hackathons, tech seminars, sports events, and cultural festivals.
          </p>
        </div>

        {(user?.role === 'faculty' || user?.role === 'admin') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-purple-200 flex items-center gap-2 shrink-0"
          >
            <Plus size={16} /> Create Event
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400 font-semibold">Loading campus events...</div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No events found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const isRegistered = evt.registeredUsers?.some(
              (u) => u._id === user?.id || u === user?.id
            );
            const spotsRemaining = evt.maxCapacity - (evt.registeredUsers?.length || 0);

            return (
              <div
                key={evt._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                      {evt.category}
                    </span>
                    {(evt.organizer?._id === user?.id || evt.organizer === user?.id || user?.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteEvent(evt._id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-600 transition">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-purple-600" />
                      <span>{new Date(evt.date).toLocaleDateString()} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-purple-600" />
                      <span>{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-purple-600" />
                      <span>
                        {evt.registeredUsers?.length || 0} / {evt.maxCapacity} Registered ({spotsRemaining} spots left)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {/* Faculty/Admin view registered users */}
                  {(user?.role === 'faculty' || user?.role === 'admin') && (
                    <button
                      onClick={() => setSelectedEventAttendees(evt)}
                      className="text-xs font-bold text-slate-600 hover:text-purple-600 flex items-center gap-1"
                    >
                      <UserCheck size={14} /> Attendees ({evt.registeredUsers?.length || 0})
                    </button>
                  )}

                  <button
                    onClick={() => handleRegisterToggle(evt._id)}
                    className={`ml-auto px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isRegistered
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        : spotsRemaining <= 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200'
                    }`}
                    disabled={!isRegistered && spotsRemaining <= 0}
                  >
                    {isRegistered ? (
                      <>
                        <XCircle size={14} /> Cancel Registration
                      </>
                    ) : spotsRemaining <= 0 ? (
                      'Full Capacity'
                    ) : (
                      <>
                        <CheckCircle size={14} /> Register Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating Event */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-base">Create Campus Event</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual CodeSprint Hackathon"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM - 04:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="Main Auditorium / Lab 3"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed event information..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-200"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Registered Attendees */}
      {selectedEventAttendees && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-base">
                Registered Students ({selectedEventAttendees.registeredUsers?.length || 0})
              </h2>
              <button onClick={() => setSelectedEventAttendees(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {selectedEventAttendees.registeredUsers?.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No registered students yet.</p>
              ) : (
                selectedEventAttendees.registeredUsers?.map((stu) => (
                  <div key={stu._id} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{stu.name}</p>
                      <p className="text-[10px] text-slate-400">{stu.email} • {stu.studentId || 'N/A'}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      {stu.department}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
