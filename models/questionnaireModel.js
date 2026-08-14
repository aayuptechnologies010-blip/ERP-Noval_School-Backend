const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Questionnaire title is required'],
      trim: true,
    },
    targetAudience: {
      type: String,
      required: [true, 'Target Audience is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Active', 'Closed'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);
module.exports = Questionnaire;
