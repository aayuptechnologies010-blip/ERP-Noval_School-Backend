const mongoose = require('mongoose');

const timetablePreferenceAllocationSchema = mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
  allocations: [{
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    preferredPeriods: [{ type: Number }]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TimetablePreferenceAllocation', timetablePreferenceAllocationSchema);
