const mongoose = require('mongoose');

const routeStopSchema = new mongoose.Schema({
  stopName: {
    type: String,
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleRoute',
    required: true
  },
  stopOrder: {
    type: Number,
    required: true
  },
  distanceFromStart: {
    type: Number,
    default: 0
  },
  fee: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RouteStop', routeStopSchema);
