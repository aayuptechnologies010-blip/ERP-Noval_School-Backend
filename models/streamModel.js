const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  streamName: {
    type: String,
    required: [true, 'Stream name is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;
