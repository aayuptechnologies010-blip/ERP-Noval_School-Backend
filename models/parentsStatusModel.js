const mongoose = require('mongoose');

const parentsStatusSchema = new mongoose.Schema({
  statusName: {
    type: String,
    required: [true, 'Parents status name is required'],
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

const ParentsStatus = mongoose.model('ParentsStatus', parentsStatusSchema);

module.exports = ParentsStatus;
