const mongoose = require('mongoose');

const studentInfractionSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true
    },
    studentClass: {
      type: String,
      required: [true, 'Class is required'],
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

const StudentInfraction = mongoose.model('StudentInfraction', studentInfractionSchema);
module.exports = StudentInfraction;
