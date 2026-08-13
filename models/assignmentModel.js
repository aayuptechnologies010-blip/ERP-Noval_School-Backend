const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Class Wise', 'Student Wise'],
      required: [true, 'Assignment type is required'],
      default: 'Class Wise'
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    class: {
      type: String,
      default: null,
      trim: true
    },
    assignedOn: {
      type: Date,
      required: [true, 'Assigned on date is required']
    },
    hasSubmissionDate: {
      type: Boolean,
      default: false
    },
    dueDate: {
      type: Date,
      default: null
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    attachment: {
      type: String, // URL of the uploaded file
      default: null
    },
    allowMultipleSubmission: {
      type: Boolean,
      default: false
    },
    allowLateSubmission: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
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

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
