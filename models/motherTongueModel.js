const mongoose = require('mongoose');

const motherTongueSchema = new mongoose.Schema({
  motherTongueName: {
    type: String,
    required: [true, 'Mother Tongue name is required'],
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

const MotherTongue = mongoose.model('MotherTongue', motherTongueSchema);

module.exports = MotherTongue;
