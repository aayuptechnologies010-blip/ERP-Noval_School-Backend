const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    // Student who applied for leave
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },

    // Leave period
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
    },

    // Auto-calculated number of days (inclusive)
    totalDays: {
      type: Number,
      default: 1,
    },

    // Reason for leave
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },

    // Leave status
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: 'Status must be one of: Pending, Approved, Rejected',
      },
      default: 'Pending',
    },

    // Admin remarks when reviewing (optional)
    adminRemarks: {
      type: String,
      default: '',
      trim: true,
    },

    // Who reviewed this request and when
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },

    // Denormalized class info for fast filtering (no join needed)
    class: {
      type: String,
      default: '',
      trim: true,
    },
    section: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt = "Applied On" date
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────

// Fast queries by student
leaveRequestSchema.index({ studentId: 1, fromDate: -1 });

// Fast queries for listing (admin filters by class + status + date range)
leaveRequestSchema.index({ class: 1, status: 1, fromDate: -1 });

// ─── Pre-save hook: auto-calculate totalDays ───────────────────────────────
leaveRequestSchema.pre('save', function () {
  if (this.fromDate && this.toDate) {
    const diffMs = this.toDate - this.fromDate;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
    this.totalDays = diffDays > 0 ? diffDays : 1;
  }
});

// ───────────────────────────────────────────────────────────────────────────

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = LeaveRequest;
