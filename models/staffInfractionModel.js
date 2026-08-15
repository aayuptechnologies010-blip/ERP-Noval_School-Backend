const mongoose = require('mongoose');

const staffInfractionSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    infractionType: {
      type: String,
      required: [true, 'Infraction type is required'],
      trim: true
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['Minor', 'Moderate', 'Severe'],
      trim: true
    },
    consequence: {
      type: String,
      required: [true, 'Consequence is required'],
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Resolved'],
      default: 'Resolved'
    },
    penaltyPoints: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

const StaffInfraction = mongoose.model('StaffInfraction', staffInfractionSchema);
module.exports = StaffInfraction;
