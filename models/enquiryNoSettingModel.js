const mongoose = require('mongoose');

const enquiryNoSettingSchema = new mongoose.Schema({
  session: { type: String, default: '' },
  settingShouldBe: { type: String, enum: ['Automatic', 'Manual', ''], default: 'Automatic' },
  prefix: { type: String, default: '' },
  startFrom: { type: String, default: '' },
  leadZero: { type: String, default: '' },
  suffix: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('EnquiryNoSetting', enquiryNoSettingSchema);
