const mongoose = require('mongoose');

const lessonPlanSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: [true, 'Topic/Lesson Name is required'],
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
    duration: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    }
  },
  {
    timestamps: true
  }
);

const LessonPlan = mongoose.model('LessonPlan', lessonPlanSchema);
module.exports = LessonPlan;
