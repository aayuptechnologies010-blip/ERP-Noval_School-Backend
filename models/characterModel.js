const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  characterName: {
    type: String,
    required: [true, 'Character name is required'],
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

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
