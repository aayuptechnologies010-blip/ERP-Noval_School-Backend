const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    assignedTo: {
      type: String,
      required: [true, 'Assigned user is required'],
      trim: true
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: [true, 'Priority is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    description: {
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

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
