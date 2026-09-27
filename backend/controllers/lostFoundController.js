const LostFound = require('../models/LostFound');

// @route   GET /api/lost-found
// @desc    Get all lost and found items
// @access  Public / Private
const getLostFoundItems = async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let filter = {};

    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await LostFound.find(filter)
      .populate('postedBy', 'name email phone department studentId')
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching lost & found items', error: error.message });
  }
};

// @route   POST /api/lost-found
// @desc    Report a lost or found item
// @access  Private
const createLostFoundItem = async (req, res) => {
  try {
    const { title, description, type, category, location, dateHappened, contactInfo } = req.body;

    if (!title || !description || !type || !location || !contactInfo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let itemImage = '';
    if (req.file) {
      itemImage = `/uploads/${req.file.filename}`;
    }

    const item = await LostFound.create({
      title,
      description,
      type,
      category: category || 'Other',
      location,
      dateHappened: dateHappened || new Date(),
      itemImage,
      contactInfo,
      postedBy: req.user._id
    });

    const populated = await LostFound.findById(item._id).populate('postedBy', 'name email phone department');

    if (req.io) {
      req.io.emit('new_lost_found', populated);
    }

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Error posting lost & found item', error: error.message });
  }
};

// @route   PUT /api/lost-found/:id/status
// @desc    Update item status (open, claimed, closed)
// @access  Private
const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    item.status = status;
    await item.save();

    const updated = await LostFound.findById(item._id).populate('postedBy', 'name email phone department');
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// @route   DELETE /api/lost-found/:id
// @desc    Delete post
// @access  Private
const deleteLostFoundItem = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await item.deleteOne();
    return res.json({ message: 'Post removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

module.exports = {
  getLostFoundItems,
  createLostFoundItem,
  updateItemStatus,
  deleteLostFoundItem
};
