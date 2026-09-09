const mongoose = require('mongoose');

const timetableTeacherSettingSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  shortName: {
    type: String,
    trim: true
  },
  maxPeriodsPerWeek: {
    type: Number,
    default: 48
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const TimetableTeacherSetting = mongoose.model('TimetableTeacherSetting', timetableTeacherSettingSchema);

module.exports = TimetableTeacherSetting;
