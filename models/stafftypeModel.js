const mongoose = require('mongoose');

const stafftypeSchema = new mongoose.Schema({
  type: { type: String, required: true }, hourly: { type: Boolean, default: false }, showEcare: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('StaffType', stafftypeSchema);