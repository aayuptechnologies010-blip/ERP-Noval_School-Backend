const mongoose = require('mongoose');

const feeTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  pref: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FeeType', feeTypeSchema);
