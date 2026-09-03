const mongoose = require('mongoose');

const feeReceiptSettingSchema = new mongoose.Schema({
  receiptType: {
    type: String,
    enum: [
      'Single Receipt', 
      'School Wise Receipt', 
      'Feetype Wise Receipt', 
      'School with Feetype Wise Receipt', 
      'Bank Wise Receipt'
    ],
    required: true,
    default: 'Single Receipt'
  },
  settings: [{
    // Optional References based on type
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolGlobalDetails', default: null },
    feeTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolGlobalFeeType', default: null },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank', default: null },
    
    prefix: { type: String, default: '' },
    leadZero: { type: Number, default: 0 },
    rcptNoStart: { type: Number, default: 1 },
    suffix: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('FeeReceiptSetting', feeReceiptSettingSchema);
