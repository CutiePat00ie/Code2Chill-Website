const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplications,
  updateApplicationStatus
} = require('../controllers/joinController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', submitApplication);
router.get('/', protect, adminOnly, getApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;
