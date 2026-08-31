const mongoose = require('mongoose');

const subCasteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sub Caste name is required'],
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

const SubCaste = mongoose.model('SubCaste', subCasteSchema);

module.exports = SubCaste;
