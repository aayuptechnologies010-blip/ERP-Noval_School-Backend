const mongoose = require('mongoose');

const rejoinStaffSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  staffName: {
    type: String,
    required: true,
    trim: true
  },
  oldEmpNo: {
    type: String,
    default: ''
  },
  newEmpNo: {
    type: String,
    default: ''
  },
  rejoinDate: {
    type: Date,
    default: Date.now
  },
  designation: {
    type: String,
    default: ''
  },
  staffType: {
    type: String,
    default: ''
  },
  basicSalary: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'Rejoined'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RejoinStaff', rejoinStaffSchema);
