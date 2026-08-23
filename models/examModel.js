const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true, // e.g., 'Half Yearly', 'Unit Test 1', 'Final Exams'
  },
  term: {
    type: String,
    required: true, // e.g., 'Term 1', 'Term 2'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  applicableClasses: [{
    type: String // e.g., '10', '11', '12'
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming'
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
