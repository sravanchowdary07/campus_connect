const express = require('express');
const router = express.Router();
const {
  getStudyResources,
  uploadStudyResource,
  incrementDownloadCount,
  deleteStudyResource
} = require('../controllers/studyResourceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getStudyResources);
router.post('/', protect, upload.single('file'), uploadStudyResource);
router.post('/:id/download', incrementDownloadCount);
router.delete('/:id', protect, deleteStudyResource);

module.exports = router;
