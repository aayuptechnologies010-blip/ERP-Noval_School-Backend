const mongoose = require('mongoose');

const transportAttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  tripType: {
    type: String,
    required: true,
  },
  stop: {
    type: String,
  },
  records: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
      },
      morningStatus: {
        type: String,
        enum: ['P', 'A', 'L', ''],
        default: ''
      },
      afternoonStatus: {
        type: String,
        enum: ['P', 'A', 'L', ''],
        default: ''
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('TransportAttendance', transportAttendanceSchema);
