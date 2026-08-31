const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: [true, 'Section name is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  orderNo: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
