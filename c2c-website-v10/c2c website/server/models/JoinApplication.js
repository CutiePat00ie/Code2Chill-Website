const mongoose = require('mongoose');

const joinApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      trim: true
    },
    collegeId: {
      type: String,
      required: [true, 'Please provide roll number / college ID'],
      trim: true
    },
    year: {
      type: String,
      required: [true, 'Please select your academic year']
    },
    branch: {
      type: String,
      required: [true, 'Please specify branch/department']
    },
    domain: {
      type: String,
      required: [true, 'Please choose your domain of interest']
    },
    experience: {
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
    whyJoin: {
      type: String,
      required: [true, 'Please explain why you want to join Code2Chill']
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('JoinApplication', joinApplicationSchema);
