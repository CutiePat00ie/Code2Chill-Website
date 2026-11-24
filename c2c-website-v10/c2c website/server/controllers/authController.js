const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'c2c_super_secret_jwt_key_2026_code2chill_technical_club',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, domain, collegeId, year, branch, bio, github, linkedin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (global.USE_MEMORY_DB) {
      const existingUser = memoryStore.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = memoryStore.createUser({
        name,
        email,
        password: hashedPassword,
        domain: domain || 'Software Development',
        collegeId: collegeId || '',
        year: year || '1st Year',
        branch: branch || 'Computer Science',
        bio: bio || 'Code2Chill Club Member',
        github: github || '',
        linkedin: linkedin || '',
        role: 'member'
      });

      const token = generateToken(newUser._id);
      const { password: _, ...userSafe } = newUser;

      return res.status(201).json({
        success: true,
        token,
        user: userSafe,
        message: 'Welcome to Code2Chill!'
      });
    }

    // MongoDB Mode
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      domain: domain || 'Software Development',
      collegeId,
      year,
      branch,
      bio,
      github,
      linkedin,
      role: 'member'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        domain: user.domain,
        avatar: user.avatar,
        year: user.year,
        branch: user.branch,
        collegeId: user.collegeId,
        registeredEvents: user.registeredEvents
      },
      message: 'Welcome to Code2Chill!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (global.USE_MEMORY_DB) {
      const user = memoryStore.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      const { password: _, ...userSafe } = user;

      return res.json({
        success: true,
        token,
        user: userSafe,
        message: 'Logged in successfully'
      });
    }

    // MongoDB Mode
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        domain: user.domain,
        avatar: user.avatar,
        year: user.year,
        branch: user.branch,
        collegeId: user.collegeId,
        registeredEvents: user.registeredEvents
      },
      message: 'Logged in successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      domain: req.body.domain,
      collegeId: req.body.collegeId,
      year: req.body.year,
      branch: req.body.branch,
      bio: req.body.bio,
      github: req.body.github,
      linkedin: req.body.linkedin,
      avatar: req.body.avatar
    };

    // Filter out undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    if (global.USE_MEMORY_DB) {
      const updatedUser = memoryStore.updateUser(req.user._id, updates);
      const { password: _, ...userSafe } = updatedUser;
      return res.json({
        success: true,
        user: userSafe,
        message: 'Profile updated successfully'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
