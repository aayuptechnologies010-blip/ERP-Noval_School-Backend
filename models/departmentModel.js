const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);