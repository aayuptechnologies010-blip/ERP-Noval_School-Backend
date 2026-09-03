const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
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
