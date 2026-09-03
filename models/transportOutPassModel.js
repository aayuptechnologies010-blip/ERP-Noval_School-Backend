const mongoose = require('mongoose');

const transportOutPassSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  section: {
    type: String,
  },
  assignDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('TransportOutPass', transportOutPassSchema);
