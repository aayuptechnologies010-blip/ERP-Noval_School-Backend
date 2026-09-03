const mongoose = require('mongoose');

const dailyMeterSchema = new mongoose.Schema({
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
  openingMeter: {
    type: Number,
    required: true
  },
  closingMeter: {
    type: Number,
    required: true
  },
  totalKm: {
    type: Number
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Auto-calculate totalKm before save
dailyMeterSchema.pre('save', function (next) {
  this.totalKm = this.closingMeter - this.openingMeter;
  next();
});

module.exports = mongoose.model('DailyMeter', dailyMeterSchema);
