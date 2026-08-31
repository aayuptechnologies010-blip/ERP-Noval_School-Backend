const mongoose = require('mongoose');

const wingSchema = new mongoose.Schema({
  wingName: {
    type: String,
    required: [true, 'Wing name is required'],
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

const Wing = mongoose.model('Wing', wingSchema);

module.exports = Wing;
