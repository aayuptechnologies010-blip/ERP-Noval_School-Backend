const mongoose = require('mongoose');

const feeGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  special: {
    type: String, // 'True' or 'False'
    default: 'False'
  }
}, { timestamps: true });

module.exports = mongoose.model('FeeGroup', feeGroupSchema);
