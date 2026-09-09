const mongoose = require('mongoose');

const vehicleRouteSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    unique: true
  },
  startPoint: {
    type: String,
    required: true
  },
  endPoint: {
    type: String,
    required: true
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VehicleRoute', vehicleRouteSchema);
