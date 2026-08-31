const mongoose = require('mongoose');

const religionSchema = new mongoose.Schema({
  religionName: {
    type: String,
    required: [true, 'Religion name is required'],
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

const Religion = mongoose.model('Religion', religionSchema);

module.exports = Religion;
