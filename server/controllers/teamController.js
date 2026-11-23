const TeamMember = require('../models/TeamMember');
const memoryStore = require('../utils/memoryStore');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const members = memoryStore.getTeamMembers();
      return res.json({ success: true, count: members.length, data: members });
    }

    const members = await TeamMember.find().sort({ createdAt: 1 });
    res.json({ success: true, count: members.length, data: members });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new team member
// @route   POST /api/team
// @access  Private/Admin
const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, domain, year, bio, photo, github, linkedin, twitter } = req.body;

    if (!name || !role || !domain) {
      return res.status(400).json({ success: false, message: 'Please provide name, role and domain' });
    }

    if (global.USE_MEMORY_DB) {
      const newMember = memoryStore.createTeamMember({
        name,
        role,
        domain,
        year: year || '3rd Year',
        bio: bio || '',
        photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        github: github || '',
        linkedin: linkedin || '',
        twitter: twitter || ''
      });
      return res.status(201).json({ success: true, data: newMember, message: 'Team member added' });
    }

    const member = await TeamMember.create({
      name,
      role,
      domain,
      year,
      bio,
      photo,
      github,
      linkedin,
      twitter
    });

    res.status(201).json({ success: true, data: member, message: 'Team member added' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
const deleteTeamMember = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const deleted = memoryStore.deleteTeamMember(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      return res.json({ success: true, message: 'Team member removed' });
    }

    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.json({ success: true, message: 'Team member removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeamMembers,
  createTeamMember,
  deleteTeamMember
};
