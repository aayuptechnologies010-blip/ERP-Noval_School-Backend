const mongoose = require('mongoose');

const travelAgencySchema = new mongoose.Schema({
  agencyName: {
    type: String,
    required: true,
    unique: true
  },
  contactPerson: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TravelAgency', travelAgencySchema);
