const mongoose = require('mongoose');

const timetableConsecutiveAllocationSchema = mongoose.Schema({
  totalPeriods: { type: Number, required: true },
  frequency: { type: Number, required: true },
  totalSet: { type: Number, required: true },
  allocations: [{
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolClass' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TimetableConsecutiveAllocation', timetableConsecutiveAllocationSchema);
