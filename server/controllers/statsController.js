const memoryStore = require('../utils/memoryStore');
const seedData = require('../utils/seedData');
const User = require('../models/User');
const Event = require('../models/Event');
const Project = require('../models/Project');

// @desc    Get club overview statistics
// @route   GET /api/stats
// @access  Public
const getClubStats = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const stats = memoryStore.getStats();
      return res.json({ success: true, data: stats });
    }

    const [usersCount, eventsCount, projectsCount] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Project.countDocuments()
    ]);

    const stats = {
      activeMembers: 680 + usersCount,
      eventsOrganized: eventsCount + 30,
      innovativeProjects: projectsCount + 35,
      techDomains: 6,
      hackathonsWon: 19,
      githubStars: '1.4k+'
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all technical domains info
// @route   GET /api/stats/domains
// @access  Public
const getDomains = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const domains = memoryStore.getDomains();
      return res.json({ success: true, data: domains });
    }

    res.json({ success: true, data: seedData.domainsData });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClubStats,
  getDomains
};
