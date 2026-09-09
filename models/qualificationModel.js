const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Qualification', qualificationSchema);