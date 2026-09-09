const mongoose = require('mongoose');

const incomeTaxSlabSchema = new mongoose.Schema({
  slabType: {
    type: String,
    required: true,
    default: 'Tax payable in Existing Regime' // or 'Tax payable in New Regime'
  },
  groupName: {
    type: String,
    required: true // e.g., 'For Male', 'For Female', 'Senior Citizen'
  },
  groupSlNo: {
    type: Number,
    default: 1
  },
  lowerBound: {
    type: Number,
    required: true,
    default: 0
  },
  upperBound: {
    type: Number,
    required: true,
    default: 0
  },
  taxRate: {
    type: Number,
    required: true,
    default: 0 // In percent (e.g. 5, 10, 20, 30)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('IncomeTaxSlab', incomeTaxSlabSchema);
