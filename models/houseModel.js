const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  houseName: {
    type: String,
    required: [true, 'House name is required'],
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

const House = mongoose.model('House', houseSchema);

module.exports = House;
