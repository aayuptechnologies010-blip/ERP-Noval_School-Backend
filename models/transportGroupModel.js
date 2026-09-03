const mongoose = require('mongoose');

const transportGroupSchema = new mongoose.Schema({
  groupName: {
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

module.exports = mongoose.model('TransportGroup', transportGroupSchema);
