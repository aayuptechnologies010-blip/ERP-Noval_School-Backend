const mongoose = require('mongoose');

const timetableGlobalSettingSchema = new mongoose.Schema({
  staffType: {
    type: String,
    default: "All (13)"
  },
  dayCriteria: {
    type: String,
    enum: ["daywise", "weekday"],
    default: "weekday"
  },
  periodStartWith: {
    type: String,
    default: ""
  },
  validateBusyCondition: {
    type: Boolean,
    default: false
  },
  showClassWisePeriodTime: {
    type: Boolean,
    default: false
  },
  isDeleteWithYesNo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const TimetableGlobalSetting = mongoose.model('TimetableGlobalSetting', timetableGlobalSettingSchema);

module.exports = TimetableGlobalSetting;
