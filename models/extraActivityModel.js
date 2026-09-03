const mongoose = require('mongoose');

const extraActivitySchema = new mongoose.Schema({
  activityName: {
    type: String,
    required: [true, 'Extra Curricular Activity name is required'],
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

const ExtraActivity = mongoose.model('ExtraActivity', extraActivitySchema);

module.exports = ExtraActivity;
