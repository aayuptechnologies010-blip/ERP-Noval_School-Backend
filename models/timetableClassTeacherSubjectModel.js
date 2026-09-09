const mongoose = require('mongoose');

const timetableClassTeacherSubjectSchema = new mongoose.Schema({
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
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
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }
}, {
  timestamps: true
});

const TimetableClassTeacherSubject = mongoose.model('TimetableClassTeacherSubject', timetableClassTeacherSubjectSchema);

module.exports = TimetableClassTeacherSubject;
