const Project = require('../models/Project');
const memoryStore = require('../utils/memoryStore');

// @desc    Get all projects with filters
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const { domain, featured, search } = req.query;

    if (global.USE_MEMORY_DB) {
      const projects = memoryStore.getProjects({ domain, featured, search });
      return res.json({ success: true, count: projects.length, data: projects });
    }

    let query = {};
    if (domain && domain !== 'All') {
      query.domain = { $regex: domain, $options: 'i' };
    }
    if (featured === 'true' || featured === true) {
      query.featured = true;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { techStack: { $in: [new RegExp(search, 'i')] } },
        { authors: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const projects = await Project.find(query).sort({ featured: -1, likes: -1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const project = memoryStore.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.json({ success: true, data: project });
    }

    const project = await Project.findById(req.params.id).populate('submittedBy', 'name email avatar');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Submit new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, domain, description, techStack, github, liveDemo, image, authors } = req.body;

    if (!title || !description || !domain) {
      return res.status(400).json({ success: false, message: 'Please provide title, description and domain' });
    }

    const parsedTechStack = Array.isArray(techStack) 
      ? techStack 
      : (techStack ? techStack.split(',').map(s => s.trim()) : ['React', 'Node.js']);

    const parsedAuthors = Array.isArray(authors)
      ? authors
      : (authors ? authors.split(',').map(a => a.trim()) : [req.user.name]);

    if (global.USE_MEMORY_DB) {
      const newProj = memoryStore.createProject({
        title,
        domain,
        description,
        techStack: parsedTechStack,
        github: github || '',
        liveDemo: liveDemo || '',
        image: image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        authors: parsedAuthors,
        submittedBy: req.user._id,
        featured: req.user.role === 'admin' ? (req.body.featured || false) : false
      });
      return res.status(201).json({ success: true, data: newProj, message: 'Project showcased successfully!' });
    }

    const project = await Project.create({
      title,
      domain,
      description,
      techStack: parsedTechStack,
      github,
      liveDemo,
      image: image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      authors: parsedAuthors,
      submittedBy: req.user._id,
      featured: req.user.role === 'admin' ? (req.body.featured || false) : false
    });

    res.status(201).json({ success: true, data: project, message: 'Project showcased successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a project
// @route   POST /api/projects/:id/like
// @access  Public
const likeProject = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const updated = memoryStore.likeProject(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.json({ success: true, likes: updated.likes });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, likes: project.likes });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    if (global.USE_MEMORY_DB) {
      const deleted = memoryStore.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.json({ success: true, message: 'Project removed successfully' });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  likeProject,
  deleteProject
};
