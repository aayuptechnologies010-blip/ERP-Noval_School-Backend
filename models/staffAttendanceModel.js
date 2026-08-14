const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: [true, 'Staff ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    department: {
      type: String,
      default: 'All',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Present', 'Absent', 'Leave', 'HalfDay', 'Late', 'NA'],
        message: 'Status must be one of: Present, Absent, Leave, HalfDay, Late, NA',
      },
      required: [true, 'Attendance status is required'],
    },
    remarks: {
      type: String,
      default: '',
      trim: true,
    },
    checkIn: {
      type: String,
      default: '',
      trim: true,
    },
    checkOut: {
      type: String,
      default: '',
      trim: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

staffAttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });
staffAttendanceSchema.index({ department: 1, date: 1 });
staffAttendanceSchema.index({ staffId: 1, date: -1 });

const StaffAttendance = mongoose.model('StaffAttendance', staffAttendanceSchema);
module.exports = StaffAttendance;
