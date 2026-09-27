const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  registerForEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getEvents);
router.post('/', protect, authorize('faculty', 'admin'), upload.single('bannerImage'), createEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteEvent);

module.exports = router;
