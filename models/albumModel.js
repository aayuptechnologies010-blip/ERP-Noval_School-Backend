const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  totalMemories: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
