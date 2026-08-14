const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
      trim: true,
    },
    dayType: {
      type: String,
      required: [true, 'Day type is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    fromDate: {
      type: Date,
      required: [true, 'From Date is required'],
    },
    assignTo: {
      type: String,
      required: [true, 'Assign to is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    showOnWebsite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
