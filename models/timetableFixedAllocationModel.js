const mongoose = require('mongoose');

const timetableFixedAllocationSchema = mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  day: { type: String, required: true },
  periodNo: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimetableFixedAllocation', timetableFixedAllocationSchema);
