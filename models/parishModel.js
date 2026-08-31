const mongoose = require('mongoose');

const parishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Parish name is required'],
    unique: true,
    trim: true
  },
  religion: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Parish = mongoose.model('Parish', parishSchema);

module.exports = Parish;
