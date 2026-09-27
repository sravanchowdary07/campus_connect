const Event = require('../models/Event');

// @route   GET /api/events
// @desc    Get all events
// @access  Public / Private
const getEvents = async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};

    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;

    const events = await Event.find(filter)
      .populate('organizer', 'name email role department')
      .populate('registeredUsers', 'name email studentId department')
      .sort({ date: 1 });

    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// @route   POST /api/events
// @desc    Create event (Faculty & Admin)
// @access  Private (Faculty/Admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, venue, maxCapacity } = req.body;

    if (!title || !description || !date || !time || !venue) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let bannerImage = '';
    if (req.file) {
      bannerImage = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      description,
      category: category || 'Technical',
      date,
      time,
      venue,
      maxCapacity: Number(maxCapacity) || 100,
      organizer: req.user._id,
      bannerImage
    });

    const populated = await Event.findById(event._id)
      .populate('organizer', 'name email role department')
      .populate('registeredUsers', 'name email studentId department');

    if (req.io) {
      req.io.emit('new_event', populated);
    }

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// @route   POST /api/events/:id/register
// @desc    Register for event (Students)
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const isRegistered = event.registeredUsers.includes(req.user._id);
    if (isRegistered) {
      // Unregister (toggle capability for user convenience)
      event.registeredUsers = event.registeredUsers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      await event.save();

      const updated = await Event.findById(event._id)
        .populate('organizer', 'name email role department')
        .populate('registeredUsers', 'name email studentId department');

      return res.json({ message: 'Registration cancelled', event: updated, isRegistered: false });
    }

    // Check capacity
    if (event.registeredUsers.length >= event.maxCapacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    const updated = await Event.findById(event._id)
      .populate('organizer', 'name email role department')
      .populate('registeredUsers', 'name email studentId department');

    if (req.io) {
      req.io.emit('event_registration_update', { eventId: event._id, count: updated.registeredUsers.length });
    }

    return res.json({ message: 'Successfully registered for event!', event: updated, isRegistered: true });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating event registration', error: error.message });
  }
};

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Organizer/Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    if (req.io) {
      req.io.emit('delete_event', req.params.id);
    }

    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  registerForEvent,
  deleteEvent
};
