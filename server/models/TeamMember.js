const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide team member name'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Please provide role/designation'],
      trim: true
    },
    domain: {
      type: String,
      required: [true, 'Please specify domain or team wing'],
      trim: true
    },
    year: {
      type: String,
      default: '3rd Year'
    },
    bio: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
