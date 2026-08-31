const mongoose = require('mongoose');

const casteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Caste name is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Caste = mongoose.model('Caste', casteSchema);

module.exports = Caste;
