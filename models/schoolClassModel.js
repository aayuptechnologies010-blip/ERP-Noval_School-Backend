const mongoose = require('mongoose');

const schoolClassSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Class name is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  wingName: {
    type: String,
    trim: true
  },
  schoolName: {
    type: String,
    trim: true
  },
  orderNo: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const SchoolClass = mongoose.model('SchoolClass', schoolClassSchema);

module.exports = SchoolClass;
