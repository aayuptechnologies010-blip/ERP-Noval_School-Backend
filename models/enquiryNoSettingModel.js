const mongoose = require('mongoose');

const enquiryNoSettingSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'Session is required'],
    unique: true // One setting per session
  },
  enquiryNoType: {
    type: String,
    enum: ['Automatic', 'Manual'],
    default: 'Automatic'
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

const EnquiryNoSetting = mongoose.model('EnquiryNoSetting', enquiryNoSettingSchema);

module.exports = EnquiryNoSetting;
