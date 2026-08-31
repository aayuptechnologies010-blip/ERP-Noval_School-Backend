const mongoose = require('mongoose');

const schoolBoardSchema = new mongoose.Schema({
  boardName: {
    type: String,
    required: [true, 'Board name is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const SchoolBoard = mongoose.model('SchoolBoard', schoolBoardSchema);

module.exports = SchoolBoard;
