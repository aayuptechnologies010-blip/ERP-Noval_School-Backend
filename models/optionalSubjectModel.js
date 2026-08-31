const mongoose = require('mongoose');

const optionalSubjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: [true, 'Subject name is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const OptionalSubject = mongoose.model('OptionalSubject', optionalSubjectSchema);

module.exports = OptionalSubject;
