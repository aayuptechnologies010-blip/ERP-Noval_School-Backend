const mongoose = require('mongoose');

const termMasterSchema = new mongoose.Schema({
  termName: {
    type: String,
    required: [true, 'Term name is required'],
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

const TermMaster = mongoose.model('TermMaster', termMasterSchema);

module.exports = TermMaster;
