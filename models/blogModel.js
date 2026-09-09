const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'School Editorial Board'
  },
  category: {
    type: String,
    default: 'General'
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  coverImage: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Published'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
