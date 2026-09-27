const express = require('express');
const router = express.Router();
const {
  getComplaints,
  submitComplaint,
  updateComplaintStatus,
  addComplaintResponse,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getComplaints);
router.post('/', protect, upload.array('attachments', 3), submitComplaint);
router.put('/:id/status', protect, authorize('faculty', 'admin'), updateComplaintStatus);
router.post('/:id/response', protect, addComplaintResponse);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;
