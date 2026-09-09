const mongoose = require('mongoose');

const markAttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  day: { type: String, required: true },
  attendances: [{
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    attendanceType: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Half Day', 'On Leave'],
      default: 'Present'
    }
  }],
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null }
}, { timestamps: true });

markAttendanceSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('TimetableMarkAttendance', markAttendanceSchema);
