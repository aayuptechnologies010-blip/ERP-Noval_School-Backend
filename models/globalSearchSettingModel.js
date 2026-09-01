const mongoose = require('mongoose');

const globalSearchSettingSchema = new mongoose.Schema({
  searchOptionsForStudents: {
    admNo: { type: Boolean, default: true },
    name: { type: Boolean, default: true },
    fName: { type: Boolean, default: true },
    mName: { type: Boolean, default: true },
    rollNo: { type: Boolean, default: false },
    parentCode: { type: Boolean, default: false },
    mob: { type: Boolean, default: false },
    address: { type: Boolean, default: false },
    stBarcode: { type: Boolean, default: false },
    computerNo: { type: Boolean, default: false },
    busId: { type: Boolean, default: false },
  },
  displayOnReport: {
    type: String,
    enum: ['Show Admission No', 'Show Bill', 'Show Bus ID'],
    default: 'Show Admission No'
  }
}, {
  timestamps: true
});

const GlobalSearchSetting = mongoose.model('GlobalSearchSetting', globalSearchSettingSchema);

module.exports = GlobalSearchSetting;
