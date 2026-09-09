const mongoose = require('mongoose');

const insuranceVendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: [true, 'Vendor Name is required'],
    trim: true,
    unique: true
  },
  contactPerson: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InsuranceVendor', insuranceVendorSchema);
