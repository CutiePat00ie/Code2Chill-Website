const seedData = require('../utils/seedData');

// @desc    Club goals, roadmap and testimonials (edit in utils/seedData.js)
// @route   GET /api/content
// @access  Public
const getContent = (req, res) => {
  res.json({
    success: true,
    data: {
      goals: seedData.goalsData,
      roadmap: seedData.roadmapData,
      testimonials: []
    }
  });
};

module.exports = { getContent };
