const StudyResource = require('../models/StudyResource');

// @route   GET /api/study-resources
// @desc    Get study materials with department, semester, category filters
// @access  Public / Private
const getStudyResources = async (req, res) => {
  try {
    const { department, semester, category, search } = req.query;
    let filter = {};

    if (department && department !== 'All') filter.department = department;
    if (semester && semester !== 'All') filter.semester = semester;
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await StudyResource.find(filter)
      .populate('uploadedBy', 'name email role department')
      .sort({ createdAt: -1 });

    return res.json(resources);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching study resources', error: error.message });
  }
};

// @route   POST /api/study-resources
// @desc    Upload new study material (Faculty/Admin/Student)
// @access  Private
const uploadStudyResource = async (req, res) => {
  try {
    const { title, description, subject, department, semester, category } = req.body;

    if (!title || !subject || !department || !semester) {
      return res.status(400).json({ message: 'Title, subject, department, and semester are required' });
    }

    let fileUrl = '';
    let fileName = '';
    let fileSize = '1.5 MB';
    let fileType = 'pdf';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
      fileType = req.file.originalname.split('.').pop().toLowerCase();
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileName = title + '.pdf';
    } else {
      return res.status(400).json({ message: 'Please attach a document file' });
    }

    const resource = await StudyResource.create({
      title,
      description: description || '',
      subject,
      department,
      semester,
      category: category || 'Notes',
      fileUrl,
      fileName,
      fileSize,
      fileType,
      uploadedBy: req.user._id
    });

    const populated = await StudyResource.findById(resource._id).populate('uploadedBy', 'name email role department');

    if (req.io) {
      req.io.emit('new_study_resource', populated);
    }

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading study resource', error: error.message });
  }
};

// @route   POST /api/study-resources/:id/download
// @desc    Increment download count
// @access  Public / Private
const incrementDownloadCount = async (req, res) => {
  try {
    const resource = await StudyResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.downloadsCount += 1;
    await resource.save();

    return res.json({ downloadsCount: resource.downloadsCount });
  } catch (error) {
    return res.status(500).json({ message: 'Error tracking download', error: error.message });
  }
};

// @route   DELETE /api/study-resources/:id
// @desc    Delete study resource
// @access  Private (Uploader/Faculty/Admin)
const deleteStudyResource = async (req, res) => {
  try {
    const resource = await StudyResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (
      resource.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'faculty'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await resource.deleteOne();
    return res.json({ message: 'Study resource deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting study resource', error: error.message });
  }
};

module.exports = {
  getStudyResources,
  uploadStudyResource,
  incrementDownloadCount,
  deleteStudyResource
};
