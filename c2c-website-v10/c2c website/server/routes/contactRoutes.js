const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  deleteContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
