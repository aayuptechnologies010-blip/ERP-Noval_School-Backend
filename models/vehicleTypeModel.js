const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: true,
    unique: true
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VehicleType', vehicleTypeSchema);
