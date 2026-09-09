const mongoose = require('mongoose');

const timetableParallelAllocationSchema = mongoose.Schema({
  name: { type: String, required: true },
  periodsToAllocate: { type: Number, required: true },
  allocations: [{
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolClass' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TimetableParallelAllocation', timetableParallelAllocationSchema);
