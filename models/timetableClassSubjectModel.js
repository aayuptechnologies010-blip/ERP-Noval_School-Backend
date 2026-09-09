const mongoose = require('mongoose');

const timetableClassSubjectSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  },
  subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    periods: {
      type: Number,
      default: 0
    },
    order: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

const TimetableClassSubject = mongoose.model('TimetableClassSubject', timetableClassSubjectSchema);

module.exports = TimetableClassSubject;
