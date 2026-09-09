const mongoose = require('mongoose');

const timetablePeriodAllotmentSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  periods: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const TimetablePeriodAllotment = mongoose.model('TimetablePeriodAllotment', timetablePeriodAllotmentSchema);

module.exports = TimetablePeriodAllotment;
