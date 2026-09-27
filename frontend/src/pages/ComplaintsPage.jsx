import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquareWarning,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  X,
  Paperclip,
  Trash2
} from 'lucide-react';

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeComplaintModal, setActiveComplaintModal] = useState(null);

  // Submit Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [priority, setPriority] = useState('medium');
  const [attachments, setAttachments] = useState([]);

  // Response Form State
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await API.get('/complaints', {
        params: {
          category: selectedCategory,
          status: selectedStatus
        }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory, selectedStatus]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('department', department);
      formData.append('priority', priority);

      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
      }

      await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowSubmitModal(false);
      setTitle('');
      setDescription('');
      setAttachments([]);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting complaint');
    }
  };

  const handleUpdateStatusAndRespond = async (e) => {
    e.preventDefault();
    if (!activeComplaintModal) return;

    try {
      await API.put(`/complaints/${activeComplaintModal._id}/status`, {
        status: newStatus || activeComplaintModal.status,
        responseText
      });

      setActiveComplaintModal(null);
      setResponseText('');
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating complaint');
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint record?')) return;
    try {
      await API.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      alert('Failed to delete complaint');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Resolved</span>;
      case 'in_progress':
        return <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock size={12} /> In Progress</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-amber-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Complaints & Grievances Portal</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submit academic, hostel, or infrastructure issues and track real-time resolution progress.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-amber-200 flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Submit Complaint
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <Filter size={14} className="text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent font-medium text-slate-700 focus:outline-none text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Hostel">Hostel</option>
            <option value="Canteen">Canteen</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="IT Services">IT Services</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent font-medium text-slate-700 focus:outline-none text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400 font-semibold">Loading grievance records...</div>
      ) : complaints.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
          <MessageSquareWarning className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((comp) => (
            <div key={comp._id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {getStatusBadge(comp.status)}
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {comp.category}
                    </span>
                    <span className="text-[11px] text-slate-400">Dept: {comp.department}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">{comp.title}</h3>
                </div>

                {(comp.submittedBy?._id === user?.id || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComplaint(comp._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{comp.description}</p>

              {/* Attachments */}
              {comp.attachments && comp.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {comp.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                    >
                      <Paperclip size={12} /> Attachment #{idx + 1}
                    </a>
                  ))}
                </div>
              )}

              {/* Resolution Responses History */}
              {comp.responses && comp.responses.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 mt-3">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Official Responses / Activity Log:
                  </p>
                  {comp.responses.map((resp, rIdx) => (
                    <div key={rIdx} className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-indigo-600">{resp.author?.name} ({resp.author?.role})</span>
                        <span>{new Date(resp.createdAt).toLocaleString()}</span>
                      </div>
                      <p>{resp.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Submitted by <strong className="text-slate-700">{comp.submittedBy?.name || 'Student'}</strong> on {new Date(comp.createdAt).toLocaleDateString()}
                </div>

                <button
                  onClick={() => {
                    setActiveComplaintModal(comp);
                    setNewStatus(comp.status);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  {(user?.role === 'faculty' || user?.role === 'admin') ? 'Update / Respond' : 'Add Comment'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal for Submitting Complaint */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-base">Submit Grievance Complaint</h2>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of issue"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Canteen">Canteen</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete details including location, dates, or context..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attach Photos / Docs</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAttachments(e.target.files)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-200"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Responding / Updating Status */}
      {activeComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-base">Update Complaint Status</h2>
              <button onClick={() => setActiveComplaintModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusAndRespond} className="space-y-4">
              {(user?.role === 'faculty' || user?.role === 'admin') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Change Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add Response / Comment</label>
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type official response or update..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveComplaintModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-200"
                >
                  Save Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
