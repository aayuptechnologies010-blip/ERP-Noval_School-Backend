const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    unique: true
  },
  licenseExpiry: {
    type: Date
  },
  address: {
    type: String
  },
  vehicleAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);
