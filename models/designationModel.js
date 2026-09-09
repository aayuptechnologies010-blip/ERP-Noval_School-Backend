const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  type: { type: String, required: true }, showPayroll: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Designation', designationSchema);