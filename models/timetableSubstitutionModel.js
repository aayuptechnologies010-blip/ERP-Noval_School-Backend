const mongoose = require('mongoose');

const substitutionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  day: { type: String, required: true },
  absentTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  period: { type: String, required: true },
  classSubject: { type: String, default: '' },
  substituteTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  wing: { type: String, default: '' },
  remarks: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null }
}, { timestamps: true });

module.exports = mongoose.model('TimetableSubstitution', substitutionSchema);
