const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    assignedTo: {
      type: String, // Can hold any userId (Admin, Staff, Student)
      required: [true, 'Assigned user ID is required'],
      index: true,
    },
    taskDescription: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Task type is required (e.g., Task, Approval, Due)'],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Overdue', 'Done'],
        message: 'Status must be one of: Pending, Overdue, Done',
      },
      default: 'Pending',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
