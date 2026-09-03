const mongoose = require('mongoose');

const vehicleReminderSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  reminderType: {
    type: String,
    required: true,
    enum: ['Insurance', 'PUC / Pollution', 'Fitness Certificate', 'Road Tax', 'Registration Renewal', 'Other']
  },
  dueDate: {
    type: Date,
    required: true
  },
  remarks: {
    type: String
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VehicleReminder', vehicleReminderSchema);
