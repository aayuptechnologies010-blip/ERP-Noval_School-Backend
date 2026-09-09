const mongoose = require('mongoose');

const vehicleFuelSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric'],
    default: 'Diesel'
  },
  quantity: {
    type: Number,
    required: true
  },
  pricePerLitre: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
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

module.exports = mongoose.model('VehicleFuel', vehicleFuelSchema);
