const mongoose = require('mongoose');

const timetablePeriodSettingSchema = new mongoose.Schema({
  periodNumber: {
    type: Number,
    required: true
  },
  startTime: {
    type: String, // HH:MM format
    required: true
  },
  endTime: {
    type: String, // HH:MM format
    required: true
  },
  isBreak: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const TimetablePeriodSetting = mongoose.model('TimetablePeriodSetting', timetablePeriodSettingSchema);

module.exports = TimetablePeriodSetting;
