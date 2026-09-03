const mongoose = require('mongoose');

const registrationNoSettingSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolGlobalDetails',
    required: [true, 'School is required']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
    required: [true, 'Class is required']
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'Session is required']
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolBoard',
    required: [true, 'Board is required']
  },
  settingFor: {
    type: String,
    required: [true, 'Setting For is required (e.g., Registration No.)'],
    trim: true
  },
  settingType: {
    type: String,
    enum: ['Automatic', 'Manual'],
    default: 'Automatic'
  },
  recNoStartFrom: {
    type: Number,
    default: 1
  },
  prefix: {
    type: String,
    trim: true,
    default: ''
  },
  startFrom: {
    type: Number,
    default: 1
  },
  leadZero: {
    type: Number,
    default: 0
  },
  suffix: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure uniqueness for this specific combination
registrationNoSettingSchema.index(
  { school: 1, class: 1, session: 1, board: 1, settingFor: 1 },
  { unique: true }
);

const RegistrationNoSetting = mongoose.model('RegistrationNoSetting', registrationNoSettingSchema);

module.exports = RegistrationNoSetting;
