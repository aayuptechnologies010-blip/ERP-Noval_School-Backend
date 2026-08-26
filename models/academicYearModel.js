const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Academic Year name is required'],
    unique: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const AcademicYear = mongoose.model('AcademicYear', academicYearSchema);

module.exports = AcademicYear;
