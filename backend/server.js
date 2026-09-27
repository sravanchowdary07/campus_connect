const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const studyResourceRoutes = require('./routes/studyResourceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach Socket.IO to req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/study-resources', studyResourceRoutes);
app.use('/api/admin', adminRoutes);

// Base health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusConnect API Server is active' });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database & Start Server
connectDB().then(() => {
  // Auto seed if database is empty or running on MongoMemoryServer
  const seed = require('./seed');
  seed.seedInitialData().then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 CampusConnect Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Seed error:', err);
    server.listen(PORT, () => {
      console.log(`🚀 CampusConnect Server running on port ${PORT}`);
    });
  });
});
