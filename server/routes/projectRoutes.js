const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  likeProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, createProject);
router.post('/:id/like', likeProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
