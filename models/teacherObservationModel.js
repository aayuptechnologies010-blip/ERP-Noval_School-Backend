const mongoose = require('mongoose');

const teacherObservationSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: [true, 'Staff reference is required']
    },
    observedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    observationDate: {
      type: Date,
      required: [true, 'Observation date is required']
    },
    subject: {
      type: String,
      trim: true
    },
    topic: {
      type: String,
      trim: true
    },
    remarks: {
      type: String,
      required: [true, 'Remarks are required']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const TeacherObservation = mongoose.model('TeacherObservation', teacherObservationSchema);
module.exports = TeacherObservation;
