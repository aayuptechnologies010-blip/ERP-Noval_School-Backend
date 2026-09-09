const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  eventDate: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: '10:00 AM'
  },
  location: {
    type: String,
    default: 'School Auditorium'
  },
  category: {
    type: String,
    default: 'Cultural'
  },
  description: {
    type: String
  },
  bannerUrl: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  photos: [{
    type: String
  }],
  status: {
    type: String,
    default: 'Upcoming'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
