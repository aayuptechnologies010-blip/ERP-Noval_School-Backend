const mongoose = require('mongoose');

const timetableResourceSubjectSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass'
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }]
}, {
  timestamps: true
});

const TimetableResourceSubject = mongoose.model('TimetableResourceSubject', timetableResourceSubjectSchema);

module.exports = TimetableResourceSubject;
