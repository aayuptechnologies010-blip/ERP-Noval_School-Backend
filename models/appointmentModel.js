const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Appointment title is required'],
      trim: true
    },
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Appointment type is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending'
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    time: {
      type: String,
      required: [true, 'Time is required']
    },
    notes: {
      type: String,
      trim: true
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

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
