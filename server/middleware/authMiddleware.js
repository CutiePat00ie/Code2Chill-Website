const jwt = require('jsonwebtoken');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'c2c_super_secret_jwt_key_2026_code2chill_technical_club'
      );

      if (global.USE_MEMORY_DB) {
        const user = memoryStore.findUserById(decoded.id);
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found in session' });
        }
        // Exclude password
        const { password, ...userWithoutPass } = user;
        req.user = userWithoutPass;
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'User not found in database' });
        }
      }

      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'c2c_super_secret_jwt_key_2026_code2chill_technical_club'
      );

      if (global.USE_MEMORY_DB) {
        const user = memoryStore.findUserById(decoded.id);
        if (user) {
          const { password, ...userWithoutPass } = user;
          req.user = userWithoutPass;
        }
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch {
      // optional, continue
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
