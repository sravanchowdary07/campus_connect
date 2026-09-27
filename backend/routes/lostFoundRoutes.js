const express = require('express');
const router = express.Router();
const {
  getLostFoundItems,
  createLostFoundItem,
  updateItemStatus,
  deleteLostFoundItem
} = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getLostFoundItems);
router.post('/', protect, upload.single('itemImage'), createLostFoundItem);
router.put('/:id/status', protect, updateItemStatus);
router.delete('/:id', protect, deleteLostFoundItem);

module.exports = router;
