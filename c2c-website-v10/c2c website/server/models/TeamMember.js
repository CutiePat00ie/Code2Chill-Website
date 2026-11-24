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
      default: ''
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
    },
    email: { type: String, default: '' },
    emoji: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    funFact: { type: String, default: '' },
    quote: { type: String, default: '' },
    since: { type: String, default: '' },
    isHead: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
