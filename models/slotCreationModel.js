const mongoose = require('mongoose');

const slotCreationSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  studentClass: {
    type: String,
    required: true
  },
  slotName: {
    type: String,
    required: true
  },
  slotDate: {
    type: Date
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  capacity: {
    type: Number,
    required: true,
    default: 0
  },
  allotted: {
    type: Number,
    default: 0
  },
  examLocation: {
    type: String
  }
}, {
  timestamps: true
});

const SlotCreation = mongoose.model('SlotCreation', slotCreationSchema);

module.exports = SlotCreation;
