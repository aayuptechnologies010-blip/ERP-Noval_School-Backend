const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  periodName: { type: String, required: true }, // e.g., "1st Period", "Break"
  startTime: { type: String, required: true }, // e.g., "08:00 AM"
  endTime: { type: String, required: true },   // e.g., "08:45 AM"
  isBreak: { type: Boolean, default: false },
  subject: { type: String, default: '' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null } // Optional, populated to get name
}, { _id: false });

const dayScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  periods: [periodSchema]
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true
  },
  schedule: [dayScheduleSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, {
  timestamps: true
});

// Ensure one timetable per class and section
timetableSchema.index({ class: 1, section: 1 }, { unique: true });

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;
