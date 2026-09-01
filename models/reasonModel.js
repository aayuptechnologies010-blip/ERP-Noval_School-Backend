const mongoose = require('mongoose');

const reasonSchema = new mongoose.Schema({
  reasonName: {
    type: String,
    required: [true, 'Reason name is required'],
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

const Reason = mongoose.model('Reason', reasonSchema);

module.exports = Reason;
