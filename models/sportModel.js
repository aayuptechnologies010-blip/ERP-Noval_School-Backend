const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  sportType: {
    type: String,
    required: true,
    trim: true
  },
  matchDate: {
    type: String
  },
  teams: {
    type: String
  },
  result: {
    type: String
  },
  description: {
    type: String
  },
  photoUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sport', sportSchema);
