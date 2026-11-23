const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide project title'],
      trim: true
    },
    domain: {
      type: String,
      required: [true, 'Please specify the domain']
    },
    description: {
      type: String,
      required: [true, 'Please provide project description']
    },
    techStack: [
      {
        type: String,
        trim: true
      }
    ],
    github: {
      type: String,
      default: ''
    },
    liveDemo: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
    },
    authors: [
      {
        type: String,
        trim: true
      }
    ],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likes: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Active', 'In Development', 'Completed', 'Archived'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
