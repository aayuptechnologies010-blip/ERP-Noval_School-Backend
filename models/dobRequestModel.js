const mongoose = require('mongoose');

const dobRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String },
  admissionNo: { type: String },
  classSection: { type: String },
  oldDob: { type: Date },
  newDob: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  actionDate: { type: Date },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('DobRequest', dobRequestSchema);