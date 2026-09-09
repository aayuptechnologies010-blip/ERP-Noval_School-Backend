const mongoose = require('mongoose');

const timetableClassSettingSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  weekPeriods: {
    type: Number,
    default: 48
  },
  periodsPerDay: {
    type: Number,
    default: 8
  },
  recess1: {
    type: Number,
    default: 0
  },
  recess2: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const TimetableClassSetting = mongoose.model('TimetableClassSetting', timetableClassSettingSchema);

module.exports = TimetableClassSetting;
