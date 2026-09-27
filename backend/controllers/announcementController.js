const Announcement = require('../models/Announcement');

// @route   GET /api/announcements
// @desc    Get all announcements with search & filters
// @access  Public / Private
const getAnnouncements = async (req, res) => {
  try {
    const { category, department, priority, search } = req.query;
    let filter = {};

    if (category && category !== 'All') filter.category = category;
    if (department && department !== 'All') filter.department = department;
    if (priority && priority !== 'All') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const announcements = await Announcement.find(filter)
      .populate('author', 'name email role department')
      .sort({ isPinned: -1, createdAt: -1 });

    return res.json(announcements);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

// @route   POST /api/announcements
// @desc    Create announcement (Faculty & Admin only)
// @access  Private (Faculty/Admin)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, department, priority, targetAudience, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const announcement = await Announcement.create({
      title,
      content,
      category: category || 'General',
      department: department || 'All',
      priority: priority || 'medium',
      targetAudience: targetAudience || 'All',
      isPinned: isPinned === 'true' || isPinned === true,
      author: req.user._id,
      attachments
    });

    const populated = await Announcement.findById(announcement._id).populate('author', 'name email role department');

    // Emit socket event if io is available
    if (req.io) {
      req.io.emit('new_announcement', populated);
    }

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (Author/Admin)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check ownership or admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }

    await announcement.deleteOne();

    if (req.io) {
      req.io.emit('delete_announcement', req.params.id);
    }

    return res.json({ message: 'Announcement removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
