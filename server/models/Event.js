const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Hackathon', 'Workshop', 'Technical Talk', 'Coding Competition', 'Project Sprints', 'General'],
      default: 'Workshop'
    },
    domain: {
      type: String,
      required: [true, 'Please specify the domain'],
      default: 'Software Development'
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description']
    },
    date: {
      type: Date,
      required: [true, 'Please provide the start date and time']
    },
    endDate: {
      type: Date
    },
    time: {
      type: String,
      required: [true, 'Please provide the time range (e.g. 10:00 AM - 04:00 PM)']
    },
    venue: {
      type: String,
      required: [true, 'Please specify venue or online link']
    },
    type: {
      type: String,
      enum: ['In-Person', 'Virtual', 'Hybrid'],
      default: 'In-Person'
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'
    },
    capacity: {
      type: Number,
      default: 100
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    registrationDeadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    tags: [String],
    prerequisites: {
      type: String,
      default: 'Laptop and passion to learn.'
    },
    organizer: {
      type: String,
      default: 'Code2Chill Technical Council'
    },
    speaker: {
      type: String,
      default: 'Domain Leads & Industry Guests'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', eventSchema);
