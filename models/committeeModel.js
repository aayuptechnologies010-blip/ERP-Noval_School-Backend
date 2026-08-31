const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  committeeType: {
    type: String,
    required: [true, 'Committee type is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  memberType: {
    type: String,
    enum: ['Employee', 'Student', 'Other'],
    default: 'Employee',
    required: true
  },
  memberName: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  fromDate: {
    type: Date,
    required: [true, 'From date is required']
  },
  toDate: {
    type: Date,
    required: [true, 'To date is required']
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Committee = mongoose.model('Committee', committeeSchema);

module.exports = Committee;
