const mongoose = require('mongoose');

const guestbookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  photoUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: 'Approved'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guestbook', guestbookSchema);
