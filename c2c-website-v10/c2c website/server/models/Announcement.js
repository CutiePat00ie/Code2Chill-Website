const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide announcement title'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please provide content']
    },
    priority: {
      type: String,
      enum: ['normal', 'urgent', 'info'],
      default: 'normal'
    },
    category: {
      type: String,
      default: 'General'
    },
    link: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
