const mongoose = require('mongoose');

const timetableClassTeacherSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  assistantTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, {
  timestamps: true
});

const TimetableClassTeacher = mongoose.model('TimetableClassTeacher', timetableClassTeacherSchema);

module.exports = TimetableClassTeacher;
