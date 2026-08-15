const mongoose = require('mongoose');

const studentAppreciationSchema = new mongoose.Schema(
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
    appreciationType: {
      type: String,
      required: [true, 'Appreciation type is required'],
      trim: true
    },
    points: {
      type: Number,
      required: [true, 'Points are required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
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

const StudentAppreciation = mongoose.model('StudentAppreciation', studentAppreciationSchema);
module.exports = StudentAppreciation;
