const JoinApplication = require('../models/JoinApplication');
const memoryStore = require('../utils/memoryStore');

// @desc    Submit membership application
// @route   POST /api/join
// @access  Public
const submitApplication = async (req, res, next) => {
  try {
    const { name, email, collegeId, year, branch, domain, experience, github, linkedin, whyJoin } = req.body;

    if (!name || !email || !collegeId || !domain || !whyJoin) {
      return res.status(400).json({ success: false, message: 'Please fill in all mandatory application fields' });
    }

    if (global.USE_MEMORY_DB) {
      const app = memoryStore.createApplication({
        name,
        email,
        collegeId,
        year: year || '1st Year',
        branch: branch || 'Computer Science',
        domain,
        experience,
        github,
        linkedin,
        whyJoin
      });
      return res.status(201).json({
        success: true,
        data: app,
        message: 'Application submitted successfully! Our lead coordinators will review it and get in touch.'
      });
    }

    const app = await JoinApplication.create({
      name,
      email,
      collegeId,
      year: year || '1st Year',
      branch: branch || 'Computer Science',
      domain,
      experience,
      github,
      linkedin,
      whyJoin
    });

    res.status(201).json({
      success: true,
      data: app,
      message: 'Application submitted successfully! Our lead coordinators will review it and get in touch.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/join
// @access  Private/Admin
const getApplications = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const apps = memoryStore.getApplications();
      return res.json({ success: true, count: apps.length, data: apps });
    }

    const apps = await JoinApplication.find().sort({ createdAt: -1 });
    res.json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/join/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (global.USE_MEMORY_DB) {
      const app = memoryStore.updateApplicationStatus(req.params.id, status);
      if (!app) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      return res.json({ success: true, data: app, message: `Application marked as ${status}` });
    }

    const app = await JoinApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, data: app, message: `Application marked as ${status}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getApplications,
  updateApplicationStatus
};
