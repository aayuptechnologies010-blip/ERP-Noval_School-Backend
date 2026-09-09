const mongoose = require('mongoose');

const holidaySchema = mongoose.Schema({
  holidayName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: 'All Departments'
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const Holiday = mongoose.model('Holiday', holidaySchema);
module.exports = Holiday;
