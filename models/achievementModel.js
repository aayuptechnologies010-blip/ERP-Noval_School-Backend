const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  studentName: {
    type: String,
    trim: true
  },
  class: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    default: 'Academic'
  },
  eventName: {
    type: String,
    trim: true
  },
  date: {
    type: String
  },
  rank: {
    type: String,
    default: '1st'
  },
  description: {
    type: String
  },
  photoUrl: {
    type: String,
    default: ''
  },
  venue: {
    type: String,
    trim: true
  },
  showOn: {
    type: String,
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
