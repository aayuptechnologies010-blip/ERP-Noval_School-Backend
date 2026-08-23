const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  parentName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  childName: {
    type: String,
    required: true
  },
  classInterested: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Follow-up', 'Converted', 'Dropped'],
    default: 'Pending'
  },
  followUpDate: {
    type: Date
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
