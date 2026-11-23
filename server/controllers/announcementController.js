const Announcement = require('../models/Announcement');
const memoryStore = require('../utils/memoryStore');

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const ann = memoryStore.getAnnouncements();
      return res.json({ success: true, count: ann.length, data: ann });
    }

    const ann = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, count: ann.length, data: ann });
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority, category, link } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide title and content' });
    }

    if (global.USE_MEMORY_DB) {
      const newAnn = memoryStore.createAnnouncement({
        title,
        content,
        priority: priority || 'normal',
        category: category || 'General',
        link: link || ''
      });
      return res.status(201).json({ success: true, data: newAnn, message: 'Announcement broadcasted' });
    }

    const ann = await Announcement.create({
      title,
      content,
      priority,
      category,
      link
    });

    res.status(201).json({ success: true, data: ann, message: 'Announcement broadcasted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const deleted = memoryStore.deleteAnnouncement(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Announcement not found' });
      }
      return res.json({ success: true, message: 'Announcement removed' });
    }

    const ann = await Announcement.findByIdAndDelete(req.params.id);
    if (!ann) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.json({ success: true, message: 'Announcement removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
