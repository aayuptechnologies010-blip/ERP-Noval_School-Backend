const mongoose = require('mongoose');

const professionalTaxSlabSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'Group Name is required'],
    trim: true
  },
  groupSlNo: {
    type: Number,
    required: [true, 'Group Sl No. is required'],
    default: 1
  },
  lowerBound: {
    type: Number,
    required: [true, 'Lower bound is required'],
    min: 0,
    default: 0
  },
  upperBound: {
    type: Number,
    required: [true, 'Upper bound is required'],
    min: 0,
    default: 0
  },
  tax: {
    type: Number,
    required: [true, 'Tax amount is required'],
    min: 0,
    default: 0
  },
  applicableMonth: {
    type: String,
    default: 'All'
  },
  gender: {
    type: String,
    enum: ['All', 'Male', 'Female'],
    default: 'All'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProfessionalTaxSlab', professionalTaxSlabSchema);
