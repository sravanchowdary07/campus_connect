const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  createFacultyAccount,
  updateUserRoleOrStatus,
  deleteUser
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/analytics', protect, getAnalytics);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.post('/create-faculty', protect, authorize('admin'), createFacultyAccount);
router.put('/users/:id', protect, authorize('admin'), updateUserRoleOrStatus);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
