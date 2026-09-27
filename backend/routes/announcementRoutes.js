const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAnnouncements);
router.post('/', protect, authorize('faculty', 'admin'), upload.array('attachments', 5), createAnnouncement);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteAnnouncement);

module.exports = router;
