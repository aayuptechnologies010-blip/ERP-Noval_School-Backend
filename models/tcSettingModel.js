const mongoose = require('mongoose');

const tcSettingSchema = new mongoose.Schema({
  subjectFromMarksManager: {
    type: Boolean,
    default: true
  },
  subjectFromTimeTable: {
    type: Boolean,
    default: true
  },
  attendanceFromECare: {
    type: Boolean,
    default: true
  },
  checkDuesInFees: {
    type: Boolean,
    default: true
  },
  checkDuesInLibrary: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const TCSetting = mongoose.model('TCSetting', tcSettingSchema);

module.exports = TCSetting;
