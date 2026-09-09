const mongoose = require('mongoose');

const shiftMasterSchema = mongoose.Schema({
  shiftName: { type: String, required: true },
  startTimeHour: { type: String, required: true },
  startTimeMinute: { type: String, required: true },
  endTimeHour: { type: String, required: true },
  endTimeMinute: { type: String, required: true },
  lateInAllowed: { type: String, default: '00' },
  weeklyOff: { type: String, default: 'None' }, // "None", "Half Day", "2nd WO Only", "Alternate WO", "All WO"
}, {
  timestamps: true
});

const ShiftMaster = mongoose.model('ShiftMaster', shiftMasterSchema);
module.exports = ShiftMaster;
