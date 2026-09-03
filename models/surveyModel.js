const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ['text', 'radio', 'checkbox'], required: true },
  options: [{ type: String }] // Only for radio/checkbox
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  deadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Survey', surveySchema);
