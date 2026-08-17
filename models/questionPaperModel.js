const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Paper Title is required'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true
    },
    teacher: {
      type: String,
      required: [true, 'Teacher name is required'],
      trim: true
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total Marks are required']
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    status: {
      type: String,
      enum: ['Published', 'Draft'],
      default: 'Draft'
    }
  },
  {
    timestamps: true
  }
);

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);
module.exports = QuestionPaper;
