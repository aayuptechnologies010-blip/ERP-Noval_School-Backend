const mongoose = require('mongoose');

const vehicleServiceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  serviceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  nextServiceDate: {
    type: Date
  },
  serviceType: {
    type: String,
    required: true
  },
  garageName: {
    type: String
  },
  cost: {
    type: Number,
    default: 0
  },
  currentMeter: {
    type: Number
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VehicleService', vehicleServiceSchema);
