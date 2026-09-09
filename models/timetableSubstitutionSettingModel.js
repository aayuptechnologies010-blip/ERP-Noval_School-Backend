const mongoose = require('mongoose');

const timetableSubstitutionSettingSchema = mongoose.Schema({
  patterns: [{
    sno: { type: Number, required: true },
    pattern: { type: String, required: true },
    selected: { type: Boolean, default: false },
    orderNo: { type: String, default: "" }
  }],
  repeatTeacher: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimetableSubstitutionSetting', timetableSubstitutionSettingSchema);
