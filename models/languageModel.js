const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  languageName: {
    type: String,
    required: [true, 'Language name is required'],
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

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
