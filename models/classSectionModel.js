const mongoose = require('mongoose');

const classSectionSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Class name is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  sections: [{
    type: String,
    trim: true,
    uppercase: true
  }]
}, {
  timestamps: true
});

const ClassSection = mongoose.model('ClassSection', classSectionSchema);

module.exports = ClassSection;
