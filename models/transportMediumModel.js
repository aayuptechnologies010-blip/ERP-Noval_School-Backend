const mongoose = require('mongoose');

const transportMediumSchema = new mongoose.Schema({
  mediumName: {
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

module.exports = mongoose.model('TransportMedium', transportMediumSchema);
