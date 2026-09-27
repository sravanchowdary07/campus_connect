const Complaint = require('../models/Complaint');

// @route   GET /api/complaints
// @desc    Get complaints (Student gets own, Faculty gets department, Admin gets all)
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const { category, status, department } = req.query;
    let filter = {};

    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    if (department && department !== 'All') filter.department = department;

    // Role-based visibility
    if (req.user.role === 'student') {
      filter.submittedBy = req.user._id;
    } else if (req.user.role === 'faculty') {
      // Faculty views department complaints or complaints assigned to them
      if (!department || department === 'All') {
        filter.$or = [{ department: req.user.department }, { assignedTo: req.user._id }];
      }
    }
    // Admin gets all based on query filters

    const complaints = await Complaint.find(filter)
      .populate('submittedBy', 'name email studentId department phone')
      .populate('assignedTo', 'name email department')
      .populate('responses.author', 'name role department')
      .sort({ createdAt: -1 });

    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
};

// @route   POST /api/complaints
// @desc    Submit a new complaint
// @access  Private
const submitComplaint = async (req, res) => {
  try {
    const { title, description, category, department, priority } = req.body;

    if (!title || !description || !category || !department) {
      return res.status(400).json({ message: 'Please complete all required fields' });
    }

    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      department,
      priority: priority || 'medium',
      submittedBy: req.user._id,
      attachments
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email studentId department phone')
      .populate('assignedTo', 'name email department');

    if (req.io) {
      req.io.emit('new_complaint', populated);
    }

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Error submitting complaint', error: error.message });
  }
};

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status & assign faculty
// @access  Private (Faculty / Admin)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, responseText } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) {
      complaint.status = status;
    }

    if (!complaint.assignedTo && (req.user.role === 'faculty' || req.user.role === 'admin')) {
      complaint.assignedTo = req.user._id;
    }

    if (responseText && responseText.trim() !== '') {
      complaint.responses.push({
        author: req.user._id,
        text: responseText.trim()
      });
    }

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email studentId department phone')
      .populate('assignedTo', 'name email department')
      .populate('responses.author', 'name role department');

    if (req.io) {
      req.io.emit('complaint_status_update', updated);
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating complaint', error: error.message });
  }
};

// @route   POST /api/complaints/:id/response
// @desc    Add comment/response to a complaint
// @access  Private
const addComplaintResponse = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Response text is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.responses.push({
      author: req.user._id,
      text: text.trim()
    });

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email studentId department phone')
      .populate('assignedTo', 'name email department')
      .populate('responses.author', 'name role department');

    if (req.io) {
      req.io.emit('complaint_status_update', updated);
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding response', error: error.message });
  }
};

// @route   DELETE /api/complaints/:id
// @desc    Delete complaint (Admin or owner)
// @access  Private
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    await complaint.deleteOne();
    return res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting complaint', error: error.message });
  }
};

module.exports = {
  getComplaints,
  submitComplaint,
  updateComplaintStatus,
  addComplaintResponse,
  deleteComplaint
};
