const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    // Reference to the student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },

    // Attendance date (stored as midnight UTC for consistency)
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },

    // Class info (denormalized for fast queries without joins)
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true,
    },

    section: {
      type: String,
      default: '',
      trim: true,
    },

    // Attendance Status
    // P = Present, A = Absent, L = Leave, WH = Half Day, Late = Late, NA = Not Available
    status: {
      type: String,
      enum: {
        values: ['Present', 'Absent', 'Leave', 'HalfDay', 'Late', 'NA'],
        message: 'Status must be one of: Present, Absent, Leave, HalfDay, Late, NA',
      },
      required: [true, 'Attendance status is required'],
    },

    // Optional remark (e.g., "Medical Leave", "Field Trip")
    remarks: {
      type: String,
      default: '',
      trim: true,
    },

    // Who marked this attendance
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

// ─── Indexes ───────────────────────────────────────────────────────────────

// Unique: one record per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// Fast queries by class + section + date (main use-case)
attendanceSchema.index({ class: 1, section: 1, date: 1 });

// Fast queries by student
attendanceSchema.index({ studentId: 1, date: -1 });

// ───────────────────────────────────────────────────────────────────────────

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
