const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true
  },
  headline: {
    type: String,
    trim: true
  },
  mediaName: {
    type: String,
    trim: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  mediaSource: {
    type: String,
    default: 'url'
  },
  type: {
    type: String,
    default: 'image'
  },
  fileUrl: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
