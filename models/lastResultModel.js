const mongoose = require('mongoose');

const lastResultSchema = new mongoose.Schema({
  lastResultName: {
    type: String,
    required: [true, 'Last Result name is required'],
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const LastResult = mongoose.model('LastResult', lastResultSchema);

module.exports = LastResult;
