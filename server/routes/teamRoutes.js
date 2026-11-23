const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  createTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getTeamMembers);
router.post('/', protect, adminOnly, createTeamMember);
router.delete('/:id', protect, adminOnly, deleteTeamMember);

module.exports = router;
