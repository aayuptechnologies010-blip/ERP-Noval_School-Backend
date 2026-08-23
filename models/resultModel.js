const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  subject: {
    type: String,
    required: true // e.g., 'Mathematics', 'Science', 'English'
  },
  maxMarks: {
    type: Number,
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  grade: {
    type: String // e.g., 'A+', 'B', 'F'. Frontend can auto-calculate or allow manual entry.
  },
  remarks: {
    type: String // e.g., 'Excellent', 'Needs Improvement'
  }
}, {
  timestamps: true
});

// Ensure a student only has one result per subject per exam
resultSchema.index({ student: 1, exam: 1, subject: 1 }, { unique: true });

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
