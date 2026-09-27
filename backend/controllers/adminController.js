const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Complaint = require('../models/Complaint');
const LostFound = require('../models/LostFound');
const StudyResource = require('../models/StudyResource');
const bcrypt = require('bcryptjs');

// @route   GET /api/admin/analytics
// @desc    Get dashboard metrics & counters
// @access  Private (Admin / Faculty / Student overview)
const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalAnnouncements = await Announcement.countDocuments();
    const totalEvents = await Event.countDocuments();

    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in_progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const totalComplaints = await Complaint.countDocuments();

    const totalLostFound = await LostFound.countDocuments({ status: 'open' });
    const totalStudyResources = await StudyResource.countDocuments();

    return res.json({
      students: totalStudents,
      faculty: totalFaculty,
      announcements: totalAnnouncements,
      events: totalEvents,
      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints
      },
      lostFound: totalLostFound,
      studyResources: totalStudyResources
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// @route   GET /api/admin/users
// @desc    Get all users list
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @route   POST /api/admin/create-faculty
// @desc    Admin creates a Faculty account
// @access  Private (Admin)
const createFacultyAccount = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, phone } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: 'Name, email, password, and department are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const faculty = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'faculty',
      employeeId: employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department,
      phone: phone || ''
    });

    return res.status(201).json({
      message: 'Faculty account created successfully',
      user: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        role: faculty.role,
        employeeId: faculty.employeeId,
        department: faculty.department
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating faculty account', error: error.message });
  }
};

// @route   PUT /api/admin/users/:id/role
// @desc    Change user role or active status
// @access  Private (Admin)
const updateUserRoleOrStatus = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    return res.json({ message: 'User updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// @route   DELETE /api/admin/users/:id
// @desc    Delete user account
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Admin cannot delete self' });
    }

    await user.deleteOne();
    return res.json({ message: 'User removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  createFacultyAccount,
  updateUserRoleOrStatus,
  deleteUser
};
