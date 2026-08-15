const mongoose = require('mongoose');

const infractionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['Minor', 'Moderate', 'Severe'],
      trim: true
    },
    penaltyPoints: {
      type: Number,
      required: [true, 'Penalty points are required']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
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

const Infraction = mongoose.model('Infraction', infractionSchema);
module.exports = Infraction;
