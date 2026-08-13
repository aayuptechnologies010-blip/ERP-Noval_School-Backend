const mongoose = require('mongoose');

const staffLeaveSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: [true, 'Staff ID is required'],
    },
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
    },
    totalDays: {
      type: Number,
      default: 1,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        message: 'Status must be one of: Pending, Approved, Rejected, Cancelled',
      },
      default: 'Pending',
    },
    adminRemarks: {
      type: String,
      default: '',
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt = "Applied On" date
  }
);

staffLeaveSchema.index({ staffId: 1, fromDate: -1 });
staffLeaveSchema.index({ status: 1, fromDate: -1 });

staffLeaveSchema.pre('save', function () {
  if (this.fromDate && this.toDate) {
    const diffMs = this.toDate - this.fromDate;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
    this.totalDays = diffDays > 0 ? diffDays : 1;
  }
});

const StaffLeave = mongoose.model('StaffLeave', staffLeaveSchema);
module.exports = StaffLeave;
