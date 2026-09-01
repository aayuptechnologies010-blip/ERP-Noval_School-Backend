const mongoose = require('mongoose');

const studentClassificationSchema = new mongoose.Schema({
  classificationName: {
    type: String,
    required: [true, 'Classification name is required'],
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const StudentClassification = mongoose.model('StudentClassification', studentClassificationSchema);

module.exports = StudentClassification;
