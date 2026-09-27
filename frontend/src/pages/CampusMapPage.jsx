import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Building2, Utensils, BookOpen, Trophy, Bus, Info } from 'lucide-react';

export default function CampusMapPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLocation, setActiveLocation] = useState(null);

  const campusLocations = [
    {
      id: 'lib-01',
      name: 'Central Library & Learning Hub',
      category: 'Academic',
      icon: BookOpen,
      x: 35,
      y: 40,
      hours: '08:00 AM - 11:00 PM (24/7 during exams)',
      contact: '+1 (555) 019-2810',
      description: '4-story quiet study area, digital research labs, 100k+ reference books, and group discussion rooms.',
      amenities: ['High-Speed Wi-Fi', 'Printing Station', 'Silent Study Zones', 'Coffee Kiosk']
    },
    {
      id: 'cs-02',
      name: 'Computer Science & AI Block',
      category: 'Academic',
      icon: Building2,
      x: 20,
      y: 25,
      hours: '07:30 AM - 09:00 PM',
      contact: '+1 (555) 019-2811',
      description: 'Department of CS & Software Engineering. Houses Innovation Lab, High-Performance Computing Cluster, and ROS Robotics Lab.',
      amenities: ['GPU Workstations', 'Robotics Bay', 'Faculty Cabins', 'Auditorium 302']
    },
    {
      id: 'cant-03',
      name: 'Central Canteen & Food Court',
      category: 'Canteen',
      icon: Utensils,
      x: 55,
      y: 50,
      hours: '07:00 AM - 10:00 PM',
      contact: '+1 (555) 019-2812',
      description: 'Main campus dining hall serving fresh meals, snacks, fresh juices, and specialty coffees.',
      amenities: ['Indoor/Outdoor Seating', 'Juice Bar', 'Digital Token Queue', 'UPI Payments']
    },
    {
      id: 'adm-04',
      name: 'Administrative Building & Dean Office',
      category: 'Admin',
      icon: Building2,
      x: 45,
      y: 20,
      hours: '09:00 AM - 05:00 PM',
      contact: '+1 (555) 019-2800',
      description: 'Central registrar office, admissions desk, fee counter, and student welfare services.',
      amenities: ['Admissions Counter', 'Student Helpdesk', 'Finance Section']
    },
    {
      id: 'aud-05',
      name: 'Grand Auditorium & Convocation Hall',
      category: 'Sports & Arts',
      icon: Trophy,
      x: 70,
      y: 30,
      hours: 'Event Dependent',
      contact: '+1 (555) 019-2815',
      description: 'State-of-the-art 1,200 seat theater style hall equipped with Dolby Surround Audio for cultural and technical fests.',
      amenities: ['1200 Capacity', 'Green Rooms', 'Stage Lighting Array']
    },
    {
      id: 'sport-06',
      name: 'Main Sports Complex & Gymnasium',
      category: 'Sports & Arts',
      icon: Trophy,
      x: 80,
      y: 65,
      hours: '06:00 AM - 09:00 PM',
      contact: '+1 (555) 019-2816',
      description: 'Includes Olympic basketball court, indoor badminton courts, swimming pool, and fully equipped gym.',
      amenities: ['Cardio Zone', 'Badminton Courts', 'Locker Rooms', 'Trainer Assistance']
    },
    {
      id: 'bus-07',
      name: 'Main Campus Transit Bus Terminal',
      category: 'Transit',
      icon: Bus,
      x: 15,
      y: 75,
      hours: '06:30 AM - 09:30 PM',
      contact: '+1 (555) 019-2820',
      description: 'Primary boarding point for city shuttle buses, inter-building electric carts, and visitor parking.',
      amenities: ['Shuttle Schedule Board', 'EV Charging Station', 'Visitor Pass Desk']
    },
    {
      id: 'hostel-08',
      name: 'Student Hostels & Residential Quarters',
      category: 'Hostels',
      icon: Building2,
      x: 65,
      y: 80,
      hours: '24 Hours',
      contact: '+1 (555) 019-2825',
      description: 'Hostels Block A, B, and C with 24/7 security guard desk, laundry facilities, and common recreational rooms.',
      amenities: ['24/7 Guard', 'Laundry Room', 'Table Tennis Room', 'RO Purifiers']
    }
  ];

  const filteredLocations = selectedCategory === 'All'
    ? campusLocations
    : campusLocations.filter(loc => loc.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Interactive Campus Map</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Navigate key buildings, academic blocks, canteens, hostels, and sports facilities.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Academic', 'Canteen', 'Admin', 'Sports & Arts', 'Transit', 'Hostels'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Visual (2-Cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 relative border border-slate-800 shadow-xl overflow-hidden min-h-[480px]">
          
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

          {/* Map Title Header */}
          <div className="relative z-10 flex items-center justify-between text-white/80 text-xs mb-4 pb-2 border-b border-slate-800">
            <span className="font-bold flex items-center gap-2 text-indigo-400">
              <MapPin size={16} /> Campus Digital Blueprint Layout
            </span>
            <span>Click any marker to inspect facilities</span>
          </div>

          {/* Interactive Markers Container */}
          <div className="relative z-10 w-full h-[400px] border border-slate-800/80 rounded-2xl bg-slate-950/60 overflow-hidden">
            
            {/* Campus Pathways graphic lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-indigo-500" strokeWidth="3" strokeDasharray="6 6">
              <line x1="20%" y1="25%" x2="35%" y2="40%" />
              <line x1="35%" y1="40%" x2="55%" y2="50%" />
              <line x1="45%" y1="20%" x2="70%" y2="30%" />
              <line x1="55%" y1="50%" x2="80%" y2="65%" />
              <line x1="15%" y1="75%" x2="55%" y2="50%" />
              <line x1="55%" y1="50%" x2="65%" y2="80%" />
            </svg>

            {/* Map Markers */}
            {filteredLocations.map((loc) => {
              const Icon = loc.icon;
              const isSelected = activeLocation?.id === loc.id;

              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocation(loc)}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-2xl transition transform hover:scale-125 flex items-center gap-2 group z-20 ${
                    isSelected
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-400/40 shadow-lg z-30 scale-110'
                      : 'bg-slate-800 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-slate-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-[11px] font-bold tracking-tight whitespace-nowrap bg-slate-900/90 text-slate-200 px-2 py-0.5 rounded-lg border border-slate-700 hidden sm:inline-block">
                    {loc.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected Building Detail Sidebar (1-Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          {activeLocation ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {activeLocation.category}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                    {activeLocation.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {activeLocation.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={16} className="text-indigo-600 shrink-0" />
                  <span><strong>Hours:</strong> {activeLocation.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={16} className="text-indigo-600 shrink-0" />
                  <span><strong>Desk:</strong> {activeLocation.contact}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 mb-2">Available Amenities:</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeLocation.amenities.map((item, i) => (
                    <span key={i} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Info className="w-12 h-12 text-slate-300 mb-2" />
              <p className="font-bold text-xs text-slate-600">No Building Selected</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Click on any map marker pin to view opening hours, contact desk, and available amenities.
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">Campus GPS Coordinates: 28.5450° N, 77.1926° E</p>
          </div>
        </div>

      </div>

    </div>
  );
}
