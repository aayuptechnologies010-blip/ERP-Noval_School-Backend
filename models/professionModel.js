const mongoose = require('mongoose');

const professionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Profession name is required'],
    unique: true,
    trim: true,
    uppercase: true // Storing in uppercase as shown in the UI screenshot
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Profession = mongoose.model('Profession', professionSchema);

module.exports = Profession;
