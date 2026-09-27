import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Calendar,
  Phone,
  Tag,
  CheckCircle,
  Trash2,
  X
} from 'lucide-react';

export default function LostFoundPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, lost, found
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('lost');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState(`${user?.email} | ${user?.phone || ''}`);
  const [itemImage, setItemImage] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await API.get('/lost-found', {
        params: {
          type: activeTab,
          category: selectedCategory,
          search
        }
      });
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching lost & found items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, selectedCategory, search]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('contactInfo', contactInfo);

      if (itemImage) {
        formData.append('itemImage', itemImage);
      }

      await API.post('/lost-found', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowModal(false);
      setTitle('');
      setDescription('');
      setLocation('');
      setItemImage(null);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting item');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/lost-found/${id}/status`, { status });
      fetchItems();
    } catch (err) {
      alert('Error updating item status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/lost-found/${id}`);
      fetchItems();
    } catch (err) {
      alert('Error deleting post');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-rose-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Lost & Found Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Report lost belongings or register items found around campus to reconnect with owners.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-rose-200 flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Post Lost / Found Item
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'lost', label: '🔴 Lost Items' },
            { id: 'found', label: '🟢 Found Items' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search item or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="ID Card / Documents">ID Card / Documents</option>
              <option value="Keys / Wallet">Keys / Wallet</option>
              <option value="Clothing">Clothing</option>
              <option value="Books / Stationery">Books / Stationery</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400 font-semibold">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No items listed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-lg transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.type === 'lost' ? 'LOST ITEM' : 'FOUND ITEM'}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.status === 'claimed' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.description}</p>

                <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-rose-500" />
                    <span>Location: <strong>{item.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-rose-500" />
                    <span>Date: {new Date(item.dateHappened).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-rose-500" />
                    <span className="truncate">Contact: {item.contactInfo}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">By {item.postedBy?.name || 'User'}</span>

                <div className="flex items-center gap-1">
                  {(item.postedBy?._id === user?.id || user?.role === 'admin') && (
                    <>
                      {item.status === 'open' && (
                        <button
                          onClick={() => handleStatusChange(item._id, 'claimed')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100"
                        >
                          Mark Claimed
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating Post */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-base">Post Lost or Found Item</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Listing Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('lost')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      type === 'lost' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🔴 I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('found')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      type === 'found' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🟢 I Found Something
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Blue Leather Wallet with Student ID"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="ID Card / Documents">ID Card / Documents</option>
                    <option value="Keys / Wallet">Keys / Wallet</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books / Stationery">Books / Stationery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Central Canteen / Library Lawn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Identify key marks, colors, or proof details..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Info *</label>
                <input
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Phone number, email, or room number"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-200"
                >
                  Post Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
