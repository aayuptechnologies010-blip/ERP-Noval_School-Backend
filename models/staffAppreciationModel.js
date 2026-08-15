const mongoose = require('mongoose');

const staffAppreciationSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
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

const StaffAppreciation = mongoose.model('StaffAppreciation', staffAppreciationSchema);
module.exports = StaffAppreciation;
