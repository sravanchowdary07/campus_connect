const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Announcement = require('./models/Announcement');
const Event = require('./models/Event');
const Complaint = require('./models/Complaint');
const LostFound = require('./models/LostFound');
const StudyResource = require('./models/StudyResource');

const seedInitialData = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already populated. Skipping initial seed.');
      return;
    }

    console.log('Seeding initial CampusConnect data...');

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    // 1. Create Users
    const admin = await User.create({
      name: 'Dr. Arthur Pendelton',
      email: 'admin@campusconnect.edu',
      password: adminPassword,
      role: 'admin',
      employeeId: 'ADM-001',
      department: 'Administration',
      phone: '+1 (555) 019-2831'
    });

    const facultyCS = await User.create({
      name: 'Prof. Sarah Jenkins',
      email: 'faculty@campusconnect.edu',
      password: defaultPassword,
      role: 'faculty',
      employeeId: 'FAC-102',
      department: 'Computer Science',
      phone: '+1 (555) 234-5678'
    });

    const facultyECE = await User.create({
      name: 'Dr. Robert Vance',
      email: 'vance@campusconnect.edu',
      password: defaultPassword,
      role: 'faculty',
      employeeId: 'FAC-105',
      department: 'Electronics & Communication',
      phone: '+1 (555) 345-6789'
    });

    const studentAlex = await User.create({
      name: 'Alex Rivera',
      email: 'student@campusconnect.edu',
      password: defaultPassword,
      role: 'student',
      studentId: 'STU-202401',
      department: 'Computer Science',
      year: '3rd Year',
      phone: '+1 (555) 876-5432'
    });

    const studentMaya = await User.create({
      name: 'Maya Lin',
      email: 'maya@campusconnect.edu',
      password: defaultPassword,
      role: 'student',
      studentId: 'STU-202402',
      department: 'Electrical Engineering',
      year: '2nd Year',
      phone: '+1 (555) 987-6543'
    });

    // 2. Create Announcements
    await Announcement.create([
      {
        title: 'End Semester Examination Schedule Released',
        content: 'The final examination timetable for Fall Semester 2026 has been published. All students are advised to check their respective department portals for venue details.',
        category: 'Exam',
        department: 'All',
        priority: 'urgent',
        author: admin._id,
        isPinned: true
      },
      {
        title: 'Annual Hackathon "HackCampus 2.0" Registration Open',
        content: 'Register now for the 36-hour flagship hackathon organized by the Computer Science Society. Prizes worth $5,000 up for grabs!',
        category: 'Events',
        department: 'Computer Science',
        priority: 'high',
        author: facultyCS._id,
        isPinned: true
      },
      {
        title: 'Central Library Extended Hours During Exams',
        content: 'Starting next Monday, the Central Library will remain open 24/7 to support students during exam preparation. Wi-Fi and quiet zones fully functional.',
        category: 'Administrative',
        department: 'All',
        priority: 'medium',
        author: admin._id,
        isPinned: false
      }
    ]);

    // 3. Create Events
    await Event.create([
      {
        title: 'HackCampus 2.0 Hackathon',
        description: '36-hour annual hackathon featuring AI, Web3, and Mobile dev tracks. Mentorship from industry experts and food provided throughout!',
        category: 'Technical',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: '09:00 AM - 09:00 PM',
        venue: 'Auditorium Hall A & Innovation Lab',
        maxCapacity: 150,
        organizer: facultyCS._id,
        registeredUsers: [studentAlex._id, studentMaya._id]
      },
      {
        title: 'Campus AI & Robotics Workshop',
        description: 'Hands-on session on ROS2, Computer Vision with OpenCV, and Neural Networks for autonomous vehicles.',
        category: 'Workshop',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '02:00 PM - 05:00 PM',
        venue: 'CS Seminar Room 302',
        maxCapacity: 60,
        organizer: facultyECE._id,
        registeredUsers: [studentAlex._id]
      },
      {
        title: 'Inter-College Football Tournament Finals',
        description: 'Cheer for our campus team as they face Westview University in the grand finals!',
        category: 'Sports',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        time: '04:00 PM - 07:00 PM',
        venue: 'Main Sports Complex Stadium',
        maxCapacity: 500,
        organizer: admin._id,
        registeredUsers: [studentMaya._id]
      }
    ]);

    // 4. Create Complaints
    await Complaint.create([
      {
        title: 'Wi-Fi connectivity drop in Block B Hostel 3rd Floor',
        description: 'The wireless access point near room 312 keeps disconnecting every 10 minutes. Unable to access online study portals.',
        category: 'IT Services',
        department: 'IT Infrastructure',
        priority: 'high',
        status: 'in_progress',
        submittedBy: studentAlex._id,
        assignedTo: facultyCS._id,
        responses: [
          {
            author: facultyCS._id,
            text: 'IT maintenance team dispatched new router hardware. Testing in progress.',
            createdAt: new Date()
          }
        ]
      },
      {
        title: 'Projector flickering in Room 204 Engineering Building',
        description: 'HDMI signal disconnects during lectures.',
        category: 'Academic',
        department: 'Computer Science',
        priority: 'medium',
        status: 'pending',
        submittedBy: studentMaya._id
      }
    ]);

    // 5. Create Lost & Found items
    await LostFound.create([
      {
        title: 'Blue Leather Wallet with Student ID',
        description: 'Contains student ID card, some cash, and library card. Lost near the Central Canteen area around 1:30 PM.',
        type: 'lost',
        category: 'Keys / Wallet',
        location: 'Central Canteen',
        contactInfo: 'alex.rivera@campusconnect.edu | +1 (555) 876-5432',
        postedBy: studentAlex._id,
        status: 'open'
      },
      {
        title: 'Apple AirPods Pro Case Found',
        description: 'White charging case found on the bench near Library Lawn. Has a silicone red cover.',
        type: 'found',
        category: 'Electronics',
        location: 'Library Quad Lawn',
        contactInfo: 'Submit proof of ownership at Security Office Gate 1',
        postedBy: studentMaya._id,
        status: 'open'
      }
    ]);

    // 6. Create Study Resources
    await StudyResource.create([
      {
        title: 'Data Structures & Algorithms Comprehensive Notes',
        description: 'Complete lecture notes covering Trees, Graphs, Dynamic Programming, and Sorting Algorithms with C++ & Python code samples.',
        subject: 'Data Structures',
        department: 'Computer Science',
        semester: 'Semester 3',
        category: 'Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'DSA_Lecture_Notes_2026.pdf',
        fileSize: '3.4 MB',
        fileType: 'pdf',
        uploadedBy: facultyCS._id,
        downloadsCount: 142
      },
      {
        title: 'Database Management Systems Previous Year Question Papers',
        description: 'Collection of end-semester exam papers from 2021 to 2025 with answer keys.',
        subject: 'Database Systems',
        department: 'Computer Science',
        semester: 'Semester 4',
        category: 'Question Paper',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'DBMS_PYQ_2021_2025.pdf',
        fileSize: '2.1 MB',
        fileType: 'pdf',
        uploadedBy: facultyCS._id,
        downloadsCount: 98
      },
      {
        title: 'Digital Signal Processing Lab Manual',
        description: 'MATLAB and Python scripts for audio processing, FFT, and Digital Filter Design.',
        subject: 'Signal Processing',
        department: 'Electronics & Communication',
        semester: 'Semester 5',
        category: 'Lab Manual',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'DSP_Lab_Manual_v2.pdf',
        fileSize: '4.8 MB',
        fileType: 'pdf',
        uploadedBy: facultyECE._id,
        downloadsCount: 56
      }
    ]);

    console.log('✅ CampusConnect demo data successfully seeded!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = { seedInitialData };

if (require.main === module) {
  const connectDB = require('./config/db');
  connectDB().then(() => {
    seedInitialData().then(() => {
      process.exit(0);
    });
  });
}
