const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  capacity: {
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

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
